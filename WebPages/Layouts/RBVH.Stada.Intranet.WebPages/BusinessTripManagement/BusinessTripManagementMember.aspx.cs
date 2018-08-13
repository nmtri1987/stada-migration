using System;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;
using RBVH.Stada.Intranet.WebPages.Utils;
using RBVH.Stada.Intranet.Biz.Constants;
using RBVH.Stada.Intranet.Biz.DataAccessLayer;
using System.Globalization;
using System.Collections.Generic;
using RBVH.Stada.Intranet.WebPages.Common;

namespace RBVH.Stada.Intranet.WebPages.Layouts.RBVH.Stada.Intranet.WebPages.BusinessTripManagement
{
    public partial class BusinessTripManagementMember : LayoutsPageBase
    {
        private AdditionalEmployeePositionDAL additionalEmployeePositionDAL;
        public bool IsCashier = false;
        public bool IsDriver = false;
        public bool IsExtAdmin = false;
        protected bool hasRequestPermission = false;
        protected void Page_Load(object sender, EventArgs e)
        {
            LoadView();
        }
        private void LoadView()
        {
            additionalEmployeePositionDAL = new AdditionalEmployeePositionDAL(SPContext.Current.Web.Url);
            var currentEmployeeId = GetCurrentUserId();

            if (Page.Session[SessionKey.IsCashier] != null)
            {
                bool isCashier;
                bool.TryParse(Page.Session[SessionKey.IsCashier].ToString(), out isCashier);
                this.IsCashier = isCashier;
            }
            else
            {
                bool isCashier = additionalEmployeePositionDAL.GetAdditionalPosition(currentEmployeeId, StringConstant.AdditionalEmployeePositionModule.BusinessTripManagement, StringConstant.AdditionalEmployeePositionLevelCode.Cashier);
                Page.Session[SessionKey.IsCashier] = isCashier;
                this.IsCashier = isCashier;
            }

            if (Page.Session[SessionKey.IsDriver] != null)
            {
                bool isDriver;
                bool.TryParse(Page.Session[SessionKey.IsDriver].ToString(), out isDriver);
                this.IsDriver = isDriver;
            }
            else
            {
                bool isDriver = additionalEmployeePositionDAL.GetAdditionalPosition(currentEmployeeId, StringConstant.AdditionalEmployeePositionModule.BusinessTripManagement, StringConstant.AdditionalEmployeePositionLevelCode.Driver);
                Page.Session[SessionKey.IsDriver] = isDriver;
                this.IsDriver = isDriver;
            }

            if (Page.Session[SessionKey.IsExtAdmin] != null)
            {
                bool isExtAdmin;
                bool.TryParse(Page.Session[SessionKey.IsExtAdmin].ToString(), out isExtAdmin);
                this.IsExtAdmin = isExtAdmin;
            }
            else
            {
                bool isExtAdmin = additionalEmployeePositionDAL.GetAdditionalPosition(currentEmployeeId, StringConstant.AdditionalEmployeePositionModule.BusinessTripManagement, StringConstant.AdditionalEmployeePositionLevelCode.ExtAdmin);
                Page.Session[SessionKey.IsExtAdmin] = isExtAdmin;
                this.IsExtAdmin = isExtAdmin;
            }

            //var url = SPContext.Current.Web.Url;
            //additionalEmployeePositionDAL = new AdditionalEmployeePositionDAL(url);
            //var currentEmployeeId = GetCurrentUserId();
            //IsCashier = additionalEmployeePositionDAL.GetAdditionalPosition(currentEmployeeId, StringConstant.AdditionalEmployeePositionModule.BusinessTripManagement, StringConstant.AdditionalEmployeePositionLevelCode.Cashier);
            //IsDriver = additionalEmployeePositionDAL.GetAdditionalPosition(currentEmployeeId, StringConstant.AdditionalEmployeePositionModule.BusinessTripManagement, StringConstant.AdditionalEmployeePositionLevelCode.Driver);
            //IsExtAdmin = additionalEmployeePositionDAL.GetAdditionalPosition(currentEmployeeId, StringConstant.AdditionalEmployeePositionModule.BusinessTripManagement, StringConstant.AdditionalEmployeePositionLevelCode.ExtAdmin);

            //if (IsCashier == true || IsExtAdmin == true)
            //{
            //    DateTime currentDateTime = DateTime.Now;
            //    string fromDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
            //    string toDate = new DateTime(currentDateTime.Year, currentDateTime.Month, 1, 23, 59, 59).AddMonths(1).AddDays(-1).ToString(StringConstant.DateFormatyyyyMMddHHmmssfff);
            //    Dictionary<string, string> paramCollection = new Dictionary<string, string>();
            //    paramCollection.Add("AdminStartMonth", fromDate);
            //    paramCollection.Add("AdminEndMonth", toDate);
            //    paramCollection.Add("AdminDeptId", "0");

            //    Uri oldUri = this.Page.Request.Url;
            //    Uri newUri = this.Page.Request.Url.AddParameter(paramCollection);
            //    URLHelper.RedirectPage(oldUri, newUri);
            //}
        }

        private int GetCurrentUserId()
        {
            UserHelper userHelper = new UserHelper();
            var currentEmployee = userHelper.GetCurrentLoginUser();

            if (currentEmployee.EmployeeType == StringConstant.EmployeeType.ADUser &&
                (int)Convert.ToDouble(currentEmployee.EmployeeLevel.LookupValue, CultureInfo.InvariantCulture.NumberFormat) < (int)StringConstant.EmployeeLevel.BOD)
            {
                hasRequestPermission = true;
            }

            return currentEmployee == null ? 0 : currentEmployee.ID;
        }
    }
}
