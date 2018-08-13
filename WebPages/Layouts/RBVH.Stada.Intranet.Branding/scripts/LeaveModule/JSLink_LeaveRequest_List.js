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