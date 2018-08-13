(function () {
    var OvertimeApprovalConfig = {
        ShiftManagement_Department: "Department",
        ShiftManagement_Requester: "Requester",
        ShiftManagement_Time: "Date",
        ApprovalStatusFieldDisplayName: "Approval Status",
        CreatedDate: "Created Date",
        Overtime_Location: 'Place',
        Locale: '',
        ListResourceFileName: "RBVHStadaLists",
        Container: "overtime-approval-list-container"
    };
    (function () {
        var overrideOvertimeApprovalCtx = {};
        overrideOvertimeApprovalCtx.Templates = {};
        overrideOvertimeApprovalCtx.Templates.Item = OvertimeApproveCustomItem;
        overrideOvertimeApprovalCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideOvertimeApprovalCtx.BaseViewID = 2;
        overrideOvertimeApprovalCtx.OnPostRender = PostRender_OvertimeApproval;
        overrideOvertimeApprovalCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='title-approval-header'>Title</th>" +
        "<th id='requester-approval-header'>" + OvertimeApprovalConfig.ShiftManagement_Requester + "</th>" +
        "<th id='department-approval-header'>" + OvertimeApprovalConfig.ShiftManagement_Department + "</th>" +
         "<th id='location-approval-header'>" + OvertimeApprovalConfig.Overtime_Location + "</th>" +
        "<th id='time-approval-header'>" + OvertimeApprovalConfig.ShiftManagement_Time + "</th>" +
        "<th id='approvalStatus-approval-header'>" + OvertimeApprovalConfig.ApprovalStatusFieldDisplayName + "</th>" +
        "<th id='createdDate-approval-header'>" + OvertimeApprovalConfig.CreatedDate + "</th>" +
        "<tr></thead><tbody>";
        overrideOvertimeApprovalCtx.Templates.Footer = pagingControl;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideOvertimeApprovalCtx);
    })();
    function PostRender_OvertimeApproval(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            OvertimeApprovalConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(OvertimeApprovalConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + OvertimeApprovalConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(OvertimeApprovalConfig.ListResourceFileName, "Res", OnListResourcesReady);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + OvertimeApprovalConfig.Container + ' .department-locale').each(function () {
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
    function OnListResourcesReady() {
        $('#' + OvertimeApprovalConfig.Container + ' #title-approval-header').text(Res.shiftManagement_Title);
        $('#' + OvertimeApprovalConfig.Container + ' #requester-approval-header').text(Res.shiftManagement_Requester);
        $('#' + OvertimeApprovalConfig.Container + ' #department-approval-header').text(Res.shiftManagement_Department);
        $('#' + OvertimeApprovalConfig.Container + ' #location-approval-header').text(Res.overtime_Location);
        $('#' + OvertimeApprovalConfig.Container + ' #time-approval-header').text(Res.shiftManagement_Time);
        $('#' + OvertimeApprovalConfig.Container + ' #approvalStatus-approval-header').text(Res.approvalStatusFieldDisplayName);
        $('#' + OvertimeApprovalConfig.Container + ' #createdDate-approval-header').text(Res.createdDate);
        $('#' + OvertimeApprovalConfig.Container + ' .viewDetail').text(Res.shiftManagement_ViewDetail);
        $('#' + OvertimeApprovalConfig.Container + ' .label-success').text(Res.approvalStatus_Approved);
        $('#' + OvertimeApprovalConfig.Container + ' .label-danger').text(Res.approvalStatus_Rejected);
        $('#' + OvertimeApprovalConfig.Container + ' .label-default').text(Res.approvalStatus_InProgress);
    }
    function OvertimeApproveCustomItem(ctx) {
        var tr = "";
        var status = ctx.CurrentItem.ApprovalStatus;
        var Requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab2';
        sourceURL = encodeURIComponent(sourceURL);

        var Title = '<td><a  href="/SitePages/OverTimeApproval.aspx?subSection=OvertimeManagement&itemid=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + (status == 'true' ? '&mode=view' : '') + '"   class="viewDetail" \>View Detail</a></td>';
        var Date = '<td> ' + ctx.CurrentItem.CommonDate + '</td>';
        var Department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var Location = '<td>' + ctx.CurrentItem.CommonLocation[0].lookupValue + '</td>';
        var createdDate = '<td>' + ctx.CurrentItem.Created + '</td>';

        if (status == 'true') {
            status = '<td><span class="label label-success">Approved</span></td>';
        }
        else if (status == 'false') {
            status = '<td><span class="label label-danger">Rejected</span></td>';
        }
        else {
            status = '<td><span class="label label-default">In-Progress</span></td>';
        }
        tr = "<tr>" + Title + Requester + Department + Location + Date + status + createdDate + "</tr>";
        return tr;
    }
    function pagingControl(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();
(function () {
    var OvertimeRequestManagementConfig = {
        ShiftManagement_Department: "Department",
        ShiftManagement_Requester: "Requester",
        ShiftManagement_Time: "Date",
        ShiftManagement_EditTitle: "Edit",
        ShiftManagement_ViewTitle: "View",
        ApprovalStatusFieldDisplayName: "Approval Status",
        CreatedDate: "Created Date",
        Overtime_Location: 'Place',
        List_Title: 'Overtime Management',
        Locale: '',
        ListResourceFileName: "RBVHStadaLists",
        Container: "overtime-request-list-container"
    };
    (function () {
        var overrideCtx = {};
        overrideCtx.Templates = {};
        overrideCtx.BaseViewID = 4;
        overrideCtx.Templates.Item = OvertimeManagementCustomItem;
        overrideCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCtx.OnPostRender = PostRender_OvertimeRequest;
        overrideCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='requesterTH'>" + OvertimeRequestManagementConfig.ShiftManagement_Requester + "</th>" +
        "<th id='departmentTH'>" + OvertimeRequestManagementConfig.ShiftManagement_Department + "</th>" +
        "<th id='location'>" + OvertimeRequestManagementConfig.Overtime_Location + "</th>" +
        "<th id='time'>" + OvertimeRequestManagementConfig.ShiftManagement_Time + "</th>" +
        "<th id='approvalStatus'>" + OvertimeRequestManagementConfig.ApprovalStatusFieldDisplayName + "</th>" +
        "<th id='createdDate'>" + OvertimeRequestManagementConfig.CreatedDate + "</th>" +
        "<th id='action'>" + OvertimeRequestManagementConfig.ShiftManagement_EditTitle + " | " + OvertimeRequestManagementConfig.ShiftManagement_ViewTitle + "</th>" +
        "</tr></thead><tbody>";
        overrideCtx.Templates.Footer = pagingControl;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
    })();
    function PostRender_OvertimeRequest(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            OvertimeRequestManagementConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(OvertimeRequestManagementConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + OvertimeRequestManagementConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(OvertimeRequestManagementConfig.ListResourceFileName, "Res", OnListResourcesReady);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + OvertimeRequestManagementConfig.Container + ' .department-locale').each(function () {
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
    function OnListResourcesReady() {
        $('#' + OvertimeRequestManagementConfig.Container + ' #departmentTH').text(Res.shiftManagement_Department);
        $('#' + OvertimeRequestManagementConfig.Container + ' #requesterTH').text(Res.shiftManagement_Requester);
        $('#' + OvertimeRequestManagementConfig.Container + ' #time').text(Res.shiftManagement_Time);
        $('#' + OvertimeRequestManagementConfig.Container + ' #action').text(Res.shiftManagement_EditTitle + " | " + Res.shiftManagement_ViewTitle);
        $('#' + OvertimeRequestManagementConfig.Container + ' #approvalStatus').text(Res.approvalStatusFieldDisplayName);
        $('#' + OvertimeRequestManagementConfig.Container + ' #location').text(Res.overtime_Location);
        $('#' + OvertimeRequestManagementConfig.Container + ' .label-success').text(Res.approvalStatus_Approved);
        $('#' + OvertimeRequestManagementConfig.Container + ' .label-danger').text(Res.approvalStatus_Rejected);
        $('#' + OvertimeRequestManagementConfig.Container + ' .label-default').text(Res.approvalStatus_InProgress);
        $('#' + OvertimeRequestManagementConfig.Container + ' #createdDate').text(Res.createdDate);
    }
    function OvertimeManagementCustomItem(ctx) {
        var tr = "";
        var Requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += "#tab2";
        sourceURL = encodeURIComponent(sourceURL);

        var edit = '<span><a  href="/SitePages/OvertimeRequest.aspx?subSection=OvertimeManagement&itemid=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="table-action" style="margin-left: 10px;"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a></span>';
        var view = '<span><a  href="/SitePages/OvertimeRequest.aspx?subSection=OvertimeManagement&itemid=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '&mode=view"   class="table-action" ><i class="fa fa-eye" aria-hidden="true"></i></a></span>';
        var Date = '<td> ' + ctx.CurrentItem.CommonDate + '</td>';
        var Department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var Location = '<td>' + ctx.CurrentItem.CommonLocation[0].lookupValue + '</td>';
        var status = ctx.CurrentItem.ApprovalStatus;
        var report = ''
        if (status == 'true') {
            edit = '<span><a class="table-action" style="margin-left: 10px;"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a></span>';
            report = getAttachments(OvertimeRequestManagementConfig.List_Title, ctx.CurrentItem.ID)
            status = '<td><span class="label label-success">Approved</span></td>';

        }
        else if (status == 'false') {
            edit = '<span><a class="table-action" style="margin-left: 10px;"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a></span>';
            status = '<td><span class="label label-danger">Rejected</span></td>';
        }
        else {
            status = '<td><span class="label label-default">In-Progress</span></td>';
        }
        var action = "<td>" + edit + view + report + "</td>";
        var createdDate = "<td>" + ctx.CurrentItem.Created + "</td>";
        tr = "<tr>" + Requester + Department + Location + Date + status + createdDate + action + "</tr>";

        return tr;
    }
    function pagingControl(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
    function getAttachments(listName, itemId) {
        var url = _spPageContextInfo.webAbsoluteUrl;
        var requestUri = url + "/_api/web/lists/getbytitle('" + listName + "')/items(" + itemId + ")/AttachmentFiles";
        var str = "";
        $.ajax({
            url: requestUri,
            type: "GET",
            headers: { "ACCEPT": "application/json;odata=verbose" },
            async: false,
            success: function (data) {
                for (var i = 0; i < data.d.results.length; i++) {
                    str += "<a target='_blank' href='" + data.d.results[i].ServerRelativeUrl + "'>" +
                            "<img border='0' width='16' src='/_layouts/15/images/attach16.png?rev=23'></a>";
                    if (i != data.d.results.length - 1) {
                        str += "<br/>";
                    }
                }
            },
            error: function (err) {
            }
        });
        return str;
    }
})();
(function () {
    var MyOvertimeConfig = {
        OvertimeDetail_OvertimeHourFrom: "Overtime Hour From",
        OvertimeDetail_OvertimeHourTo: "Overtime Hour To",
        OvertimeDetail_WorkingHour: "Working Hour(s)",
        OvertimeDetail_Task: "Work Content",
        OvertimeDetail_TransportAtHM: "Company Transport HM",
        OvertimeDetail_TransportAtKD: "Company Transport KD",
        OvertimeDetail_CompanyTransport: "Company Transport",
        ApprovalStatusFieldDisplayName: "Approval Status",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        ViewDetail: "View item detail",
        Container: "my-overtime-container"
    };
    (function () {
        var overrideCtx = {};
        overrideCtx.Templates = {};
        overrideCtx.BaseViewID = 1;
        overrideCtx.Templates.Item = MyOvertimeCustomItem;
        overrideCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCtx.OnPostRender = OnPostRender;
        overrideCtx.Templates.Header = "<div class='col-md-12'><table class='table'><thead>" +
        "<th id='OvertimeHourFrom'>" + MyOvertimeConfig.OvertimeDetail_OvertimeHourFrom + "</th>" +
         "<th id='OvertimeHourTo'>" + MyOvertimeConfig.OvertimeDetail_OvertimeHourTo + "</th>" +
        "<th id='OvertimeDetail_WorkingHour'>" + MyOvertimeConfig.OvertimeDetail_WorkingHour + "</th>" +
        "<th id='OvertimeDetail_Task'>" + MyOvertimeConfig.OvertimeDetail_Task + "</th>" +
        "<th id='OvertimeDetail_CompanyTransport'>" + MyOvertimeConfig.OvertimeDetail_CompanyTransport + "</th>" +
        "<th id='myovertime_approvalStatus'>" + MyOvertimeConfig.ApprovalStatusFieldDisplayName + "</th>" +
        "</tr></thead><tbody>";
        overrideCtx.Templates.Footer = pagingControl;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
    })();

    function openDialogBox(Url) {
        var ModalDialogOptions = { url: Url, width: 800, height: 400, showClose: true, allowMaximize: false, title: MyOvertimeConfig.ViewDetail };
        SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', ModalDialogOptions);
    }
    function OnPostRender(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            SP.SOD.registerSod(MyOvertimeConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + MyOvertimeConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(MyOvertimeConfig.ListResourceFileName, "Res", OnListResourcesReady);
            SP.SOD.registerSod(MyOvertimeConfig.PageResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + MyOvertimeConfig.PageResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(MyOvertimeConfig.PageResourceFileName, "Res", OnPageResourcesReady);
        }, "strings.js");

        $('.viewDetail').click(function () {
            url = $(this).attr('data-url');
            openDialogBox(url);
        });
    }
    function OnListResourcesReady() {
        $('#' + MyOvertimeConfig.Container + ' #OvertimeHourFrom').text(Res.overtimeDetail_OvertimeHourFrom);
        $('#' + MyOvertimeConfig.Container + ' #OvertimeHourTo').text(Res.overtimeDetail_OvertimeHourTo);
        $('#' + MyOvertimeConfig.Container + ' #OvertimeDetail_Task').text(Res.overtimeDetail_Task);
        $('#' + MyOvertimeConfig.Container + ' #myovertime_approvalStatus').text(Res.approvalStatusFieldDisplayName);
        $('#' + MyOvertimeConfig.Container + ' #OvertimeDetail_WorkingHour').text(Res.overtimeDetail_WorkingHour);
        $('#' + MyOvertimeConfig.Container + ' #OvertimeDetail_CompanyTransport').text(Res.overtimeDetail_CompanyTransport);
        $('#' + MyOvertimeConfig.Container + ' .viewDetail').text(Res.overtimeDetail_ViewDetail);
        $('#' + MyOvertimeConfig.Container + ' .label-success').text(Res.approvalStatus_Approved);
        $('#' + MyOvertimeConfig.Container + ' .label-default').text(Res.approvalStatus_InProgress);
        $('#' + MyOvertimeConfig.Container + ' .label-danger').text(Res.approvalStatus_Rejected);
    }
    function OnPageResourcesReady()
    {
        MyOvertimeConfig.ViewDetail = Res.viewDetail;
    }
    function MyOvertimeCustomItem(ctx) {
        var tr = "";
        var OvertimeHourFrom = '<td>' + ctx.CurrentItem.OvertimeFrom + '</td>';
        var OvertimeHourTo = '<td> ' + ctx.CurrentItem.OvertimeTo + '</td>';
        var viewDetail = "";
        if (ctx.CurrentItem.SummaryLinks != null && ctx.CurrentItem.SummaryLinks != '') {
            viewDetail = "- <a class='viewDetail' href='#' data-url='" + ctx.CurrentItem.SummaryLinks + "' >View Detail<a>"
        }
        var Task = '<td>' + ctx.CurrentItem.Task + ' ' + viewDetail + '</td>';
        var CompanyTransport = '<td>' + ctx.CurrentItem.CompanyTransport + '</td>';
        var WorkingHour = '<td>' + ctx.CurrentItem.WorkingHours + '</td>';
        var status = ctx.CurrentItem.ApprovalStatus;
        if (status == 'true') {
            status = '<td><span class="label label-success">Approved</span></td>';
        }
        else if (status == 'false') {
            status = '<td><span class="label label-danger">Rejected</span></td>';
        }
        else {
            status = '<td><span class="label label-default">In-Progress</span></td>';
        }
        tr = "<tr>" + OvertimeHourFrom + OvertimeHourTo + WorkingHour + Task + CompanyTransport + status + "</tr>";

        return tr;
    }
    function pagingControl(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();
(function () {
    var OvertimeDepartmentConfig = {
        ShiftManagement_Department: "Department",
        ShiftManagement_Requester: "Requester",
        ShiftManagement_Time: "Date",
        ApprovalStatusFieldDisplayName: "Approval Status",
        CreatedDate: "Created Date",
        Overtime_Location: 'Place',
        Locale: '',
        ListResourceFileName: "RBVHStadaLists",
        Container: "overtime-by-department-list-container"
    };
    (function () {
        var overrideCtx = {};
        overrideCtx.Templates = {};
        overrideCtx.Templates.Item = CustomItem;
        overrideCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCtx.BaseViewID = 3;
        overrideCtx.OnPostRender = PostRender_OvertimeByDepartment;
        overrideCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='overtime-bydep-title-header'>Title</th>" +
        "<th id='overtime-bydep-requester-header'>" + OvertimeDepartmentConfig.ShiftManagement_Requester + "</th>" +
        "<th id='overtime-bydep-department-header'>" + OvertimeDepartmentConfig.ShiftManagement_Department + "</th>" +
         "<th id='overtime-bydep-location-header'>" + OvertimeDepartmentConfig.Overtime_Location + "</th>" +
        "<th id='overtime-bydep-time-header'>" + OvertimeDepartmentConfig.ShiftManagement_Time + "</th>" +
        "<th id='overtime-bydep-approvalStatus-header'>" + OvertimeDepartmentConfig.ApprovalStatusFieldDisplayName + "</th>" +
        "<th id='overtime-bydep-createdDate-header'>" + OvertimeDepartmentConfig.CreatedDate + "</th>" +
        "<tr></thead><tbody>";
        overrideCtx.Templates.Footer = pagingControl;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
    })();
    function PostRender_OvertimeByDepartment(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            OvertimeDepartmentConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(OvertimeDepartmentConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + OvertimeDepartmentConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(OvertimeDepartmentConfig.ListResourceFileName, "Res", OnListResourcesReady);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + OvertimeDepartmentConfig.Container + ' .department-locale').each(function () {
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
    function OnListResourcesReady() {
        $('#' + OvertimeDepartmentConfig.Container + ' #overtime-bydep-department-header').text(Res.shiftManagement_Department);
        $('#' + OvertimeDepartmentConfig.Container + ' #overtime-bydep-requester-header').text(Res.shiftManagement_Requester);
        $('#' + OvertimeDepartmentConfig.Container + ' #overtime-bydep-title-header').text(Res.shiftManagement_Title);
        $('#' + OvertimeDepartmentConfig.Container + ' #overtime-bydep-time-header').text(Res.shiftManagement_Time);
        $('#' + OvertimeDepartmentConfig.Container + ' #overtime-bydep-approvalStatus-header').text(Res.approvalStatusFieldDisplayName);
        $('#' + OvertimeDepartmentConfig.Container + ' #overtime-bydep-location-header').text(Res.overtime_Location);
        $('#' + OvertimeDepartmentConfig.Container + ' .viewDetail').text(Res.shiftManagement_ViewDetail);
        $('#' + OvertimeDepartmentConfig.Container + ' .label-success').text(Res.approvalStatus_Approved);
        $('#' + OvertimeDepartmentConfig.Container + ' .label-danger').text(Res.approvalStatus_Rejected);
        $('#' + OvertimeDepartmentConfig.Container + ' .label-default').text(Res.approvalStatus_InProgress);
        $('#' + OvertimeDepartmentConfig.Container + ' #overtime-bydep-createdDate-header').text(Res.createdDate);
    }
    function CustomItem(ctx) {
        var currentUrl = window.location.href.split('#')[0];
        currentUrl = Functions.removeParam('lang', currentUrl);
        currentUrl += '#tab3';
        currentUrl = encodeURIComponent(currentUrl);

        var tr = "";
        var status = ctx.CurrentItem.ApprovalStatus;
        var Requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var Title = '<td><a  href="/SitePages/OverTimeRequest.aspx?subSection=OvertimeManagement&itemid=' + ctx.CurrentItem.ID + '&mode=view' + '&Source=' + currentUrl + '"   class="viewDetail" \>View Detail</a></td>';
        var Date = '<td> ' + ctx.CurrentItem.CommonDate + '</td>';
        var Department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var Location = '<td>' + ctx.CurrentItem.CommonLocation[0].lookupValue + '</td>';
        var createdDate = '<td>' + ctx.CurrentItem.Created + '</td>';

        if (status == 'true') {
            status = '<td><span class="label label-success">Approved</span></td>';
        }
        else if (status == 'false') {
            status = '<td><span class="label label-danger">Rejected</span></td>';
        }
        else {
            status = '<td><span class="label label-default">In-Progress</span></td>';
        }
        tr = "<tr>" + Title + Requester + Department + Location + Date + status + createdDate + "</tr>";
        return tr;
    }
    function pagingControl(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();