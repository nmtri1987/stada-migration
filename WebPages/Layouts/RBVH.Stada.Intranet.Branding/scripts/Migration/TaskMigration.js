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
            GridDataSource: [],
            ApprovalStatus: [
            { Name: "", Id: 0 },
            { Name: "In-Progress", Id: 1 },
            { Name: "Rejected", Id: 2 },
            { Name: "Approved", Id: 3 },
            { Name: "In-Process", Id: 4 },
            { Name: "Completed", Id: 5 },
            ],
            LocationId: 2
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
            else
            {
                if (!!department == false) {
                    $(that.Settings.Controls.DepartmentSelector).css('border-color', 'red !important');
                }
                else 
                {
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

        $(that.Settings.Controls.ModuleSelector).on('change', function () {
            $('.select2-selection').css('border-color', 'inherit');
        });
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

    var _populateGridFilter = function () {
        $(".se-pre-con").fadeIn(0);
        $.when(_populateDepartments(), _populateModules()).done(function (departmentList, moduleList) {
            $(".se-pre-con").fadeOut(0);

            if (departmentList && departmentList.length > 0 && departmentList[0].d && departmentList[0].d.results) {
                $(that.Settings.Controls.DepartmentSelector).empty();
                $.each(departmentList[0].d.results, function (idx, value) {
                    if (that.Settings.Data.LCID == 1066) {
                        that.Settings.Data.Departments.push({ "DepartmentName": value.CommonName1066, Id: value.ID })
                    }
                    else {
                        that.Settings.Data.Departments.push({ "DepartmentName": value.CommonName, Id: value.ID });

                        $(that.Settings.Controls.DepartmentSelector).append($("<option>").attr('value', value.ID).text(value.CommonName));
                    }
                });
            }
            that.Settings.Data.Departments.unshift({ "DepartmentName": "", Id: 0 });

            //that.Settings.Data.Modules = moduleList[0];
            if (moduleList && moduleList.length > 0 && moduleList[0].d && moduleList[0].d.results) {
                $(that.Settings.Controls.ModuleSelector).empty();
                $.each(moduleList[0].d.results, function (idx, value) {
                    if (that.Settings.Data.LCID == 1066) {
                        that.Settings.Data.Modules.push({ "Name": value.VietnameseModuleName, Id: value.ID });
                    }
                    else {
                        that.Settings.Data.Modules.push({ "Name": value.ModuleName, Id: value.ID });

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
                $('tr.jsgrid-row > td:nth-child(6), tr.jsgrid-alt-row > td:nth-child(6)').each(function () {
                    var $status = $(this);
                    var $span = RBVH.Stada.WebPages.Utilities.GUI.generateItemStatus($status.html());
                    $status.html($span);
                });
            }
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

        var url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Delegations Module')/items?$select=ID,ModuleName,VietnameseModuleName&" + orderby;

        return $.ajax({
            method: "GET",
            url: url,
            headers: { "Accept": "application/json; odata=verbose" },
        });
    }

    return {
        Initialize: function (settings) {
            $.extend(true, that.Settings, settings);
            _init();
        }
    };
})();

