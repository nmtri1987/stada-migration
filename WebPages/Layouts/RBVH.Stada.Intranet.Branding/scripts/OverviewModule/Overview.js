RBVH.Stada.javascript.common.NamespaceManager.register("RBVH.Stada.WebPages.pages");
RBVH.Stada.WebPages.pages.Overview = function (settings) {
    this.Protocol = window.location.protocol;
    this.Settings = {
        Condition:
        {
            WaitingApproval: "WaitingApproval",
            WaitingApprovalToday: "WaitingApprovalToday",
            InProcess: "InProcess",
            ApprovedToday: "ApprovedToday",
        },
        Data: {
            LCID: 0,
            ApprovalStatus: [],
            Departments: [],
            Modules: [],
            OriginalModuleDataSource: [],
            OriginalGridToDoTaskDataSource: [],
            OriginalGridDoneTaskDataSource: [],
            ProcessedGridDataSource: [],
            UserInfoId: 0,
            UserADId: 0,
            LocationId: 2,
            Position: '',
            IsBOD: false,
            Condition: '',
        },
        Grid:
        {
            DataSource: [],
            ShaderCssClass: '.jsgrid-load-shader',
            LoadPanelCssClass: '.jsgrid-load-panel',
            LoadedData: false,
        },
        Chart: {
            DataSource: {
                TotalWaitingApproval: 0,
                TotalWaitingApprovalToday: 0,
                TotalInProcess: 0,
                TotalApprovedToday: 0
            }
        },
        ChartObj: {}
    };

    $.extend(true, this.Settings, settings);

    this.Initialize();
};

