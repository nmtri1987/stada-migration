(function () {
    var ShiftManagementApprovalConfig = {
        ShiftManagement_Department: "Department",
        ShiftManagement_Location: "Location",
        ShiftManagement_Title: "Title",
        ShiftManagement_Requester: "Requester",
        ShiftManagement_ViewDetail: "View Detail",
        ShiftManagement_Time: "Time",
        ShiftManagement_Month: "Month",
        ShiftManagement_Year: "Year",
        Locale: '',
        ListResourceFileName: "RBVHStadaLists",
        Container: "shift-approval-list-container"
    };
    (function () {
        var overrideShiftApproveCtx = {};
        overrideShiftApproveCtx.Templates = {};

        overrideShiftApproveCtx.ListTemplateType = 10010;
        overrideShiftApproveCtx.BaseViewID = 2;
        overrideShiftApproveCtx.Templates.Item = shiftApproveCustomItem;
        overrideShiftApproveCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideShiftApproveCtx.OnPostRender = PostRender_ShiftApprove;
        overrideShiftApproveCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='titleTHApproval'>Title</th>" +
        "<th id='requesterTHApproval'>" + ShiftManagementApprovalConfig.ShiftManagement_Requester + "</th>" +
        "<th id='departmentTHApproval'>" + ShiftManagementApprovalConfig.ShiftManagement_Department + "</th>" +
        "<th id='locationTHApproval'>" + ShiftManagementApprovalConfig.ShiftManagement_Location + "</th>" +
        "<th id='month'>" + ShiftManagementApprovalConfig.ShiftManagement_Month + "</th>" +
        "<th id='year'>" + ShiftManagementApprovalConfig.ShiftManagement_Year + "</th>" +
        "<tr></thead><tbody>";
        overrideShiftApproveCtx.Templates.Footer = shiftApprovePagingControl;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideShiftApproveCtx);
    })();
    function PostRender_ShiftApprove(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            ShiftManagementApprovalConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(ShiftManagementApprovalConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + ShiftManagementApprovalConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(ShiftManagementApprovalConfig.ListResourceFileName, "Res", OnListShiftApproveResourcesReady);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + ShiftManagementApprovalConfig.Container + ' .department-locale').each(function () {
                        var id = $(this).attr('data-id');
                        var currentDepartment = $(this);
                        $(data).each(function (idx, obj) {
                            if (obj.Id.toString() === id) {
                                currentDepartment.text(obj.DepartmentName)
                            }
                        })
                    });
                }
            },
            error: function (data) {
                status = 'failed';
            }
        });
    }
    function OnListShiftApproveResourcesReady() {
        $('#' + ShiftManagementApprovalConfig.Container + ' #titleTHApproval').text(Res.shiftManagement_Title);
        $('#' + ShiftManagementApprovalConfig.Container + ' #requesterTHApproval').text(Res.shiftManagement_Requester);
        $('#' + ShiftManagementApprovalConfig.Container + ' #departmentTHApproval').text(Res.shiftManagement_Department);
        $('#' + ShiftManagementApprovalConfig.Container + ' #locationTHApproval').text(Res.shiftManagement_Location);
        $('#' + ShiftManagementApprovalConfig.Container + ' #month').text(Res.shiftManagement_Month);
        $('#' + ShiftManagementApprovalConfig.Container + ' #year').text(Res.shiftManagement_Year);
        $('#' + ShiftManagementApprovalConfig.Container + ' .viewDetail').text(Res.shiftManagement_ViewDetail);
        $('#' + ShiftManagementApprovalConfig.Container + ' .label-success').text(Res.approvalStatus_InProgress);
        $('#' + ShiftManagementApprovalConfig.Container + ' .label-default').text(Res.approvalStatus_Approved);
    }
    function shiftApproveCustomItem(ctx) {
        var tr = "";
        var Requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab2';
        sourceURL = encodeURIComponent(sourceURL);

        var Title = '<td><a  href="/SitePages/ShiftApproval.aspx?subSection=ShiftManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';
        var Month = '<td> ' + ctx.CurrentItem.CommonMonth + '</td>';
        var yearValue = ctx.CurrentItem.CommonYear.replace('.', '');
        yearValue = yearValue.replace(',', '');
        var Year = '<td> ' + yearValue + '</td>';
        var Department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var Location = '<td> ' + ctx.CurrentItem.CommonLocation[0].lookupValue + '</td>';

        tr = "<tr>" + Title + Requester + Department + Location + Month + Year + "</tr>";
        return tr;
    }
    function shiftApprovePagingControl(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();
(function () {
    var ShiftManagementConfig = {
        ShiftManagement_Department: "Department",
        ShiftManagement_Location: "Location",
        ShiftManagement_Requester: "Requester",
        ShiftManagement_Month: "Month",
        ShiftManagement_Year: "Year",
        ShiftManagement_Approver: "Approver",
        ShiftManagement_ModifiedBy: "Modified By",
        Locale: '',
        ShiftManagement_EditTitle: "Edit",
        ShiftManagement_ViewTitle: "View",
        ListResourceFileName: "RBVHStadaLists",
        Container: "shift-request-list-container"
    };
    (function () {
        var overrideShiftRequestCtx = {};
        overrideShiftRequestCtx.Templates = {};
        overrideShiftRequestCtx.ListTemplateType = 10010;
        overrideShiftRequestCtx.BaseViewID = 4;
        overrideShiftRequestCtx.Templates.Item = shiftRequestCustomItem;
        overrideShiftRequestCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideShiftRequestCtx.OnPostRender = PostRender_ShiftRequest;
        overrideShiftRequestCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='requesterTH'>" + ShiftManagementConfig.ShiftManagement_Requester + "</th>" +
        "<th id='departmentTH'>" + ShiftManagementConfig.ShiftManagement_Department + "</th>" +
        "<th id='locationTH'>" + ShiftManagementConfig.ShiftManagement_Location + "</th>" +
        "<th id='month'>" + ShiftManagementConfig.ShiftManagement_Month + "</th>" +
        "<th id='year'>" + ShiftManagementConfig.ShiftManagement_Year + "</th>" +
        "<th id='approver'>" + ShiftManagementConfig.ShiftManagement_Approver + "</th>" +
        "<th id='modifiedBy'>" + ShiftManagementConfig.ShiftManagement_ModifiedBy + "</th>" +
        "<th id='action'>" + ShiftManagementConfig.ShiftManagement_EditTitle + " | " + ShiftManagementConfig.ShiftManagement_ViewTitle + "</th>" +
        "</tr></thead><tbody>";
        overrideShiftRequestCtx.Templates.Footer = shiftRequestPagingControl;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideShiftRequestCtx);
    })();
    function PostRender_ShiftRequest(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            ShiftManagementConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(ShiftManagementConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + ShiftManagementConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(ShiftManagementConfig.ListResourceFileName, "Res", OnListShiftRequestResourcesReady);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + ShiftManagementConfig.Container + ' .department-locale').each(function () {
                        var id = $(this).attr('data-id');
                        var currentDepartment = $(this);
                        $(data).each(function (idx, obj) {
                            if (obj.Id.toString() === id) {
                                currentDepartment.text(obj.DepartmentName)
                            }
                        })
                    });
                }
            },
            error: function (data) {
                status = 'failed';
            }
        });
    }
    function OnListShiftRequestResourcesReady() {
        $('#' + ShiftManagementConfig.Container + ' #departmentTH').text(Res.shiftManagement_Department);
        $('#' + ShiftManagementConfig.Container + ' #locationTH').text(Res.shiftManagement_Location);
        $('#' + ShiftManagementConfig.Container + ' #requesterTH').text(Res.shiftManagement_Requester);
        $('#' + ShiftManagementConfig.Container + ' #month').text(Res.shiftManagement_Month);
        $('#' + ShiftManagementConfig.Container + ' #year').text(Res.shiftManagement_Year);
        $('#' + ShiftManagementConfig.Container + ' #approver').text(Res.shiftManagement_Approver);
        $('#' + ShiftManagementConfig.Container + ' #modifiedBy').text(Res.shiftManagement_ModifiedBy);
        $('#' + ShiftManagementConfig.Container + ' #action').text(Res.shiftManagement_EditTitle + " | " + Res.shiftManagement_ViewTitle);
        $('#' + ShiftManagementConfig.Container + ' #approvalStatus').text(Res.approvalStatusFieldDisplayName);
        $('#' + ShiftManagementConfig.Container + ' .label-success').text(Res.approvalStatus_Approved);
        $('#' + ShiftManagementConfig.Container + ' .label-default').text(Res.approvalStatus_InProgress);
    }
    function shiftRequestCustomItem(ctx) {
        var tr = "";
        var Requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var ModifiedBy = '<td>' + (ctx.CurrentItem.Editor.length > 0 ? ctx.CurrentItem.Editor[0].title : '') + '</td>';
        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab2';
        sourceURL = encodeURIComponent(sourceURL);

        var edit = '<span><a  href="/SitePages/ShiftRequest.aspx?itemid=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="table-action" style="margin-left: 10px;"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a></span>';
        var view = '<span><a  href="/SitePages/ShiftRequest.aspx?itemid=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '&mode=view"   class="table-action"><i class="fa fa-eye" aria-hidden="true"></i></a></span>';
        var action = "<td>" + edit + view + "</td>";
        var Month = '<td> ' + ctx.CurrentItem.CommonMonth + '</td>';
        var yearValue = ctx.CurrentItem.CommonYear.replace('.', '');
        yearValue = yearValue.replace(',', '');
        var Year = '<td> ' + yearValue + '</td>';
        var Department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var location = '<td> ' + ctx.CurrentItem.CommonLocation[0].lookupValue + '</td>';
        var approverValue = !!ctx.CurrentItem.CommonApprover1 ? ctx.CurrentItem.CommonApprover1[0].title : '';
        var Approver = '<td> ' + approverValue + '</td>';
        tr = "<tr>" + Requester + Department + location + Month + Year + Approver + ModifiedBy + action + "</tr>";

        return tr;
    }
    function shiftRequestPagingControl(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();
(function () {
    var ShiftManagementDepartmentConfig = {
        ShiftManagement_Department: "Department",
        ShiftManagement_Location: "Location",
        ShiftManagement_Requester: "Requester",
        ShiftManagement_Month: "Month",
        ShiftManagement_Year: "Year",
        ShiftManagement_Approver: "Approver",
        Locale: '',
        ShiftManagement_ViewTitle: "View",
        ListResourceFileName: "RBVHStadaLists",
        Container: "shift-by-department-list-container"
    };
    (function () {
        var overrideShiftRequestByDepartmentCtx = {};
        overrideShiftRequestByDepartmentCtx.Templates = {};
        overrideShiftRequestByDepartmentCtx.ListTemplateType = 10010;
        overrideShiftRequestByDepartmentCtx.BaseViewID = 3;
        overrideShiftRequestByDepartmentCtx.Templates.Item = shiftManagementDepartmentCustomItem;
        overrideShiftRequestByDepartmentCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideShiftRequestByDepartmentCtx.OnPostRender = PostRender_ShiftRequestByDepartment;
        overrideShiftRequestByDepartmentCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='requesterTHDept'>" + ShiftManagementDepartmentConfig.ShiftManagement_Requester + "</th>" +
        "<th id='departmentTHDept'>" + ShiftManagementDepartmentConfig.ShiftManagement_Department + "</th>" +
        "<th id='locationTHDept'>" + ShiftManagementDepartmentConfig.ShiftManagement_Location + "</th>" +
        "<th id='monthDept'>" + ShiftManagementDepartmentConfig.ShiftManagement_Month + "</th>" +
        "<th id='yearDept'>" + ShiftManagementDepartmentConfig.ShiftManagement_Year + "</th>" +
        "<th id='approverDept'>" + ShiftManagementDepartmentConfig.ShiftManagement_Approver + "</th>" +
        "<th id='actionDept'>" + ShiftManagementDepartmentConfig.ShiftManagement_ViewTitle + "</th>" +
        "</tr></thead><tbody>";
        overrideShiftRequestByDepartmentCtx.Templates.Footer = shiftManagementDepartmentPagingControl;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideShiftRequestByDepartmentCtx);
    })();
    function PostRender_ShiftRequestByDepartment(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            ShiftManagementDepartmentConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(ShiftManagementDepartmentConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + ShiftManagementDepartmentConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(ShiftManagementDepartmentConfig.ListResourceFileName, "Res", OnListShiftManagementDepartmentResourcesReady);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + ShiftManagementDepartmentConfig.Container + ' .department-locale').each(function () {
                        var id = $(this).attr('data-id');
                        var currentDepartment = $(this);
                        $(data).each(function (idx, obj) {
                            if (obj.Id.toString() === id) {
                                currentDepartment.text(obj.DepartmentName)
                            }
                        })
                    });
                }
            },
            error: function (data) {
                status = 'failed';
            }
        });
    }
    function OnListShiftManagementDepartmentResourcesReady() {
        $('#' + ShiftManagementDepartmentConfig.Container + ' #requesterTHDept').text(Res.shiftManagement_Requester);
        $('#' + ShiftManagementDepartmentConfig.Container + ' #departmentTHDept').text(Res.shiftManagement_Department);
        $('#' + ShiftManagementDepartmentConfig.Container + ' #locationTHDept').text(Res.shiftManagement_Location);
        $('#' + ShiftManagementDepartmentConfig.Container + ' #monthDept').text(Res.shiftManagement_Month);
        $('#' + ShiftManagementDepartmentConfig.Container + ' #yearDept').text(Res.shiftManagement_Year);
        $('#' + ShiftManagementDepartmentConfig.Container + ' #approverDept').text(Res.shiftManagement_Approver);
        $('#' + ShiftManagementDepartmentConfig.Container + ' #actionDept').text(Res.shiftManagement_ViewTitle);
        $('#' + ShiftManagementDepartmentConfig.Container + ' .label-success').text(Res.approvalStatus_Approved);
        $('#' + ShiftManagementDepartmentConfig.Container + ' .label-default').text(Res.approvalStatus_InProgress);
    }
    function shiftManagementDepartmentCustomItem(ctx) {
        var tr = "";
        var Requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab3';
        sourceURL = encodeURIComponent(sourceURL);

        var edit = '<span><a  href="/SitePages/ShiftRequest.aspx?subSection=ShiftManagement&itemid=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="table-action" style="margin-left: 10px;"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a></span>';
        var view = '<span><a  href="/SitePages/ShiftRequest.aspx?subSection=ShiftManagement&itemid=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '&mode=view"   class="table-action"><i class="fa fa-eye" aria-hidden="true"></i></a></span>';
        var action = "<td>" + view + "</td>";
        var Month = '<td> ' + ctx.CurrentItem.CommonMonth + '</td>';
        var yearValue = ctx.CurrentItem.CommonYear.replace('.', '');
        yearValue = yearValue.replace(',', '');
        var Year = '<td> ' + yearValue + '</td>';
        var Department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var location = '<td> ' + ctx.CurrentItem.CommonLocation[0].lookupValue + '</td>';
        var approverValue = !!ctx.CurrentItem.CommonApprover1 ? ctx.CurrentItem.CommonApprover1[0].title : '';
        var Approver = '<td> ' + approverValue + '</td>';
        
        tr = "<tr>" + Requester + Department + location + Month + Year + Approver + action + "</tr>";

        return tr;
    }
    function shiftManagementDepartmentPagingControl(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();

var MyShiftConfig = {
    TimeShift_ListTitle: 'Shift Time',
    ListResourceFileName: "RBVHStadaLists",
    ShiftTimeList: [],
    PageResourceFileName: "RBVHStadaWebpages",
    LeavesByEmployee: window.location.protocol + '//{0}/_vti_bin/Services/leavemanagement/leavemanagementservice.svc/GetLeavesInRange/{1}/{2}/{3}/{4}/{5}', // {employeeID}/{departmentID}/{locationID}/{fromDate}/{toDate},
    CalendarList: window.location.protocol + '//{0}/_vti_bin/Services/Calendar/CalendarService.svc/GetHolidayInRange/{1}/{2}',
    LeaveArray: [],
    NonWorkingDays: [],
    DaysInMonth: 31,
    ISODateFormat: '{0}-{1}-{2}',
};
(function () {

    var overrideMyShiftCtx = {};
    overrideMyShiftCtx.Templates = {};
    overrideMyShiftCtx.Templates.Item = myShiftCustomItem;
    overrideMyShiftCtx.OnPreRender = function (ctx) {
        GetNonWorkingDays();
        ShiftTimeList();
        $('.ms-menutoolbar').hide();

        // LEAVE popup
        var delay = 1000, setTimeoutConst;
        $(document)
            .on('mouseover', 'td.jsgrid-cell-all-day, td.jsgrid-cell-half-day', function (e) {
                var currentRow = $(this);
                setTimeoutConst = setTimeout(function () {
                    var leaveUrl = currentRow.attr("data-leave-url");
                    $("#leave-link").attr("href", leaveUrl);

                    $("#leave-dialog").dialog();

                    $('#leave-link').off('click').on('click', function () {
                        var itemURL = $(this).attr('href');
                        window.open(itemURL, "_blank");
                        setTimeout(function () {
                            $("#leave-dialog").dialog('close');
                        }, 1000);

                        return false;
                    });

                    return false;
                }, delay);
            })
            .on('mouseout', 'td.jsgrid-cell-all-day, td.jsgrid-cell-half-day', function (e) {
                clearTimeout(setTimeoutConst);
            });
    };
    
    overrideMyShiftCtx.ListTemplateType = 100;
    overrideMyShiftCtx.Templates.Header = renderHeader;
    overrideMyShiftCtx.Templates.Footer = pagingControl;
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideMyShiftCtx);
})();

