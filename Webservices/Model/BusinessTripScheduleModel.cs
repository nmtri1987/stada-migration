using RBVH.Stada.Intranet.Biz.Constants;
using RBVH.Stada.Intranet.Biz.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RBVH.Stada.Intranet.Webservices.Model
{
    public class BusinessTripScheduleModel
    {
        public int Id { get; set; }
        public string DepartDate { get; set; }
        public string DepartTime { get; set; }
        public int DepartHour { get; set; }
        public int DepartMinute { get; set; }
        public string FlightName { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string ContactCompany { get; set; }
        public string ContactPhone { get; set; }
        public string OtherSchedule { get; set; }
        public LookupItemModel BusinessTripManagementID { get; set; }

        public BusinessTripScheduleModel()
        {
            this.BusinessTripManagementID = new LookupItemModel();
        }

        public BusinessTripSchedule ToEntity()
        {
            BusinessTripSchedule businessTripSchedule = new BusinessTripSchedule();

            businessTripSchedule.ID = Id;

            //DateTime departDate;
            //DateTime.TryParseExact(DepartDate, StringConstant.DateFormatddMMyyyy2, CultureInfo.InvariantCulture, DateTimeStyles.None, out departDate);
            //departDate.AddHours(DepartHour);
            //departDate.AddMinutes(DepartMinute);
            businessTripSchedule.DepartDate = Convert.ToDateTime(DepartDate);

            businessTripSchedule.FlightName = FlightName;
            businessTripSchedule.City = City;
            businessTripSchedule.Country = Country;
            businessTripSchedule.ContactCompany = ContactCompany;
            businessTripSchedule.ContactPhone = ContactPhone;
            businessTripSchedule.OtherSchedule = OtherSchedule;
            businessTripSchedule.BusinessTripManagementID = new LookupItem() { LookupId = (BusinessTripManagementID != null ? BusinessTripManagementID.LookupId : 0), LookupValue = (BusinessTripManagementID != null ? BusinessTripManagementID.LookupValue : string.Empty) };

            return businessTripSchedule;
        }
    }
}
