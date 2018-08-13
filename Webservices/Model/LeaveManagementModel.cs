using RBVH.Stada.Intranet.Biz.Models;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace RBVH.Stada.Intranet.Webservices.Model
{
    public class LeaveManagementModel
    {
        public int Id { get; set; }
        public LookupItemModel Requester { get; set; }
        public LookupItemModel RequestFor { get; set; }
        public LookupItemModel Department { get; set; }
        public LookupItemModel Location { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        private double totalHourVal = 0;
        public double LeaveHours
        {
            get { return totalHourVal; }
            set
            {
                totalHourVal = value;
                TimeSpan interval = TimeSpan.FromHours(value);
                //TotalHoursDisp = string.Format("{0:00}:{1:00}", (int)interval.TotalHours, interval.Minutes);
                TotalHoursDisp = string.Format("{0:00}:{1:00}", (interval.Days * 24 + interval.Hours), interval.ToString("mm"));
            }
        }
        public string TotalHoursDisp
        {
            get; set;
        }
        public double TotalDays { get; set; }
        public string Reason { get; set; }
        public LookupItemModel TransferworkTo { get; set; }
        public DateTime? LeftAt { get; set; }
        public bool Left { get; set; }
        public bool UnexpectedLeave { get; set; }
        public UserModel TLE { get; set; }
        public UserModel DH { get; set; }
        public UserModel BOD { get; set; }
        public UserModel Approver { get; set; }
        public string Comment { get; set; }
        public string ApprovalStatus { get; set; }
        public bool IsValidRequest { get; set; }
        public LeaveManagementModel() { }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string LeftAtDate { get; set; }
        public bool RequestExpired { get; set; }
        public string RequestDueDate { get; set; }
        public UserModel CreatedBy { get; set; }
        public UserModel ModifiedBy { get; set; }
        public List<UserModel> AdditionalUser { get; set; }

        public LeaveManagement ToEntity()
        {
            var leaveManagement = new LeaveManagement();
            leaveManagement.ID = Id;
            leaveManagement.Requester.LookupId = Requester.LookupId;
            leaveManagement.RequestFor.LookupId = RequestFor.LookupId;
            leaveManagement.Department.LookupId = Department.LookupId;
            leaveManagement.Location.LookupId = Location.LookupId;
            leaveManagement.From = DateTime.Parse(FromDate);
            leaveManagement.To = DateTime.Parse(ToDate);
            leaveManagement.LeaveHours = LeaveHours;
            leaveManagement.Reason = Reason;
            leaveManagement.TransferworkTo.LookupId = TransferworkTo.LookupId;
            leaveManagement.LeftAt = LeftAtDate != null ? DateTime.Parse(LeftAtDate) : leaveManagement.From;
            leaveManagement.Left = Left;
            leaveManagement.UnexpectedLeave = UnexpectedLeave;

            if (TLE != null)
            {
                leaveManagement.TLE = new User { FirstName = TLE.FirstName, FullName = TLE.FullName, ID = TLE.ID, IsGroup = TLE.IsGroup, LastName = TLE.LastName, UserName = TLE.UserName };
            }

            if (DH != null)
            {
                leaveManagement.DH = new User { FirstName = DH.FirstName, FullName = DH.FullName, ID = DH.ID, IsGroup = DH.IsGroup, LastName = DH.LastName, UserName = DH.UserName };
            }

            if (BOD != null)
            {
                leaveManagement.BOD = new User { FirstName = BOD.FirstName, FullName = BOD.FullName, ID = BOD.ID, IsGroup = BOD.IsGroup, LastName = BOD.LastName, UserName = BOD.UserName };
            }

            if (Approver != null)
            {
                leaveManagement.Approver = new User { FirstName = Approver.FirstName, FullName = Approver.FullName, ID = Approver.ID, IsGroup = Approver.IsGroup, LastName = Approver.LastName, UserName = Approver.UserName };
            }

            if (AdditionalUser != null && AdditionalUser.Count > 0)
            {
                foreach (var addUser in AdditionalUser)
                {
                    leaveManagement.AdditionalUser.Add(new User { FirstName = addUser.FirstName, FullName = addUser.FullName, ID = addUser.ID, IsGroup = addUser.IsGroup, LastName = addUser.LastName, UserName = addUser.UserName });
                }
            }

            leaveManagement.Comment = Comment;
            leaveManagement.ApprovalStatus = ApprovalStatus;
            leaveManagement.IsValidRequest = IsValidRequest;

            leaveManagement.TotalDays = TotalDays;
            return leaveManagement;
        }
    }
}
