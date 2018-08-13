(function () {
    var ApprovalConfigCSRDepartment = {
        ChangeShiftManagement_Requester: "Requester",
        ChangeShiftManagement_FromShift: "From Shift",
        ChangeShiftManagement_ToShift: "To Shift",
        ChangeShiftManagement_From: "From",
        ChangeShiftManagement_To: "To",
        ChangeShiftManagement_Created: "Created",
        Comment: "Comment",
        ChangeShiftManagement_Reason: "Reason",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        ViewDetail: "View item detail"
    };

    (function () {
        var overrideCSRDepartmentCtx = {};
        overrideCSRDepartmentCtx.Templates = {};
        overrideCSRDepartmentCtx.Templates.Item = CustomItem_CSRDepartment;
        overrideCSRDepartmentCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCSRDepartmentCtx.ListTemplateType = 10011;
        overrideCSRDepartmentCtx.BaseViewID = 1;
        overrideCSRDepartmentCtx.OnPostRender = PostRender_CSRDepartment;
        overrideCSRDepartmentCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='requesterTH_csrDept'>" + ApprovalConfigCSRDepartment.ChangeShiftManagement_Requester + "</th>" +
            "<th id='fromshift_csrDept'>" + ApprovalConfigCSRDepartment.ChangeShiftManagement_FromShift + "</th>" +
            "<th id='toshift_csrDept'>" + ApprovalConfigCSRDepartment.ChangeShiftManagement_ToShift + "</th>" +
            "<th id='from_csrDept'>" + ApprovalConfigCSRDepartment.ChangeShiftManagement_From + "</th>" +
            "<th id='to_csrDept'>" + ApprovalConfigCSRDepartment.ChangeShiftManagement_To + "</th>" +
            "<th id='created_csrDept'>" + ApprovalConfigCSRDepartment.ChangeShiftManagement_Created + "</th>" +
            "<th id='reason_csrDept'>" + ApprovalConfigCSRDepartment.ChangeShiftManagement_Reason + "</th>" +
            "<th id='comment_csrDept'>" + ApprovalConfigCSRDepartment.Comment + "</th>" +
            "<th id='approvalStatus_csrDept'>" + ApprovalConfigCSRDepartment.ChangeShiftManagement_ApprovalStatus + "</th>" +
            "<th id='action_csrDept'>" + ApprovalConfigCSRDepartment.ChangeShiftManagement_ViewTitle + "</th>" +
            "<th></th>" +
        "</tr></thead><tbody>";
        overrideCSRDepartmentCtx.Templates.Footer = CreateFooter;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCSRDepartmentCtx);
    })();
    function CreateFooter(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
    function openDialogBox(Url) {
        var ModalDialogOptions = { url: Url, width: 800, height: 400, showClose: true, allowMaximize: false, title: ApprovalConfigCSRDepartment.ViewDetail };
        SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', ModalDialogOptions);
    }
    function PostRender_CSRDepartment(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            SP.SOD.registerSod(ApprovalConfigCSRDepartment.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + ApprovalConfigCSRDepartment.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(ApprovalConfigCSRDepartment.ListResourceFileName, "Res", OnListResourcesReady_CSRDepartment);
            SP.SOD.registerSod(ApprovalConfigCSRDepartment.PageResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + ApprovalConfigCSRDepartment.PageResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(ApprovalConfigCSRDepartment.PageResourceFileName, "Res", OnPageResourcesReady_CSRDepartment);
        }, "strings.js");
        $('.viewdetaildepreq').click(function () {
            url = $(this).attr('data-url');
            openDialogBox(url);
        });
    }
    function OnListResourcesReady_CSRDepartment() {
        $('#requesterTH_csrDept').text(Res.changeShiftList_Requester);
        $('#fromshift_csrDept').text(Res.changeShiftList_FromShift);
        $('#toshift_csrDept').text(Res.changeShiftList_ToShift);
        $('#from_csrDept').text(Res.changeShiftList_FromDate);
        $('#to_csrDept').text(Res.changeShiftList_ToDate);
        $('#created_csrDept').text(Res.createdDate);
        $('#reason_csrDept').text(Res.changeShiftManagement_Reason);
        $('#comment_csrDept').text(Res.commonComment);
        $('#approvalStatus_csrDept').text(Res.changeShiftManagement_ApprovalStatus);
        $('#action_csrDept').text(Res.changeShiftManagement_ViewTitle);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-default').text(Res.approvalStatus_InProgress);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        $('.label-danger').text(Res.approvalStatus_Rejected);
        $('.cancel-request').text(Res.changeShiftManagement_CancelRequest);
    }
    function OnPageResourcesReady_CSRDepartment() {
        ApprovalConfigCSRDepartment.ViewDetail = Res.viewDetail;
    }
    function CustomItem_CSRDepartment(ctx) {
        var tr = "";
        var Requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var FromShift = '<td>' + ctx.CurrentItem.FromShift[0].lookupValue + '</td>';
        var ToShift = '<td>' + ctx.CurrentItem.ToShift[0].lookupValue + '</td>';
        var From = '<td>' + ctx.CurrentItem.CommonFrom + '</td>';
        var To = '<td>' + ctx.CurrentItem.To + '</td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';
        var Reason = '<td>' + ctx.CurrentItem.Reason + '</td>';
        var Comment = '<td>' + ctx.CurrentItem.CommonComment + '</td>';
        var status = ctx.CurrentItem.ApprovalStatus + "";

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab3';
        sourceURL = encodeURIComponent(sourceURL);
        var view = '<span><a data-url="/Lists/ChangeShiftManagement/DispForm.aspx?ID=' + ctx.CurrentItem.ID + '&TextOnly=true&Source=' + sourceURL + '"   class="table-action viewdetaildepreq"><i class="fa fa-eye" aria-hidden="true"></i></a></span>';
        var actionEditView = "<td>" + view + "</td>";

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
        else {
            statusVal = '<td><span class="label label-default">In-Progress</span></td>';
        }
        tr = "<tr>" + Requester + FromShift + ToShift + From + To + created + Reason + Comment + statusVal + actionEditView + "</tr>";
        return tr;
    }
})();
(function () {
    var ApprovalConfigChangeShiftRequest = {
        ChangeShiftManagement_Requester: "Requester",
        ChangeShiftManagement_FromShift: "From Shift",
        ChangeShiftManagement_ToShift: "To Shift",
        ChangeShiftManagement_From: "From",
        ChangeShiftManagement_To: "To",
        ChangeShiftManagement_Created: "Created",
        Comment: "Comment",
        ChangeShiftManagement_Reason: "Reason",
        ApprovalStatus: '',
        RequestStatusApproved: '',
        RequestStatusCancelled: '',
        RequestStatusRejected: '',
        ChangeShiftManagement_ApprovalStatus: "Approval Status",
        ChangeShiftManagement_ListTitle: 'Change Shift Management',
        ChangeShiftManagement_ViewTitle: "View",
        ApprovalStatus_Cancelled: 'Cancelled',
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        ViewDetail: 'View item detail',
    };

    (function () {
        var overrideChangeShiftRequestCtx = {};
        overrideChangeShiftRequestCtx.Templates = {};
        overrideChangeShiftRequestCtx.Templates.Item = CustomItemChangeShiftRequest;
        overrideChangeShiftRequestCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideChangeShiftRequestCtx.ListTemplateType = 10011;
        overrideChangeShiftRequestCtx.BaseViewID = 2;
        overrideChangeShiftRequestCtx.OnPostRender = ChangeShiftRequestPostRender;
        overrideChangeShiftRequestCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='requesterTH_csRequest'>" + ApprovalConfigChangeShiftRequest.ChangeShiftManagement_Requester + "</th>" +
            "<th id='fromshift_csRequest'>" + ApprovalConfigChangeShiftRequest.ChangeShiftManagement_FromShift + "</th>" +
            "<th id='toshift_csRequest'>" + ApprovalConfigChangeShiftRequest.ChangeShiftManagement_ToShift + "</th>" +
            "<th id='from_csRequest'>" + ApprovalConfigChangeShiftRequest.ChangeShiftManagement_From + "</th>" +
            "<th id='to_csRequest'>" + ApprovalConfigChangeShiftRequest.ChangeShiftManagement_To + "</th>" +
            "<th id='created_csRequest'>" + ApprovalConfigChangeShiftRequest.ChangeShiftManagement_Created + "</th>" +
            "<th id='reason_csRequest'>" + ApprovalConfigChangeShiftRequest.ChangeShiftManagement_Reason + "</th>" +
            "<th id='comment_csRequest'>" + ApprovalConfigChangeShiftRequest.Comment + "</th>" +
            "<th id='approvalStatus_csRequest'>" + ApprovalConfigChangeShiftRequest.ChangeShiftManagement_ApprovalStatus + "</th>" +
            "<th id='action_csRequest'>" + ApprovalConfigChangeShiftRequest.ChangeShiftManagement_ViewTitle + "</th>" +
            "<th></th>" +
        "</tr></thead><tbody>";
        overrideChangeShiftRequestCtx.Templates.Footer = pagingControlChangeShiftRequest;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideChangeShiftRequestCtx);
    })();
    function openDialogBox(Url) {
        var ModalDialogOptions = { url: Url, width: 800, height: 400, showClose: true, allowMaximize: false, title: ApprovalConfigChangeShiftRequest.ViewDetail };
        SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', ModalDialogOptions);
    }
    function ChangeShiftRequestPostRender(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            ApprovalConfigChangeShiftRequest.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(ApprovalConfigChangeShiftRequest.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + ApprovalConfigChangeShiftRequest.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(ApprovalConfigChangeShiftRequest.ListResourceFileName, "Res", OnListResourcesReadyChangeShiftRequest);
            SP.SOD.registerSod(ApprovalConfigChangeShiftRequest.PageResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + ApprovalConfigChangeShiftRequest.PageResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(ApprovalConfigChangeShiftRequest.PageResourceFileName, "Res", OnPageResourcesReadyChangeShiftRequest);
        }, "strings.js");
        $('.cancel-request').click(function () {
            updateListItem_ChangeShiftRequest($(this).attr('data-id'), $(this));
            $(this).attr('disabled', 'true');
        });
        $('.viewdetailmyrequest').click(function () {
            url = $(this).attr('data-url');
            openDialogBox(url);
        });
    }
    function OnListResourcesReadyChangeShiftRequest() {
        $('#requesterTH_csRequest').text(Res.changeShiftList_Requester);
        $('#fromshift_csRequest').text(Res.changeShiftList_FromShift);
        $('#toshift_csRequest').text(Res.changeShiftList_ToShift);
        $('#from_csRequest').text(Res.changeShiftList_FromDate);
        $('#to_csRequest').text(Res.changeShiftList_ToDate);
        $('#created_csRequest').text(Res.createdDate);
        $('#reason_csRequest').text(Res.changeShiftManagement_Reason);
        $('#comment_csRequest').text(Res.commonComment);
        $('#approvalStatus_csRequest').text(Res.changeShiftManagement_ApprovalStatus);
        $('#action_csRequest').text(Res.changeShiftManagement_ViewTitle);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-default').text(Res.approvalStatus_InProgress);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        ApprovalConfigChangeShiftRequest.ApprovalStatus_Cancelled = Res.approvalStatus_Cancelled;
        $('.label-danger').text(Res.approvalStatus_Rejected);
        $('.cancel-request').text(Res.changeShiftManagement_CancelRequest);
    }
    function OnPageResourcesReadyChangeShiftRequest() {
        ApprovalConfigChangeShiftRequest.RequestStatusApproved = Res.requestStatusApproved;
        ApprovalConfigChangeShiftRequest.RequestStatusCancelled = Res.requestStatusCancelled;
        ApprovalConfigChangeShiftRequest.RequestStatusRejected = Res.requestStatusRejected;
        ApprovalConfigChangeShiftRequest.ViewDetail = Res.viewDetail;
    }
    function pad(n) {
        return (n < 10) ? ("0" + n) : n;
    }
    function CustomItemChangeShiftRequest(ctx) {
        var tr = "";
        var Requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var FromShift = '<td>' + ctx.CurrentItem.FromShift[0].lookupValue + '</td>';
        var ToShift = '<td>' + ctx.CurrentItem.ToShift[0].lookupValue + '</td>';
        var From = '<td>' + ctx.CurrentItem.CommonFrom + '</td>';
        var To = '<td>' + ctx.CurrentItem.To + '</td>';
        var CreatedDate = '<td>' + ctx.CurrentItem.Created + '</td>';
        var Reason = '<td>' + ctx.CurrentItem.Reason + '</td>';
        var Comment = '<td>' + ctx.CurrentItem.CommonComment + '</td>';
        var status = ctx.CurrentItem.ApprovalStatus + "";

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab1';
        sourceURL = encodeURIComponent(sourceURL);
        var view = '<span><a data-url="/Lists/ChangeShiftManagement/DispForm.aspx?ID=' + ctx.CurrentItem.ID + '&TextOnly=true&Source=' + sourceURL + '"   class="table-action viewdetailmyrequest"><i class="fa fa-eye" aria-hidden="true"></i></a></span>';
        var actionEditView = "<td>" + view + "</td>";

        var action = "<td><button type='button' class='btn btn-default btn-sm cancel-request' disabled  data-id='" + ctx.CurrentItem.ID + "'>Cancel Request</button></td>";
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
        else {
            statusVal = '<td><span class="label label-default">In-Progress</span></td>';
            action = "<td><button type='button' class='btn btn-default btn-sm cancel-request'  data-id='" + ctx.CurrentItem.ID + "'>Cancel Request</button></td>";
        }
        tr = "<tr>" + Requester + FromShift + ToShift + From + To + CreatedDate + Reason + Comment + statusVal + actionEditView + action + "</tr>";
        return tr;
    }
    function pagingControlChangeShiftRequest(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
    function updateListItem_ChangeShiftRequest(itemId) {
        checkIsCancelled_ChangeShiftRequest(itemId);
        if (ApprovalConfigChangeShiftRequest.ApprovalStatus && ApprovalConfigChangeShiftRequest.ApprovalStatus.toLowerCase() === "approved") {
            alert(ApprovalConfigChangeShiftRequest.RequestStatusApproved);
            location.reload();
        }
        else if (ApprovalConfigChangeShiftRequest.ApprovalStatus && ApprovalConfigChangeShiftRequest.ApprovalStatus.toLowerCase() === "cancelled") {
            alert(ApprovalConfigChangeShiftRequest.RequestStatusCancelled);
            location.reload();
        }
        else if (ApprovalConfigChangeShiftRequest.ApprovalStatus && ApprovalConfigChangeShiftRequest.ApprovalStatus.toLowerCase() === "rejected") {
            alert(ApprovalConfigChangeShiftRequest.RequestStatusRejected);
            location.reload();
        }
        else {
            var siteUrl = _spPageContextInfo.webServerRelativeUrl;
            var fullWebUrl = window.location.protocol + '//' + window.location.host + siteUrl;
            var clientContext = new SP.ClientContext(fullWebUrl);
            var oList = clientContext.get_web().get_lists().getByTitle(String(ApprovalConfigChangeShiftRequest.ChangeShiftManagement_ListTitle));
            clientContext.load(oList);
            this.oListItem = oList.getItemById(itemId);
            oListItem.set_item('ApprovalStatus', 'Cancelled');
            oListItem.update();
            clientContext.executeQueryAsync(Function.createDelegate(this, function () { location.reload(); }), Function.createDelegate(this, function () { }));
        }
    }
    function checkIsCancelled_ChangeShiftRequest(itemId) {
        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + String(ApprovalConfigChangeShiftRequest.ChangeShiftManagement_ListTitle) + "')/items(" + itemId + ")";
        var d = $.Deferred();
        $.ajax({
            url: url,
            method: "GET",
            async: false,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                ApprovalConfigChangeShiftRequest.ApprovalStatus = data.d.ApprovalStatus;
                d.resolve(data.d);
            },
            error: function (data) {
                status = 'failed';
            }
        });
        return d.promise();
    }
})();
var ChangeShiftApprovalTaskConfig = {
    ChangeShiftManagement_Requester: "Requester",
    ChangeShiftManagement_FromShift: "FromShift",
    ChangeShiftManagement_ToShift: "ToShift",
    ChangeShiftManagement_From: "From",
    ChangeShiftManagement_To: "To",
    ChangeShiftManagement_Created: "Created",
    ChangeShiftManagement_Reason: "Reason",
    Comment: "Comment",
    ItemID: '',
    ApprovalStatus: '',
    IsManager: false,
    ChangeShiftManagement_ViewTitle: "View",
    ApproveRequest: '//{0}/_vti_bin/Services/ChangeShiftManagement/ChangeShiftManagementService.svc/Approve',
    RejectRequest: '//{0}/_vti_bin/Services/ChangeShiftManagement/ChangeShiftManagementService.svc/Reject',
    ListResourceFileName: "RBVHStadaLists",
    PageResourceFileName: "RBVHStadaWebpages",
    Locale: '',
    ViewDetail: "View item detail",
};
(function () {
    var overrideCtx = {};
    overrideCtx.Templates = {};
    overrideCtx.Templates.Item = CustomItem;
    overrideCtx.OnPreRender = function (ctx) {
        $('.ms-menutoolbar').hide();
    };
    overrideCtx.BaseViewID = 3;
    overrideCtx.ListTemplateType = 10011;
    overrideCtx.OnPostRender = PostRender;
    overrideCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='requesterTH'>" + ChangeShiftApprovalTaskConfig.ChangeShiftManagement_Requester + "</th>" +
        "<th id='fromshift'>" + ChangeShiftApprovalTaskConfig.ChangeShiftManagement_FromShift + "</th>" +
        "<th id='toshift'>" + ChangeShiftApprovalTaskConfig.ChangeShiftManagement_ToShift + "</th>" +
        "<th id='from'>" + ChangeShiftApprovalTaskConfig.ChangeShiftManagement_From + "</th>" +
        "<th id='to'>" + ChangeShiftApprovalTaskConfig.ChangeShiftManagement_To + "</th>" +
        "<th id='created'>" + ChangeShiftApprovalTaskConfig.ChangeShiftManagement_Created + "</th>" +
        "<th id='reason'>" + ChangeShiftApprovalTaskConfig.ChangeShiftManagement_Reason + "</th>" +
        "<th id='actionTH'>" + ChangeShiftApprovalTaskConfig.ChangeShiftManagement_ViewTitle + "</th>" +
	    "<th id='comment'>" + ChangeShiftApprovalTaskConfig.Comment + "</th>" +
        "<th></th>" +
        "</tr></thead><tbody>";
    overrideCtx.Templates.Footer = pagingControl;
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
})();
function openDialogBox(Url) {
    var ModalDialogOptions = { url: Url, width: 800, height: 400, showClose: true, allowMaximize: false, title: ChangeShiftApprovalTaskConfig.ViewDetail };
    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', ModalDialogOptions);
}
function PostRender(ctx) {
    SP.SOD.executeOrDelayUntilScriptLoaded(function () {
        ChangeShiftApprovalTaskConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
        SP.SOD.registerSod(ChangeShiftApprovalTaskConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + ChangeShiftApprovalTaskConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
        SP.SOD.executeFunc(ChangeShiftApprovalTaskConfig.ListResourceFileName, "Res", OnListResourcesReady);
        SP.SOD.registerSod(ChangeShiftApprovalTaskConfig.PageResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + ChangeShiftApprovalTaskConfig.PageResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
        SP.SOD.executeFunc(ChangeShiftApprovalTaskConfig.PageResourceFileName, "Res", OnPageResourcesReady);
    }, "strings.js");
    $('.approve-request').click(function () {
        $(this).prop('disabled', true);
        DoApprove($(this).attr('data-id'));
    });
    $('.reject-request').click(function () {
        $(this).prop('disabled', true);
        DoReject($(this).attr('data-id'));
    });
    $('.viewdetailapproval').click(function () {
        url = $(this).attr('data-url');
        openDialogBox(url);
    });
}
function OnListResourcesReady() {
    $('#requesterTH').text(Res.changeShiftList_Requester);
    $('#fromshift').text(Res.changeShiftList_FromShift);
    $('#toshift').text(Res.changeShiftList_ToShift);
    $('#from').text(Res.changeShiftList_FromDate);
    $('#to').text(Res.changeShiftList_ToDate);
    $('#created').text(Res.createdDate);
    $('#reason').text(Res.changeShiftManagement_Reason);
    $('#actionTH').text(Res.changeShiftManagement_ViewTitle);
    $('#comment').text(Res.commonComment);
    $('.label-success').text(Res.approvalStatus_Approved);
    $('.label-default').text(Res.approvalStatus_InProgress);
    $('.label-warning').text(Res.approvalStatus_Cancelled);
    $('.label-danger').text(Res.approvalStatus_Rejected);
    $('.cancel-request').text(Res.changeShiftManagement_CancelRequest);
}
function OnPageResourcesReady() {
    $(".approve-request").text(Res.approveButton);
    $(".reject-request").text(Res.rejectButton);
    ChangeShiftApprovalTaskConfig.ViewDetail = Res.viewDetail;
}
function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}
function CustomItem(ctx) {
    var tr = "";
    var Requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
    var FromShift = '<td>' + ctx.CurrentItem.FromShift[0].lookupValue + '</td>';
    var ToShift = '<td>' + ctx.CurrentItem.ToShift[0].lookupValue + '</td>';
    var From = '<td>' + ctx.CurrentItem.CommonFrom + '</td>';
    var To = '<td>' + ctx.CurrentItem.To + '</td>';
    var Created = '<td>' + ctx.CurrentItem.Created + '</td>';
    var Reason = '<td>' + ctx.CurrentItem.Reason + '</td>';
    var Comment = '<td><input type="text" class="form-control comment' + ctx.CurrentItem.ID + '" ></input></td>';
    var status = ctx.CurrentItem.ApprovalStatus;

    var sourceURL = window.location.href.split('#')[0];
    sourceURL = Functions.removeParam('lang', sourceURL);
    sourceURL += '#tab2';
    sourceURL = encodeURIComponent(sourceURL);
    var view = '<span><a data-url="/Lists/ChangeShiftManagement/DispForm.aspx?ID=' + ctx.CurrentItem.ID + '&TextOnly=true&Source=' + sourceURL + '"   class="table-action viewdetailapproval"><i class="fa fa-eye" aria-hidden="true"></i></a></span>';
    var actionEditView = "<td>" + view + "</td>";

    var disabled = '';
    //if (ctx.CurrentItem.CommonReqDueDate && ctx.CurrentItem.CommonReqDueDate.length > 0) {
    //    var commonReqDueDate = ctx.CurrentItem.CommonReqDueDate;
    //    if (commonReqDueDate.indexOf(' ') > 0)
    //    {
    //        commonReqDueDate = commonReqDueDate.split(' ')[0];
    //        var requestDueDateObj = Functions.parseVietNameseDate(commonReqDueDate);
    //        var nowDate = new Date();
    //        var currentDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
    //        if (requestDueDateObj.valueOf() < currentDate.valueOf()) {
    //            disabled = 'disabled';
    //        }
    //    }
    //}

    var approve = "<button type='button' class='btn btn-success btn-sm approve-request' data-approvalStatus='" + ctx.CurrentItem.ApprovalStatus + "'  data-id='" + ctx.CurrentItem.ID + "' data-emp-id='" + ctx.CurrentItem.Requester[0].lookupId + "' " + disabled + ">Approve</button>";
    var reject = "<button type='button' class='btn btn-default btn-sm reject-request'  data-id='" + ctx.CurrentItem.ID + "' " + disabled + ">Reject</button>";
    var action = '<td>' + approve + '   ' + reject + '<td>'
    tr = "<tr>" + Requester + FromShift + ToShift + From + To + Created + Reason + actionEditView + Comment + action + "</tr>";
    return tr;
}

function pagingControl(ctx) {
    return ViewUtilities.Paging.InstanceHtml(ctx)
}

function DoApprove(itemId) {
    var postData = {};
    postData.Id = itemId;
    postData.Comment = $('.comment' + itemId).val();
    postData.ApproverName = _rbvhContext.EmployeeInfo.FullName;
    postData.ApproverId = _rbvhContext.EmployeeInfo.ADAccount.ID;
    var url = RBVH.Stada.WebPages.Utilities.String.format(ChangeShiftApprovalTaskConfig.ApproveRequest, location.host);
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(postData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function (response) {
        if (response.Code === 2) {
            alert(response.Message);
        }
        Redirect();
    });
}
function DoReject(itemId) {
    var postData = {};
    postData.Id = itemId;
    postData.Comment = $('.comment' + itemId).val();
    postData.ApproverName = _rbvhContext.EmployeeInfo.FullName;
    postData.ApproverId = _rbvhContext.EmployeeInfo.ADAccount.ID;
    var url = RBVH.Stada.WebPages.Utilities.String.format(ChangeShiftApprovalTaskConfig.RejectRequest, location.host);
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(postData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    }).done(function (response) {
        if (response.Code === 3) {
            alert(response.Message);
        }
        Redirect();
    });
}
function Redirect() {
    var sourceParam = Functions.getParameterByName("Source");
    if (sourceParam) {
        Functions.redirectToSource();
    }
    else {
        window.location.reload();
    }
}