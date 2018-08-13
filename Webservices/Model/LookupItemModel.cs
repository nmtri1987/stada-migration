using RBVH.Stada.Intranet.Biz.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RBVH.Stada.Intranet.Webservices.Model
{
    public class LookupItemModel
    {
        public int LookupId { get; set; }
        public string LookupValue { get; set; }

        public LookupItemModel()
        {
            LookupId = 0;
            LookupValue = string.Empty;
        }

        /// <summary>
        /// ToString
        /// </summary>
        /// <returns></returns>
        public override string ToString()
        {
            return string.Format("{0};#{1}", LookupId, LookupValue);
        }

        public static LookupItemModel ConvertFromEntity(LookupItem item)
        {
            if (item != null)
                return new LookupItemModel
                {
                    LookupId = item.LookupId,
                    LookupValue = item.LookupValue
                };

            return new LookupItemModel
            {
                LookupId = 0,
                LookupValue = string.Empty
            };
        }
    }
}
