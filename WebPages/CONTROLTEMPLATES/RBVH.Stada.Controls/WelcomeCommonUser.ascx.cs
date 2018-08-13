using System;
using System.Web.UI;
using RBVH.Stada.Intranet.WebPages.Utils;
using Microsoft.SharePoint;
using RBVH.Stada.Intranet.Biz.Constants;
using RBVH.Stada.Intranet.Biz.Models;
using RBVH.Stada.Intranet.Biz.DataAccessLayer;
using System.Web.Script.Serialization;

namespace RBVH.Stada.Intranet.WebPages.CONTROLTEMPLATES.RBVH.Stada.Controls
{
    public partial class WelcomeCommonUser : UserControl
    {
        private const string WelcomeCommonUser_EmployeeInfo_Session_Key = "WelcomeCommonUser_EmployeeInfo_Session_Key";
        //private const string WelcomeCommonUser_IsCurrentUserInCommonGroup_Session_Key = "WelcomeCommonUser_IsCurrentUserInCommonGroup_Session_Key";

        JavaScriptSerializer jsSerializer = new JavaScriptSerializer();

        EmployeeInfo _employeeInfo;
        public string EmployeeInfo
        {
            get
            {
                var employeeInfoStr = jsSerializer.Serialize(_employeeInfo);
                if (!string.IsNullOrEmpty(employeeInfoStr))
                {
                    employeeInfoStr = employeeInfoStr.Replace(@"\\", "");
                }
                return employeeInfoStr;
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!Page.IsPostBack)
            {
                LoadData();
            }
        }

        /// <summary>
        ///     Load data
        /// </summary>
        /// <returns>model in form</returns>
        protected void LoadData()
        {
            var isCurrentUserInCommonGroup =  false;
            if (Page.Session[SessionKey.IsCurrentUserInCommonGroup] != null)
            {
                bool.TryParse(Page.Session[SessionKey.IsCurrentUserInCommonGroup].ToString(), out isCurrentUserInCommonGroup);
            }
            else
            {
                isCurrentUserInCommonGroup = UserPermission.IsCurrentUserInGroup(StringConstant.CommonAccounts);
                Page.Session[SessionKey.IsCurrentUserInCommonGroup] = isCurrentUserInCommonGroup;
            }

            // if (!SPContext.Current.Web.CurrentUser.IsSiteAdmin && UserPermission.IsCurrentUserInGroup(StringConstant.CommonAccounts))
            if (!SPContext.Current.Web.CurrentUser.IsSiteAdmin && isCurrentUserInCommonGroup)
            {
                var employeeInfo = UserPermission.GetEmployeeInfo();

                // Common user alreay logged in
                if (employeeInfo != null)
                {
                    EmployeeNameLiteral.Text = employeeInfo.FullName;
                    ScriptManager.RegisterStartupScript(this, GetType(), "ShowWelcomeCommon", "showWelcomeCommon();", true);
                    employeeInfo.Image = string.Empty;
                    this._employeeInfo = employeeInfo;
                }
                else
                {
                    ScriptManager.RegisterStartupScript(this, GetType(), "hideWelcomeCommon", "hideWelcomeCommon();", true);
                }
            }
            else
            {
                try
                {
                    var employee = Page.Session[WelcomeCommonUser_EmployeeInfo_Session_Key] as EmployeeInfo;

                    if (employee == null)
                    {
                        EmployeeInfoDAL employeeInfoDAL = new EmployeeInfoDAL(SPContext.Current.Site.Url);
                        //DepartmentDAL departmentDAL = new DepartmentDAL(SPContext.Current.Site.Url);
                        employee = employeeInfoDAL.GetByADAccount(SPContext.Current.Web.CurrentUser.ID);
                        if (employee != null)
                        {
                            employee.Image = string.Empty;
                            this._employeeInfo = employee;
                            Page.Session[WelcomeCommonUser_EmployeeInfo_Session_Key] = employee;
                        }
                    }
                    else
                    {
                        this._employeeInfo = employee;
                    }
                }
                catch { }

                ScriptManager.RegisterStartupScript(this, GetType(), "showWelcome", "showWelcome();", true);
            }
        }
    }
}