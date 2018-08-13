using RBVH.Stada.Intranet.Biz.Models;
using RBVH.Stada.Intranet.Webservices.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Threading.Tasks;

namespace RBVH.Stada.Intranet.Webservices.ISAPI.Services.Common
{
    [ServiceContract]
    interface ICommonService
    {
        [OperationContract]
        [WebGet(UriTemplate = "GetModules/{lcid}", ResponseFormat = WebMessageFormat.Json)]
        IEnumerable<ModuleModel> GetModules(string lcid);

        [OperationContract]
        [WebGet(UriTemplate = "GetTaskByCondition/{condition}/{currentUserADId}/{currentUserInfoId}/{approverFullName}", ResponseFormat = WebMessageFormat.Json)]
        IEnumerable<FilterTaskModel> GetTaskByCondition(string condition, string currentUserADId, string currentUserInfoId, string approverFullName);

        [OperationContract]
        [WebGet(UriTemplate = "GetTaskOverview/{currentUserADId}/{currentUserInfoId}/{approverFullName}", ResponseFormat = WebMessageFormat.Json)]
        TaskOverviewModel GetTaskOverview(string currentUserADId, string currentUserInfoId, string approverFullName);

        [OperationContract]
        [WebGet(UriTemplate = "GetModifiedDate/{moduleId}/{itemId}", ResponseFormat = WebMessageFormat.Json)]
        MessageResult GetModifiedDate(string moduleId, string itemId);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "GetAllTasks", ResponseFormat = WebMessageFormat.Json)]
        IEnumerable<FilterTaskModel> GetAllTasks(FilterTaskParamModel param);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DoMigration", ResponseFormat = WebMessageFormat.Json)]
        string DoMigration(FilterTaskParamModel param);

        [OperationContract]
        [WebInvoke(Method = "POST", UriTemplate = "DoDelete", ResponseFormat = WebMessageFormat.Json)]
        string DoDelete(FilterTaskParamModel param);
    }
}
