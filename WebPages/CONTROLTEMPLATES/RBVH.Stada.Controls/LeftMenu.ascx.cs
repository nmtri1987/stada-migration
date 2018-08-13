using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;
using RBVH.Stada.Intranet.Biz.Constants;
using RBVH.Stada.Intranet.Biz.DataAccessLayer;
using RBVH.Stada.Intranet.Biz.Models;
using RBVH.Stada.Intranet.WebPages.Models;
using RBVH.Stada.Intranet.WebPages.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security;
using System.Web;
using System.Web.UI;
using RBVH.Stada.Intranet.Biz.Extension;

namespace RBVH.Stada.Intranet.WebPages.CONTROLTEMPLATES.RBVH.Stada.Controls
{
    public partial class LeftMenu : UserControl
    {
        private const string LeftMenu_PermissionGroupList_Session_Key = "LeftMenu_PermissionGroupList_Session_Key";
        //private const string LeftMenu_IsCurrentUserInGroup_Session_Key = "LeftMenu_IsCurrentUserInGroup_Session_Key";

        private PermissionGroupDAL _permissionGroupDAL;
        private const string STR_KEY_NAME = "Stada_LangSwitcher_Setting";
        private const string DEFAULT_LANG = "en-US";
        private const string SUB_SECTION_PARAM = "subSection";
        private List<string> _groups = new List<string>();

        protected void Page_Load(object sender, EventArgs e)
        {
            var currentPage = Request.CurrentExecutionFilePath;
            var pageExist = false;
            foreach (var item in Constants.LeftMenuList)
            {
                if (currentPage.IndexOf(item, 0, StringComparison.CurrentCultureIgnoreCase) > -1)
                {
                    pageExist = true;
                    break;
                }
            }

            if (!pageExist)
                return;

            SPWeb currentWeb = SPContext.Current.Site.RootWeb;

            #region "Permission"

            // REM: Optimize performance
            // Page.Response.Cache.SetCacheability(System.Web.HttpCacheability.NoCache);
            SPUser currentUser = currentWeb.CurrentUser;


            _permissionGroupDAL = new PermissionGroupDAL(SPContext.Current.Site.RootWeb.Url);

            var items = currentWeb.CurrentUser.Groups.GetEnumerator();
            while (items.MoveNext())
            {
                _groups.Add(items.Current.ToString());
            }

            var hasPermission = _permissionGroupDAL.IsAuthorizedOnPage(currentWeb, currentPage, _groups);
            if (!hasPermission)
            {
                var ex = new SecurityException();
                SPUtility.HandleAccessDenied(ex);
            }

            var isCurrentUserInCommonGroup = false;
            if (Page.Session[SessionKey.IsCurrentUserInCommonGroup] != null)
            {
                bool.TryParse(Page.Session[SessionKey.IsCurrentUserInCommonGroup].ToString(), out isCurrentUserInCommonGroup);
            }
            else
            {
                isCurrentUserInCommonGroup = UserPermission.IsCurrentUserInGroup(StringConstant.CommonAccounts);
                Page.Session[SessionKey.IsCurrentUserInCommonGroup] = isCurrentUserInCommonGroup;
            }

            // if (currentUser.IsSiteAdmin == false && UserPermission.IsCurrentUserInGroup(StringConstant.Group.CommonAccountGroupName) && HttpContext.Current.Session[StringConstant.EmployeeLogedin] == null)
            if (currentUser.IsSiteAdmin == false && isCurrentUserInCommonGroup && HttpContext.Current.Session[StringConstant.EmployeeLogedin] == null)
            {
                string url = HttpContext.Current.Request.Url.AbsoluteUri;
                if (url.Contains(StringConstant.PageLoginURL) || url.Contains(StringConstant.PageHomeURL))
                    return;
                //Response.Redirect(StringConstant.PageLoginURL);
                SPUtility.Redirect(StringConstant.PageLoginURL, SPRedirectFlags.Default | SPRedirectFlags.Trusted, HttpContext.Current);
            }
            else
            {
                #region "Left Menu"

                InitialData(currentWeb);

                #endregion
            }

            #endregion
        }

