// JavaScript source code
var UnitTesting = function () {
    var self = this;
    self.Settings = { Top: 20000 }
    self.Condition =
    {
        WaitingApproval: "WaitingApproval",
        WaitingApprovalToday: "WaitingApprovalToday",
        InProcess: "InProcess",
        ApprovedToday: "ApprovedToday",
    };
    self.Result = {
        TotalWaitingApproval: 0,
        TotalWaitingApprovalToday: 0,
        TotalInProcess: 0,
        TotalApprovedToday: 0
    }
    self.GetPendingOverview = function (userId) {
        var selectCols = '$select=ID,ListItemID,ListItemDueDate,ModuleNameENId,ApprovalStatusEN/NameEN&$expand=ApprovalStatusEN/NameEN';
        var filterBy = "&$filter=AssignedTo eq " + userId;
        var url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Task List ToDo')/items?" + "$top=" + self.Settings.Top + "&" + selectCols + filterBy;
        return $.ajax({
            method: "GET",
            url: url,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    };
    self.GetDoneOverview = function (userId) {
        var that = this;
        var selectCols = '$select=ID,ListItemID,ListItemApprovalUrl,ListItemDescription,ListItemCreatedDate,ListItemDueDate,ListURL,RequesterId,DepartmentENId,ModuleNameENId,ApprovalStatusENId,Requester/EmployeeDisplayName&$expand=Requester/EmployeeDisplayName';
        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        var filterBy = "&$filter=(AssignedTo eq " + userId + ")";
        filterBy += " and (Created gt datetime'" + currentDate.toISOString() + "')";
        var url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Task List Done')/items?" + "$top=" + self.Settings.Top + "&" + selectCols + filterBy;
        return $.ajax({
            method: "GET",
            url: url,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    };
    self.ClassifyTaskCategory = function (moduleList, taskObj, currentDate) {
        var that = this;
        var moduleObj = moduleList.filter(function (element) {
            if (element.Id == taskObj.ModuleNameENId) {
                return element;
            }
            else { return null; }
        });

        if (moduleObj && moduleObj.length > 0) {
            if (moduleObj[0].ListURL.toLowerCase() == "/lists/shiftmanagement") {
                return self.Condition.WaitingApprovalToday;
            }
            else if (moduleObj[0].ListURL.toLowerCase() == "/lists/changeshiftmanagement") {
                if (taskObj.ListItemDueDate && taskObj.ListItemDueDate.length > 0) {
                    var requestDueDate = (new Date(taskObj.ListItemDueDate)).setHours(0, 0, 0, 0);
                    var tomorrow = new Date(currentDate);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    if (requestDueDate && ((requestDueDate.valueOf() == currentDate.valueOf()) || (requestDueDate.valueOf() == tomorrow.valueOf()))) {
                        return self.Condition.WaitingApprovalToday;
                    }
                    else if (requestDueDate && (requestDueDate.valueOf() > tomorrow.valueOf())) {
                        return self.Condition.WaitingApproval;
                    }
                }
            }
            else if (moduleObj[0].ListURL.toLowerCase() == "/lists/overtimemanagement") {
                if (taskObj.ListItemDueDate && taskObj.ListItemDueDate.length > 0) {
                    var requestDueDate = (new Date(taskObj.ListItemDueDate)).setHours(0, 0, 0, 0);
                    if (requestDueDate && requestDueDate.valueOf() >= currentDate.valueOf()) {
                        return self.Condition.WaitingApprovalToday;
                    }
                }
            }
            else if (moduleObj[0].ListURL.toLowerCase() == "/lists/notovertimemanagement") {
                if (taskObj.ListItemDueDate && taskObj.ListItemDueDate.length > 0) {
                    var requestDueDate = (new Date(taskObj.ListItemDueDate)).setHours(0, 0, 0, 0);
                    var tomorrow = new Date(currentDate);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    if (requestDueDate && ((requestDueDate.valueOf() == currentDate.valueOf()) || (requestDueDate.valueOf() == tomorrow.valueOf()))) {
                        return self.Condition.WaitingApprovalToday;
                    }
                    else if (requestDueDate && requestDueDate.valueOf() > tomorrow.valueOf()) {
                        return self.Condition.WaitingApproval;
                    }
                }
            }
            else if (moduleObj[0].ListURL.toLowerCase() == "/lists/leavemanagement") {
                if (taskObj.ListItemDueDate && taskObj.ListItemDueDate.length > 0) {
                    var requestDueDate = (new Date(taskObj.ListItemDueDate)).setHours(0, 0, 0, 0);
                    var tomorrow = new Date(currentDate);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    if (requestDueDate && ((requestDueDate.valueOf() == currentDate.valueOf()) || (requestDueDate.valueOf() == tomorrow.valueOf()))) {
                        return self.Condition.WaitingApprovalToday;
                    }
                    else if (requestDueDate && requestDueDate.valueOf() > tomorrow.valueOf()) {
                        return self.Condition.WaitingApproval;
                    }
                }
            }
            else if (moduleObj[0].ListURL.toLowerCase() == "/lists/vehiclemanagement") {
                if (taskObj.ListItemDueDate && taskObj.ListItemDueDate.length > 0) {
                    var requestDueDate = (new Date(taskObj.ListItemDueDate)).setHours(0, 0, 0, 0);
                    var tomorrow = new Date(currentDate);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    if (requestDueDate && ((requestDueDate.valueOf() == currentDate.valueOf()) || (requestDueDate.valueOf() == tomorrow.valueOf()))) {
                        return self.Condition.WaitingApprovalToday;
                    }
                    else if (requestDueDate && requestDueDate.valueOf() > tomorrow.valueOf()) {
                        return self.Condition.WaitingApproval;
                    }
                }
            }
            else if (moduleObj[0].ListURL.toLowerCase() == "/lists/freightmanagement") {
                if (taskObj.ListItemDueDate && taskObj.ListItemDueDate.length > 0) {
                    var requestDueDate = (new Date(taskObj.ListItemDueDate)).setHours(0, 0, 0, 0);
                    if (requestDueDate && (requestDueDate.valueOf() >= currentDate.valueOf())) {
                        return self.Condition.WaitingApprovalToday;
                    }
                }
            }
            else if (moduleObj[0].ListURL.toLowerCase() == "/lists/businesstripmanagement") {
                if (taskObj.ListItemDueDate && taskObj.ListItemDueDate.length > 0) {
                    var requestDueDate = (new Date(taskObj.ListItemDueDate)).setHours(0, 0, 0, 0);
                    var tomorrow = new Date(currentDate);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    if (requestDueDate && ((requestDueDate.valueOf() == currentDate.valueOf()) || (requestDueDate.valueOf() == tomorrow.valueOf()))) {
                        return self.Condition.WaitingApprovalToday;
                    }
                    else if (requestDueDate && requestDueDate.valueOf() > tomorrow.valueOf()) {
                        return self.Condition.WaitingApproval;
                    }
                }
            }
            else if (moduleObj[0].ListURL.toLowerCase() == "/lists/requests") {
                if (taskObj.ApprovalStatusEN && taskObj.ApprovalStatusEN.NameEN && taskObj.ApprovalStatusEN.NameEN.toLowerCase() == "in-process") {
                    return that.Settings.Condition.InProcess;
                }
                else {
                    if (taskObj.ListItemDueDate && taskObj.ListItemDueDate.length > 0) {
                        var requestDueDate = (new Date(taskObj.ListItemDueDate)).setHours(0, 0, 0, 0);
                        var tomorrow = new Date(currentDate);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        if (requestDueDate && ((requestDueDate.valueOf() == currentDate.valueOf()) || (requestDueDate.valueOf() == tomorrow.valueOf()))) {
                            return self.Condition.WaitingApprovalToday;
                        }
                        else if (requestDueDate && requestDueDate.valueOf() > tomorrow.valueOf()) {
                            return self.Condition.WaitingApproval;
                        }
                    }
                    else {
                        return self.Condition.WaitingApproval;
                    }
                }
            }
            else if (moduleObj[0].ListURL.toLowerCase() == "/lists/employeerequirementsheets") {
                if (taskObj.ListItemDueDate && taskObj.ListItemDueDate.length > 0) {
                    var requestDueDate = (new Date(taskObj.ListItemDueDate)).setHours(0, 0, 0, 0);
                    var maxDueDate = new Date(currentDate);
                    maxDueDate.setDate(maxDueDate.getDate() + 15 + 1);
                    if (requestDueDate && (requestDueDate.valueOf() > maxDueDate.valueOf())) {
                        return self.Condition.WaitingApproval;
                    }
                    else if (requestDueDate && (requestDueDate.valueOf() > currentDate.valueOf()) && (requestDueDate.valueOf() <= maxDueDate.valueOf())) {
                        return self.Condition.WaitingApprovalToday;
                    }
                }
            }
            else if (moduleObj[0].ListURL.toLowerCase() == "/lists/requestfordiplomasupplies") {
                return self.Condition.WaitingApproval;
            }
        }
        return "";
    }
    self.DoUnitTest = function (userId, moduleList) {
        var deferred = $.Deferred();
        $.when(self.GetPendingOverview(userId), self.GetDoneOverview(userId)).done(function (pendingTaskList, doneTaskList) {
            if (pendingTaskList[0].d.results) {
                var currentDate = (new Date()).setHours(0, 0, 0, 0);
                $.each(pendingTaskList[0].d.results, function (idx, taskObj) {
                    var taskCategory = self.ClassifyTaskCategory(moduleList, taskObj, currentDate);
                    if (taskCategory) {
                        switch (taskCategory) {
                            case self.Condition.WaitingApproval:
                                self.Result.TotalWaitingApproval += 1;
                                break;
                            case self.Condition.WaitingApprovalToday:
                                self.Result.TotalWaitingApprovalToday += 1;
                                break;
                            case self.Condition.InProcess:
                                self.Result.TotalInProcess += 1;
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
            if (doneTaskList && doneTaskList.length > 0 && doneTaskList[0].d && doneTaskList[0].d.results) {
                self.Result.TotalApprovedToday = doneTaskList[0].d.results.length;
            }
            deferred.resolve(self.Result);
        });
        return deferred.promise();
    }
}





// Module pattern
var TaskMigrationModule = (function () {
    'use strict';
    var that = {};

    that.Settings = {
        Services:
        {
            TASK_LIST_URL: window.location.protocol + '//' + location.host + '/_vti_bin/Services/Common/CommonService.svc/GetAllTasks',
            DO_MIGRATION_URL: window.location.protocol + '//' + location.host + '/_vti_bin/Services/Common/CommonService.svc/DoMigration',
            DO_DELETE_URL: window.location.protocol + '//' + location.host + '/_vti_bin/Services/Common/CommonService.svc/DoDelete',
            TASK_OVERVIEW_OLD_URL: window.location.protocol + '//' + location.host + '/_vti_bin/Services/Common/CommonService.svc/GetTaskOverview/{0}/{1}/{2}',
        },
        Lists:
        {
            TO_DO_LIST_NAME: 'Task List ToDo',
            APPROVED_LIST_NAME: 'Task List Done',
        },

        Data:
        {
            Modules: [],
            Departments: [],
            Employees: [],
            GridDataSource: [],
            GridUnitTestDataSource: [],
            ApprovalStatus: [
            { Name: "", Id: 0 },
            { Name: "In-Progress", Id: 1 },
            { Name: "Rejected", Id: 2 },
            { Name: "Approved", Id: 3 },
            { Name: "In-Process", Id: 4 },
            { Name: "Completed", Id: 5 },
            ],
            LocationId: 2,
            BODId: 1,
            BODDepartmentId: 999,
        }
    };

    /**
     * Initialize data 
     */
    var _init = function () {
        _registerEvents();

        _populateGridFilter();
    }

    var _registerEvents = function () {
        $(that.Settings.Controls.ModuleSelector).select2({
            placeholder: "Select module(s)",
            width: "100%"
        });

        //$('input:checkbox[id*=' + that.Settings.Controls.DataIdContainerSelector + ']').on('click', function () {
        //    $(this).closest(that.Settings.Controls.DataContainerSelector).find('input:checkbox[id!=' + $(this).attr('id') + ']').prop('checked', false);
        //});

        $(that.Settings.Controls.DoMigrationButtonSelector).on('click', function () {
            $(that.Settings.Controls.GridResultSelector).empty();

            var modules = $(that.Settings.Controls.ModuleSelector).val();
            var department = $(that.Settings.Controls.DepartmentSelector).val();

            if (modules == null) {
                $(that.Settings.Controls.ModuleSelector).parent().find('.select2-selection').css('border-color', 'red');
            }
            else {
                if (department == '0') {
                    $(that.Settings.Controls.DepartmentSelector).css('border-color', 'red !important');
                }
                else {
                    that.Settings.Data.GridDataSource = [];
                    $(that.Settings.Controls.GridResultSelector).jsGrid("option", "data", []);

                    $(".se-pre-con").fadeIn(0);
                    _doMigration();
                }
            }
        });
        $(that.Settings.Controls.DoDeleteButtonSelector).on('click', function () {
            $('.select2-selection').css('border-color', 'inherit');
            that.Settings.Data.GridDataSource = [];
            $(that.Settings.Controls.GridResultSelector).jsGrid("option", "data", []);
            $(that.Settings.Controls.GridResultSelector).empty();


            $("#dialog").dialog({
                width: "400px",
                buttons: {
                    "Delete All": function () {
                        $(".se-pre-con").fadeIn(0);
                        _doDelete(true);

                        $(this).dialog('close');
                    },
                    "By department and module": function () {
                        $(".se-pre-con").fadeIn(0);
                        _doDelete();

                        $(this).dialog('close');
                    }
                }
            });
        });
        $(that.Settings.Controls.DoSearchButtonSelector).on('click', function () {
            $(".se-pre-con").fadeIn(0);
            $('.select2-selection').css('border-color', 'inherit');
            that.Settings.Data.GridDataSource = [];
            $(that.Settings.Controls.GridResultSelector).jsGrid("option", "data", []);

            _populateGrid();
        });

        $(that.Settings.Controls.DoUnitTestButtonSelector).on('click', function () {
            _doUnitTest();
        });

        $(that.Settings.Controls.ModuleSelector).on('change', function () {
            $('.select2-selection').css('border-color', 'inherit');
        });

        $(that.Settings.Controls.DepartmentSelector).on('change', function () {
            _populateEmployees($(this).val());
        });

        //$(that.Settings.Controls.UnitTestSelector).on('change', function () {
        //    if (this.checked) {
        //        //$(that.Settings.Controls.EmployeeContainerSelector).show();
        //        $(that.Settings.Controls.DoUnitTestButtonSelector).show();
        //        _populateUsers($(that.Settings.Controls.DepartmentSelector).val());
        //    }
        //    else
        //        $(that.Settings.Controls.EmployeeContainerSelector).hide();
        //});
    }

    /**
     * Migrate data 
     * @deleteOnly: Delete wrong data
     */
    var _doMigration = function (action) {
        var obj = {};

        var modules = $(that.Settings.Controls.ModuleSelector).val();
        var department = $(that.Settings.Controls.DepartmentSelector).val();

        obj.ModuleIds = modules;
        obj.DepartmentId = department;

        obj.HasOverwriteOldData = $(that.Settings.Controls.OverwriteOldDataSelector).prop('checked') ? '1' : '0';
        obj.HasIncludeDelegation = $(that.Settings.Controls.IncludeDelegationSelector).prop('checked') ? '1' : '0';
        $.ajax({
            type: "POST",
            url: that.Settings.Services.DO_MIGRATION_URL,
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (result) {
                ///////
                $(".se-pre-con").fadeOut(0);
                alert('Migration done. Click Search button to see the result');
            }
        });
    }

    var _doDelete = function (deleteAll) {
        var obj = {};

        var modules = $(that.Settings.Controls.ModuleSelector).val();
        var department = $(that.Settings.Controls.DepartmentSelector).val();

        obj.HasOverwriteOldData = '0';
        obj.HasIncludeDelegation = '0';
        obj.DepartmentId = department;
        obj.ModuleIds = deleteAll ? [] : modules;

        $.ajax({
            type: "POST",
            url: that.Settings.Services.DO_DELETE_URL,
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            cache: false,
            success: function (result) {
                console.log('Migration \'s Result: ' + result);
                ///////
                $(".se-pre-con").fadeOut(0);
            }
        });
    };

    var _executeQuery = function (promise1, promise2) {
        var deferred = $.Deferred()
        $.when(promise1, promise2).done(function (result1, result2) {
            var obj = {};
            obj.CurrentUserADId = result1[0].CurrentUserADId;
            obj.CurrentUserId = result1[0].CurrentUserId;
            obj.DisplayName = _getDisplayNameById(obj.CurrentUserId);
            obj.FullName = result1[0].FullName;
            obj.TotalWaitingApproval1 = result1[0].TotalWaitingApproval;
            obj.TotalWaitingApprovalToday1 = result1[0].TotalWaitingApprovalToday;
            obj.TotalInProcess1 = result1[0].TotalInProcess;
            obj.TotalApprovedToday1 = result1[0].TotalApprovedToday;

            obj.TotalWaitingApproval2 = result2.TotalWaitingApproval;
            obj.TotalWaitingApprovalToday2 = result2.TotalWaitingApprovalToday;
            obj.TotalInProcess2 = result2.TotalInProcess;
            obj.TotalApprovedToday2 = result2.TotalApprovedToday;


            that.Settings.Data.GridUnitTestDataSource.push(obj);
            deferred.resolve();
        });
        return deferred.promise()
    }

    var _doUnitTest = function () {
        $(".se-pre-con").fadeIn(0);
        var promiseArray = [];
        that.Settings.Data.GridUnitTestDataSource = [];
        $.each(that.Settings.Data.Employees, function (i, employee) {
            var url = RBVH.Stada.WebPages.Utilities.String.format(that.Settings.Services.TASK_OVERVIEW_OLD_URL, employee.UserADId, employee.ID, employee.DisplayName);

            var promise1 = $.ajax({
                type: "GET",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: false,
                //success: function (result) {
                //}
            });

            var unitTest = new UnitTesting();
            var promise2 = unitTest.DoUnitTest(employee.ID, that.Settings.Data.Modules);

            promiseArray.push(_executeQuery(promise1, promise2));
        });

        $.when.apply($, promiseArray).done(function (result) {
            _populateUnitTestGrid();
            $(".se-pre-con").fadeOut(0);
        });


    }

    var _populateGridFilter = function () {
        $(".se-pre-con").fadeIn(0);
        $.when(_populateDepartments(), _populateModules()).done(function (departmentList, moduleList) {
            $(".se-pre-con").fadeOut(0);

            if (departmentList && departmentList.length > 0 && departmentList[0].d && departmentList[0].d.results) {
                $(that.Settings.Controls.DepartmentSelector).empty();

                $.each(departmentList[0].d.results, function (idx, value) {
                    if (that.Settings.Data.LCID == 1066) {
                        that.Settings.Data.Departments.push({ "DepartmentName": value.CommonName1066, Id: value.ID });
                    }
                    else {
                        that.Settings.Data.Departments.push({ "DepartmentName": value.CommonName, Id: value.ID });

                        $(that.Settings.Controls.DepartmentSelector).append($("<option>").attr('value', value.ID).text(value.CommonName));
                    }
                });
            }
            that.Settings.Data.Departments.unshift({ "DepartmentName": "", Id: 0 });

            // BOD
            $(that.Settings.Controls.DepartmentSelector).append($("<option>").attr('value', that.Settings.Data.BODDepartmentId).text("BOD"));

            _populateEmployees($(that.Settings.Controls.DepartmentSelector).val());

            //that.Settings.Data.Modules = moduleList[0];
            if (moduleList && moduleList.length > 0 && moduleList[0].d && moduleList[0].d.results) {
                $(that.Settings.Controls.ModuleSelector).empty();
                $.each(moduleList[0].d.results, function (idx, value) {
                    if (that.Settings.Data.LCID == 1066) {
                        that.Settings.Data.Modules.push({ "Name": value.VietnameseModuleName, Id: value.ID, "ListURL": value.ListURL });
                    }
                    else {
                        that.Settings.Data.Modules.push({ "Name": value.ModuleName, Id: value.ID, "ListURL": value.ListURL });

                        $(that.Settings.Controls.ModuleSelector).append($("<option>").attr('value', value.ID).text(value.ModuleName));
                    }
                })
            }
            that.Settings.Data.Modules.unshift({ "Name": "", Id: 0 });
        });
    }

    var _populateGrid = function () {
        function applyFilter(data, filter) {
            return $.grep(data, function (client) {
                return (!filter.RequesterName || client.RequesterName.indexOf(filter.RequesterName) > -1)
                    && (!filter.DepartmentId || client.DepartmentId == filter.DepartmentId)
                    && (!filter.ModuleId || client.ModuleId == filter.ModuleId)
                    && (!filter.AssignedToName || client.AssignedToName.indexOf(filter.AssignedToName) > -1)
                    && (!filter.Description || client.Description.indexOf(filter.Description) > -1)
                    && (!filter.CreatedDate || client.CreatedDate.indexOf(filter.CreatedDate) > -1)
                    && (!filter.DueDate || client.DueDate.indexOf(filter.DueDate) > -1)
                    && (!filter.ApprovalStatusId || client.ApprovalStatusId == filter.ApprovalStatusId);
            });
        };
        $(that.Settings.Controls.GridResultSelector).jsGrid({
            height: "auto",
            width: "100%",

            filtering: true,
            sorting: true,
            paging: true,
            autoload: true,

            pageSize: 20,
            pageButtonCount: 5,
            pagePrevText: "<",
            pageNextText: ">",
            pageFirstText: "<<",
            pageLastText: ">>",

            controller: {
                loadData: function (filter) {
                    if (that.Settings.Data.GridDataSource.length > 0)
                        return applyFilter(that.Settings.Data.GridDataSource, filter);

                    var modules = $(that.Settings.Controls.ModuleSelector).val();
                    var department = $(that.Settings.Controls.DepartmentSelector).val();
                    var obj = {};
                    obj.ModuleIds = modules || [];
                    obj.DepartmentId = department;

                    obj.HasOverwriteOldData = '0';
                    obj.HasIncludeDelegation = '0';
                    var url = that.Settings.Services.TASK_LIST_URL;
                    return $.ajax({
                        type: "POST",
                        url: url,
                        data: JSON.stringify(obj),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        cache: false,
                        success: function (result) {
                            $(".se-pre-con").fadeOut(0);
                            // Bind Datasource
                            that.Settings.Data.GridDataSource = result;

                            // Trigger tab 1
                            $('[href="#tab1"]').trigger('click');

                            return that.Settings.Data.GridDataSource;
                        }
                    });
                },
            },

            fields: [
                { name: "ModuleId", type: "select", title: 'Module', width: "12%", items: that.Settings.Data.Modules, valueField: "Id", textField: "Name", align: "left" },
                { name: "RequesterName", type: "text", title: 'Requester', width: "12%", align: "left" },
                { name: "AssignedToName", type: "text", title: 'Assigned To', width: "12%", align: "left" },
                { name: "DepartmentId", type: "select", title: 'Department', width: "12%", items: that.Settings.Data.Departments, valueField: "Id", textField: "DepartmentName", align: "left" },
                { name: "Description", type: "text", title: 'Description', width: 'auto', align: "left" },
                { name: "ApprovalStatusId", type: "select", title: 'Approval Status', width: "12%", items: that.Settings.Data.ApprovalStatus, valueField: "Id", textField: "Name", align: "center" },
                { name: "CreatedDate", type: "text", title: 'Created Date', width: "12%", align: "center" },
                { name: "DueDate", type: "text", title: 'Due Date', width: "12%", align: "center" },
                { type: "control", modeSwitchButton: false, editButton: false, deleteButton: false }
            ],

            onDataLoaded: function () {
                $(that.Settings.Controls.GridResultSelector + ' tr.jsgrid-row > td:nth-child(6), ' + that.Settings.Controls.GridResultSelector + ' tr.jsgrid-alt-row > td:nth-child(6)').each(function () {
                    var $status = $(this);
                    var $span = RBVH.Stada.WebPages.Utilities.GUI.generateItemStatus($status.html());
                    $status.html($span);
                });
            }
        });
    }

    var _populateUnitTestGrid = function () {
        $(that.Settings.Controls.GridUnitTestResultSelector).jsGrid({
            height: "auto",
            width: "100%",
            filtering: false,
            sorting: true,
            paging: false,
            autoload: true,

            pageSize: 20,
            pageButtonCount: 5,
            pagePrevText: "<",
            pageNextText: ">",
            pageFirstText: "<<",
            pageLastText: ">>",

            controller: {
                loadData: function (filter) {
                    var dataSource = that.Settings.Data.GridUnitTestDataSource.sort(function (a, b) {
                        return a.DisplayName > b.DisplayName;
                    });

                    // Trigger tab 2
                    $('[href="#tab2"]').trigger('click');

                    return dataSource;
                },
            },

            fields: [
                { name: "DisplayName", type: "text", title: 'DisplayName', width: "auto", align: "left" },
                { name: "TotalWaitingApproval1", type: "text", title: 'Total Waiting Approval 1', width: "10%", align: "center" },
                { name: "TotalWaitingApproval2", type: "text", title: 'Total Waiting Approval 2', width: "10%", align: "center" },
                { name: "TotalWaitingApprovalToday1", type: "text", title: 'Total Waiting Approval Today 1', width: "12%", align: "center" },
                { name: "TotalWaitingApprovalToday2", type: "text", title: 'Total Waiting Approval Today 2', width: "12%", align: "center" },
                { name: "TotalInProcess1", type: "text", title: 'Total In Process 1', width: "8%", align: "center" },
                { name: "TotalInProcess2", type: "text", title: 'Total In Process 2', width: "8%", align: "center" },
                { name: "TotalApprovedToday1", type: "text", title: 'Total Approved Today 1', width: "10%", align: "center" },
                { name: "TotalApprovedToday2", type: "text", title: 'Total Approved Today 2', width: "10%", align: "center" },
            ],

            onDataLoaded: function () {
            },

            rowRenderer: function (item, index) {
                var classStr = "jsgrid-row";
                var styleStr, styleStr1, styleStr2, styleStr3, styleStr4;
                styleStr = styleStr1 = styleStr2 = styleStr3 = styleStr4 = "";

                if (index % 2 != 0) {
                    classStr = "jsgrid-alt-row";
                }

                var totalWaitingApproval1 = item["TotalWaitingApproval1"];
                var totalWaitingApproval2 = item["TotalWaitingApproval2"]
                var totalWaitingApprovalToday1 = item["TotalWaitingApprovalToday1"];
                var totalWaitingApprovalToday2 = item["TotalWaitingApprovalToday2"];
                var totalInProcess1 = item["TotalInProcess1"];
                var totalInProcess2 = item["TotalInProcess2"];
                var totalApprovedToday1 = item["TotalApprovedToday1"];
                var totalApprovedToday2 = item["TotalApprovedToday2"];
                if (totalWaitingApproval1 != totalWaitingApproval2 || totalWaitingApprovalToday1 != totalWaitingApprovalToday2
                    || totalInProcess1 != totalInProcess2 || totalApprovedToday1 != totalApprovedToday2)
                    styleStr = styleStr1 = styleStr2 = styleStr3 = styleStr4 = 'background-color: #f4e7d7 !important';

                if (totalWaitingApproval1 != totalWaitingApproval2)
                {
                    styleStr1 = 'background-color: #f4e7d7 !important; font-style: italic; color: white; text-decoration: underline;';
                }

                if (totalWaitingApprovalToday1 != totalWaitingApprovalToday2) {
                    styleStr2 = 'background-color: #f4e7d7 !important; font-style: italic; color: white; text-decoration: underline;';
                }

                if (totalInProcess1 != totalInProcess2) {
                    styleStr3 = 'background-color: #f4e7d7 !important; font-style: italic; color: white; text-decoration: underline;';
                }

                if (totalApprovedToday1 != totalApprovedToday2) {
                    styleStr4 = 'background-color: #f4e7d7 !important; font-style: italic; color: white; text-decoration: underline;';
                }

                var tdDisplayName = '<td class="jsgrid-cell jsgrid-align-left" style="width: auto;' + styleStr + '">' + item["DisplayName"] + '</td>';
                var tdTotalWaitingApproval1 = '<td class="jsgrid-cell jsgrid-align-center" style="width: 10%;' + styleStr1 + '"><span class="label" style="background-color: rgb(136, 141, 145);">' + item["TotalWaitingApproval1"] + '</span></td>';
                var tdTotalWaitingApproval2 = '<td class="jsgrid-cell jsgrid-align-center" style="width: 10%;' + styleStr1 + '"><span class="label" style="background-color: rgb(136, 141, 145);">' + item["TotalWaitingApproval2"] + '</span></td>';

                var tdTotalWaitingApprovalToday1 = '<td class="jsgrid-cell jsgrid-align-center" style="width: 12%;' + styleStr2 + '"><span class="label" style="background-color: rgb(193, 20, 11);">' + item["TotalWaitingApprovalToday1"] + '</span></td>';
                var tdTotalWaitingApprovalToday2 = '<td class="jsgrid-cell jsgrid-align-center" style="width: 12%;' + styleStr2 + '"><span class="label" style="background-color: rgb(193, 20, 11);">' + item["TotalWaitingApprovalToday2"] + '</span></td>';

                var tdTotalInProcess1 = '<td class="jsgrid-cell jsgrid-align-center" style="width: 8%;' + styleStr3 + '"><span class="label" style="background-color: rgb(219, 30, 210);">' + item["TotalInProcess1"] + '</span></td>';
                var tdTotalInProcess2 = '<td class="jsgrid-cell jsgrid-align-center" style="width: 8%;' + styleStr3 + '"><span class="label" style="background-color: rgb(219, 30, 210);">' + item["TotalInProcess2"] + '</span></td>';

                var tdTotalApprovedToday1 = '<td class="jsgrid-cell jsgrid-align-center" style="width: 10%;' + styleStr4 + '"><span class="label" style="background-color: rgb(92, 184, 92);">' + item["TotalApprovedToday1"] + '</span></td>';
                var tdTotalApprovedToday2 = '<td class="jsgrid-cell jsgrid-align-center" style="width: 10%;' + styleStr4 + '"><span class="label" style="background-color: rgb(92, 184, 92);">' + item["TotalApprovedToday2"] + '</span></td>';

                return $('<tr class="' + classStr + '" >' +
                              tdDisplayName +
                              tdTotalWaitingApproval1 +
                              tdTotalWaitingApproval2 +
                              tdTotalWaitingApprovalToday1 +
                              tdTotalWaitingApprovalToday2 +
                              tdTotalInProcess1 +
                              tdTotalInProcess2 +
                              tdTotalApprovedToday1 +
                              tdTotalApprovedToday2 +
                      '</tr>');
            },
        });
    }

    var _populateDepartments = function () {
        var lcid = _spPageContextInfo.currentLanguage;
        var orderby = "&$orderby=CommonName";

        var url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Departments')/items?$select=ID,CommonName,CommonName1066&$filter=CommonMultiLocations eq " + that.Settings.Data.LocationId + orderby;
        return $.ajax({
            method: "GET",
            url: url,
            headers: { "Accept": "application/json; odata=verbose" },
        });
    }

    var _populateModules = function () {
        var lcid = _spPageContextInfo.currentLanguage;
        var orderby = "&$orderby=ModuleName";

        var url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Delegations Module')/items?$select=ID,ListURL,ModuleName,VietnameseModuleName&" + orderby;

        return $.ajax({
            method: "GET",
            url: url,
            headers: { "Accept": "application/json; odata=verbose" },
        });
    }

    var _populateEmployees = function (departmentId) {
        $(".se-pre-con").fadeIn(0);

        var lcid = _spPageContextInfo.currentLanguage;
        var orderby = "&$orderby=EmployeeDisplayName";

        var url = '';
        if (departmentId == that.Settings.Data.BODDepartmentId)
            url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Employees')/items?$select=ID,EmployeeInfoFullName, EmployeeDisplayName,ADAccount/Id&$filter=Position eq " + that.Settings.Data.BODId + " and EmployeeType eq '" + "AD User' and IsActive eq 1" + orderby + "&$expand=ADAccount";
        else
            url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Employees')/items?$select=ID,EmployeeInfoFullName, EmployeeDisplayName,ADAccount/Id&$filter=EmployeeInfoDepartment eq " + departmentId + " and EmployeeType eq '" + "AD User' and IsActive eq 1" + orderby + "&$expand=ADAccount";

        $.ajax({
            type: "GET",
            url: url,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (result) {
                ///////
                $(".se-pre-con").fadeOut(0);
                if (result && result.d && result.d.results) {
                    $(that.Settings.Controls.EmployeeSelector).empty();
                    that.Settings.Data.Employees = [];
                    $.each(result.d.results, function (idx, value) {
                        that.Settings.Data.Employees.push({ ID: value.ID, FullName: value.EmployeeInfoFullName, DisplayName: value.EmployeeDisplayName, UserADId: value.ADAccount.Id });
                        $(that.Settings.Controls.EmployeeSelector).append($("<option>").attr('value', value.ID).text(value.EmployeeInfoFullName));
                    });
                }
            }
        });
    }

    var _getDisplayNameById = function (id) {
        var displayName = '';
        $.each(that.Settings.Data.Employees, function (i, item) {
            if (item.ID == id) {
                displayName = item.DisplayName;

                return false;
            }
        });

        return displayName;
    }

    return {
        Initialize: function (settings) {
            $.extend(true, that.Settings, settings);
            _init();
        }
    };
})();