function GetNonWorkingDays()
{
    // Get Non-working days:
    var currentMonth = RBVH.Stada.WebPages.Utilities.GetValueByParam('MyMonth');
    var currentYear = RBVH.Stada.WebPages.Utilities.GetValueByParam('MyYear');

    var startMonth = currentMonth - 1;
    var startYear = currentYear;
    if (currentMonth == 1) {
        startMonth = 12;
        startYear = currentYear - 1;
    }

    MyShiftConfig.DaysInMonth = new Date(currentYear, currentMonth - 1, 0).getDate();

    var startDate = RBVH.Stada.WebPages.Utilities.String.format(MyShiftConfig.ISODateFormat, startMonth, '21', startYear);

    var nextYear = currentYear;
    var nextMonth = currentMonth;// + 1;

    var endDate = RBVH.Stada.WebPages.Utilities.String.format(MyShiftConfig.ISODateFormat, nextMonth, '20', nextYear);

    var nonWorkingDaysURL = RBVH.Stada.WebPages.Utilities.String.format(MyShiftConfig.CalendarList, location.host, startDate, endDate);

    var locationId = 2;
    var locationName = 'NM2';
    var employeeId = '';
    var departmentId = '';

    if (_rbvhContext && _rbvhContext.EmployeeInfo)
    {
        locationId = _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        locationName = _rbvhContext.EmployeeInfo.FactoryLocation.LookupValue;
        employeeId = _rbvhContext.EmployeeInfo.ID;
        departmentId = _rbvhContext.EmployeeInfo.Department.LookupId;
        locationId = _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
    }

    nonWorkingDaysURL = nonWorkingDaysURL + '/' + locationId;

    var leaveByEmployeeURL = RBVH.Stada.WebPages.Utilities.String.format(MyShiftConfig.LeavesByEmployee, location.host, employeeId, departmentId, locationId, startDate, endDate);

    $.ajax({
        type: "GET",
        url: nonWorkingDaysURL,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (result) {
            MyShiftConfig.NonWorkingDays = [];
            MyShiftConfig.NonWorkingDays = result.filter(function (item) {
                return item.Location == locationName;
            }).map(function (obj) { return obj.Day; });
        }
    });

    $.ajax({
        type: "GET",
        url: leaveByEmployeeURL,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (result) {
            if (result) {
                MyShiftConfig.LeaveArray = result;
            }
        }
    });
}

