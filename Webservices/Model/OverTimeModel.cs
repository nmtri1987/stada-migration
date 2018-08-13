using RBVH.Stada.Intranet.Biz.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RBVH.Stada.Intranet.Webservices.Model
{
    public class OverTimeModel
    {
        public int ID { get; set; }
        public string ApprovalStatus { get; set; }
        public LookupItemModel CommonDepartment { get; set; }
        public string Date
        {
            get; set;
        }
        public bool RequiredBODApprove { get; set; }
        public string OtherRequirements { get; set; }
        public LookupItemModel CommonLocation { get; set; }
        public string Place { get; set; }
        public LookupItemModel Requester { get; set; }
        public UserModel ApprovedBy { get; set; }
        public UserModel FirstApprovedBy { get; set; }
        public string SumOfEmployee { get; set; }
        public string SumOfMeal { get; set; }
        public List<OvertimeDetailModel> OvertimeDetailModelList { get; set; }
        public string ApproverFullName { get; set; }
        public string FirstApprovedDate { get; set; }
        public string Modified { get; set; }
        public int ApprovedLevel { get; set; }
        public string DHComments { get; set; }
        public string BODComments { get; set; }
        public string SecurityComments { get; set; }
        public bool RequestExpired { get; set; }
        public string RequestDueDate { get; set; }

        public OverTimeModel()
        {
            this.CommonDepartment = new LookupItemModel();
            this.CommonLocation = new LookupItemModel();
            this.Requester = new LookupItemModel();
            this.ApprovedBy = new UserModel();
            this.FirstApprovedBy = new UserModel();
            OvertimeDetailModelList = new List<OvertimeDetailModel>();
        }
        public OverTimeManagement ToEntity()
        {
            OverTimeManagement overtimeManagement = new OverTimeManagement();
            overtimeManagement.ID = this.ID;
            overtimeManagement.ApprovalStatus = this.ApprovalStatus;
            if (ApprovedBy != null)
            {
                overtimeManagement.ApprovedBy = new User { FirstName = ApprovedBy.FirstName, FullName = ApprovedBy.FullName, ID = ApprovedBy.ID, IsGroup = ApprovedBy.IsGroup, LastName = ApprovedBy.LastName, UserName = ApprovedBy.UserName };
            }
            if (FirstApprovedBy != null)
            {
                overtimeManagement.FirstApprovedBy = new User { FirstName = FirstApprovedBy.FirstName, FullName = FirstApprovedBy.FullName, ID = FirstApprovedBy.ID, IsGroup = FirstApprovedBy.IsGroup, LastName = FirstApprovedBy.LastName, UserName = FirstApprovedBy.UserName };
            }
            overtimeManagement.CommonDepartment = new LookupItem { LookupId = (CommonDepartment != null ? CommonDepartment.LookupId : 0), LookupValue = (CommonDepartment != null ? CommonDepartment.LookupValue : string.Empty) };
            overtimeManagement.CommonDate = Convert.ToDateTime(this.Date);
            overtimeManagement.CommonLocation.LookupId = this.CommonLocation.LookupId;
            overtimeManagement.Place = this.Place;
            overtimeManagement.OtherRequirements = this.OtherRequirements;
            overtimeManagement.DHComments = this.DHComments;
            overtimeManagement.BODComments = this.BODComments;
            overtimeManagement.SecurityComments = this.SecurityComments;
            overtimeManagement.Requester.LookupId = this.Requester.LookupId;
            overtimeManagement.Requester.LookupValue = this.Requester.LookupValue;
            overtimeManagement.SumOfEmployee = string.IsNullOrEmpty(this.SumOfEmployee) ? 0 : int.Parse(this.SumOfEmployee);
            overtimeManagement.SumOfMeal = string.IsNullOrEmpty(this.SumOfMeal) ? 0 : int.Parse(this.SumOfMeal);
            return overtimeManagement;
        }
    }
}
