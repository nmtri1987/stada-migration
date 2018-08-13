using Microsoft.SharePoint;
using RBVH.Stada.Intranet.Biz.Constants;
using RBVH.Stada.Intranet.Biz.DataAccessLayer;
using RBVH.Stada.Intranet.Biz.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RBVH.Stada.Intranet.Webservices.Model
{
    public class DelegationModel
    {
        public string ModuleName { get; set; }
        public string VietnameseModuleName { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public User FromEmployee { get; set; }
        public List<LookupItemModel> ToEmployee { get; set; }
        public LookupItemModel Requester { get; set; }
        public LookupItemModel Department { get; set; }

        public DelegationModel()
        {
            FromEmployee = new User();
            ToEmployee = new List<LookupItemModel>();
            Requester = new LookupItemModel();
            Department = new LookupItemModel();
        }

        public DelegationModel(Delegation delegation) : this()
        {
            if (delegation != null)
            {
                ModuleName = delegation.ModuleName;
                VietnameseModuleName = delegation.VietnameseModuleName;
                FromDate = delegation.FromDate.ToString(StringConstant.DateFormatddMMyyyyHHmm);
                ToDate = delegation.ToDate.ToString(StringConstant.DateFormatddMMyyyyHHmm);
                if (delegation.ToEmployee != null)
                    ToEmployee.AddRange(delegation.ToEmployee.Select(item => new LookupItemModel { LookupId = item.LookupId, LookupValue = item.LookupValue }));

                Requester = new LookupItemModel { LookupId = (delegation.Requester != null ? delegation.Requester.LookupId : 0), LookupValue = (delegation.Requester != null ? delegation.Requester.LookupValue : string.Empty) };
                Department = new LookupItemModel { LookupId = (delegation.Department != null ? delegation.Department.LookupId : 0), LookupValue = (delegation.Department != null ? delegation.Department.LookupValue : string.Empty) };

                EmployeeInfoDAL _employeeInfoDAL = new EmployeeInfoDAL(SPContext.Current.Site.Url);
                FromEmployee = _employeeInfoDAL.GetByID( delegation.FromEmployee.LookupId).ADAccount;
            }
        }
    }
}