function GenerateTD(ctx, i)
{
    var cellCSS = ' jsgrid-cell jsgrid-align-center ';
    var cellValue = '';

    // LEAVE
    var leaveInfo = null;
    var leaveCSS = '';
    var leaveUrl = '';

    leaveInfo = $.grep(MyShiftConfig.LeaveArray, function (e) { return (e.Day == i && $.inArray(i, MyShiftConfig.NonWorkingDays) < 0); });
    if (leaveInfo.length == 1) {
        leaveCSS = ' jsgrid-cell-half-day ';
        if (leaveInfo[0].AllDay == true) {
            leaveCSS = ' jsgrid-cell-all-day shift-time-valid ';
            cellValue = 'P'; // TODO: MUST load from SHIFT
        }
        leaveUrl = leaveInfo[0].ItemUrl;
    }

    if (ctx.CurrentItem['ShiftTime' + i] == '') {
    }
    else {
        var index = ctx.CurrentItem['ShiftTime' + i][0].lookupId - 1;
        var code = '';
        if (MyShiftConfig.ShiftTimeList[index] != null) {
            code = MyShiftConfig.ShiftTimeList[index].Code;
        }

        cellValue = cellValue != '' ? cellValue : code;
        var isApproved = ctx.CurrentItem['ShiftTime' + i + 'Approval'];
        if (isApproved == "Yes" || isApproved == "Có") {
            cellCSS = cellCSS + ' shift-time-valid '
        }
    }

    return "<td class='" + cellCSS + leaveCSS + "' data-leave-url='" + leaveUrl + "'>" + cellValue + "</td>";
}