        private void InitialData(SPWeb spWeb)
        {
            // Get groups of current user
            //var url = spWeb.Url;
            //_permissionGroupDAL = new PermissionGroupDAL(url);
            //var permissionGroupList = _permissionGroupDAL.GetPagesOnLeftMenu(_groups).Where(x => x.PermissionModuleCategory != null);
            var permissionGroupListObject = Page.Session[LeftMenu_PermissionGroupList_Session_Key] as List<PermissionGroup>;
            if (permissionGroupListObject == null)
            {
                var url = spWeb.Url;
                _permissionGroupDAL = new PermissionGroupDAL(url);
                permissionGroupListObject = _permissionGroupDAL.GetPagesOnLeftMenu(_groups).ToList();
                Page.Session[LeftMenu_PermissionGroupList_Session_Key] = permissionGroupListObject;
            }

            if (permissionGroupListObject != null)
            {
                var permissionGroupList = permissionGroupListObject.Where(x => x.PermissionModuleCategory != null);
                if (permissionGroupList != null && permissionGroupList.Count() > 0)
                {
                    var groupPermissionGroupList = permissionGroupList.OrderBy(x => x.LeftMenuOrder).GroupBy(x => x.PermissionModuleCategory.LookupValue);
                    BindingMenuView(spWeb, groupPermissionGroupList);
                }
            }
        }

        private void BindingMenuView(SPWeb spWeb, IEnumerable<IGrouping<string, PermissionGroup>> groupPermissionGroupList)
        {
            IList<RootMenu> RootMenuList = new List<RootMenu>();
            var currentLang = Context.Session != null && Context.Session[STR_KEY_NAME] != null ? Context.Session[STR_KEY_NAME].ToString() : DEFAULT_LANG;
            var subSection = Request.Params[SUB_SECTION_PARAM];
            subSection = subSection != null ? string.Format("/{0}/", subSection) : null;
            var currentURL = Request.CurrentExecutionFilePath;

            string webUrl = spWeb.Url;
            foreach (var permissionGroup in groupPermissionGroupList)
            {
                var RootMenu = new RootMenu();
                RootMenu.Name = permissionGroup.Key;
                if (RootMenu.Name.ToLower() == "timesheet")
                {
                    RootMenu.Name = DEFAULT_LANG == currentLang ? RootMenu.Name : "Chấm công";
                }
                else if (RootMenu.Name.ToLower() == "management")
                {
                    RootMenu.Name = DEFAULT_LANG == currentLang ? RootMenu.Name : "Quản lý";
                }

                foreach (var page in permissionGroup.ToList<PermissionGroup>())
                {
                    //var fulUrl = webUrl + page.PageName;
                    //page.Name = DEFAULT_LANG == currentLang ? page.Name : page.VietNameseName;
                    //page.VietNameseName = "";
                    //RootMenu.PermissionGroups.Add(page);
                    //if (fulUrl.Contains(currentURL) || (subSection != null && fulUrl.Contains(subSection)))
                    //{
                    //    //set temp value of actived item to  VietNameseName
                    //    page.VietNameseName = "selected  ms-core-listMenu-selected";
                    //}

                    var newPage = new PermissionGroup
                    {
                        Name = page.Name,
                        VietNameseName = page.VietNameseName,
                        IsOnLeftMenu = page.IsOnLeftMenu,
                        PermissionModuleCategory = page.PermissionModuleCategory,
                        PermissionModuleCategoryVN = page.PermissionModuleCategoryVN,
                        PageName = page.PageName,
                        LeftMenuOrder = page.LeftMenuOrder
                    };
                    //var fulUrl = webUrl + newPage.PageName;
                    var fulUrl = GetPageUrlWithParams(webUrl, newPage.PageName);
                    newPage.PageName = fulUrl;
                    newPage.Name = DEFAULT_LANG == currentLang ? newPage.Name : newPage.VietNameseName;
                    newPage.VietNameseName = "";
                    RootMenu.PermissionGroups.Add(newPage);
                    if (fulUrl.Contains(currentURL) || (subSection != null && fulUrl.Contains(subSection)))
                    {
                        //set temp value of actived item to  VietNameseName
                        newPage.VietNameseName = "selected  ms-core-listMenu-selected";
                    }
                }
                RootMenuList.Add(RootMenu);

            }
            RootItem.DataSource = RootMenuList;
            RootItem.DataBind();
        }

