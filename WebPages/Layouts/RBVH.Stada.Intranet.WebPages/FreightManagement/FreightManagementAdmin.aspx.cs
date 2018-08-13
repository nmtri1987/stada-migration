﻿using System;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;
using RBVH.Stada.Intranet.WebPages.Utils;
using System.Collections.Generic;
using RBVH.Stada.Intranet.Biz.Constants;
using RBVH.Stada.Intranet.WebPages.Common;

namespace RBVH.Stada.Intranet.WebPages.Layouts.RBVH.Stada.Intranet.WebPages.FreightManagement
{
    public partial class FreightManagementAdmin : LayoutsPageBase
    {
        public bool IsAdminDepartment { get; set; }
        public int CurrentDepartmentId { get; set; }

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
            //string fromDate = $"{DateTime.Now:dd/MM/yyyy}";
            ////string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
            //string toDate = fromDate;
            //Dictionary<string, string> paramCollection = new Dictionary<string, string>();
            //paramCollection.Add("AdminFromDate", fromDate);
            //paramCollection.Add("AdminToDate", toDate);

            //if (IsAdminDepartment == true)
            //{
            //    paramCollection.Add("AdminDeptId", "0");
            //}
            //else
            //{
            //    paramCollection.Add("AdminDeptId", CurrentDepartmentId.ToString());
            //}

            //paramCollection.Add("AdminVehicleId", "0");

            //Uri oldUri = this.Page.Request.Url;
            //Uri newUri = this.Page.Request.Url.AddParameter(paramCollection);
            //URLHelper.RedirectPage(oldUri, newUri);
        }
    }
}