function myShiftCustomItem(ctx) {
    var tr = "<tr>";
    var td = '';

    for (i = 21; i <= MyShiftConfig.DaysInMonth; i++) {
        td = GenerateTD(ctx, i);
        tr = tr + td;
    }
    for (i = 1; i <= 20; i++) {
        td = GenerateTD(ctx, i);
        tr = tr + td;
    }
    tr = tr + "</tr>";
    return tr;
}
function renderHeader(ctx) {
    var header = '';

    for (i = 21; i <= MyShiftConfig.DaysInMonth; i++) {
        header = header + '<th class="jsgrid-header-cell jsgrid-align-center">' + i + '</th>';
    }
    for (i = 1; i <= 20; i++) {
        header = header + '<th class="jsgrid-header-cell jsgrid-align-center">' + i + '</th>';
    }
    header = "<div class='col-md-12' style='padding-left: 0px;'><table class='table table-bordered' id='myshift'><thead><tr>" + header + "</tr></thead><tbody>";
    return header;
}

function pagingControl(ctx) {
    return ViewUtilities.Paging.InstanceHtml(ctx);
}
function ShiftTimeList() {
    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + String(MyShiftConfig.TimeShift_ListTitle) + "')/items";
    var d = $.Deferred();
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            // Returning the results
            MyShiftConfig.ShiftTimeList = data.d.results;
            d.resolve(data.d.results);
        },
        error: function (data) {
            status = 'failed';
        }
    });
    return d.promise();

}
(function () {
    var shiftTimeFormContext = {};
    shiftTimeFormContext.Templates = {};
    shiftTimeFormContext.OnPostRender = shiftTimeFormOnPostRender;
    shiftTimeFormContext.Templates.Fields = {
        "ShiftTimeWorkingHourFrom": {
            "DisplayForm": hideDatePicker
        },
        "ShiftTimeWorkingHourTo": {
            "DisplayForm": hideDatePicker
        },
        "ShiftTimeWorkingHourMid": {
            "DisplayForm": hideDatePicker
        },
        "ShiftTimeBreakingHourFrom": {
            "DisplayForm": hideDatePicker
        },
        "ShiftTimeBreakingHourTo": {
            "DisplayForm": hideDatePicker
        }
    };
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(shiftTimeFormContext);
})();

function shiftTimeFormOnPostRender(ctx) {
    hideShiftTimeDatePicker(ctx);
}

function hideDatePicker(ctx) {
    //common function in CommForm.js
    return Functions.hideDatePickerDisplayForm(ctx);
}

function hideShiftTimeDatePicker(ctx) {
    var datePickers = ["ShiftTimeWorkingHourFrom", "ShiftTimeWorkingHourTo", "ShiftTimeWorkingHourMid", "ShiftTimeBreakingHourFrom", "ShiftTimeBreakingHourTo"];
    //common function in CommForm.js
    Functions.hideDatePartInDatetimePicker(datePickers);
}