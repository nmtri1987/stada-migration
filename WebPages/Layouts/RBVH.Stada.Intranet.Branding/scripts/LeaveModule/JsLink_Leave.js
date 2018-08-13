(function () {
    var LeaveHistoryConfig = {
        LeaveManagement_ViewDetail: "View Detail",
        LeaveManagement_Requester: "Requester",
        LeaveManagement_RequestFor: "Request for",
        LeaveManagement_Department: "Department",
        LeaveManagement_From: "From",
        LeaveManagement_To: "To",
        LeaveManagement_Reason: "Reason",
        LeaveManagement_LeaveHours: "Leave Hours",
        LeaveManagement_IsValid: "Is Valid",
        LeaveManagement_UnexpectedLeave: "Unexpected leave",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        Container: "leave-history-list-container",
    };
    (function () {
        var overrideCSRDepartmentCtx = {};
        overrideCSRDepartmentCtx.Templates = {};
        overrideCSRDepartmentCtx.Templates.Item = CustomItem_LeaveHistory;
        overrideCSRDepartmentCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCSRDepartmentCtx.ListTemplateType = 10004;
        overrideCSRDepartmentCtx.BaseViewID = 5;
        overrideCSRDepartmentCtx.OnPostRender = PostRender_LeaveHistory;
        overrideCSRDepartmentCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='requester_leaveHistory'>" + LeaveHistoryConfig.LeaveManagement_Requester + "</th>" +
            "<th id='requestFor_leaveHistory'>" + LeaveHistoryConfig.LeaveManagement_RequestFor + "</th>" +
            "<th id='department_leaveHistory'>" + LeaveHistoryConfig.LeaveManagement_Department + "</th>" +
            "<th id='from_leaveHistory'>" + LeaveHistoryConfig.LeaveManagement_From + "</th>" +
            "<th id='to_leaveHistory'>" + LeaveHistoryConfig.LeaveManagement_To + "</th>" +
            "<th id='leaveHours_leaveHistory'>" + LeaveHistoryConfig.LeaveManagement_LeaveHours + "</th>" +
            "<th id='reason_leaveHistory'>" + LeaveHistoryConfig.LeaveManagement_Reason + "</th>" +
            "<th id='unexpected_leaveHistory'>" + LeaveHistoryConfig.LeaveManagement_UnexpectedLeave + "</th>" +
            "<th id='isValid_leaveHistory'>" + LeaveHistoryConfig.LeaveManagement_IsValid + "</th>" +
            "<th></th>" +
        "</tr></thead><tbody>";
        overrideCSRDepartmentCtx.Templates.Footer = CreateFooter;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCSRDepartmentCtx);
    })();
    function CreateFooter(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
    function PostRender_LeaveHistory(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            LeaveHistoryConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(LeaveHistoryConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + LeaveHistoryConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(LeaveHistoryConfig.ListResourceFileName, "Res", OnListResourcesReady_LeaveHistory);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + LeaveHistoryConfig.Container + ' .department-locale').each(function () {
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
    function OnListResourcesReady_LeaveHistory() {
        $('#requester_leaveHistory').text(Res.leaveList_Requester);
        $('#requestFor_leaveHistory').text(Res.leaveList_RequestFor);
        $('#department_leaveHistory').text(Res.leaveList_Department);
        $('#from_leaveHistory').text(Res.leaveList_From);
        $('#to_leaveHistory').text(Res.leaveList_To);
        $('#reason_leaveHistory').text(Res.leaveList_Reason);
        $('#unexpected_leaveHistory').text(Res.leaveList_UnexpectedLeave);
        $('#isValid_leaveHistory').text(Res.leaveList_IsValidRequest);
        $('#leaveHours_leaveHistory').text(Res.leaveList_LeaveHours);
    }
    function pad(n) {
        return (n < 10) ? ("0" + n) : n;
    }
    function CustomItem_LeaveHistory(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var requestFor = '<td>' + ctx.CurrentItem.RequestFor[0].lookupValue + '</td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var from = '<td>' + ctx.CurrentItem.CommonFrom + '</td>';
        var to = '<td>' + ctx.CurrentItem.To + '</td>';
        var leaveHours = '<td>' + ctx.CurrentItem.LeaveHours + '</td>';
        var reason = '<td>' + ctx.CurrentItem.Reason + '</td>';

        //-------------
        var unexpectedLeave = "";
        if (ctx.CurrentItem["UnexpectedLeave.value"] && ctx.CurrentItem["UnexpectedLeave.value"] === "1") {
            unexpectedLeave = "<span class='glyphicon glyphicon-ok leavemanagement-item-ok'>";
        }
        var unexpectedLeave = '<td>' + unexpectedLeave + '</td>';
        //-------------
        var isRequestValidCss = "";
        var isRequestValidTh = "";
        if (ctx.CurrentItem["IsValidRequest.value"] && ctx.CurrentItem["IsValidRequest.value"] === "1") {
            isRequestValidTh = "<td><span style='margin-left:25%; ' class='glyphicon glyphicon-ok'></td>";
        }
        else {
            isRequestValidTh = "<td><span style='margin-left:25%;' class='glyphicon glyphicon-remove'></td>";
            isRequestValidCss = "style='background-color: #fff7e6;'";
        }

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab3';
        sourceURL = encodeURIComponent(sourceURL);

        tr = "<tr>" + requester + requestFor + department + from + to + leaveHours + reason + unexpectedLeave + isRequestValidTh + "</tr>";
        return tr;
    }
})();
(function () {
    var LeaveRequestApprovalConfig = {
        LeaveManagement_ViewDetail: "View Detail",
        LeaveManagement_Requester: "Requester",
        LeaveManagement_RequestFor: "Request for",
        LeaveManagement_Department: "Department",
        LeaveManagement_From: "From",
        LeaveManagement_To: "To",
        LeaveManagement_LeaveHours: "Leave Hours",
        LeaveManagement_ApprovalStatus: "Approval Status",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        Container: "leave-approval-list-container",
    };

    (function () {
        var overrideCSRDepartmentCtx = {};
        overrideCSRDepartmentCtx.Templates = {};
        overrideCSRDepartmentCtx.Templates.Item = CustomItem_LeaveDepartment;
        overrideCSRDepartmentCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCSRDepartmentCtx.ListTemplateType = 10004;
        overrideCSRDepartmentCtx.BaseViewID = 3;
        overrideCSRDepartmentCtx.OnPostRender = PostRender_LeaveDepartment;
        overrideCSRDepartmentCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='leave_approval_viewDetail'>" + LeaveRequestApprovalConfig.LeaveManagement_ViewDetail + "</th>" +
            "<th id='leaveapproval_requester'>" + LeaveRequestApprovalConfig.LeaveManagement_Requester + "</th>" +
            "<th id='leaveapproval_requestFor'>" + LeaveRequestApprovalConfig.LeaveManagement_RequestFor + "</th>" +
            "<th id='leaveapproval_department'>" + LeaveRequestApprovalConfig.LeaveManagement_Department + "</th>" +
            "<th id='leaveapproval_from'>" + LeaveRequestApprovalConfig.LeaveManagement_From + "</th>" +
            "<th id='leaveapproval_to'>" + LeaveRequestApprovalConfig.LeaveManagement_To + "</th>" +
            "<th id='leaveapproval_leaveHours'>" + LeaveRequestApprovalConfig.LeaveManagement_LeaveHours + "</th>" +
            "<th id='leaveapproval_approvalStatus'>" + LeaveRequestApprovalConfig.LeaveManagement_ApprovalStatus + "</th>" +
            "<th></th>" +
        "</tr></thead><tbody>";
        overrideCSRDepartmentCtx.Templates.Footer = CreateFooter;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCSRDepartmentCtx);
    })();
    function CreateFooter(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
    function PostRender_LeaveDepartment(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            LeaveRequestApprovalConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(LeaveRequestApprovalConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + LeaveRequestApprovalConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(LeaveRequestApprovalConfig.ListResourceFileName, "Res", OnListResourcesReady_LeaveDepartment);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + LeaveRequestApprovalConfig.Container + ' .department-locale').each(function () {
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
    function OnListResourcesReady_LeaveDepartment() {
        $('#leave_approval_viewDetail').text(Res.leaveList_ViewDetail);
        $('#leaveapproval_requester').text(Res.leaveList_Requester);
        $('#leaveapproval_requestFor').text(Res.leaveList_RequestFor);
        $('#leaveapproval_department').text(Res.leaveList_Department);
        $('#leaveapproval_from').text(Res.leaveList_From);
        $('#leaveapproval_to').text(Res.leaveList_To);
        $('#leaveapproval_leaveHours').text(Res.leaveList_LeaveHours);
        $('#leaveapproval_approvalStatus').text(Res.leaveList_ApprovalStatus);
        $('#' + LeaveRequestApprovalConfig.Container + ' .viewDetail').text(Res.leaveList_ViewDetail);
        $('#' + LeaveRequestApprovalConfig.Container + ' .label-success').text(Res.approvalStatus_Approved);
        $('#' + LeaveRequestApprovalConfig.Container + ' .label-warning').text(Res.approvalStatus_Cancelled);
        $('#' + LeaveRequestApprovalConfig.Container + ' .label-danger').text(Res.approvalStatus_Rejected);
    }
    function pad(n) {
        return (n < 10) ? ("0" + n) : n;
    }
    function CustomItem_LeaveDepartment(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var requestFor = '<td>' + ctx.CurrentItem.RequestFor[0].lookupValue + '</td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var from = '<td>' + ctx.CurrentItem.CommonFrom + '</td>';
        var to = '<td>' + ctx.CurrentItem.To + '</td>';
        var leaveHours = '<td>' + ctx.CurrentItem.LeaveHours + '</td>';
        var status = ctx.CurrentItem.ApprovalStatus + "";

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab2';
        sourceURL = encodeURIComponent(sourceURL);
        var viewDetail = '<td><a href="/SitePages/LeaveRequest.aspx?subSection=LeaveManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

        status = status.toLowerCase();
        var statusVal = '';
        if (status == 'approved') {
            statusVal = '<td><span class="label label-success">Approved</span></td>';
        }
        else if (status == "cancelled") {
            statusVal = '<td><span class="label label-warning">Cancelled</span></td>';
        }
        else if (status == "rejected") {
            statusVal = '<td><span class="label label-danger">Rejected</span></td>';
        }
        else if (status && status.length > 0) {
            statusVal = '<td><span class="label label-default statusmultilang">' + ctx.CurrentItem.ApprovalStatus + '</span></td>';
        }
        else {
            statusVal = '<td><span class="label label-default">In-Progress</span></td>';
        }
        tr = "<tr>" + viewDetail + requester + requestFor + department + from + to + leaveHours + statusVal + "</tr>";
        return tr;
    }
})();
(function () {
    var LeaveRequestByDepartmentConfig = {
        LeaveManagement_ViewDetail: "View Detail",
        LeaveManagement_Requester: "Requester",
        LeaveManagement_RequestFor: "Request for",
        LeaveManagement_Department: "Department",
        LeaveManagement_From: "From",
        LeaveManagement_To: "To",
        Comment: "Comment",
        LeaveManagement_Reason: "Reason",
        LeaveManagement_LeaveHours: "Leave Hours",
        LeaveManagement_IsValid: "Is Valid",
        LeaveManagement_UnexpectedLeave: "Unexpected leave",
        LeaveManagement_ApprovalStatus: "Approval Status",
        ApprovalStatus_Cancelled: 'Cancelled',
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        Container: "leave-dept-list-container",
    };
    (function () {
        var overrideCSRDepartmentCtx = {};
        overrideCSRDepartmentCtx.Templates = {};
        overrideCSRDepartmentCtx.Templates.Item = CustomItem_LeaveDepartment;
        overrideCSRDepartmentCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCSRDepartmentCtx.ListTemplateType = 10004;
        overrideCSRDepartmentCtx.BaseViewID = 4;
        overrideCSRDepartmentCtx.OnPostRender = PostRender_LeaveDepartment;
        overrideCSRDepartmentCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='viewDetail_leaveDept'>" + LeaveRequestByDepartmentConfig.LeaveManagement_ViewDetail + "</th>" +
            "<th id='requester_leaveDept'>" + LeaveRequestByDepartmentConfig.LeaveManagement_Requester + "</th>" +
            "<th id='requestFor_leaveDept'>" + LeaveRequestByDepartmentConfig.LeaveManagement_RequestFor + "</th>" +
            "<th id='department_leaveDept'>" + LeaveRequestByDepartmentConfig.LeaveManagement_Department + "</th>" +
            "<th id='from_leaveDept'>" + LeaveRequestByDepartmentConfig.LeaveManagement_From + "</th>" +
            "<th id='to_leaveDept'>" + LeaveRequestByDepartmentConfig.LeaveManagement_To + "</th>" +
            "<th id='leaveHours_leaveDept'>" + LeaveRequestByDepartmentConfig.LeaveManagement_LeaveHours + "</th>" +
            "<th id='reason_leaveDept'>" + LeaveRequestByDepartmentConfig.LeaveManagement_Reason + "</th>" +
            "<th id='comment_leaveDept'>" + LeaveRequestByDepartmentConfig.Comment + "</th>" +
            "<th id='unexpected_leaveDept'>" + LeaveRequestByDepartmentConfig.LeaveManagement_UnexpectedLeave + "</th>" +
            "<th id='isValid_leaveDept'>" + LeaveRequestByDepartmentConfig.LeaveManagement_IsValid + "</th>" +
            "<th id='approvalStatus_leaveDept'>" + LeaveRequestByDepartmentConfig.LeaveManagement_ApprovalStatus + "</th>" +
            "<th></th>" +
        "</tr></thead><tbody>";
        overrideCSRDepartmentCtx.Templates.Footer = CreateFooter;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCSRDepartmentCtx);
    })();
    function CreateFooter(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
    function PostRender_LeaveDepartment(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            LeaveRequestByDepartmentConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(LeaveRequestByDepartmentConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + LeaveRequestByDepartmentConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(LeaveRequestByDepartmentConfig.ListResourceFileName, "Res", OnListResourcesReady_LeaveDepartment);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + LeaveRequestByDepartmentConfig.Container + ' .department-locale').each(function () {
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
    function OnListResourcesReady_LeaveDepartment() {
        $('#viewDetail_leaveDept').text(Res.leaveList_ViewDetail);
        $('#requester_leaveDept').text(Res.leaveList_Requester);
        $('#requestFor_leaveDept').text(Res.leaveList_RequestFor);
        $('#department_leaveDept').text(Res.leaveList_Department);
        $('#from_leaveDept').text(Res.leaveList_From);
        $('#to_leaveDept').text(Res.leaveList_To);
        $('#reason_leaveDept').text(Res.leaveList_Reason);
        $('#comment_leaveDept').text(Res.commonComment);
        $('#unexpected_leaveDept').text(Res.leaveList_UnexpectedLeave);
        $('#isValid_leaveDept').text(Res.leaveList_IsValidRequest);
        $('#leaveHours_leaveDept').text(Res.leaveList_LeaveHours);
        $('#approvalStatus_leaveDept').text(Res.leaveList_ApprovalStatus);
        $('#' + LeaveRequestByDepartmentConfig.Container + ' .viewDetail').text(Res.leaveList_ViewDetail);
        $('#' + LeaveRequestByDepartmentConfig.Container + ' .label-success').text(Res.approvalStatus_Approved);
        $('#' + LeaveRequestByDepartmentConfig.Container + ' .label-warning').text(Res.approvalStatus_Cancelled);
        LeaveRequestByDepartmentConfig.ApprovalStatus_Cancelled = Res.approvalStatus_Cancelled;
        $('#' + LeaveRequestByDepartmentConfig.Container + ' .label-danger').text(Res.approvalStatus_Rejected);
    }
    function pad(n) {
        return (n < 10) ? ("0" + n) : n;
    }
    function CustomItem_LeaveDepartment(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var requestFor = '<td>' + ctx.CurrentItem.RequestFor[0].lookupValue + '</td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var from = '<td>' + ctx.CurrentItem.CommonFrom + '</td>';
        var to = '<td>' + ctx.CurrentItem.To + '</td>';
        var leaveHours = '<td>' + ctx.CurrentItem.LeaveHours + '</td>';
        var reason = '<td>' + ctx.CurrentItem.Reason + '</td>';
        var comment = ctx.CurrentItem.CommonComment != null ? '<td>' + Functions.parseComment(ctx.CurrentItem.CommonComment) + '</td>' : '<td></td>';
        var status = ctx.CurrentItem.ApprovalStatus + "";

        //-------------
        var unexpectedLeave = "";
        if (ctx.CurrentItem["UnexpectedLeave.value"] && ctx.CurrentItem["UnexpectedLeave.value"] === "1") {
            unexpectedLeave = "<span class='glyphicon glyphicon-ok leavemanagement-item-ok'>";
        }
        var unexpectedLeave = '<td>' + unexpectedLeave + '</td>';
        //-------------
        var isRequestValidCss = "";
        var isRequestValidTh = "";
        if (ctx.CurrentItem["IsValidRequest.value"] && ctx.CurrentItem["IsValidRequest.value"] === "1") {
            isRequestValidTh = "<td><span style='margin-left:25%; ' class='glyphicon glyphicon-ok'></td>";
        }
        else {
            isRequestValidTh = "<td><span style='margin-left:25%;' class='glyphicon glyphicon-remove'></td>";
            isRequestValidCss = "style='background-color: #fff7e6;'";
        }

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab3';
        sourceURL = encodeURIComponent(sourceURL);
        var viewDetail = '<td><a href="/SitePages/LeaveRequest.aspx?subSection=LeaveManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

        status = status.toLowerCase();
        var statusVal = '';
        if (status == 'approved') {
            statusVal = '<td><span class="label label-success">Approved</span></td>';
        }
        else if (status == "cancelled") {
            statusVal = '<td><span class="label label-warning">Cancelled</span></td>';
        }
        else if (status == "rejected") {
            statusVal = '<td><span class="label label-danger">Rejected</span></td>';
        }
        else if (status && status.length > 0) {
            statusVal = '<td><span class="label label-default statusmultilang">' + ctx.CurrentItem.ApprovalStatus + '</span></td>';
        }
        else {
            statusVal = '<td><span class="label label-default">In-Progress</span></td>';
        }
        tr = "<tr>" + viewDetail + requester + requestFor + department + from + to + leaveHours + reason + comment + unexpectedLeave + isRequestValidTh + statusVal + "</tr>";
        return tr;
    }
})();
(function () {
    var LeaveRequestListConfig = {
        LeaveManagement_ViewDetail: "View Detail",
        LeaveManagement_Requester: "Requester",
        LeaveManagement_RequestFor: "Request for",
        LeaveManagement_From: "From",
        LeaveManagement_To: "To",
        LeaveManagement_LeaveHours: "Leave hours",
        LeaveManagement_ApprovalStatus: "Approval status",
        LeaveManagement_IsValid: "Is Valid",
        LeaveManagement_UnexpectedLeave: "Unexpected leave",
        LeaveManagement_ViewTitle: "View",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        Container: "leave-request-list-container",
    };

    (function () {
        var overrideLeaveRequestCtx = {};
        overrideLeaveRequestCtx.Templates = {};
        overrideLeaveRequestCtx.Templates.Item = CustomItemLeaveRequest;
        overrideLeaveRequestCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideLeaveRequestCtx.ListTemplateType = 10004;
        overrideLeaveRequestCtx.BaseViewID = 2;
        overrideLeaveRequestCtx.OnPostRender = PostRenderLeaveRequest;
        overrideLeaveRequestCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
            "<thead><tr><th id='leave-request-detail'>" + LeaveRequestListConfig.LeaveManagement_ViewDetail + "</th>" + // TODO: Refactor
            "<th id='leave-request-requester'>" + LeaveRequestListConfig.LeaveManagement_Requester + "</th>" +
            "<th id='leave-request-request-for'>" + LeaveRequestListConfig.LeaveManagement_RequestFor + "</th>" +
            "<th id='leave-request-from'>" + LeaveRequestListConfig.LeaveManagement_From + "</th>" +
            "<th id='leave-request-to'>" + LeaveRequestListConfig.LeaveManagement_To + "</th>" +
            "<th id='leave-request-hours'>" + LeaveRequestListConfig.LeaveManagement_LeaveHours + "</th>" +
            "<th id='leave-request-status'>" + LeaveRequestListConfig.LeaveManagement_ApprovalStatus + "</th>" +
            "<th id='leave-request-unexpected'>" + LeaveRequestListConfig.LeaveManagement_UnexpectedLeave + "</th>" +
            "<th id='leave-request-isValid'>" + LeaveRequestListConfig.LeaveManagement_IsValid + "</th>" +
            "<th id='leave-request-action'>" + '' + "</th>" +
            "<th></th>" +
            "</tr></thead><tbody>";
        overrideLeaveRequestCtx.Templates.Footer = pagingControlLeaveRequest;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideLeaveRequestCtx);
    })();

    function PostRenderLeaveRequest(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            LeaveRequestListConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(LeaveRequestListConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + LeaveRequestListConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(LeaveRequestListConfig.ListResourceFileName, "Res", OnListResourcesReadyLeaveRequest);
        }, "strings.js");

        $('.leave-request-cancel').click(function () {
            $(this).attr('disabled', 'true');
            var leaveId = $(this).attr('data-id');
            var requestLink = window.location.protocol + "//{0}/_vti_bin/services/leavemanagement/leavemanagementservice.svc/CancelLeaveManagement/{1}";
            requestLink = RBVH.Stada.WebPages.Utilities.String.format(requestLink, location.host, leaveId);
            if (leaveId) {
                $.ajax({
                    type: "GET",
                    url: requestLink,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (resultData) {
                        if (resultData.Code === 10) {
                            alert(resultData.Message);
                        }
                        window.location.reload();
                    },
                    error: function (error) {
                        console.log("Error while cancelling this request");
                    }
                });
            }
        });
    }

    function OnListResourcesReadyLeaveRequest() {
        $('#leave-request-detail').text(Res.leaveList_ViewDetail);
        $('#leave-request-requester').text(Res.leaveList_Requester);
        $('#leave-request-request-for').text(Res.leaveList_RequestFor);
        $('#leave-request-from').text(Res.leaveList_From);
        $('#leave-request-to').text(Res.leaveList_To);
        $('#leave-request-hours').text(Res.leaveList_LeaveHours);
        $('#leave-request-status').text(Res.leaveList_ApprovalStatus);
        $('#leave-request-unexpected').text(Res.leaveList_UnexpectedLeave);
        $('#leave-request-isValid').text(Res.leaveList_IsValidRequest);
        $('#' + LeaveRequestListConfig.Container + ' .viewDetail').text(Res.leaveList_ViewDetail);
        $('#' + LeaveRequestListConfig.Container + ' .label-success').text(Res.approvalStatus_Approved);
        $('#' + LeaveRequestListConfig.Container + ' .label-warning').text(Res.approvalStatus_Cancelled);
        $('#' + LeaveRequestListConfig.Container + ' .label-danger').text(Res.approvalStatus_Rejected);
        $('#' + LeaveRequestListConfig.Container + ' .leave-request-cancel').text(Res.leaveList_CancelRequest);
    }

    function pad(n) {
        return (n < 10) ? ("0" + n) : n;
    }
    function CustomItemLeaveRequest(ctx) {
        var tr = "";
        var Requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var RequestFor = '<td>' + ctx.CurrentItem.RequestFor[0].lookupValue + '</td>';
        var From = '<td>' + ctx.CurrentItem.CommonFrom + '</td>';
        var To = '<td>' + ctx.CurrentItem.To + '</td>';
        var Hours = '<td>' + ctx.CurrentItem.LeaveHours + '</td>';
        //-------------
        var unexpectedLeave = "";
        if (ctx.CurrentItem["UnexpectedLeave.value"] && ctx.CurrentItem["UnexpectedLeave.value"] === "1") {
            unexpectedLeave = "<span class='glyphicon glyphicon-ok leavemanagement-item-ok'>";
        }
        var unexpectedLeave = '<td>' + unexpectedLeave + '</td>';
        //-------------
        var isRequestValidCss = "";
        var isRequestValidTh = "";
        if (ctx.CurrentItem["IsValidRequest.value"] && ctx.CurrentItem["IsValidRequest.value"] === "1") {
            isRequestValidTh = "<td><span style='margin-left:25%; ' class='glyphicon glyphicon-ok'></td>";
        }
        else {
            isRequestValidTh = "<td><span style='margin-left:25%;' class='glyphicon glyphicon-remove'></td>";
            isRequestValidCss = "style='background-color: #fff7e6;'";
        }
        //-------------
        var enableCancelButtonCss = "";
        var status = ctx.CurrentItem.ApprovalStatus + "";
        status = status.toLowerCase();
        var statusVal = '';
        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab1';
        sourceURL = encodeURIComponent(sourceURL);
        var Title = '<td><a  href="/SitePages/LeaveRequest.aspx?subSection=LeaveManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

        var disabled = '';
        if ((ctx.CurrentItem.Editor[0].id !== ctx.CurrentItem.Author[0].id) || (ctx.CurrentItem.Requester[0].lookupId != _rbvhContext.EmployeeInfo.ID) || (ctx.CurrentItem.Editor[0].id === ctx.CurrentItem.Author[0].id && (status === 'approved' || status === 'cancelled' || status === 'rejected'))) {
            disabled = 'disabled';
        }

        var action = "<td><button type='button' class='btn btn-default btn-sm leave-request-cancel' " + disabled + " data-id='" + ctx.CurrentItem.ID + "' " + enableCancelButtonCss + ">Cancel Request</button></td>";
        if (status == 'approved') {
            statusVal = '<td><span class="label label-success">Approved</span></td>';
        }
        else if (status == "cancelled") {
            statusVal = '<td><span class="label label-warning">Cancelled</span></td>';
        }
        else if (status == "rejected") {
            statusVal = '<td><span class="label label-danger">Rejected</span></td>';
        }
        else if (status && status.length > 0) {
            statusVal = '<td><span class="label label-default statusmultilang">' + ctx.CurrentItem.ApprovalStatus + '</span></td>';
            //action = "<td><button type='button' class='btn btn-default btn-sm leave-request-cancel' data-id='" + ctx.CurrentItem.ID + "' " + enableCancelButtonCss + ">Cancel Request</button></td>";
        }
        else {
            statusVal = '<td><span class="label label-default">In-Progress</span></td>';
            //action = "<td><button type='button' class='btn btn-default btn-sm leave-request-cancel' data-id='" + ctx.CurrentItem.ID + "' " + enableCancelButtonCss + ">Cancel Request</button></td>";
        }
        tr = "<tr " + isRequestValidCss + " >" + Title + Requester + RequestFor + From + To + Hours + statusVal + unexpectedLeave + isRequestValidTh + action + "</tr>";
        return tr;
    }

    function pagingControlLeaveRequest(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();
var LeaveRequestSecurityConfig = {
    LaveManagement_Requester: "Requester",
    LeaveManagement_Department: "Department",
    LaveManagement_From: "From",
    LaveManagement_To: "To",
    LeaveManagement_Shift: "Shift",
    LeaveManagement_LeaveHours: "Leave Hours",
    LaveManagement_Reason: "Reason",
    LeaveManagement_LeftAt: "Left At",
    LeaveManagement_CheckOutBy: "Check Out By",
    LeaveManagement_EnterTime: "Time In",
    LeaveManagement_CheckInBy: "Check In By",
    LaveManagement_RequesterPhoto: "Photo",
    LaveManagement_ListTitle: 'Leave Management',
    ListResourceFileName: "RBVHStadaLists",
    PageResourceFileName: "RBVHStadaWebpages",
    DefaultAvatar: "<img src='/styles/images/DefaultAvatar.jpg'>",
    Container: "leave-sec-list-container"
};

(function () {
    var leaveSCR_OverrideCtx = {};
    leaveSCR_OverrideCtx.Templates = {};
    leaveSCR_OverrideCtx.Templates.Item = leaveSCR_CustomItem;
    leaveSCR_OverrideCtx.OnPreRender = function (ctx) {
        $('.ms-menutoolbar').hide();
    };
    leaveSCR_OverrideCtx.ListTemplateType = 10004;
    leaveSCR_OverrideCtx.BaseViewID = 6;
    leaveSCR_OverrideCtx.OnPostRender = leaveSCR_LeavePostRender;
    leaveSCR_OverrideCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr>" +
        "<th id='leaveSCR_photo'>" + LeaveRequestSecurityConfig.LaveManagement_RequesterPhoto + "</th>" +
        "<th id='leaveSCR_requester'>" + LeaveRequestSecurityConfig.LaveManagement_Requester + "</th>" +
        "<th id='leaveSCR_department'>" + LeaveRequestSecurityConfig.LeaveManagement_Department + "</th>" +
        "<th id='leaveSCR_from'>" + LeaveRequestSecurityConfig.LaveManagement_From + "</th>" +
        "<th id='leaveSCR_to'>" + LeaveRequestSecurityConfig.LaveManagement_To + "</th>" +
        "<th id='leaveSCR_shift'>" + LeaveRequestSecurityConfig.LeaveManagement_Shift + "</th>" +
        "<th id='leaveSCR_leftAt'>" + LeaveRequestSecurityConfig.LeaveManagement_LeftAt + "</th>" +
        "<th id='leaveSCR_checkoutby'>" + LeaveRequestSecurityConfig.LeaveManagement_CheckOutBy + "</th>" +
        "<th id='leaveSCR_EnterTime'>" + LeaveRequestSecurityConfig.LeaveManagement_EnterTime + "</th>" +
        "<th id='leaveSCR_checkinby'>" + LeaveRequestSecurityConfig.LeaveManagement_CheckInBy + "</th>" +
        "<th></th>" +
        "</tr></thead><tbody>";
    leaveSCR_OverrideCtx.Templates.Footer = pagingControl;
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(leaveSCR_OverrideCtx);
})();
function leaveSCR_LeavePostRender(ctx) {
    SP.SOD.executeOrDelayUntilScriptLoaded(function () {
        SP.SOD.registerSod(LeaveRequestSecurityConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + LeaveRequestSecurityConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
        SP.SOD.executeFunc(LeaveRequestSecurityConfig.ListResourceFileName, "Res", leaveSCR_OnListResourcesReady);
    }, "strings.js");

    $('.left-button').click(function () {
        $(this).attr('disabled', 'true');
        leaveSCR_UpdateLeftStatus($(this).attr('data-id'), $(this));
    });
    $('.entertime-button').click(function () {
        $(this).attr('disabled', 'true');
        leaveSCR_UpdateEnterTimeStatus($(this).attr('data-id'), $(this));
    });

    var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
    $.ajax({
        url: url,
        method: "GET",
        async: true,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data && data.length > 0) {
                $('#' + LeaveRequestSecurityConfig.Container + ' .department-locale').each(function () {
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

function leaveSCR_OnListResourcesReady() {
    $('#leaveSCR_requester').text(Res.leaveList_Requester);
    $('#leaveSCR_department').text(Res.leaveList_Department);
    $('#leaveSCR_from').text(Res.leaveList_From);
    $('#leaveSCR_to').text(Res.leaveList_To);
    $('#leaveSCR_shift').text(Res.leaveList_Shift);
    $('#leaveSCR_leftAt').text(Res.leaveList_LeavedAt);
    $('#leaveSCR_checkoutby').text(Res.leaveList_CheckOutBy);
    $('#leaveSCR_photo').text(Res.leaveList_Avatar);
    $('#leaveSCR_EnterTime').text(Res.leaveList_EnterTime);
    $('#leaveSCR_checkinby').text(Res.leaveList_CheckInBy);
    $('#' + LeaveRequestSecurityConfig.Container + ' .left-button').text(Res.leaveList_LeftButton);
    $('#' + LeaveRequestSecurityConfig.Container + ' .entertime-button').text(Res.leaveList_Entered);
}

function leaveSCR_CustomItem(ctx) {
    var currentID = ctx.CurrentItem.ID;
    var getAvatarUrl = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/Services/Employee/EmployeeService.svc/GetAvatar/" + ctx.CurrentItem.RequestFor[0].lookupId;
    var getAvatarPromise = $.ajax({
        url: getAvatarUrl,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
    });
    var photo = "";
    getAvatarPromise.then(function (image) {
        if (image != "") {
            photo = "<td id='photo'><div class='customImageAvatar'>" + image + "</div></td>";
        }
        else {
            photo = "<td id='photo'><div class='customImageAvatar'>" + LeaveRequestSecurityConfig.DefaultAvatar + "</div></td>";
        }

    }, function () {
        photo = "<td  id='photo'><div class='customImageAvatar'>" + LeaveRequestSecurityConfig.DefaultAvatar + "</div></td>";
    });

    var tr = "";
    var requesterName = '<td style="vertical-align: middle;">' + Functions.removeInvalidValue(ctx.CurrentItem.RequestFor[0].lookupValue) + '</td>';
    var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '" style="vertical-align: middle;">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
    var fromDate = '<td style="vertical-align: middle;">' + (ctx.CurrentItem.CommonFrom) + '</td>';
    var toDate = '<td style="vertical-align: middle;">' + (ctx.CurrentItem.To) + '</td>';
    var leftAt = '<td style="vertical-align: middle;">' + ctx.CurrentItem.LeftAt + '</td>';
    var checkOutByVal = "";
    if (ctx.CurrentItem.CheckOutBy) {
        checkOutByVal = ctx.CurrentItem.CheckOutBy[0].lookupValue;
    }
    var checkOutBy = '<td style="vertical-align: middle;">' + checkOutByVal + '</td>';

    var timeIn = '<td style="vertical-align: middle;">' + ctx.CurrentItem.EnterTime + '</td>';
    var checkInByVal = "";
    if (ctx.CurrentItem.CheckInBy) {
        checkInByVal = ctx.CurrentItem.CheckInBy[0].lookupValue;
    }
    var checkInBy = '<td style="vertical-align: middle;">' + checkInByVal + '</td>';

    var action = "";
    var disabledLeftAtButton = "";
    var disabledTimeInButton = "";
    if (ctx.CurrentItem.LeftAt || ctx.CurrentItem.LeftAt != "") {
        disabledLeftAtButton = "disabled";
    }

    if (ctx.CurrentItem.EnterTime && ctx.CurrentItem.EnterTime != "") {
        disabledTimeInButton = "disabled";
    }
    
    // Get Shift Time:
    var departmentId = ctx.CurrentItem.CommonDepartment[0].lookupId;
    var empId = ctx.CurrentItem.RequestFor[0].lookupId;
    var locationId = _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
    var date = new Date();
    var dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var shiftValue = '<td style="vertical-align: middle;">' + 'HC' + '</td>';
    var getShiftTimeUrl = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/Services/LeaveManagement/LeaveManagementService.svc/GetShiftTimeByDate/" + dateString + "/" + empId + "/" + departmentId + "/" + locationId;
    $.ajax({
        url: getShiftTimeUrl,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
    }).done(function (response) {
        shiftValue = '<td style="vertical-align: middle;">' + response + '</td>';
    });

    action = "<td style='vertical-align: middle;' nowrap><button type='button'  class='btn btn-default btn-sm left-button' " + disabledLeftAtButton + " data-id='" + currentID + "'>Left</button><button type='button' style='margin-left: 10px;'  class='btn btn-default btn-sm entertime-button' " + disabledTimeInButton + " data-id='" + currentID + "'>Entered</button></td>";
    tr = "<tr>" + photo + requesterName + department + fromDate + toDate + shiftValue + leftAt + checkOutBy + timeIn + checkInBy + action + "</tr>";
    return tr;
}

function pagingControl(ctx) {
    return ViewUtilities.Paging.InstanceHtml(ctx);
}

function leaveSCR_UpdateLeftStatus(itemId) {
    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + String(LeaveRequestSecurityConfig.LaveManagement_ListTitle) + "')/items(" + itemId + ")";
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data) {
                leaveSCR_UpdateItem(itemId);
            }
        },
        error: function (data) {
        }
    });
}

function leaveSCR_UpdateItem(itemId) {
    var siteUrl = _spPageContextInfo.webServerRelativeUrl;
    var fullWebUrl = window.location.protocol + '//' + window.location.host + siteUrl;
    var clientContext = new SP.ClientContext(fullWebUrl);
    var oList = clientContext.get_web().get_lists().getByTitle(String(LeaveRequestSecurityConfig.LaveManagement_ListTitle));
    var currentUser = clientContext.get_web().get_currentUser();
    clientContext.load(currentUser);
    clientContext.load(oList);
    this.oListItem = oList.getItemById(itemId);
    var now = new Date();
    oListItem.set_item('LeftAt', now);
    oListItem.set_item('CheckOutBy', _rbvhContext.EmployeeInfo.ID);
    oListItem.update();
    clientContext.executeQueryAsync(Function.createDelegate(this, this.leaveSCR_onQuerySucceeded), Function.createDelegate(this, this.leaveSCR_onQueryFailed));
}

function leaveSCR_UpdateEnterTimeStatus(itemId) {
    var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + String(LeaveRequestSecurityConfig.LaveManagement_ListTitle) + "')/items(" + itemId + ")";
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data) {
                leaveSCR_UpdateEnterTimeItem(itemId);
            }
        },
        error: function (data) {
        }
    });
}

function leaveSCR_UpdateEnterTimeItem(itemId) {
    var siteUrl = _spPageContextInfo.webServerRelativeUrl;
    var fullWebUrl = window.location.protocol + '//' + window.location.host + siteUrl;
    var clientContext = new SP.ClientContext(fullWebUrl);
    var oList = clientContext.get_web().get_lists().getByTitle(String(LeaveRequestSecurityConfig.LaveManagement_ListTitle));
    var currentUser = clientContext.get_web().get_currentUser();
    clientContext.load(currentUser);
    clientContext.load(oList);
    this.oListItem = oList.getItemById(itemId);
    var now = new Date();
    oListItem.set_item('EnterTime', now);
    oListItem.set_item('CheckInBy', _rbvhContext.EmployeeInfo.ID);
    oListItem.update();
    clientContext.executeQueryAsync(Function.createDelegate(this, this.leaveSCR_onQuerySucceeded), Function.createDelegate(this, this.leaveSCR_onQueryFailed));
}

function leaveSCR_onQuerySucceeded() {
    location.reload();
}
function leaveSCR_onQueryFailed() {
    location.reload();
}