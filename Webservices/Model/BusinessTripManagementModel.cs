using RBVH.Stada.Intranet.Biz.Constants;
using RBVH.Stada.Intranet.Biz.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Runtime.Serialization;

namespace RBVH.Stada.Intranet.Webservices.Model
{
    public class BusinessTripManagementModel
    {
        public int Id { get; set; }
        public LookupItemModel Requester { get; set; }
        public LookupItemModel Department { get; set; }
        public LookupItemModel Location { get; set; }
        public bool Domestic { get; set; }
        public string BusinessTripPurpose { get; set; }
        public bool HotelBooking { get; set; }
        public bool TripHighPriority { get; set; }
        public string PaidBy { get; set; }
        public string OtherService { get; set; }
        public string TransportationType { get; set; }
        public string OtherTransportationDetail { get; set; }
        public bool HasVisa { get; set; }
        public string CashRequestDetails { get; set; }
        public string OtherRequestDetail { get; set; }
        public LookupItemModel Driver { get; set; }
        public LookupItemModel Cashier { get; set; }
        public string Comment { get; set; }
        public string ApprovalStatus { get; set; }
        public UserModel DH { get; set; }
        public UserModel DirectBOD { get; set; }
        public UserModel BOD { get; set; }
        public UserModel AdminDept { get; set; }
        public List<BusinessTripEmployeeModel> EmployeeList { get; set; }
        public List<BusinessTripScheduleModel> ScheduleList { get; set; }
        public bool RequestExpired { get; set; }
        public string RequestDueDate { get; set; }
        public UserModel CreatedBy { get; set; }
        public UserModel ModifiedBy { get; set; }

        public BusinessTripManagementModel() {
            Requester = new LookupItemModel();
            Department = new LookupItemModel();
            Location = new LookupItemModel();
            Driver = new LookupItemModel();
            Cashier = new LookupItemModel();
            EmployeeList = new List<BusinessTripEmployeeModel>();
            ScheduleList = new List<BusinessTripScheduleModel>();
        }

        public BusinessTripManagement ToEntity()
        {
            BusinessTripManagement businessTripManagement = new BusinessTripManagement();

            businessTripManagement.ID = Id;
            businessTripManagement.Requester = new LookupItem() { LookupId = (Requester != null ? Requester.LookupId : 0), LookupValue = (Requester != null ? Requester.LookupValue : string.Empty) };
            businessTripManagement.CommonDepartment = new LookupItem() { LookupId = (Department != null ? Department.LookupId : 0), LookupValue = (Department != null ? Department.LookupValue : string.Empty) };
            businessTripManagement.CommonLocation = new LookupItem() { LookupId = (Location != null ? Location.LookupId : 0), LookupValue = (Location != null ? Location.LookupValue : string.Empty) };
            businessTripManagement.Domestic = Domestic;
            businessTripManagement.BusinessTripPurpose = BusinessTripPurpose;
            businessTripManagement.HotelBooking = HotelBooking;
            businessTripManagement.TripHighPriority = TripHighPriority;
            businessTripManagement.PaidBy = PaidBy;
            businessTripManagement.OtherService = OtherService;
            businessTripManagement.TransportationType = TransportationType;
            businessTripManagement.OtherTransportationDetail = OtherTransportationDetail;
            businessTripManagement.HasVisa = HasVisa;
            businessTripManagement.CashRequestDetail = CashRequestDetails;
            businessTripManagement.OtherRequestDetail = OtherRequestDetail;
            businessTripManagement.Driver = new LookupItem() { LookupId = (Driver != null ? Driver.LookupId : 0), LookupValue = (Driver != null ? Driver.LookupValue : string.Empty) };
            businessTripManagement.Cashier = new LookupItem() { LookupId = (Cashier != null ? Cashier.LookupId : 0), LookupValue = (Cashier != null ? Cashier.LookupValue : string.Empty) };
            businessTripManagement.Comment = Comment;
            businessTripManagement.ApprovalStatus = ApprovalStatus;
            if (DH != null)
            {
                businessTripManagement.DH = new User { FirstName = DH.FirstName, FullName = DH.FullName, ID = DH.ID, IsGroup = DH.IsGroup, LastName = DH.LastName, UserName = DH.UserName };
            }
            if (DirectBOD != null)
            {
                businessTripManagement.DirectBOD = new User { FirstName = DirectBOD.FirstName, FullName = DirectBOD.FullName, ID = DirectBOD.ID, IsGroup = DirectBOD.IsGroup, LastName = DirectBOD.LastName, UserName = DirectBOD.UserName };
            }
            if (BOD != null)
            {
                businessTripManagement.BOD = new User { FirstName = BOD.FirstName, FullName = BOD.FullName, ID = BOD.ID, IsGroup = BOD.IsGroup, LastName = BOD.LastName, UserName = BOD.UserName };
            }
            if (AdminDept != null)
            {
                businessTripManagement.AdminDept = new User { FirstName = AdminDept.FirstName, FullName = AdminDept.FullName, ID = AdminDept.ID, IsGroup = AdminDept.IsGroup, LastName = AdminDept.LastName, UserName = AdminDept.UserName };
            }

            return businessTripManagement;
        }
    }
}