        /// <summary>
        /// Add parameters for page on the left menu.
        /// </summary>
        /// <param name="pageName">The page name. For example: /_layouts/15/RBVH.Stada.Intranet.WebPages/ShiftManagement/ShiftManagementAdmin.aspx</param>
        /// <returns></returns>
        private string GetPageUrlWithParams(string webUrl, string pageName)
        {
            var url = "#";

            try
            {
                UriBuilder urilBuilder = new UriBuilder(webUrl + pageName);

                #region Shift

                if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/ShiftManagement/ShiftManagementAdmin.aspx", true) == 0)
                {
                    bool isAdminDepartment = false;
                    if (Page.Session[SessionKey.IsAdminDepartment] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                    }
                    else
                    {
                        isAdminDepartment = UserPermission.IsAdminDepartment;
                        Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                    }

                    DateTime defaultDateTimeOfShift = URLHelper.GetDefaultDateTimeOfShift();
                    urilBuilder.AddQuery("MyMonth", defaultDateTimeOfShift.Month.ToString());
                    urilBuilder.AddQuery("MyYear", defaultDateTimeOfShift.Year.ToString());
                    if (isAdminDepartment)
                    {
                        urilBuilder.AddQuery("AdminMonth", defaultDateTimeOfShift.Month.ToString());
                        urilBuilder.AddQuery("AdminYear", defaultDateTimeOfShift.Year.ToString());
                        urilBuilder.AddQuery("AdminDeptId", "0");
                    }
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/ShiftManagement/ShiftManagementMember.aspx", true) == 0)
                {
                    DateTime defaultDateTimeOfShift = URLHelper.GetDefaultDateTimeOfShift();
                    urilBuilder.AddQuery("MyMonth", defaultDateTimeOfShift.Month.ToString());
                    urilBuilder.AddQuery("MyYear", defaultDateTimeOfShift.Year.ToString());
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/ShiftManagement/ShiftManagementManager.aspx", true) == 0)
                {
                    bool isAdminDepartment = false;
                    if (Page.Session[SessionKey.IsAdminDepartment] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                    }
                    else
                    {
                        isAdminDepartment = UserPermission.IsAdminDepartment;
                        Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                    }

                    int currentDepartmentId = 0;
                    if (Page.Session[SessionKey.CurrentDepartmentId] != null)
                    {
                        int.TryParse(Page.Session[SessionKey.CurrentDepartmentId].ToString(), out currentDepartmentId);
                    }
                    else
                    {
                        currentDepartmentId = UserPermission.CurrentDepartmentId;
                        Page.Session[SessionKey.CurrentDepartmentId] = currentDepartmentId;
                    }
                    DateTime defaultDateTimeOfShift = URLHelper.GetDefaultDateTimeOfShift();
                    urilBuilder.AddQuery("AdminMonth", defaultDateTimeOfShift.Month.ToString());
                    urilBuilder.AddQuery("AdminYear", defaultDateTimeOfShift.Year.ToString());

                    if (isAdminDepartment)
                    {
                        urilBuilder.AddQuery("AdminDeptId", "0");
                    }
                    else
                    {
                        urilBuilder.AddQuery("AdminDeptId", currentDepartmentId.ToString());
                    }
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/ShiftManagement/ShiftManagementBOD.aspx", true) == 0)
                {
                    DateTime defaultDateTimeOfShift = URLHelper.GetDefaultDateTimeOfShift();
                    urilBuilder.AddQuery("AdminMonth", defaultDateTimeOfShift.Month.ToString());
                    urilBuilder.AddQuery("AdminYear", defaultDateTimeOfShift.Year.ToString());
                    urilBuilder.AddQuery("AdminDeptId", "0");
                }

                #endregion

                #region  Change Shift

                if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/ChangeShiftManagement/ChangeShiftManagementMember.aspx", true) == 0)
                {
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/ChangeShiftManagement/ChangeShiftManagementAdmin.aspx", true) == 0)
                {
                    //bool isAdminDepartment = false;
                    //if (Page.Session[SessionKey.IsAdminDepartment] != null)
                    //{
                    //    bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                    //}
                    //else
                    //{
                    //    isAdminDepartment = UserPermission.IsAdminDepartment;
                    //    Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                    //}

                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    urilBuilder.AddQuery("AdminStartMonth", fromDate);
                    urilBuilder.AddQuery("AdminEndMonth", toDate);
                    urilBuilder.AddQuery("AdminDeptId", "0");
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/ChangeShiftManagement/ChangeShiftManagementManager.aspx", true) == 0)
                {
                    bool isAdminDepartment = false;
                    if (Page.Session[SessionKey.IsAdminDepartment] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                    }
                    else
                    {
                        isAdminDepartment = UserPermission.IsAdminDepartment;
                        Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                    }

                    int currentDepartmentId = 0;
                    if (Page.Session[SessionKey.CurrentDepartmentId] != null)
                    {
                        int.TryParse(Page.Session[SessionKey.CurrentDepartmentId].ToString(), out currentDepartmentId);
                    }
                    else
                    {
                        currentDepartmentId = UserPermission.CurrentDepartmentId;
                        Page.Session[SessionKey.CurrentDepartmentId] = currentDepartmentId;
                    }

                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    urilBuilder.AddQuery("AdminStartMonth", fromDate);
                    urilBuilder.AddQuery("AdminEndMonth", toDate);

                    if (isAdminDepartment)
                    {
                        urilBuilder.AddQuery("AdminDeptId", "0");
                    }
                    else
                    {
                        urilBuilder.AddQuery("AdminDeptId", currentDepartmentId.ToString());
                    }
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/ChangeShiftManagement/ChangeShiftManagementBOD.aspx", true) == 0)
                {
                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    urilBuilder.AddQuery("AdminStartMonth", fromDate);
                    urilBuilder.AddQuery("AdminEndMonth", toDate);
                    urilBuilder.AddQuery("AdminDeptId", "0");
                }

                #endregion

                #region Overtime

                if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/OvertimeManagement/OvertimeManagementAdmin.aspx", true) == 0)
                {
                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string adminFromDate = $"{DateTime.Now:dd/MM/yyyy}";
                    string adminToDate = adminFromDate;
                    urilBuilder.AddQuery("MyStartMonth", fromDate);
                    urilBuilder.AddQuery("MyEndMonth", toDate);
                    urilBuilder.AddQuery("AdminFromDate", adminFromDate);
                    urilBuilder.AddQuery("AdminToDate", adminToDate);
                    urilBuilder.AddQuery("AdminDeptId", "0");
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/OvertimeManagement/OvertimeManagementManager.aspx", true) == 0)
                {
                    bool isAdminDepartment = false;
                    if (Page.Session[SessionKey.IsAdminDepartment] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                    }
                    else
                    {
                        isAdminDepartment = UserPermission.IsAdminDepartment;
                        Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                    }

                    int currentDepartmentId = 0;
                    if (Page.Session[SessionKey.CurrentDepartmentId] != null)
                    {
                        int.TryParse(Page.Session[SessionKey.CurrentDepartmentId].ToString(), out currentDepartmentId);
                    }
                    else
                    {
                        currentDepartmentId = UserPermission.CurrentDepartmentId;
                        Page.Session[SessionKey.CurrentDepartmentId] = currentDepartmentId;
                    }

                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string adminFromDate = $"{DateTime.Now:dd/MM/yyyy}";
                    string adminToDate = adminFromDate;
                    urilBuilder.AddQuery("MyStartMonth", fromDate);
                    urilBuilder.AddQuery("MyEndMonth", toDate);
                    urilBuilder.AddQuery("AdminFromDate", adminFromDate);
                    urilBuilder.AddQuery("AdminToDate", adminToDate);

                    if (isAdminDepartment)
                    {
                        urilBuilder.AddQuery("AdminDeptId", "0");
                    }
                    else
                    {
                        urilBuilder.AddQuery("AdminDeptId", currentDepartmentId.ToString());
                    }
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/OvertimeManagement/OvertimeManagementBOD.aspx", true) == 0)
                {
                    //DateTime currentDateTime = DateTime.Now;
                    string fromDate = $"{DateTime.Now:dd/MM/yyyy}";
                    //string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = fromDate;
                    urilBuilder.AddQuery("AdminFromDate", fromDate);
                    urilBuilder.AddQuery("AdminToDate", toDate);
                    urilBuilder.AddQuery("AdminDeptId", "0");
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/OvertimeManagement/OvertimeManagementMember.aspx", true) == 0)
                {
                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    urilBuilder.AddQuery("MyStartMonth", fromDate);
                    urilBuilder.AddQuery("MyEndMonth", toDate);
                }

                #endregion

                #region  Not Overtime

                if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveOfAbsenceManagement/LeaveOfAbsenceManagementAdmin.aspx", true) == 0)
                {
                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    urilBuilder.AddQuery("AdminStartMonth", fromDate);
                    urilBuilder.AddQuery("AdminEndMonth", toDate);
                    urilBuilder.AddQuery("AdminDeptId", "0");
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveOfAbsenceManagement/LeaveOfAbsenceManagementBOD.aspx", true) == 0)
                {
                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    urilBuilder.AddQuery("AdminStartMonth", fromDate);
                    urilBuilder.AddQuery("AdminEndMonth", toDate);
                    urilBuilder.AddQuery("AdminDeptId", "0");
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveOfAbsenceManagement/LeaveOfAbsenceManagementManager.aspx", true) == 0)
                {
                    bool isAdminDepartment = false;
                    if (Page.Session[SessionKey.IsAdminDepartment] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                    }
                    else
                    {
                        isAdminDepartment = UserPermission.IsAdminDepartment;
                        Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                    }

                    int currentDepartmentId = 0;
                    if (Page.Session[SessionKey.CurrentDepartmentId] != null)
                    {
                        int.TryParse(Page.Session[SessionKey.CurrentDepartmentId].ToString(), out currentDepartmentId);
                    }
                    else
                    {
                        currentDepartmentId = UserPermission.CurrentDepartmentId;
                        Page.Session[SessionKey.CurrentDepartmentId] = currentDepartmentId;
                    }

                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    urilBuilder.AddQuery("AdminStartMonth", fromDate);
                    urilBuilder.AddQuery("AdminEndMonth", toDate);

                    if (isAdminDepartment)
                    {
                        urilBuilder.AddQuery("AdminDeptId", "0");
                    }
                    else
                    {
                        urilBuilder.AddQuery("AdminDeptId", currentDepartmentId.ToString());
                    }
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveOfAbsenceManagement/LeaveOfAbsenceManagementMember.aspx", true) == 0)
                {

                }

                #endregion

                #region Leave

                if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveManagement/LeaveManagementAdmin.aspx", true) == 0)
                {
                    bool isAdminDepartment = false;
                    if (Page.Session[SessionKey.IsAdminDepartment] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                    }
                    else
                    {
                        isAdminDepartment = UserPermission.IsAdminDepartment;
                        Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                    }

                    int currentDepartmentId = 0;
                    if (Page.Session[SessionKey.CurrentDepartmentId] != null)
                    {
                        int.TryParse(Page.Session[SessionKey.CurrentDepartmentId].ToString(), out currentDepartmentId);
                    }
                    else
                    {
                        currentDepartmentId = UserPermission.CurrentDepartmentId;
                        Page.Session[SessionKey.CurrentDepartmentId] = currentDepartmentId;
                    }

                    string fromDate = $"{DateTime.Now:dd/MM/yyyy}";
                    string toDate = fromDate;
                    urilBuilder.AddQuery("AdminFromDate", fromDate);
                    urilBuilder.AddQuery("AdminToDate", toDate);

                    if (isAdminDepartment)
                    {
                        urilBuilder.AddQuery("AdminDeptId", "0");
                    }
                    else
                    {
                        urilBuilder.AddQuery("AdminDeptId", currentDepartmentId.ToString());
                    }
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveManagement/LeaveManagementBOD.aspx", true) == 0)
                {
                    string fromDate = $"{DateTime.Now:dd/MM/yyyy}";
                    //string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = fromDate;
                    urilBuilder.AddQuery("AdminFromDate", fromDate);
                    urilBuilder.AddQuery("AdminToDate", toDate);
                    urilBuilder.AddQuery("AdminDeptId", "0");
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveManagement/LeaveManagementManager.aspx", true) == 0)
                {
                    bool isAdminDepartment = false;
                    if (Page.Session[SessionKey.IsAdminDepartment] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                    }
                    else
                    {
                        isAdminDepartment = UserPermission.IsAdminDepartment;
                        Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                    }

                    int currentDepartmentId = 0;
                    if (Page.Session[SessionKey.CurrentDepartmentId] != null)
                    {
                        int.TryParse(Page.Session[SessionKey.CurrentDepartmentId].ToString(), out currentDepartmentId);
                    }
                    else
                    {
                        currentDepartmentId = UserPermission.CurrentDepartmentId;
                        Page.Session[SessionKey.CurrentDepartmentId] = currentDepartmentId;
                    }

                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = $"{DateTime.Now:dd/MM/yyyy}";
                    //string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = fromDate;
                    urilBuilder.AddQuery("AdminFromDate", fromDate);
                    urilBuilder.AddQuery("AdminToDate", toDate);

                    if (isAdminDepartment)
                    {
                        urilBuilder.AddQuery("AdminDeptId", "0");
                    }
                    else
                    {
                        urilBuilder.AddQuery("AdminDeptId", currentDepartmentId.ToString());
                    }
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveManagement/LeaveManagementMember.aspx", true) == 0)
                {
                    var isSecurityGuard = false;
                    if (Page.Session[SessionKey.IsSecurityGuard] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsSecurityGuard].ToString(), out isSecurityGuard);
                    }
                    else
                    {
                        UserHelper userHelper = new UserHelper();
                        var currentEmployee = userHelper.GetCurrentLoginUser();
                        AdditionalEmployeePositionDAL additionalEmployeePositionDAL = new AdditionalEmployeePositionDAL(SPContext.Current.Web.Url);
                        isSecurityGuard = additionalEmployeePositionDAL.GetAdditionalPosition(currentEmployee.ID, null, StringConstant.AdditionalEmployeePositionLevelCode.SecurityGuard);
                        Page.Session[SessionKey.IsSecurityGuard] = isSecurityGuard;
                    }

                    if (isSecurityGuard)
                    {
                        urilBuilder.AddQuery("employeeId", "0");
                    }
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveManagement/LeaveHistory.aspx", true) == 0)
                {
                    DateTime currentDateTime = DateTime.Now;

                    string fromDate = currentDateTime.ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    urilBuilder.AddQuery("FromDate", fromDate);
                    urilBuilder.AddQuery("ToDate", toDate);
                }

                #endregion

                #region Vehicle/Transportation

                if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/TransportationManagement/TransportationManagementAdmin.aspx", true) == 0)
                {
                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    Dictionary<string, string> paramCollection = new Dictionary<string, string>();
                    urilBuilder.AddQuery("AdminStartMonth", fromDate);
                    urilBuilder.AddQuery("AdminEndMonth", toDate);
                    urilBuilder.AddQuery("AdminDeptId", "0");
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/TransportationManagement/TransportationManagementBOD.aspx", true) == 0)
                {
                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    urilBuilder.AddQuery("AdminStartMonth", fromDate);
                    urilBuilder.AddQuery("AdminEndMonth", toDate);
                    urilBuilder.AddQuery("AdminDeptId", "0");
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/TransportationManagement/TransportationManagementManager.aspx", true) == 0)
                {
                    bool isAdminDepartment = false;
                    if (Page.Session[SessionKey.IsAdminDepartment] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                    }
                    else
                    {
                        isAdminDepartment = UserPermission.IsAdminDepartment;
                        Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                    }

                    int currentDepartmentId = 0;
                    if (Page.Session[SessionKey.CurrentDepartmentId] != null)
                    {
                        int.TryParse(Page.Session[SessionKey.CurrentDepartmentId].ToString(), out currentDepartmentId);
                    }
                    else
                    {
                        currentDepartmentId = UserPermission.CurrentDepartmentId;
                        Page.Session[SessionKey.CurrentDepartmentId] = currentDepartmentId;
                    }

                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    urilBuilder.AddQuery("AdminStartMonth", fromDate);
                    urilBuilder.AddQuery("AdminEndMonth", toDate);

                    if (isAdminDepartment)
                    {
                        urilBuilder.AddQuery("AdminDeptId", "0");
                    }
                    else
                    {
                        urilBuilder.AddQuery("AdminDeptId", currentDepartmentId.ToString());
                    }
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/TransportationManagement/TransportationManagementMember.aspx", true) == 0)
                {

                }

                #endregion

                #region Freight

                if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/FreightManagement/FreightManagementAdmin.aspx", true) == 0)
                {
                    bool isAdminDepartment = false;
                    if (Page.Session[SessionKey.IsAdminDepartment] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                    }
                    else
                    {
                        isAdminDepartment = UserPermission.IsAdminDepartment;
                        Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                    }

                    int currentDepartmentId = 0;
                    if (Page.Session[SessionKey.CurrentDepartmentId] != null)
                    {
                        int.TryParse(Page.Session[SessionKey.CurrentDepartmentId].ToString(), out currentDepartmentId);
                    }
                    else
                    {
                        currentDepartmentId = UserPermission.CurrentDepartmentId;
                        Page.Session[SessionKey.CurrentDepartmentId] = currentDepartmentId;
                    }

                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = $"{DateTime.Now:dd/MM/yyyy}";
                    //string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = fromDate;
                    urilBuilder.AddQuery("AdminFromDate", fromDate);
                    urilBuilder.AddQuery("AdminToDate", toDate);

                    if (isAdminDepartment)
                    {
                        urilBuilder.AddQuery("AdminDeptId", "0");
                    }
                    else
                    {
                        urilBuilder.AddQuery("AdminDeptId", currentDepartmentId.ToString());
                    }

                    urilBuilder.AddQuery("AdminVehicleId", "0");
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/FreightManagement/FreightManagementBOD.aspx", true) == 0)
                {
                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = $"{DateTime.Now:dd/MM/yyyy}";
                    //string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = fromDate;
                    urilBuilder.AddQuery("AdminFromDate", fromDate);
                    urilBuilder.AddQuery("AdminToDate", toDate);
                    urilBuilder.AddQuery("AdminDeptId", "0");
                    urilBuilder.AddQuery("AdminVehicleId", "0");
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/FreightManagement/FreightManagementManager.aspx", true) == 0)
                {
                    bool isAdminDepartment = false;
                    if (Page.Session[SessionKey.IsAdminDepartment] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                    }
                    else
                    {
                        isAdminDepartment = UserPermission.IsAdminDepartment;
                        Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                    }

                    int currentDepartmentId = 0;
                    if (Page.Session[SessionKey.CurrentDepartmentId] != null)
                    {
                        int.TryParse(Page.Session[SessionKey.CurrentDepartmentId].ToString(), out currentDepartmentId);
                    }
                    else
                    {
                        currentDepartmentId = UserPermission.CurrentDepartmentId;
                        Page.Session[SessionKey.CurrentDepartmentId] = currentDepartmentId;
                    }

                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = $"{DateTime.Now:dd/MM/yyyy}";
                    //string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = fromDate;
                    urilBuilder.AddQuery("AdminFromDate", fromDate);
                    urilBuilder.AddQuery("AdminToDate", toDate);

                    if (isAdminDepartment)
                    {
                        urilBuilder.AddQuery("AdminDeptId", "0");
                    }
                    else
                    {
                        urilBuilder.AddQuery("AdminDeptId", currentDepartmentId.ToString());
                    }

                    urilBuilder.AddQuery("AdminVehicleId", "0");
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/FreightManagement/FreightManagementMember.aspx", true) == 0)
                {
                    var isSecurityGuard = false;
                    if (Page.Session[SessionKey.IsSecurityGuard] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsSecurityGuard].ToString(), out isSecurityGuard);
                    }
                    else
                    {
                        UserHelper userHelper = new UserHelper();
                        var currentEmployee = userHelper.GetCurrentLoginUser();
                        AdditionalEmployeePositionDAL additionalEmployeePositionDAL = new AdditionalEmployeePositionDAL(SPContext.Current.Web.Url);
                        isSecurityGuard = additionalEmployeePositionDAL.GetAdditionalPosition(currentEmployee.ID, null, StringConstant.AdditionalEmployeePositionLevelCode.SecurityGuard);
                        Page.Session[SessionKey.IsSecurityGuard] = isSecurityGuard;
                    }

                    if (isSecurityGuard)
                    {
                        DateTime currentDateTime = DateTime.Now;
                        string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                        string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                        urilBuilder.AddQuery("AdminSelectedDate", fromDate);
                        urilBuilder.AddQuery("AdminSelectedToDate", toDate);
                        urilBuilder.AddQuery("AdminDeptId", "0");
                        urilBuilder.AddQuery("AdminVehicleId", "0");
                        urilBuilder.AddQuery("reqnum", "0");
                        urilBuilder.AddQuery("searchtype", "0");
                    }
                    else
                    {
                        DateTime currentDateTime = DateTime.Now;
                        string fromDate = $"{DateTime.Now:dd/MM/yyyy}";
                        //string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                        string toDate = fromDate;
                        urilBuilder.AddQuery("AdminFromDate", fromDate);
                        urilBuilder.AddQuery("AdminToDate", toDate);
                        urilBuilder.AddQuery("AdminDeptId", "0");
                        urilBuilder.AddQuery("AdminVehicleId", "0");
                    }
                }

                #endregion

                #region  Business Trip

                if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/BusinessTripManagement/BusinessTripManagementAdmin.aspx", true) == 0)
                {
                    bool isAdminDepartment = false;
                    if (Page.Session[SessionKey.IsAdminDepartment] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                    }
                    else
                    {
                        isAdminDepartment = UserPermission.IsAdminDepartment;
                        Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                    }

                    int currentDepartmentId = 0;
                    if (Page.Session[SessionKey.CurrentDepartmentId] != null)
                    {
                        int.TryParse(Page.Session[SessionKey.CurrentDepartmentId].ToString(), out currentDepartmentId);
                    }
                    else
                    {
                        currentDepartmentId = UserPermission.CurrentDepartmentId;
                        Page.Session[SessionKey.CurrentDepartmentId] = currentDepartmentId;
                    }

                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    urilBuilder.AddQuery("AdminStartMonth", fromDate);
                    urilBuilder.AddQuery("AdminEndMonth", toDate);

                    if (isAdminDepartment)
                    {
                        urilBuilder.AddQuery("AdminDeptId", "0");
                    }
                    else
                    {
                        urilBuilder.AddQuery("AdminDeptId", currentDepartmentId.ToString());
                    }
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/BusinessTripManagement/BusinessTripManagementBOD.aspx", true) == 0)
                {
                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    urilBuilder.AddQuery("AdminStartMonth", fromDate);
                    urilBuilder.AddQuery("AdminEndMonth", toDate);
                    urilBuilder.AddQuery("AdminDeptId", "0");
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/BusinessTripManagement/BusinessTripManagementManager.aspx", true) == 0)
                {
                    bool isAdminDepartment = false;
                    if (Page.Session[SessionKey.IsAdminDepartment] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                    }
                    else
                    {
                        isAdminDepartment = UserPermission.IsAdminDepartment;
                        Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                    }

                    int currentDepartmentId = 0;
                    if (Page.Session[SessionKey.CurrentDepartmentId] != null)
                    {
                        int.TryParse(Page.Session[SessionKey.CurrentDepartmentId].ToString(), out currentDepartmentId);
                    }
                    else
                    {
                        currentDepartmentId = UserPermission.CurrentDepartmentId;
                        Page.Session[SessionKey.CurrentDepartmentId] = currentDepartmentId;
                    }

                    DateTime currentDateTime = DateTime.Now;
                    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                    urilBuilder.AddQuery("AdminStartMonth", fromDate);
                    urilBuilder.AddQuery("AdminEndMonth", toDate);

                    if (isAdminDepartment)
                    {
                        urilBuilder.AddQuery("AdminDeptId", "0");
                    }
                    else
                    {
                        urilBuilder.AddQuery("AdminDeptId", currentDepartmentId.ToString());
                    }
                }
                else if (string.Compare(pageName, "/_layouts/15/RBVH.Stada.Intranet.WebPages/BusinessTripManagement/BusinessTripManagementMember.aspx", true) == 0)
                {
                    var isCashier = false;
                    if (Page.Session[SessionKey.IsCashier] != null)
                    {
                        bool.TryParse(Page.Session[SessionKey.IsCashier].ToString(), out isCashier);
                    }
                    else
                    {
                        UserHelper userHelper = new UserHelper();
                        var currentEmployee = userHelper.GetCurrentLoginUser();
                        var additionalEmployeePositionDAL = new AdditionalEmployeePositionDAL(SPContext.Current.Web.Url);
                        isCashier = additionalEmployeePositionDAL.GetAdditionalPosition(currentEmployee.ID, StringConstant.AdditionalEmployeePositionModule.BusinessTripManagement, StringConstant.AdditionalEmployeePositionLevelCode.Cashier);
                        Page.Session[SessionKey.IsCashier] = isCashier;
                    }

                    var isExtAdmin = false;
                    if (Page.Session[SessionKey.IsExtAdmin] != null)
                    {
                        
                        bool.TryParse(Page.Session[SessionKey.IsExtAdmin].ToString(), out isExtAdmin);
                    }
                    else
                    {
                        UserHelper userHelper = new UserHelper();
                        var currentEmployee = userHelper.GetCurrentLoginUser();
                        var additionalEmployeePositionDAL = new AdditionalEmployeePositionDAL(SPContext.Current.Web.Url);
                        isExtAdmin = additionalEmployeePositionDAL.GetAdditionalPosition(currentEmployee.ID, StringConstant.AdditionalEmployeePositionModule.BusinessTripManagement, StringConstant.AdditionalEmployeePositionLevelCode.ExtAdmin);
                        Page.Session[SessionKey.IsExtAdmin] = isExtAdmin;
                    }

                    if (isCashier || isExtAdmin)
                    {
                        DateTime currentDateTime = DateTime.Now;
                        string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                        string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
                        urilBuilder.AddQuery("AdminStartMonth", fromDate);
                        urilBuilder.AddQuery("AdminEndMonth", toDate);
                        urilBuilder.AddQuery("AdminDeptId", "0");
                    }
                }

                #endregion

                url = HttpContext.Current.Server.UrlDecode(urilBuilder.ToString());
            }
            catch { }

            return url;
        }
    }
}
