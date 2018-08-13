using RBVH.Stada.Intranet.Biz.Models;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;

namespace RBVH.Stada.Intranet.Webservices.Model
{
    public class ShiftManagementModel
    {
        public int Id { get; set; }
        public DepartmentInfo Department { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string ApprovalStatus { get; set; }
        public LookupItemModel Requester { get; set; }
        public LookupItemModel Location { get; set; }
        public UserModel ApprovedBy { get; set; }
        public UserModel ModifiedBy { get; set; }
        public string ModifiedByString { get; set; }
        public List<UserModel> AdditionalUser { get; set; }
        public string ApproverFullName { get; set; }
        public List<ShiftManagementDetailModel> ShiftManagementDetailModelList { get; set; }
        public bool RequestExpired { get; set; }
        public string RequestDueDate { get; set; }

        public ShiftManagementModel()
        {
            Department = new DepartmentInfo();
            ShiftManagementDetailModelList = new List<ShiftManagementDetailModel>();
        }

        public ShiftManagement ToEntity()
        {
            var shiftManagement = new ShiftManagement();
            shiftManagement.ID = Id;
            shiftManagement.Department.LookupId = Department.Id;
            shiftManagement.Requester.LookupId = Requester.LookupId;
            shiftManagement.Month = Month;
            shiftManagement.Year = Year;
            shiftManagement.Location.LookupId = Location.LookupId;
            if (ApprovedBy != null)
            {
                shiftManagement.ApprovedBy = new User { FirstName = ApprovedBy.FirstName, FullName = ApprovedBy.FullName, ID = ApprovedBy.ID, IsGroup = ApprovedBy.IsGroup, LastName = ApprovedBy.LastName, UserName = ApprovedBy.UserName };
            }
            if (AdditionalUser != null)
            {
                var userList = new List<User>();
                userList.AddRange(AdditionalUser.Select(item => new User { FirstName = item.FirstName, FullName = item.FullName, ID = item.ID, IsGroup = item.IsGroup, LastName = item.LastName, UserName = item.UserName }));
                shiftManagement.CommonAddApprover1 = userList;
            }
            if (ModifiedBy != null)
            {
                shiftManagement.ModifiedBy = new User { FirstName = ModifiedBy.FirstName, FullName = ModifiedBy.FullName, ID = ModifiedBy.ID, IsGroup = ModifiedBy.IsGroup, LastName = ModifiedBy.LastName, UserName = ModifiedBy.UserName };
            }

            return shiftManagement;
        }
    }
}