RBVH.Stada.WebPages.pages.Overview.prototype =
{
    Initialize: function () {
        var that = this;

        $(document).ready(function () {
            that.InitDefaultValue();
            that.RegisterEvents();

            $(that.Settings.Chart.ShaderSelector).show();
            var $loadPanel = $(that.Settings.Chart.LoaderSelector).show();
            var actualWidth = $loadPanel.outerWidth();
            var actualHeight = $loadPanel.outerHeight();
            $loadPanel.css({
                marginTop: -actualHeight / 2,
                marginLeft: -actualWidth / 2
            });
            $.when(that.PopulateModules(), that.GetPendingOverview(), that.GetDoneOverview()).done(function (moduleList, pendingTaskList, doneTaskList) {
                if (moduleList && moduleList.length > 0 && moduleList[0].d && moduleList[0].d.results) {
                    that.Settings.Data.OriginalModuleDataSource = moduleList[0].d.results;
                    $.each(moduleList[0].d.results, function (idx, value) {
                        if (that.Settings.Data.LCID == 1066) {
                            that.Settings.Data.Modules.push({ "Name": value.VietnameseModuleName, Id: value.ID });
                        }
                        else {
                            that.Settings.Data.Modules.push({ "Name": value.ModuleName, Id: value.ID });
                        }
                    })
                }
                that.Settings.Data.Modules.unshift({ "Name": "", Id: 0 });
                that.PopulateGridFilter(that.PopulateGrid);

                that.ResetChartDataSource();
                var currentDate = (new Date()).setHours(0, 0, 0, 0);
                $.each(pendingTaskList[0].d.results, function (idx, taskObj) {
                    var taskCategory = that.ClassifyTaskCategory(taskObj, currentDate);
                    if (taskCategory) {
                        switch (taskCategory) {
                            case that.Settings.Condition.WaitingApproval:
                                that.Settings.Chart.DataSource.TotalWaitingApproval += 1;
                                break;
                            case that.Settings.Condition.WaitingApprovalToday:
                                that.Settings.Chart.DataSource.TotalWaitingApprovalToday += 1;
                                break;
                            case that.Settings.Condition.InProcess:
                                that.Settings.Chart.DataSource.TotalInProcess += 1;
                                break;
                            default:
                                break;
                        }
                    }
                });

                if (doneTaskList && doneTaskList.length > 0 && doneTaskList[0].d && doneTaskList[0].d.results) {
                    that.Settings.Chart.DataSource.TotalApprovedToday = doneTaskList[0].d.results.length;
                }
                that.PopulateChart(that.Settings.Chart.DataSource);
            });
        });
    },
    ResetChartDataSource: function () {
        var that = this;
        that.Settings.Chart.DataSource = {
            TotalWaitingApproval: 0,
            TotalWaitingApprovalToday: 0,
            TotalInProcess: 0,
            TotalApprovedToday: 0
        };
    },
    ClassifyTaskCategory: function (taskObj, currentDate) {
        var that = this;
        var moduleObj = that.Settings.Data.OriginalModuleDataSource.filter(function (element) {
            if (element.ID == taskObj.ModuleNameENId) {
                return element;
            }
            else { return null; }
        });

        if (moduleObj && moduleObj.length > 0) {
            if (moduleObj[0].ListURL.toLowerCase() == "/lists/freightmanagement" || moduleObj[0].ListURL.toLowerCase() == "/lists/businesstripmanagement"
                || moduleObj[0].ListURL.toLowerCase() == "/lists/leavemanagement" || moduleObj[0].ListURL.toLowerCase() == "/lists/vehiclemanagement") {
                var requestDueDate = (new Date(taskObj.ListItemDueDate)).setHours(0, 0, 0, 0);
                if (requestDueDate.valueOf() <= currentDate.valueOf()) {
                    return that.Settings.Condition.WaitingApprovalToday;
                }
                else {
                    return that.Settings.Condition.WaitingApproval;
                }
            }
            else if (moduleObj[0].ListURL.toLowerCase() == "/lists/requests") {
                if (taskObj.ListItemDueDate && taskObj.ListItemDueDate.length > 0) {
                    var requestDueDate = (new Date(taskObj.ListItemDueDate)).setHours(0, 0, 0, 0);
                    if (requestDueDate.valueOf() <= currentDate.valueOf()) {
                        return that.Settings.Condition.WaitingApprovalToday;
                    }
                    else {
                        return that.Settings.Condition.WaitingApproval;
                    }
                }
            }
            else if (moduleObj[0].ListURL.toLowerCase() == "/lists/employeerequirementsheets" || moduleObj[0].ListURL.toLowerCase() == "/lists/requestfordiplomasupplies") {
                if (taskObj.ListItemDueDate && taskObj.ListItemDueDate.length > 0) {
                    var requestDueDate = (new Date(taskObj.ListItemDueDate)).setHours(0, 0, 0, 0);
                    if (requestDueDate.valueOf() <= currentDate.valueOf()) {
                        return that.Settings.Condition.WaitingApprovalToday;
                    }
                    else {
                        return that.Settings.Condition.WaitingApproval;
                    }
                }
            }
        }
        return "";
    },
    RegisterEvents: function () {
        // Show/hide
        $('h2.conner .show-hide').click(function (e) {
            e.stopPropagation();
            $(this).parent().parent().find('.grid-content').toggle();
            var $span = $(this);//.parent().find('span.show-hide');
            if ($span.hasClass('s-expand')) {
                $span.removeClass('s-expand');
                $span.addClass('s-collapse');
                $(window).trigger('resize');
            }
            else {
                $span.removeClass('s-collapse');
                $span.addClass('s-expand');
                $(window).trigger('resize');
            }
        });
    },
    InitDefaultValue: function () {
        this.Settings.Data.LCID = _spPageContextInfo.currentLanguage;
        if (_rbvhContext.EmployeeInfo != null) {
            this.Settings.Data.UserInfoId = _rbvhContext.EmployeeInfo.ID;
            this.Settings.Data.UserADId = _rbvhContext.EmployeeInfo.ADAccount.ID;
            this.Settings.Data.LocationId = _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
            this.Settings.Data.FullName = _rbvhContext.EmployeeInfo.FullName;
            this.Settings.Data.Position = _rbvhContext.EmployeeInfo.EmployeePosition.LookupValue;
            this.Settings.Data.IsBOD = this.Settings.Data.Position == 'Board of Director';
        }
    },
    GetPendingOverview: function () {
        var that = this;
        var selectCols = '$select=ID,ListItemID,ListItemDueDate,ModuleNameENId';
        var filterBy = "&$filter=AssignedTo eq " + that.Settings.Data.UserInfoId;
        var url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Task List ToDo')/items?" + selectCols + filterBy;
        return $.ajax({
            method: "GET",
            url: url,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    },
    GetDoneOverview: function () {
        var that = this;
        var selectCols = '$select=ID,ListItemID,ListItemDueDate';
        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        var filterBy = "&$filter=(AssignedTo eq " + that.Settings.Data.UserInfoId + ")";
        filterBy += " and (Created gt datetime'" + currentDate.toISOString() + "')";
        var url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Task List Done')/items?" + selectCols + filterBy;
        return $.ajax({
            method: "GET",
            url: url,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    },
    GetDetailPendingTask: function () {
        var that = this;
        var selectCols = '$select=ID,ListItemID,ListItemApprovalUrl,ListItemDescription,ListItemCreatedDate,ListItemDueDate,ListURL,RequesterId,DepartmentENId,ModuleNameENId,ApprovalStatusENId,Requester/EmployeeDisplayName&$expand=Requester/EmployeeDisplayName';
        var filterBy = "&$filter=AssignedTo eq " + that.Settings.Data.UserInfoId;
        var url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Task List ToDo')/items?" + selectCols + filterBy;
        return $.ajax({
            method: "GET",
            url: url,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    },
    GetDetailDoneTask: function () {
        var that = this;
        var selectCols = '$select=ID,ListItemID,ListItemApprovalUrl,ListItemDescription,ListItemCreatedDate,ListItemDueDate,ListURL,RequesterId,DepartmentENId,ModuleNameENId,ApprovalStatusENId,Requester/EmployeeDisplayName&$expand=Requester/EmployeeDisplayName';
        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        var filterBy = "&$filter=(AssignedTo eq " + that.Settings.Data.UserInfoId + ")";
        filterBy += " and (Created gt datetime'" + currentDate.toISOString() + "')";
        var url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Task List Done')/items?" + selectCols + filterBy;
        return $.ajax({
            method: "GET",
            url: url,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    },
    PopulateChart: function (dataSource) {
        var that = this;

        var colors = ['#888d91', '#c1140b', '#db1ed2', '#5cb85c'];

        // Init Chart
        //var chart = new Highcharts.chart('container', {
        that.Settings.ChartObj = new Highcharts.chart('container', {
            chart: {
                type: 'column',
                events: {
                    load: function (event) {
                        // Hide loading...
                        $(that.Settings.Chart.ShaderSelector).hide();
                        $(that.Settings.Chart.LoaderSelector).hide();
                        //$(".se-pre-con").fadeOut(0);
                    }
                }
            },
            xAxis: {
                categories: [that.Settings.Chart.Columns.Title.WaitingApprovalTitle, that.Settings.Chart.Columns.Title.WaitingApprovalTodayTitle, that.Settings.Chart.Columns.Title.InProcessTitle, that.Settings.Chart.Columns.Title.ApprovedTodayTitle],
                labels: {
                    style: {
                        color: '#575c60',
                        font: '14px "Helvetica Neue",Helvetica,Arial,sans-serif'
                    }
                }
            },
            title: {
                text: '', // Resource
                style: {
                    'fontSize': '2.77em',
                    'fontFamily': '"Helvetica Neue",Helvetica,Arial,sans-serif',
                }
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: that.Settings.Chart.Columns.Title.LeftColumnTitle
                },
                labels: {
                    style: {
                        color: '#575c60',
                        font: '14px "Helvetica Neue",Helvetica,Arial,sans-serif'
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        this.point.y + ' ' + this.point.name.toLowerCase();
                }
            },
            plotOptions: {
                series: {
                    //pointWidth: 60,
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                // Show Indicator:
                                $(that.Settings.Grid.ShaderCssClass).show();
                                $(that.Settings.Grid.LoadPanelCssClass).show();
                                // Set Grid title
                                $(that.Settings.Grid.TaskListTitleSelector).html(' - ' + this.category);
                                // Clear all filter
                                //$(that.Settings.Grid.Selector).jsGrid("clearFilter");

                                var myGrid = $(that.Settings.Grid.Selector).data("JSGrid");
                                if (myGrid != null) {
                                    var $filterRow = myGrid._createFilterRow();
                                    myGrid._filterRow.replaceWith($filterRow);
                                    myGrid._filterRow = $filterRow;
                                }

                                if (this.category == that.Settings.Chart.Columns.Title.WaitingApprovalTitle) { // Waiting approval
                                    that.Settings.Data.Condition = that.Settings.Condition.WaitingApproval;
                                }
                                else if (this.category == that.Settings.Chart.Columns.Title.WaitingApprovalTodayTitle) { // Waiting approval TODAY
                                    that.Settings.Data.Condition = that.Settings.Condition.WaitingApprovalToday;
                                }
                                else if (this.category == that.Settings.Chart.Columns.Title.InProcessTitle) { // In-Process
                                    that.Settings.Data.Condition = that.Settings.Condition.InProcess;
                                }
                                else if (this.category == that.Settings.Chart.Columns.Title.ApprovedTodayTitle) { // Approved TODAY
                                    that.Settings.Data.Condition = that.Settings.Condition.ApprovedToday;
                                }

                                if (that.Settings.Grid.LoadedData == false) {
                                    $.when(that.GetDetailPendingTask(), that.GetDetailDoneTask()).done(function (detailPendingTask, donePendingTask) {
                                        if (detailPendingTask && detailPendingTask.length > 0 && detailPendingTask[0].d && detailPendingTask[0].d.results) {
                                            that.Settings.Data.OriginalGridToDoTaskDataSource = detailPendingTask[0].d.results;
                                            var currentDate = (new Date()).setHours(0, 0, 0, 0);
                                            that.ResetChartDataSource();
                                            $.each(that.Settings.Data.OriginalGridToDoTaskDataSource, function (idx, itemObj) {
                                                var taskCondition = "";
                                                var taskCategory = that.ClassifyTaskCategory(itemObj, currentDate);
                                                switch (taskCategory) {
                                                    case that.Settings.Condition.WaitingApproval:
                                                        that.Settings.Chart.DataSource.TotalWaitingApproval += 1;
                                                        taskCondition = that.Settings.Condition.WaitingApproval;
                                                        break;
                                                    case that.Settings.Condition.WaitingApprovalToday:
                                                        that.Settings.Chart.DataSource.TotalWaitingApprovalToday += 1;
                                                        taskCondition = that.Settings.Condition.WaitingApprovalToday;
                                                        break;
                                                    case that.Settings.Condition.InProcess:
                                                        that.Settings.Chart.DataSource.TotalInProcess += 1;
                                                        taskCondition = that.Settings.Condition.TotalInProcess;
                                                        break;
                                                    default:
                                                        break;
                                                }

                                                that.Settings.Data.ProcessedGridDataSource.push({
                                                    ItemId: itemObj.ListItemID,
                                                    ItemApprovalUrl: itemObj.ListItemApprovalUrl,
                                                    ModuleId: itemObj.ModuleNameENId,
                                                    ModuleName: null,
                                                    RequesterId: itemObj.RequesterId,
                                                    RequesterName: itemObj.Requester.EmployeeDisplayName,
                                                    DepartmentId: itemObj.DepartmentENId,
                                                    DepartmentName: null,
                                                    Description: itemObj.ListItemDescription,
                                                    ApprovalStatusId: itemObj.ApprovalStatusENId,
                                                    ApprovalStatus: null,
                                                    CreatedDate: Functions.parseVietnameseDateTimeToDDMMYYYY2(new Date(itemObj.ListItemCreatedDate)),
                                                    DueDate: Functions.parseVietnameseDateTimeToDDMMYYYY2(new Date(itemObj.ListItemDueDate)),
                                                    Condition: taskCondition
                                                });
                                            })
                                        }

                                        if (donePendingTask && donePendingTask.length > 0 && donePendingTask[0].d && donePendingTask[0].d.results) {
                                            that.Settings.Data.OriginalGridDoneTaskDataSource = donePendingTask[0].d.results;
                                            that.Settings.Chart.DataSource.TotalApprovedToday = that.Settings.Data.OriginalGridDoneTaskDataSource.length;
                                            $.each(that.Settings.Data.OriginalGridDoneTaskDataSource, function (idx, itemObj) {
                                                that.Settings.Data.ProcessedGridDataSource.push({
                                                    ItemId: itemObj.ListItemID,
                                                    ItemApprovalUrl: itemObj.ListItemApprovalUrl,
                                                    ModuleId: itemObj.ModuleNameENId,
                                                    ModuleName: null,
                                                    RequesterId: itemObj.RequesterId,
                                                    RequesterName: itemObj.Requester.EmployeeDisplayName,
                                                    DepartmentId: itemObj.DepartmentENId,
                                                    DepartmentName: null,
                                                    Description: itemObj.ListItemDescription,
                                                    ApprovalStatusId: itemObj.ApprovalStatusENId,
                                                    ApprovalStatus: null,
                                                    CreatedDate: Functions.parseVietnameseDateTimeToDDMMYYYY2(new Date(itemObj.ListItemCreatedDate)),
                                                    DueDate: Functions.parseVietnameseDateTimeToDDMMYYYY2(new Date(itemObj.ListItemDueDate)),
                                                    Condition: that.Settings.Condition.ApprovedToday
                                                });
                                            })
                                        }
                                        that.PopulateChart(that.Settings.Chart.DataSource);

                                        that.Settings.Grid.DataSource = [];
                                        var datasource = that.Settings.Data.ProcessedGridDataSource.filter(function (result) {
                                            return result.Condition == that.Settings.Data.Condition;
                                        });
                                        if (datasource && datasource.length > 0) {
                                            that.Settings.Grid.DataSource = datasource;
                                        }

                                        // Bind Datasource
                                        that.Settings.Grid.LoadedData = true;
                                        $(that.Settings.Grid.Selector).jsGrid("loadData");
                                    });
                                }
                                else {
                                    $(that.Settings.Grid.ShaderCssClass).show();
                                    $(that.Settings.Grid.LoadPanelCssClass).show();

                                    that.Settings.Grid.DataSource = [];
                                    var datasource = that.Settings.Data.ProcessedGridDataSource.filter(function (result) {
                                        return result.Condition == that.Settings.Data.Condition
                                    });
                                    if (datasource && datasource.length > 0) {
                                        that.Settings.Grid.DataSource = datasource;
                                    }
                                    $(that.Settings.Grid.Selector).jsGrid("loadData");
                                }
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        crop: false,
                        overflow: 'none',
                        style: {
                            fontSize: "13px"
                        }
                    }
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                name: that.Settings.Chart.Label, // Resource
                //colorByPoint: true,
                data: [{
                    name: that.Settings.Chart.Columns.Title.WaitingApprovalTitle,
                    y: dataSource.TotalWaitingApproval,
                    color: colors[0]
                }, {
                    name: that.Settings.Chart.Columns.Title.WaitingApprovalTodayTitle,
                    y: dataSource.TotalWaitingApprovalToday,
                    color: colors[1]
                }, {
                    name: that.Settings.Chart.Columns.Title.InProcessTitle,
                    y: dataSource.TotalInProcess,
                    color: colors[2]
                }, {
                    name: that.Settings.Chart.Columns.Title.ApprovedTodayTitle,
                    y: dataSource.TotalApprovedToday,
                    color: colors[3]
                }]
            }],

            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
        });

        // Auto resize
        var resizeTimer;
        $(window).resize(function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                //height = 300;
                var width = $('#container').parent().width();
                var height = 301;
                //chart.setSize(width, height, doAnimation = true);
                that.Settings.ChartObj.setSize(width, height, doAnimation = true);
            }, 100);
        });
    },
    PopulateGrid: function (condition) {
        var that = this;

        function applyFilter(data, filter) {
            return $.grep(data, function (client) {
                return (!filter.RequesterName || client.RequesterName.toLowerCase().indexOf(filter.RequesterName.toLowerCase()) > -1)
                    && (!filter.DepartmentId || client.DepartmentId == filter.DepartmentId)
                    && (!filter.ModuleId || client.ModuleId == filter.ModuleId)
                    && (!filter.Description || client.Description.toLowerCase().indexOf(filter.Description.toLowerCase()) > -1)
                    && (!filter.CreatedDate || client.CreatedDate.indexOf(filter.CreatedDate) > -1)
                    && (!filter.DueDate || client.DueDate.indexOf(filter.DueDate) > -1)
                    && (!filter.ApprovalStatusId || client.ApprovalStatusId == filter.ApprovalStatusId);
            });
        };

        $(that.Settings.Grid.Selector).jsGrid({
            height: "100%",
            width: "100%",

            filtering: true,
            sorting: true,
            paging: true,
            autoload: true,

            pageSize: 20,
            pageButtonCount: 5,
            pagerFormat: that.Settings.Grid.PagerFormat,
            pagePrevText: "<",
            pageNextText: ">",
            pageFirstText: "<<",
            pageLastText: ">>",
            noDataContent: that.Settings.Grid.EmptyDataTitle,
            loadMessage: that.Settings.Grid.LoadMessageTitle,

            controller: {
                loadData: function (filter) {
                    console.log(that.Settings.Data.Condition);
                    if (that.Settings.Data.Condition == '')
                        return [];

                    if (that.Settings.Grid.LoadedData)
                        return applyFilter(that.Settings.Grid.DataSource, filter);

                    // Hide Indicator:
                    $(that.Settings.Grid.ShaderCssClass).hide();
                    $(that.Settings.Grid.LoadPanelCssClass).hide();
                },
            },
            fields: [
                {
                    name: "ItemApprovalUrl", type: "text", width: 50, filtering: false, align: "center", title: "#",
                    itemTemplate: function (value, item) {
                        var $link = $("<a>").attr("href", value).attr("target", "_blank");
                        var $eye = $("<i>").attr("class", "fa fa-eye");
                        $link.append($eye);
                        return $("<div>").append($link);
                    }
                },
                { name: "ModuleId", type: "select", title: that.Settings.Grid.Columns.Title.Module, width: "12%", items: that.Settings.Data.Modules, valueField: "Id", textField: "Name", align: "left" },
                { name: "RequesterName", type: "text", title: that.Settings.Grid.Columns.Title.Requester, width: "12%", align: "left" },
                { name: "DepartmentId", type: "select", title: that.Settings.Grid.Columns.Title.Department, width: "12%", items: that.Settings.Data.Departments, valueField: "Id", textField: "DepartmentName", align: "left", filtering: that.Settings.Data.IsBOD },
                { name: "Description", type: "text", title: that.Settings.Grid.Columns.Title.Description, width: 'auto', align: "left" },
                { name: "ApprovalStatusId", type: "select", title: that.Settings.Grid.Columns.Title.ApprovalStatus, width: "12%", items: that.Settings.Data.ApprovalStatus, valueField: "Id", textField: "Name", align: "center" },
                { name: "CreatedDate", type: "text", title: that.Settings.Grid.Columns.Title.CreatedDate, width: "12%", align: "center" },
                { name: "DueDate", type: "text", title: that.Settings.Grid.Columns.Title.DueDate, width: "12%", align: "center" },
                //{ name: "ApprovedDate", type: "text", title: "Ngày duyệt", width: 100, align: "left" },
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
    },
    PopulateModules: function () {
        var that = this;

        var orderby = "&$orderby=ModuleName";
        if (_spPageContextInfo.currentLanguage == 1066) {
            orderby = "&$orderby=VietnameseModuleName";
        }
        var url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Delegations Module')/items?$select=ID,ListURL,ModuleName,VietnameseModuleName&" + orderby;
        return $.ajax({
            method: "GET",
            url: url,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    },
    PopulateDepartments: function () {
        var that = this;

        var orderby = "&$orderby=CommonName";
        if (_spPageContextInfo.currentLanguage == 1066) {
            orderby = "&$orderby=CommonName1066";
        }
        var url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Departments')/items?$select=ID,CommonName,CommonName1066&$filter=CommonMultiLocations eq " + that.Settings.Data.LocationId + orderby;
        return $.ajax({
            method: "GET",
            url: url,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    },
    PopulateApprovalStatus: function () {
        var that = this;

        var orderby = "&$orderby=NameEN";
        if (_spPageContextInfo.currentLanguage == 1066) {
            orderby = "&$orderby=NameVN";
        }
        var url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('Task List Approval Status')/items?$select=ID,NameEN,NameVN&" + orderby;
        return $.ajax({
            method: "GET",
            url: url,
            headers: { "Accept": "application/json; odata=verbose" }
        });
    },
    PopulateGridFilter: function (populateGrid) {
        var that = this;
        $.when(that.PopulateDepartments(), that.PopulateApprovalStatus()).done(function (departmentList, approvalStatusList) {
            // Department
            if (departmentList && departmentList.length > 0 && departmentList[0].d && departmentList[0].d.results) {
                $.each(departmentList[0].d.results, function (idx, value) {
                    if (that.Settings.Data.LCID == 1066) {
                        that.Settings.Data.Departments.push({ "DepartmentName": value.CommonName1066, Id: value.ID })
                    }
                    else {
                        that.Settings.Data.Departments.push({ "DepartmentName": value.CommonName, Id: value.ID });
                    }
                });
            }
            that.Settings.Data.Departments.unshift({ "DepartmentName": "", Id: 0 });

            // Approval Status
            if (approvalStatusList && approvalStatusList.length > 0 && approvalStatusList[0].d && approvalStatusList[0].d.results) {
                $.each(approvalStatusList[0].d.results, function (idx, value) {
                    if (that.Settings.Data.LCID == 1066) {
                        that.Settings.Data.ApprovalStatus.push({ "Name": value.NameVN, Id: value.ID });
                    }
                    else {
                        that.Settings.Data.ApprovalStatus.push({ "Name": value.NameEN, Id: value.ID });
                    }
                })
            }
            that.Settings.Data.ApprovalStatus.unshift({ "Name": "", Id: 0 });

            if (typeof populateGrid == 'function') {
                var processNextStep = populateGrid.bind(that);
                processNextStep();
            }
        });
    },
};
