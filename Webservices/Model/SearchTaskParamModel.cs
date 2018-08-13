using RBVH.Stada.Intranet.Biz.Models;
using System;
using System.Collections.Generic;
using System.Globalization;

namespace RBVH.Stada.Intranet.Webservices.Model
{
   public class SearchTaskParamModel
    {
        public List<string> ModuleIds { get; set; }
        public string DepartmentId { get; set; }
        public string HasDeleteOldData { get; set; }
        public string HasOverrideOldData { get; set; }
        public string HasIncludeDelegation { get; set; }
    }
}
