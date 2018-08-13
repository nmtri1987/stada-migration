using RBVH.Stada.Intranet.Biz.Constants;
using RBVH.Stada.Intranet.Biz.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Runtime.Serialization;

namespace RBVH.Stada.Intranet.Webservices.Model
{
    public class FreightManagementModel
    {
        public int Id { get; set; }
        public string RequestNo { get; set; }
        public LookupItemModel Requester { get; set; }
        public LookupItemModel Department { get; set; }
        public LookupItemModel Location { get; set; }
        public LookupItemModel Bringer { get; set; }
        public LookupItemModel BringerDepartment { get; set; }
        public LookupItemModel BringerLocation { get; set; }
        public bool CompanyVehicle { get; set; }
        public string BringerName { get; set; }
        public string CompanyName { get; set; }
        public string Reason { get; set; }
        public string Receiver { get; set; }
        public LookupItemModel ReceiverDepartmentLookup { get; set; }
        public LookupItemModel ReceiverDepartmentVN { get; set; }
        public string ReceiverDepartmentText { get; set; }
        public string ReceiverPhone { get; set; }
        public bool FreightType { get; set; }
        public bool ReturnedGoods { get; set; }
        public bool HighPriority { get; set; }
        public string OtherReason { get; set; }
        public LookupItemModel VehicleLookup { get; set; }
        public LookupItemModel VehicleVN { get; set; }
        public bool IsValidRequest { get; set; }
        public bool IsFinished { get; set; }
        public List<FreightDetailsModel> FreightDetails { get; set; }
        public DateTime Date { get; set; }
        public string DateString { get; set; }
        public int Hour { get; set; }
        public int Minute { get; set; }
        public string SecurityNotes { get; set; }
        public string Comment { get; set; }
        public string ApprovalStatus { get; set; }
        public bool RequestExpired { get; set; }
        public string RequestDueDate { get; set; }
        public UserModel DH { get; set; }
        public UserModel BOD { get; set; }
        public UserModel AdminDept { get; set; }
        public UserModel CreatedBy { get; set; }
        public UserModel ModifiedBy { get; set; }

        public FreightManagementModel()
        {
            FreightDetails = new List<FreightDetailsModel>();
            Date = DateTime.Now;
        }

        public FreightManagement ToEntity()
        {
            var freightManagement = new FreightManagement();

            freightManagement.ID = Id;
            freightManagement.RequestNo = RequestNo;
            freightManagement.Requester = new LookupItem { LookupId = (Requester != null ? Requester.LookupId : 0), LookupValue = (Requester != null ? Requester.LookupValue : string.Empty) };
            freightManagement.Department = new LookupItem { LookupId = (Department != null ? Department.LookupId : 0), LookupValue = (Department != null ? Department.LookupValue : string.Empty) };
            freightManagement.Location = new LookupItem { LookupId = (Location != null ? Location.LookupId : 0), LookupValue = (Location != null ? Location.LookupValue : string.Empty) };
            freightManagement.Bringer = new LookupItem { LookupId = (Bringer != null ? Bringer.LookupId : 0), LookupValue = (Bringer != null ? Bringer.LookupValue : string.Empty) };
            freightManagement.BringerDepartment = new LookupItem { LookupId = (BringerDepartment != null ? BringerDepartment.LookupId : 0), LookupValue = (BringerDepartment != null ? BringerDepartment.LookupValue : string.Empty) };
            freightManagement.BringerLocation = new LookupItem { LookupId = (BringerLocation != null ? BringerLocation.LookupId : 0), LookupValue = (BringerLocation != null ? BringerLocation.LookupValue : string.Empty) };
            freightManagement.CompanyVehicle = CompanyVehicle;
            freightManagement.BringerName = BringerName;
            freightManagement.CompanyName = CompanyName;
            freightManagement.Reason = Reason;
            freightManagement.Receiver = Receiver;
            freightManagement.ReceiverDepartmentLookup = new LookupItem { LookupId = (ReceiverDepartmentLookup != null ? ReceiverDepartmentLookup.LookupId : 0), LookupValue = (ReceiverDepartmentLookup != null ? ReceiverDepartmentLookup.LookupValue : string.Empty) };
            freightManagement.ReceiverDepartmentVN = new LookupItem { LookupId = (ReceiverDepartmentVN != null ? ReceiverDepartmentVN.LookupId : 0), LookupValue = (ReceiverDepartmentVN != null ? ReceiverDepartmentVN.LookupValue : string.Empty) };
            freightManagement.ReceiverDepartmentText = ReceiverDepartmentText;
            freightManagement.ReceiverPhone = ReceiverPhone;
            freightManagement.FreightType = FreightType;
            freightManagement.ReturnedGoods = ReturnedGoods;
            freightManagement.HighPriority = HighPriority;
            freightManagement.OtherReason = OtherReason;
            freightManagement.VehicleLookup = new LookupItem { LookupId = (VehicleLookup != null ? VehicleLookup.LookupId : 0), LookupValue = (VehicleLookup != null ? VehicleLookup.LookupValue : string.Empty) };
            freightManagement.VehicleVN = new LookupItem { LookupId = (VehicleVN != null ? VehicleVN.LookupId : 0), LookupValue = (VehicleVN != null ? VehicleVN.LookupValue : string.Empty) };
            freightManagement.IsValidRequest = IsValidRequest;
            DateTime dateTime;
            DateTime.TryParseExact(DateString, StringConstant.DateFormatddMMyyyy2, CultureInfo.InvariantCulture, DateTimeStyles.None, out dateTime);
            DateTime date = new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, Hour, Minute, 0);
            freightManagement.TransportTime = date;
            freightManagement.SecurityNotes = SecurityNotes;
            freightManagement.Comment = Comment;
            freightManagement.ApprovalStatus = ApprovalStatus;
            if (DH != null)
            {
                freightManagement.DH = new User { FirstName = DH.FirstName, FullName = DH.FullName, ID = DH.ID, IsGroup = DH.IsGroup, LastName = DH.LastName, UserName = DH.UserName};
            }
            if (BOD != null)
            {
                freightManagement.BOD = new User { FirstName = BOD.FirstName, FullName = BOD.FullName, ID = BOD.ID, IsGroup = BOD.IsGroup, LastName = BOD.LastName, UserName = BOD.UserName };
            }
            if (AdminDept != null)
            {
                freightManagement.AdminDept = new User { FirstName = AdminDept.FirstName, FullName = AdminDept.FullName, ID = AdminDept.ID, IsGroup = AdminDept.IsGroup, LastName = AdminDept.LastName, UserName = AdminDept.UserName };
            }

            return freightManagement;
        }
    }
}
