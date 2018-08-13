using System;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;
using RBVH.Stada.Intranet.WebPages.Utils;
using RBVH.Stada.Intranet.Biz.Constants;
using System.Collections.Generic;
using RBVH.Stada.Intranet.WebPages.Common;

namespace RBVH.Stada.Intranet.WebPages.Layouts.RBVH.Stada.Intranet.WebPages.TransportationManagement
{
    public partial class TransportationManagementAdmin : LayoutsPageBase
    {
        protected bool IsAdminDepartment { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Page.Session[SessionKey.IsAdminDepartment] != null)
            {
                bool isAdminDepartment;
                bool.TryParse(Page.Session[SessionKey.IsAdminDepartment].ToString(), out isAdminDepartment);
                this.IsAdminDepartment = isAdminDepartment;
            }
            else
            {
                var isAdminDepartment = UserPermission.IsAdminDepartment;
                Page.Session[SessionKey.IsAdminDepartment] = isAdminDepartment;
                this.IsAdminDepartment = isAdminDepartment;
            }

            //IsAdminDepartment = UserPermission.IsAdminDepartment;

            //DateTime currentDateTime = DateTime.Now;
            //string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
            //string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
            //Dictionary<string, string> paramCollection = new Dictionary<string, string>();
            //paramCollection.Add("AdminStartMonth", fromDate);
            //paramCollection.Add("AdminEndMonth", toDate);
            //paramCollection.Add("AdminDeptId", "0");

            //Uri oldUri = this.Page.Request.Url;
            //Uri newUri = this.Page.Request.Url.AddParameter(paramCollection);
            //URLHelper.RedirectPage(oldUri, newUri);
        }
    }
}
