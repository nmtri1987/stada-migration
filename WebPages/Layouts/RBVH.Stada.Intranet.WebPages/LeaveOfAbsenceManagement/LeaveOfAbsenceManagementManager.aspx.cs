﻿using System;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;
using RBVH.Stada.Intranet.Biz.DataAccessLayer;
using Microsoft.SharePoint.Administration;
using System.Linq;
using RBVH.Core.SharePoint;
using System.Globalization;
using RBVH.Stada.Intranet.WebPages.Utils;
using RBVH.Stada.Intranet.Biz.Constants;
using System.Collections.Generic;
using RBVH.Stada.Intranet.WebPages.Common;

namespace RBVH.Stada.Intranet.WebPages.Layouts.RBVH.Stada.Intranet.WebPages.LeaveOfAbsenceManagement
{
    public partial class LeaveOfAbsenceManagementManager : LayoutsPageBase
    {
        protected bool IsAdminDepartment { get; set; }
        protected int CurrentDepartmentId { get; set; }

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

            if (Page.Session[SessionKey.CurrentDepartmentId] != null)
            {
                int currentDepartmentId;
                int.TryParse(Page.Session[SessionKey.CurrentDepartmentId].ToString(), out currentDepartmentId);
                this.CurrentDepartmentId = currentDepartmentId;
            }
            else
            {
                var currentDepartmentId = UserPermission.CurrentDepartmentId;
                Page.Session[SessionKey.CurrentDepartmentId] = currentDepartmentId;
                this.CurrentDepartmentId = currentDepartmentId;
            }

            //IsAdminDepartment = UserPermission.IsAdminDepartment;
            //CurrentDepartmentId = UserPermission.CurrentDepartmentId;

            //DateTime currentDateTime = DateTime.Now;
            //string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
            //string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);

            //Dictionary<string, string> paramCollection = new Dictionary<string, string>();
            //paramCollection.Add("AdminStartMonth", fromDate);
            //paramCollection.Add("AdminEndMonth", toDate);

            //if (IsAdminDepartment == true)
            //{
            //    paramCollection.Add("AdminDeptId", "0");
            //}
            //else
            //{
            //    paramCollection.Add("AdminDeptId", CurrentDepartmentId.ToString());
            //}

            //Uri oldUri = this.Page.Request.Url;
            //Uri newUri = this.Page.Request.Url.AddParameter(paramCollection);
            //URLHelper.RedirectPage(oldUri, newUri);
        }
    }
}
