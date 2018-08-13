using RBVH.Stada.Intranet.Biz.DataAccessLayer;
using System.ServiceModel.Activation;
using RBVH.Stada.Intranet.Webservices.Model;
using Microsoft.SharePoint;
using RBVH.Stada.Intranet.Biz.Models;
using System.Collections.Generic;
using System.Linq;
using RBVH.Stada.Intranet.Biz.Constants;
using RBVH.Stada.Intranet.Biz.OverviewManagement;
using System.ServiceModel;
using RBVH.Stada.Intranet.Biz.Interfaces;
using System;
using RBVH.Stada.Intranet.Biz.Migration;
using RBVH.Stada.Intranet.Biz.Extension;
using System.Text;
using System.Globalization;

namespace RBVH.Stada.Intranet.Webservices.ISAPI.Services.Common
{
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single)]
    public class CommonService : ICommonService
    {
        private readonly DelegationModulesDAL _delegationModulesDAL;
        private readonly DelegationsDAL _delegationDAL;
        private readonly EmployeeInfoDAL _employeeInfoDAL;
        private List<IFilterTaskManager> _listDAL;
        private string _webUrl;

        private const string TO_DO_LIST_NAME = "TaskListToDo";
        private const string DONE_LIST_NAME = "TaskListDone";

        private Dictionary<int, string> EmployeeLookup;
        private Dictionary<string, string> Modules;

        public CommonService()
        {
            _webUrl = SPContext.Current.Web.Url;
            _delegationModulesDAL = new DelegationModulesDAL(_webUrl);
            _delegationDAL = new DelegationsDAL(_webUrl);
            _employeeInfoDAL = new EmployeeInfoDAL(_webUrl);
            _listDAL = new List<IFilterTaskManager>();
            // Init DAL for Visitor
            _listDAL.Add(new ShiftManagementDAL(_webUrl));
            _listDAL.Add(new ChangeShiftManagementDAL(_webUrl));
            _listDAL.Add(new OverTimeManagementDAL(_webUrl));
            _listDAL.Add(new NotOvertimeManagementDAL(_webUrl));
            _listDAL.Add(new LeaveManagementDAL(_webUrl));
            _listDAL.Add(new VehicleManagementDAL(_webUrl));
            _listDAL.Add(new FreightManagementDAL(_webUrl));
            _listDAL.Add(new BusinessTripManagementDAL(_webUrl));
            _listDAL.Add(new RequestsDAL(_webUrl));
            _listDAL.Add(new EmployeeRequirementSheetDAL(_webUrl));
            _listDAL.Add(new RequestForDiplomaSupplyDAL(_webUrl));
        }

        public IEnumerable<ModuleModel> GetModules(string lcid)
        {
            var modules = this._delegationModulesDAL.GetAll().OrderBy(x => x.ModuleName);
            if (lcid == "1066")
            {
                modules = modules.OrderBy(x => x.VietnameseModuleName);
                return modules.Select(e => new ModuleModel { ID = e.ID, Name = e.VietnameseModuleName });
            }
            else
            {
                modules = modules.OrderBy(x => x.ModuleName);
                return modules.Select(e => new ModuleModel { ID = e.ID, Name = e.ModuleName });
            }
        }

        public IEnumerable<FilterTaskModel> GetTaskByCondition(string condition, string currentUserADId, string currentUserInfoId, string approverFullName)
        {
            int userADId;
            bool currentUserADIdResult = Int32.TryParse(currentUserADId, out userADId);
            if (currentUserADIdResult)
            {
                // Get Delegation list:
                int userInfoId;
                bool currentUserInfoIdResult = Int32.TryParse(currentUserInfoId, out userInfoId);
                List<Delegation> delegationList = _delegationDAL.GetDelegationApprovalList(SPContext.Current.Web, userInfoId);
                switch (condition)
                {
                    case TaskCondition.WaitingApproval:
                        var waitingApprovalVisitor = new WaitingApprovalVisitor(userADId, userInfoId, _webUrl);
                        waitingApprovalVisitor.DelegationList = delegationList;
                        foreach (var dal in _listDAL)
                        {
                            dal.Accept(waitingApprovalVisitor);
                        }

                        return waitingApprovalVisitor.FilterTaskList.OrderBy(i => i.CreatedDate).Select(r => FilterTaskModel.FromDTO(r));

                    case TaskCondition.InProcess:
                        var inProcessVisitor = new InProcessVisitor(userADId, userInfoId, _webUrl);
                        inProcessVisitor.DelegationList = delegationList;
                        foreach (var dal in _listDAL)
                        {
                            dal.Accept(inProcessVisitor);
                        }

                        return inProcessVisitor.FilterTaskList.OrderBy(i => i.CreatedDate).Select(r => FilterTaskModel.FromDTO(r));

                    case TaskCondition.WaitingApprovalToday:
                        var waitingApprovalTodayVisitor = new WaitingApprovalTodayVisitor(userADId, userInfoId, this._webUrl);
                        waitingApprovalTodayVisitor.DelegationList = delegationList;
                        foreach (var dal in _listDAL)
                        {
                            dal.Accept(waitingApprovalTodayVisitor);
                        }

                        return waitingApprovalTodayVisitor.FilterTaskList.Select(r => FilterTaskModel.FromDTO(r));

                    case TaskCondition.ApprovedToday:
                        var approvedTodayVisitor = new ApprovedTodayVisitor(userADId, userInfoId, _webUrl);
                        approvedTodayVisitor.ApproverFullName = approverFullName;
                        // Approved: Dont need to load Delegation
                        foreach (var dal in _listDAL)
                        {
                            dal.Accept(approvedTodayVisitor);
                        }

                        return approvedTodayVisitor.FilterTaskList.OrderBy(i => i.CreatedDate).Select(r => FilterTaskModel.FromDTO(r));

                    default:
                        return Enumerable.Empty<FilterTaskModel>();
                }
            }

            return Enumerable.Empty<FilterTaskModel>();
        }

        public TaskOverviewModel GetTaskOverview(string currentUserADId, string currentUserInfoId, string approverFullName)
        {
            int userADId;
            bool currentUserIdResult = Int32.TryParse(currentUserADId, out userADId);
            int userInfoId;
            bool currentUserInfoIdResult = Int32.TryParse(currentUserInfoId, out userInfoId);
            var totalWaitingApproval = 0;
            var totalWaitingApprovalToday = 0;
            var totalInProcess = 0;
            var totalApprovedToday = 0;
            if (currentUserIdResult)
            {
                // Get Delegation list:

                List<Delegation> delegationList = _delegationDAL.GetDelegationApprovalList(SPContext.Current.Web, userInfoId);
                // Waiting Approval
                var waitingApprovalVisitor = new WaitingApprovalVisitor(userADId, userInfoId, _webUrl);
                waitingApprovalVisitor.CountOnly = true;
                waitingApprovalVisitor.DelegationList = delegationList;
                // Waiting Approval TODAY
                var waitingApprovalTodayVisitor = new WaitingApprovalTodayVisitor(userADId, userInfoId, this._webUrl);
                waitingApprovalTodayVisitor.CountOnly = true;
                waitingApprovalTodayVisitor.DelegationList = delegationList;
                // In-Process
                var inProcessVisitor = new InProcessVisitor(userADId, userInfoId, _webUrl);
                inProcessVisitor.CountOnly = true;
                inProcessVisitor.DelegationList = delegationList;
                // Approved TODAY -> Dont need to load Delegation
                var approvedTodayVisitor = new ApprovedTodayVisitor(userADId, userInfoId, _webUrl);
                approvedTodayVisitor.CountOnly = true;
                approvedTodayVisitor.ApproverFullName = approverFullName;

                foreach (var dal in _listDAL)
                {
                    dal.Accept(waitingApprovalVisitor);
                    dal.Accept(waitingApprovalTodayVisitor);
                    dal.Accept(inProcessVisitor);
                    dal.Accept(approvedTodayVisitor);
                }

                totalWaitingApproval = waitingApprovalVisitor.TotalCount;
                totalWaitingApprovalToday = waitingApprovalTodayVisitor.TotalCount;
                totalInProcess = inProcessVisitor.TotalCount;
                totalApprovedToday = approvedTodayVisitor.TotalCount;
            }

            return new TaskOverviewModel
            {
                CurrentUserADId = userADId,
                CurrentUserId = userInfoId,
                TotalWaitingApproval = totalWaitingApproval,
                TotalWaitingApprovalToday = totalWaitingApprovalToday,
                TotalInProcess = totalInProcess,
                TotalApprovedToday = totalApprovedToday
            };
        }

        public MessageResult GetModifiedDate(string moduleId, string itemId)
        {
            string ret = string.Empty;

            try
            {
                SPWeb currentWeb = SPContext.Current.Web;
                int moduleIdendify = 0;
                int itemIdentify = 0;
                if (int.TryParse(moduleId, out moduleIdendify) && int.TryParse(itemId, out itemIdentify))
                {
                    SPListItemCollection itemCollection = null;
                    SPQuery spQuery = new SPQuery()
                    {
                        Query = $"<Where><Eq><FieldRef Name='ID' /><Value Type='Counter'>{itemIdentify}</Value></Eq></Where>",
                        RowLimit = 1
                    };

                    switch (moduleIdendify)
                    {
                        case (int)StepModuleList.ShiftManagement:
                            ShiftManagementDAL _shiftManagementDAL = new ShiftManagementDAL(currentWeb.Url);
                            itemCollection = _shiftManagementDAL.GetByQueryToSPListItemCollection(currentWeb, spQuery, new string[] { StringConstant.DefaultSPListField.ModifiedField });
                            break;
                        case (int)StepModuleList.OvertimeManagement:
                            OverTimeManagementDAL _overTimeManagementDAL = new OverTimeManagementDAL(currentWeb.Url);
                            itemCollection = _overTimeManagementDAL.GetByQueryToSPListItemCollection(currentWeb, spQuery, new string[] { StringConstant.DefaultSPListField.ModifiedField });
                            break;
                        default:
                            break;
                    }

                    if (itemCollection != null && itemCollection.Count > 0)
                    {
                        DateTime modifiedField = (DateTime)itemCollection[0][StringConstant.DefaultSPListField.ModifiedField];
                        ret = modifiedField.ToString(StringConstant.DateFormatddMMyyyyHHmmss);
                    }
                }
            }
            catch (Exception ex)
            {
                return new MessageResult { Code = -1, Message = ex.Message };
            }

            return new MessageResult { Code = 0, Message = ret };
        }

        #region "Migration"

        public IEnumerable<FilterTaskModel> GetAllTasks(FilterTaskParamModel param)
        {
            List<FilterTaskModel> result = new List<FilterTaskModel>();

            using (SPSite site = new SPSite(_webUrl))
            {
                using (SPWeb web = site.OpenWeb())
                {
                    var query = $@"<Where>
                                        <And>
                                            <Eq>
                                                <FieldRef Name='DataSourceID' />
                                                <Value Type='Number'>{1}</Value>
                                            </Eq>
                                            <Eq>
                                                <FieldRef Name='DepartmentEN' LookupId='TRUE'/>
                                                <Value Type='Lookup'>{param.DepartmentId}</Value>
                                            </Eq>
                                        </And>
                                </Where>";

                    if (param.ModuleIds != null && param.ModuleIds.Any())
                    {
                        StringBuilder sbItem = new StringBuilder();
                        foreach (var moduleId in param.ModuleIds)
                        {
                            sbItem.Append($@"<Value Type='Number'>{moduleId}</Value>");
                        }

                        query = $@"<Where>
                                        <And>
                                            <And>
                                                <Eq>
                                                    <FieldRef Name='DataSourceID' />
                                                    <Value Type='Number'>{1}</Value>
                                                </Eq>
                                                <Eq>
                                                    <FieldRef Name='DepartmentEN' LookupId='TRUE'/>
                                                    <Value Type='Lookup'>{param.DepartmentId}</Value>
                                                </Eq>
                                            </And>
                                            <In>
                                                <FieldRef Name='ModuleNameEN' LookupId='TRUE'/>
                                                <Values>
                                                    {sbItem.ToString()}
                                                </Values>                        
                                            </In>
                                        </And>
                                    
                                </Where>";
                    }

                    var spQuery = new SPQuery
                    {
                        Query = query,
                        ViewAttributes = "Scope=\"RecursiveAll\""
                    };

                    // TODO list
                    SPList toDoList = web.GetList($"{web.Url}/Lists/{TO_DO_LIST_NAME}");
                    var toDoItemCollection = toDoList.GetItems(spQuery);
                    if (toDoItemCollection != null && toDoItemCollection.Count > 0)
                    {
                        var inProgressStatusId = 1; // In-Progress
                        result.AddRange(CreateFilterTaskModel(toDoItemCollection, inProgressStatusId));
                    }

                    // APPROVED list
                    SPList doneList = web.GetList($"{web.Url}/Lists/{DONE_LIST_NAME}");

                    var doneItemCollection = doneList.GetItems(spQuery);
                    if (doneItemCollection != null && doneItemCollection.Count > 0)
                    {
                        var approvedStatusId = 3; // Approved
                        result.AddRange(CreateFilterTaskModel(doneItemCollection, approvedStatusId));
                    }
                }
            }

            return result;
        }

        public string DoMigration(FilterTaskParamModel param)
        {
            if (param != null && param.ModuleIds != null && param.ModuleIds.Count > 0 && !string.IsNullOrEmpty(param.DepartmentId))
            {
                // Employee list + Modules
                BindGlobalData();

                var moduleNames = Modules.Where(m => param.ModuleIds.Contains(m.Key)).Select(m => m.Value).ToList();
                var departmentId = Convert.ToInt32(param.DepartmentId);

                var isOverrideData = param.HasOverwriteOldData == "1" ? true : false;
                var duplicatedEmployeeInfo = MigrateTask(isOverrideData, moduleNames, departmentId);
                if (!string.IsNullOrEmpty(duplicatedEmployeeInfo))
                    return duplicatedEmployeeInfo;

                if (param.HasIncludeDelegation == "1")
                    MigrateDelegation(isOverrideData, moduleNames, departmentId);
            }

            return string.Empty;
        }

        public string DoDelete(FilterTaskParamModel param)
        {
            if (param != null)
            {
                var departmentId = string.IsNullOrEmpty(param.DepartmentId) ? 0 : Convert.ToInt32(param.DepartmentId);
                var moduleIds = param.ModuleIds;
                DeleteOldData(TO_DO_LIST_NAME, moduleIds, departmentId);
                DeleteOldData(DONE_LIST_NAME, moduleIds, departmentId);
            }

            return string.Empty;
        }

        /// <summary>
        /// Migrate Task
        /// </summary>
        /// <param name="isOverride"></param>
        /// <param name="moduleNames"></param>
        /// <returns>String to describe the duplicated employee's fullname</returns>
        private string MigrateTask(bool isOverride, List<string> moduleNames, int departmentId)
        {
            var waitingApprovalMigrationVisitor = new WaitingApprovalMigrationVisitor(_webUrl, departmentId);
            var waitingApprovalTodayMigrationVisitor = new WaitingApprovalTodayMigrationVisitor(_webUrl, departmentId);
            var inProcessMigrationVisitor = new InProcessMigrationVisitor(_webUrl, departmentId);
            var approvedTodayMigrationVisitor = new ApprovedTodayMigrationVisitor(_webUrl, departmentId);

            _listDAL = new List<IFilterTaskManager>();
            foreach (var module in moduleNames)
            {
                switch (module)
                {
                    case "Shift Management": // 1
                        _listDAL.Add(new ShiftManagementDAL(_webUrl));
                        break;
                    case "Change Shift Management": // 2
                        _listDAL.Add(new ChangeShiftManagementDAL(_webUrl));
                        break;
                    case "Overtime Management": // 3
                        _listDAL.Add(new OverTimeManagementDAL(_webUrl));
                        break;
                    case "Leave Of Absence Management": // 4
                        _listDAL.Add(new NotOvertimeManagementDAL(_webUrl));
                        break;
                    case "Leave Management": // 5
                        _listDAL.Add(new LeaveManagementDAL(_webUrl));
                        break;
                    case "Vehicle Registration Management": // 6
                        _listDAL.Add(new VehicleManagementDAL(_webUrl));
                        break;
                    case "Requests Management": // 7
                        _listDAL.Add(new RequestsDAL(_webUrl));
                        break;
                    case "Freight Management": // 8
                        _listDAL.Add(new FreightManagementDAL(_webUrl));
                        break;
                    case "Recruitment Management": // 9
                        _listDAL.Add(new EmployeeRequirementSheetDAL(_webUrl));
                        break;
                    case "Request For Diploma Supply Management": // 10
                        _listDAL.Add(new RequestForDiplomaSupplyDAL(_webUrl));
                        break;
                    case "Business Trip Management": // 11
                        _listDAL.Add(new BusinessTripManagementDAL(_webUrl));
                        break;
                }
            }

            foreach (var dal in _listDAL)
            {
                dal.Accept(waitingApprovalMigrationVisitor);
                dal.Accept(waitingApprovalTodayMigrationVisitor);
                dal.Accept(inProcessMigrationVisitor);
                dal.Accept(approvedTodayMigrationVisitor);
            }

            // Check if exists duplicated employee's fullname -> return false -> manual update data
            if (approvedTodayMigrationVisitor.FilterTaskList != null && approvedTodayMigrationVisitor.FilterTaskList.Any())
            {
                var duplicatedFullNames = approvedTodayMigrationVisitor.FilterTaskList.Where(item => item.IsDuplicatedEmployeeFullName).Select(item => $"{item.Department.LookupValue}{item.AssignedTo.LookupValue}").ToList();
                if (duplicatedFullNames != null && duplicatedFullNames.Any())
                    return string.Join(";", duplicatedFullNames);
            }

            var waitingApprovalList = waitingApprovalMigrationVisitor.FilterTaskList.Select(r => FilterTaskModel.FromDTO(r));
            var waitingApprovalTodayList = waitingApprovalTodayMigrationVisitor.FilterTaskList.Select(r => FilterTaskModel.FromDTO(r));
            var inProcessList = inProcessMigrationVisitor.FilterTaskList.Select(r => FilterTaskModel.FromDTO(r));
            var approvedTodayList = approvedTodayMigrationVisitor.FilterTaskList.Select(r => FilterTaskModel.FromDTO(r));


            var todoList = waitingApprovalList.Union(waitingApprovalTodayList).Union(inProcessList);

            foreach (var model in todoList)
            {
                CreateListItem(model, TO_DO_LIST_NAME, isOverride);
            }

            foreach (var model in approvedTodayList)
            {
                CreateListItem(model, DONE_LIST_NAME, isOverride);
            }

            return string.Empty;
        }

        private void MigrateDelegation(bool isOverride, List<string> moduleNames, int departmentId)
        {
            DelegationModulesDAL delegationModulesDAL = new DelegationModulesDAL(SPContext.Current.Web.Url);

            var employeeDelegationList = new List<Delegation>();

            StringBuilder sbItem = new StringBuilder();
            foreach (var moduleName in moduleNames)
            {
                sbItem.Append($@"<Value Type='Text'>{moduleName}</Value>");
            }
            var delegationQuery = $@"
                                    <Where>
                                        <And>
                                            <Eq>
                                                <FieldRef Name='Department' LookupId='TRUE'/>
                                                <Value Type='Lookup'>{departmentId}</Value>
                                            </Eq>
                                            <In>
                                                <FieldRef Name='ModuleName' />
                                                <Values>
                                                    {sbItem.ToString()}
                                                </Values>                        
                                            </In>
                                        </And>
                                    </Where>";

            List<Delegation> delegationList = _delegationDAL.GetByQuery(delegationQuery);

            var toEmployeeList = delegationList.SelectMany(d => d.ToEmployee);
            var toEmployeeIds = toEmployeeList.Select(e => e.LookupId).Distinct().ToList();

            foreach (var employeeId in toEmployeeIds)
            {
                employeeDelegationList.AddRange(_delegationDAL.GetDelegationApprovalListByModule(SPContext.Current.Web, employeeId, sbItem.ToString()));
            }

            foreach (var delegation in employeeDelegationList)
            {
                foreach (var assignedTo in delegation.ToEmployee)
                {
                    var taskListModel = new FilterTaskModel();
                    taskListModel.ItemId = delegation.ListItemID;
                    taskListModel.ItemApprovalUrl = delegation.ListItemApprovalUrl;
                    taskListModel.Description = delegation.ListItemDescription;
                    taskListModel.CreatedDateTime = delegation.Created;
                    taskListModel.DueDateTime = RetrieveRequestDueDate(delegation.ListUrl, delegation.ListItemID); // Get DueDate
                    taskListModel.AssignedToId = assignedTo.LookupId;
                    taskListModel.RequesterId = delegation.Requester.LookupId;
                    taskListModel.DepartmentId = delegation.Department.LookupId;
                    var delegationModule = delegationModulesDAL.GetByListUrl(delegation.ListUrl);
                    if (delegationModule != null)
                    {
                        taskListModel.ModuleId = delegationModule.ID;
                    }
                    taskListModel.ApprovalStatusId = 1; // In - Progress

                    CreateListItem(taskListModel, TO_DO_LIST_NAME, isOverride);
                }
            }
        }

        private void CreateListItem(FilterTaskModel model, string listName, bool isOverride)
        {
            using (SPSite spSite = new SPSite(_webUrl))
            {
                using (SPWeb web = spSite.OpenWeb())
                {
                    try
                    {
                        web.AllowUnsafeUpdates = true;

                        SPList list = web.TryGetSPList($"{web.Url}/Lists/{listName}");

                        // Begin DELETE
                        if (isOverride)
                        {
                            var query = $@"<Where>
                                        <And>
                                            <And>
                                                <And>
                                                    <Eq>
                                                        <FieldRef Name='DataSourceID' />
                                                        <Value Type='Number'>{1}</Value>
                                                    </Eq>
                                                    <Eq>
                                                        <FieldRef Name='ListItemID' />
                                                        <Value Type='Number'>{model.ItemId}</Value>
                                                    </Eq>
                                                </And>
                                                <Eq>
                                                    <FieldRef Name='ModuleNameEN' LookupId='TRUE'/>
                                                    <Value Type='Lookup'>{model.ModuleId}</Value>
                                                </Eq>
                                            </And>
                                            <Eq>
                                                <FieldRef Name='AssignedTo' LookupId='TRUE'/>
                                                <Value Type='Lookup'>{model.AssignedToId}</Value>
                                            </Eq>
                                        </And>
                                    </Where>";
                            var spQuery = new SPQuery
                            {
                                ViewFields = "<FieldRef Name='ID'/>",
                                Query = query,
                                ViewAttributes = "Scope=\"RecursiveAll\"",
                                ViewFieldsOnly = true,
                            };


                            var itemCollection = list.GetItems(spQuery);
                            if (itemCollection != null && itemCollection.Count > 0)
                            {
                                // Delete
                                StringBuilder sbDelete = new StringBuilder();
                                sbDelete.Append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Batch>");
                                string stringcommand = "<Method><SetList Scope=\"Request\">" + list.ID + "</SetList><SetVar Name=\"ID\">{0}</SetVar><SetVar Name=\"Cmd\">Delete</SetVar></Method>";
                                foreach (SPListItem item in itemCollection)
                                {
                                    //result.Add(item.ID);
                                    sbDelete.Append(string.Format(stringcommand, item.ID));
                                }

                                sbDelete.Append("</Batch>");
                                web.ProcessBatchData(sbDelete.ToString());
                            }
                        }
                        // End DELETE

                        var folderName = EmployeeLookup[model.AssignedToId]; // model.AssignedToId.ToString();
                        var folderUrl = $"{web.Url}/Lists/{listName}/{folderName}";
                        SPFolder folder = web.GetFolder(folderUrl);
                        if (!folder.Exists)
                        {
                            // Create folder
                            SPListItem newFolder = list.Items.Add(list.RootFolder.ServerRelativeUrl, SPFileSystemObjectType.Folder);
                            if (newFolder != null)
                            {
                                newFolder["Title"] = folderName;
                                newFolder["Name"] = folderName;
                                newFolder.Update();
                            }
                        }

                        SPListItem newItem = list.Items.Add(folderUrl, SPFileSystemObjectType.Folder, null);

                        // Bind model -> item
                        newItem["ListItemID"] = model.ItemId;
                        newItem["ListItemApprovalUrl"] = model.ItemApprovalUrl;
                        newItem["ListItemDescription"] = model.Description;
                        newItem["ListItemCreatedDate"] = model.CreatedDateTime;
                        newItem["ListItemDueDate"] = model.DueDateTime;
                        // item["ListURL"] = model.;
                        newItem["AssignedTo"] = model.AssignedToId;
                        newItem["Requester"] = model.RequesterId;
                        newItem["DepartmentEN"] = model.DepartmentId;
                        newItem["LocationEN"] = 2; // NM2 - TODO
                        newItem["ModuleNameEN"] = model.ModuleId;
                        newItem["ApprovalStatusEN"] = model.ApprovalStatusId;
                        newItem["DataSourceID"] = 1; // Old Data
                                                     // item["CategoryEN"] = model.; // TODO

                        newItem.Update();

                    }
                    catch { }
                    finally
                    {
                        web.AllowUnsafeUpdates = false;
                    }
                }
            }
        }

        private void DeleteOldData(string listName, List<string> moduleIds, int departmentId)
        {
            SPSecurity.RunWithElevatedPrivileges(delegate ()
            {
                using (SPSite site = new SPSite(_webUrl))
                {
                    using (SPWeb web = site.OpenWeb())
                    {
                        try
                        {
                            web.AllowUnsafeUpdates = true;
                            var firstCondition = $@"<Eq>
                                                        <FieldRef Name='DataSourceID' />
                                                        <Value Type='Number'>{1}</Value>
                                                    </Eq>";

                            if (departmentId > 0)
                            {
                                firstCondition = $@"<And>
                                                        <Eq>
                                                            <FieldRef Name='DataSourceID' />
                                                            <Value Type='Number'>{1}</Value>
                                                        </Eq>
                                                        <Eq>
                                                            <FieldRef Name='DepartmentEN' LookupId='TRUE'/>
                                                            <Value Type='Lookup'>{departmentId}</Value>
                                                        </Eq>
                                                    </And>";
                                }

                            var query = $@" <Where>
                                                {firstCondition}
                                            </Where>";

                            if (moduleIds != null && moduleIds.Any()) // Delete by modules + department
                            {
                                StringBuilder sbItem = new StringBuilder();
                                foreach (var moduleId in moduleIds)
                                {
                                    sbItem.Append($@"<Value Type='Number'>{moduleId}</Value>");
                                }

                                query = $@"<Where>
                                                <And>
                                                    {firstCondition}
                                                    <In>
                                                        <FieldRef Name='ModuleNameEN' LookupId='TRUE'/>
                                                        <Values>
                                                            {sbItem.ToString()}
                                                        </Values>                        
                                                    </In>
                                                </And>
                                            </Where>";
                            }

                            var spQuery = new SPQuery
                            {
                                ViewFields = "<FieldRef Name='ID'/>",
                                Query = query,
                                ViewAttributes = "Scope=\"RecursiveAll\"",
                                ViewFieldsOnly = true,
                            };

                            SPList list = web.GetList($"{web.Url}/Lists/{listName}");
                            var itemCollection = list.GetItems(spQuery);

                            if (itemCollection != null && itemCollection.Count > 0)
                            {
                                // Delete
                                StringBuilder sbDelete = new StringBuilder();
                                sbDelete.Append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Batch>");
                                string stringcommand = "<Method><SetList Scope=\"Request\">" + list.ID + "</SetList><SetVar Name=\"ID\">{0}</SetVar><SetVar Name=\"Cmd\">Delete</SetVar></Method>";
                                foreach (SPListItem item in itemCollection)
                                {
                                    //result.Add(item.ID);
                                    sbDelete.Append(string.Format(stringcommand, item.ID));
                                }

                                sbDelete.Append("</Batch>");
                                web.ProcessBatchData(sbDelete.ToString());
                            }
                        }
                        catch
                        {
                        }
                        finally
                        {
                            web.AllowUnsafeUpdates = false;
                        }

                    }
                }
            });
        }

        private void BindGlobalData()
        {
            EmployeeLookup = new Dictionary<int, string>();
            Modules = new Dictionary<string, string>()
            {
                { "1", "Shift Management"},
                { "2", "Change Shift Management"},
                { "3", "Overtime Management"},
                { "4", "Leave Of Absence Management"},
                { "5", "Leave Management"},
                { "6", "Vehicle Registration Management"},
                { "7", "Requests Management"},
                { "8", "Freight Management"},
                { "9", "Recruitment Management"},
                { "10", "Request For Diploma Supply Management"},
                { "11", "Business Trip Management"}
            };

            using (SPSite site = new SPSite(_webUrl))
            {
                using (SPWeb web = site.OpenWeb())
                {
                    var spQuery = new SPQuery
                    {
                        ViewFields = "<FieldRef Name='ID'/><FieldRef Name='EmployeeID'/>",
                        ViewFieldsOnly = true
                    };

                    SPList list = web.GetList($"{web.Url}/Lists/EmployeeInfo");
                    var itemCollection = list.GetItems(spQuery);
                    if (itemCollection != null && itemCollection.Count > 0)
                    {
                        foreach (SPListItem item in itemCollection)
                        {
                            EmployeeLookup.Add((int)item["ID"], Convert.ToString(item["EmployeeID"]));
                        }
                    }
                }
            }
        }

        private List<FilterTaskModel> CreateFilterTaskModel(SPListItemCollection itemCollection, int approvalStatusId)
        {
            List<FilterTaskModel> result = new List<FilterTaskModel>();
            foreach (SPListItem item in itemCollection)
            {
                var taskListModel = new FilterTaskModel();
                taskListModel.ItemId = Convert.ToInt32(item["ListItemID"]);
                taskListModel.ItemApprovalUrl = Convert.ToString(item["ListItemApprovalUrl"]);
                taskListModel.Description = Convert.ToString(item["ListItemDescription"]);
                taskListModel.CreatedDateTime = (DateTime)item["ListItemCreatedDate"];
                taskListModel.CreatedDate = taskListModel.CreatedDateTime.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);

                DateTime dueDateTime;
                if (DateTime.TryParse(Convert.ToString(item["ListItemDueDate"]), out dueDateTime))
                {
                    taskListModel.DueDateTime = dueDateTime;
                    taskListModel.DueDate = taskListModel.DueDateTime.Value.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);
                }

                taskListModel.AssignedToName = new SPFieldLookupValue(item["AssignedTo"] as String).LookupValue;
                taskListModel.RequesterName = new SPFieldLookupValue(item["Requester"] as String).LookupValue;
                taskListModel.DepartmentId = new SPFieldLookupValue(item["DepartmentEN"] as String).LookupId;
                taskListModel.DepartmentName = new SPFieldLookupValue(item["DepartmentEN"] as String).LookupValue;
                taskListModel.ModuleId = new SPFieldLookupValue(item["ModuleNameEN"] as String).LookupId;
                taskListModel.ApprovalStatusId = approvalStatusId;

                result.Add(taskListModel);
            }

            return result;
        }

        private DateTime RetrieveRequestDueDate(string listUrl, int itemId)
        {
            using (SPSite spSite = new SPSite(_webUrl))
            {
                using (SPWeb web = spSite.OpenWeb())
                {
                    SPList list = web.GetList($"{web.Url}{listUrl}");
                    SPListItem item = list.GetItemById(itemId);
                    if (item != null)
                    {
                        DateTime dueDateTime;
                        if (DateTime.TryParse(Convert.ToString(item["CommonReqDueDate"]), out dueDateTime))
                        {
                            return dueDateTime;
                        }
                    }

                    return DateTime.Now;
                }
            }
        }

        #endregion
    }
}
