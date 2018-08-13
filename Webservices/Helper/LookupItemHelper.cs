using RBVH.Stada.Intranet.Biz.Models;
using RBVH.Stada.Intranet.Webservices.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RBVH.Stada.Intranet.Webservices.Helper
{
    public class LookupItemHelper
    {
        public static LookupItem ConvertToEntity(LookupItemModel model)
        {
            if (model != null)
                return new LookupItem { LookupId = model.LookupId, LookupValue = model.LookupValue };

            return new LookupItem();
        }

        public static LookupItemModel ConvertToModel(LookupItem entity)
        {
            if (entity != null)
                return new LookupItemModel { LookupId = entity.LookupId, LookupValue = entity.LookupValue };

            return new LookupItemModel();
        }
    }
}
