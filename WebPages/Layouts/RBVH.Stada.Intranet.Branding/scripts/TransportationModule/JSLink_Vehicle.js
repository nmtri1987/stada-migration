(function () {
    var ApprovalTransportationConfig = {
        VehicleManagement_ViewDetail: "View Detail",
        VehicleManagement_Requester: "Requester",
        VehicleManagement_Department: "Department",
        VehicleManagement_VehicleType: 'Vehicle Type',
        VehicleManagement_CommonFrom: "From",
        VehicleManagement_CommonTo: "To",
        VehicleManagement_Reason: "Reason",
        VehicleManagement_ApprovalStatus: "Approval Status",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        Container: "vehicle-approval-container"
    };
    (function () {
        var overrideCtx = {};
        overrideCtx.Templates = {};
        overrideCtx.Templates.Item = CustomItem;
        overrideCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCtx.BaseViewID = 1;
        overrideCtx.ListTemplateType = 10013;
        overrideCtx.OnPostRender = PostRender;
        overrideCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='viewDetailTHVehicleApproval'>" + ApprovalTransportationConfig.VehicleManagement_ViewDetail + "</th>" +
        "<th id='requesterTHVehicleApproval'>" + ApprovalTransportationConfig.VehicleManagement_Requester + "</th>" +
        "<th id='departmentTHVehicleApproval'>" + ApprovalTransportationConfig.VehicleManagement_Department + "</th>" +
        "<th id='vehicleTypeTHVehicleApproval'>" + ApprovalTransportationConfig.VehicleManagement_VehicleType + "</th>" +
        "<th id='fromTHVehicleApproval'>" + ApprovalTransportationConfig.VehicleManagement_CommonFrom + "</th>" +
        "<th id='toTHVehicleApproval'>" + ApprovalTransportationConfig.VehicleManagement_CommonTo + "</th>" +
        "<th id='reasonTHVehicleApproval'>" + ApprovalTransportationConfig.VehicleManagement_Reason + "</th>" +
        "<th id='approvalStatusTHVehicleApproval'>" + ApprovalTransportationConfig.VehicleManagement_ApprovalStatus + "</th>" +
        "</tr></thead><tbody>";
        overrideCtx.Templates.Footer = pagingControl;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
    })();
    function PostRender(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            ApprovalTransportationConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(ApprovalTransportationConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + ApprovalTransportationConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(ApprovalTransportationConfig.ListResourceFileName, "Res", OnListResourcesReady);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + ApprovalTransportationConfig.Container + ' .department-locale').each(function () {
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
        $('#viewDetailTHVehicleApproval').text(Res.vehicleManagement_ViewDetail);
        $('#requesterTHVehicleApproval').text(Res.vehicleManagement_Requester);
        $('#departmentTHVehicleApproval').text(Res.vehicleManagement_Department);
        $('#vehicleTypeTHVehicleApproval').text(Res.vehicleManagement_VehicleType);
        $('#fromTHVehicleApproval').text(Res.vehicleManagement_CommonFrom);
        $('#toTHVehicleApproval').text(Res.vehicleManagement_CommonTo);
        $('#reasonTHVehicleApproval').text(Res.vehicleManagement_Reason);
        $('#approvalStatusTHVehicleApproval').text(Res.vehicleManagement_ApprovalStatus);
        $('#' + ApprovalTransportationConfig.Container + ' .label-success').text(Res.approvalStatus_Approved);
        $('#' + ApprovalTransportationConfig.Container + ' .label-warning').text(Res.approvalStatus_Cancelled);
        $('#' + ApprovalTransportationConfig.Container + ' .label-danger').text(Res.approvalStatus_Rejected);
        $('#' + ApprovalTransportationConfig.Container + ' .viewDetail').text(Res.vehicleManagement_ViewDetail);
        $('#vehicle-approval-container tr').find('td:nth(3):contains("Company")').text(Res.vehicleManagement_VehicleType_Choice_Company);
        $('#vehicle-approval-container tr').find('td:nth(3):contains("Private")').text(Res.vehicleManagement_VehicleType_Choice_Private);
    }
    function pad(n) {
        return (n < 10) ? ("0" + n) : n;
    }
    function CustomItem(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var vehicleType = '<td> ' + ctx.CurrentItem.VehicleType + '</td>';
        var from = '<td> ' + ctx.CurrentItem.CommonFrom + '</td>';
        var to = '<td> ' + ctx.CurrentItem.To + '</td>';
        var reason = '<td>' + ctx.CurrentItem.Reason + '</td>';
        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab2';
        sourceURL = encodeURIComponent(sourceURL);
        var viewDetail = '<td><a href="/Lists/VehicleManagement/EditForm.aspx?subSection=TransportationManagement&ID=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '" class="viewDetail" \>View Detail</a></td>';

        var status = ctx.CurrentItem.ApprovalStatus + "";
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
        tr = "<tr>" + viewDetail + requester + department + vehicleType + from + to + reason + statusVal + "</tr>";
        return tr;
    }
    function pagingControl(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();

(function () {
    var DepartmentTransportationConfig = {
        VehicleManagement_ViewDetail: "View Detail",
        VehicleManagement_Requester: "Requester",
        VehicleManagement_Department: "Department",
        VehicleManagement_VehicleType: 'Vehicle Type',
        VehicleManagement_CompanyPickup: 'Company Pickup',
        VehicleManagement_CommonFrom: "From",
        VehicleManagement_CommonTo: "To",
        VehicleManagement_Reason: "Reason",
        VehicleManagement_ApprovalStatus: "Approval Status",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        Container: "vehicle-bydept-container"
    };
    (function () {
        var overrideCtx = {};
        overrideCtx.Templates = {};
        overrideCtx.Templates.Item = CustomItem;
        overrideCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCtx.BaseViewID = 2;
        overrideCtx.ListTemplateType = 10013;
        overrideCtx.OnPostRender = PostRender;
        overrideCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='viewDetailTHVehicleDept'>" + DepartmentTransportationConfig.VehicleManagement_ViewDetail + "</th>" +
        "<th id='requesterTHVehicleDept'>" + DepartmentTransportationConfig.VehicleManagement_Requester + "</th>" +
        "<th id='departmentTHVehicleDept'>" + DepartmentTransportationConfig.VehicleManagement_Department + "</th>" +
        "<th id='vehicleTypeTHVehicleDept'>" + DepartmentTransportationConfig.VehicleManagement_VehicleType + "</th>" +
        "<th id='companyPickupTHVehicleDept'>" + DepartmentTransportationConfig.VehicleManagement_CompanyPickup + "</th>" +
        "<th id='fromTHVehicleDept'>" + DepartmentTransportationConfig.VehicleManagement_CommonFrom + "</th>" +
        "<th id='toTHVehicleDept'>" + DepartmentTransportationConfig.VehicleManagement_CommonTo + "</th>" +
        "<th id='reasonTHVehicleDept'>" + DepartmentTransportationConfig.VehicleManagement_Reason + "</th>" +
        "<th id='approvalStatusTHVehicleDept'>" + DepartmentTransportationConfig.VehicleManagement_ApprovalStatus + "</th>" +
        "</tr></thead><tbody>";
        overrideCtx.Templates.Footer = pagingControl;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
    })();
    function PostRender(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            DepartmentTransportationConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(DepartmentTransportationConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + DepartmentTransportationConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(DepartmentTransportationConfig.ListResourceFileName, "Res", OnListResourcesReady);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + DepartmentTransportationConfig.Container + ' .department-locale').each(function () {
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
        $('#viewDetailTHVehicleDept').text(Res.vehicleManagement_ViewDetail);
        $('#requesterTHVehicleDept').text(Res.vehicleManagement_Requester);
        $('#departmentTHVehicleDept').text(Res.vehicleManagement_Department);
        $('#vehicleTypeTHVehicleDept').text(Res.vehicleManagement_VehicleType);
        $("#companyPickupTHVehicleDept").text(Res.vehicleManagement_CompanyPickup);
        $('#fromTHVehicleDept').text(Res.vehicleManagement_CommonFrom);
        $('#toTHVehicleDept').text(Res.vehicleManagement_CommonTo);
        $('#reasonTHVehicleDept').text(Res.vehicleManagement_Reason);
        $('#approvalStatusTHVehicleDept').text(Res.vehicleManagement_ApprovalStatus);
        $('#' + DepartmentTransportationConfig.Container + ' .label-success').text(Res.approvalStatus_Approved);
        $('#' + DepartmentTransportationConfig.Container + ' .label-warning').text(Res.approvalStatus_Cancelled);
        $('#' + DepartmentTransportationConfig.Container + ' .label-danger').text(Res.approvalStatus_Rejected);
        $('#' + DepartmentTransportationConfig.Container + ' .viewDetail').text(Res.vehicleManagement_ViewDetail);
        $('#vehicle-bydept-container tr').find('td:nth(3):contains("Company")').text(Res.vehicleManagement_VehicleType_Choice_Company);
        $('#vehicle-bydept-container tr').find('td:nth(3):contains("Private")').text(Res.vehicleManagement_VehicleType_Choice_Private);
    }
    function pad(n) {
        return (n < 10) ? ("0" + n) : n;
    }
    function CustomItem(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var vehicleType = '<td> ' + ctx.CurrentItem.VehicleType + '</td>';
        var pickupTemp = ctx.CurrentItem.CompanyPickup[0] == null ? ' ' : ctx.CurrentItem.CompanyPickup[0].lookupValue;
        var companyPickup = '<td> ' + pickupTemp + '</td>';
        var from = '<td> ' + ctx.CurrentItem.CommonFrom + '</td>';
        var to = '<td> ' + ctx.CurrentItem.To + '</td>';
        var reason = '<td>' + ctx.CurrentItem.Reason + '</td>';
        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab3';
        sourceURL = encodeURIComponent(sourceURL);
        var viewDetail = '<td><a href="/Lists/VehicleManagement/EditForm.aspx?subSection=TransportationManagement&ID=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '" class="viewDetail" \>View Detail</a></td>';

        var status = ctx.CurrentItem.ApprovalStatus + "";
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
        tr = "<tr>" + viewDetail + requester + department + vehicleType + companyPickup + from + to + reason + statusVal + "</tr>";
        return tr;
    }
    function pagingControl(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();

(function () {
    var RequestTransportationConfig = {
        VehicleManagement_ViewDetail: "View Detail",
        VehicleManagement_Requester: "Requester",
        VehicleManagement_VehicleType: 'Vehicle Type',
        VehicleManagement_CompanyPickup: 'Company Pickup',
        VehicleManagement_CommonFrom: "From",
        VehicleManagement_CommonTo: "To",
        VehicleManagement_Reason: "Reason",
        VehicleManagement_ApprovalStatus: "Approval Status",
        ApprovalStatus: '',
        RequestStatusApproved: '',
        RequestStatusRejected: '',
        RequestStatusCancelled: '',
        RequestStatusInProgress: '',
        VehicleManagement_ListTitle: 'Vehicle Management',
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Container: "vehicle-request-container",
        IsInProgress: false
    };
    (function () {
        var overrideCtx = {};
        overrideCtx.Templates = {};
        overrideCtx.Templates.Item = CustomItem;
        overrideCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCtx.BaseViewID = 3;
        overrideCtx.ListTemplateType = 10013;
        overrideCtx.OnPostRender = PostRender;
        overrideCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='viewDetailTHVehicleRequestList'>" + RequestTransportationConfig.VehicleManagement_ViewDetail + "</th>" +
        "<th id='requesterTHVehicleRequestList'>" + RequestTransportationConfig.VehicleManagement_Requester + "</th>" +
        "<th id='vehicleTypeTHVehicleRequestList'>" + RequestTransportationConfig.VehicleManagement_VehicleType + "</th>" +
        "<th id='companyPickupTHVehicleRequestList'>" + RequestTransportationConfig.VehicleManagement_CompanyPickup + "</th>" +
        "<th id='fromTHVehicleRequestList'>" + RequestTransportationConfig.VehicleManagement_CommonFrom + "</th>" +
        "<th id='toTHVehicleRequestList'>" + RequestTransportationConfig.VehicleManagement_CommonTo + "</th>" +
        "<th id='reasonTHVehicleRequestList'>" + RequestTransportationConfig.VehicleManagement_Reason + "</th>" +
        "<th id='approvalStatusTHVehicleRequestList'>" + RequestTransportationConfig.VehicleManagement_ApprovalStatus + "</th>" +
        "<th></th>" +
        "</tr></thead><tbody>";
        overrideCtx.Templates.Footer = pagingControl;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
    })();
    function PostRender(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            SP.SOD.registerSod(RequestTransportationConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + RequestTransportationConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(RequestTransportationConfig.ListResourceFileName, "Res", OnListResourcesReady);
            SP.SOD.registerSod(RequestTransportationConfig.PageResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + RequestTransportationConfig.PageResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(RequestTransportationConfig.PageResourceFileName, "Res", OnPageResourcesReady);
        }, "strings.js");

        $('.cancel-request').click(function () {
            updateListItem($(this).attr('data-id'), $(this));
            $(this).attr('disabled', 'true');
        });
    }
    function OnListResourcesReady() {
        $('#viewDetailTHVehicleRequestList').text(Res.vehicleManagement_ViewDetail);
        $('#requesterTHVehicleRequestList').text(Res.vehicleManagement_Requester);
        $('#vehicleTypeTHVehicleRequestList').text(Res.vehicleManagement_VehicleType);
        $("#companyPickupTHVehicleRequestList").text(Res.vehicleManagement_CompanyPickup);
        $('#fromTHVehicleRequestList').text(Res.vehicleManagement_CommonFrom);
        $('#toTHVehicleRequestList').text(Res.vehicleManagement_CommonTo);
        $('#reasonTHVehicleRequestList').text(Res.vehicleManagement_Reason);
        $('#approvalStatusTHVehicleRequestList').text(Res.vehicleManagement_ApprovalStatus);
        $('#' + RequestTransportationConfig.Container + ' .label-success').text(Res.approvalStatus_Approved);
        $('#' + RequestTransportationConfig.Container + ' .label-warning').text(Res.approvalStatus_Cancelled);
        $('#' + RequestTransportationConfig.Container + ' .label-danger').text(Res.approvalStatus_Rejected);
        $('#' + RequestTransportationConfig.Container + ' .cancel-request').text(Res.notOverTimeManagement_CancelRequest);
        $('#' + RequestTransportationConfig.Container + ' .viewDetail').text(Res.vehicleManagement_ViewDetail);
        $('#vehicle-request-container tr').find('td:nth(2):contains("Company")').text(Res.vehicleManagement_VehicleType_Choice_Company);
        $('#vehicle-request-container tr').find('td:nth(2):contains("Private")').text(Res.vehicleManagement_VehicleType_Choice_Private);
    }
    function OnPageResourcesReady() {
        RequestTransportationConfig.RequestStatusApproved = Res.requestStatusApproved;
        RequestTransportationConfig.RequestStatusRejected = Res.requestStatusRejected;
        RequestTransportationConfig.RequestStatusCancelled = Res.requestStatusCancelled;
        RequestTransportationConfig.RequestStatusInProgress = Res.requestStatusInProgress;
    }
    function pad(n) {
        return (n < 10) ? ("0" + n) : n;
    }
    function CustomItem(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var vehicleType = '<td> ' + ctx.CurrentItem.VehicleType + '</td>';
        var pickupTemp = ctx.CurrentItem.CompanyPickup[0] == null ? ' ' : ctx.CurrentItem.CompanyPickup[0].lookupValue;
        var companyPickup = '<td> ' + pickupTemp + '</td>';
        var from = '<td> ' + ctx.CurrentItem.CommonFrom + '</td>';
        var to = '<td> ' + ctx.CurrentItem.To + '</td>';
        var reason = '<td>' + ctx.CurrentItem.Reason + '</td>';

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab1';
        sourceURL = encodeURIComponent(sourceURL);

        var viewDetail = '<td><a href="/Lists/VehicleManagement/EditForm.aspx?subSection=TransportationManagement&ID=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '" class="viewDetail" \>View Detail</a></td>';

        var status = ctx.CurrentItem.ApprovalStatus + "";
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
        else if (status && status.length > 0) {
            statusVal = '<td><span class="label label-default statusmultilang">' + ctx.CurrentItem.ApprovalStatus + '</span></td>';
            action = "<td><button type='button' class='btn btn-default btn-sm cancel-request'  data-id='" + ctx.CurrentItem.ID + "'>Cancel Request</button></td>";
        }
        else {
            statusVal = '<td><span class="label label-default">In-Progress</span></td>';
            action = "<td><button type='button' class='btn btn-default btn-sm cancel-request'  data-id='" + ctx.CurrentItem.ID + "'>Cancel Request</button></td>";
        }

        tr = "<tr>" + viewDetail + requester + vehicleType + companyPickup + from + to + reason + statusVal + action + "</tr>";
        return tr;
    }
    function pagingControl(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }

    function updateListItem(itemId) {
        checkIsCancelled(itemId);
        if (RequestTransportationConfig.ApprovalStatus === "Approved") {
            alert(RequestTransportationConfig.RequestStatusApproved);
            location.reload();
        }
        else if (RequestTransportationConfig.ApprovalStatus === "Rejected") {
            alert(RequestTransportationConfig.RequestStatusRejected);
            location.reload();
        }
        else if (RequestTransportationConfig.ApprovalStatus === "Cancelled") {
            alert(RequestTransportationConfig.RequestStatusCancelled);
            location.reload();
        }
        else if (RequestTransportationConfig.IsInProgress === false) {
            var siteUrl = _spPageContextInfo.webServerRelativeUrl;
            var fullWebUrl = window.location.protocol + '//' + window.location.host + siteUrl;
            var clientContext = new SP.ClientContext(fullWebUrl);
            var oList = clientContext.get_web().get_lists().getByTitle(String(RequestTransportationConfig.VehicleManagement_ListTitle));
            clientContext.load(oList);
            this.oListItem = oList.getItemById(itemId);
            oListItem.set_item('ApprovalStatus', 'Cancelled');
            oListItem.update();
            clientContext.executeQueryAsync(Function.createDelegate(this, function () { location.reload(); }), Function.createDelegate(this, function () { }));
        }
    }
    function onQuerySucceeded() {
    }
    function onQueryFailed(sender, args) {
    }
    function checkIsCancelled(itemId) {
        var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + String(RequestTransportationConfig.VehicleManagement_ListTitle) + "')/items(" + itemId + ")";
        var d = $.Deferred();
        $.ajax({
            url: url,
            method: "GET",
            async: false,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                RequestTransportationConfig.ApprovalStatus = data.d.ApprovalStatus;
                if (data.d.AuthorId != data.d.EditorId) {
                    RequestTransportationConfig.IsInProgress = true;
                }
                d.resolve(data.d);
            },
            error: function (data) {
                status = 'failed';
            }
        });
        return d.promise();
    }
})();