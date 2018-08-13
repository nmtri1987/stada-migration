(function () {
    var FreightRequestApprovalConfig = {
        FreightManagement_ViewDetail: "View Detail",
        FreightManagement_Requester: "Requester",
        FreightManagement_Department: "Department",
        FreightManagement_Bringer: "Bringer",
        FreightManagement_Receiver: "Received by",
        FreightManagement_Created: "Created",
        FreightManagement_ApprovalStatus: "Approval status",
        FreightManagement_RequestNumber: "Request number",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        CompanyVehicle: "Company's Vehicle",
        Locale: '',
        Container: "freight-approval-container",
    };

    (function () {
        var overrideCSRDepartmentCtx = {};
        overrideCSRDepartmentCtx.Templates = {};
        overrideCSRDepartmentCtx.Templates.Item = CustomItem_FreightDepartment;
        overrideCSRDepartmentCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCSRDepartmentCtx.ListTemplateType = 10015;
        overrideCSRDepartmentCtx.BaseViewID = 3;
        overrideCSRDepartmentCtx.OnPostRender = PostRender_FreightDepartment;
        overrideCSRDepartmentCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='viewDetailTH_freightApproval'>" + FreightRequestApprovalConfig.FreightManagement_ViewDetail + "</th>" +
            "<th id='requestNoTH_freightApproval'>" + FreightRequestApprovalConfig.FreightManagement_RequestNumber + "</th>" +
            "<th id='requesterTH_freightApproval'>" + FreightRequestApprovalConfig.FreightManagement_Requester + "</th>" +
            "<th id='departmentTH_freightApproval'>" + FreightRequestApprovalConfig.FreightManagement_Department + "</th>" +
            "<th id='bringerTH_freightApproval'>" + FreightRequestApprovalConfig.FreightManagement_Bringer + "</th>" +
            "<th id='receiverTH_freightApproval'>" + FreightRequestApprovalConfig.FreightManagement_Receiver + "</th>" +
            "<th id='createdTH_freightApproval'>" + FreightRequestApprovalConfig.FreightManagement_Created + "</th>" +
            "<th id='approvalStatusTH_freightApproval'>" + FreightRequestApprovalConfig.FreightManagement_ApprovalStatus + "</th>" +
            "<th></th>" +
        "</tr></thead><tbody>";
        overrideCSRDepartmentCtx.Templates.Footer = CreateFooter;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCSRDepartmentCtx);
    })();
    function CreateFooter(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
    function PostRender_FreightDepartment(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            FreightRequestApprovalConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(FreightRequestApprovalConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + FreightRequestApprovalConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(FreightRequestApprovalConfig.ListResourceFileName, "Res", OnListResourcesReady_FreightApproval);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + FreightRequestApprovalConfig.Container + ' .department-locale').each(function () {
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
    function OnListResourcesReady_FreightApproval() {
        $('#viewDetailTH_freightApproval').text(Res.freightManagement_ViewDetail);
        $('#requesterTH_freightApproval').text(Res.freightManagement_Requester);
        $('#departmentTH_freightApproval').text(Res.overtime_Department);
        $('#bringerTH_freightApproval').text(Res.freightManagement_Bringer);
        $('#receiverTH_freightApproval').text(Res.freightManagement_Receiver);
        $('#requestNoTH_freightApproval').text(Res.freightManagement_RequestNumber);
        $('#createdTH_freightApproval').text(Res.createdDate);
        $('#approvalStatusTH_freightApproval').text(Res.freightManagement_ApprovalStatus);
        $('#' + FreightRequestApprovalConfig.Container + ' .viewDetail').text(Res.freightManagement_ViewDetail);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        $('.label-danger').text(Res.approvalStatus_Rejected);
        FreightRequestApprovalConfig.CompanyVehicle = Res.freightManagement_CompanyVehicle;
        $('.companyvehicle').text(FreightRequestApprovalConfig.CompanyVehicle);
    }
    function CustomItem_FreightDepartment(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var bringer = '<td></td>';
        if (ctx.CurrentItem.Bringer && ctx.CurrentItem.Bringer[0].lookupId > 0) {
            bringer = '<td>' + ctx.CurrentItem.Bringer[0].lookupValue + '</td>';
        }
        else if (ctx.CurrentItem.BringerName && ctx.CurrentItem.BringerName.length > 0) {
            bringer = '<td>' + ctx.CurrentItem.BringerName + '</td>';
        }
        else {
            bringer = '<td class="companyvehicle">' + FreightRequestApprovalConfig.CompanyVehicle + '</td>';
        }

        var receiver = ctx.CurrentItem.Receiver != null ? '<td>' + ctx.CurrentItem.Receiver + '</td>' : '<td></td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';
        var comment = ctx.CurrentItem.CommonComment != null ? '<td>' + Functions.parseComment(ctx.CurrentItem.CommonComment) + '</td>' : '<td></td>';

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab2';
        sourceURL = encodeURIComponent(sourceURL);
        var title = '<td><a href="/SitePages/FreightRequest.aspx?subSection=FreightManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

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
        var requestNo = ctx.CurrentItem.RequestNo != null ? '<td>' + ctx.CurrentItem.RequestNo + '</td>' : '<td></td>';
        tr = "<tr>" + title + requestNo + requester + department + bringer + receiver + created + statusVal + "</tr>";
        return tr;
    }
})();
(function () {
    var FreightRequestByDepartmentConfig = {
        FreightManagement_ViewDetail: "View Detail",
        FreightManagement_Requester: "Requester",
        FreightManagement_Department: "Department",
        FreightManagement_Bringer: "Bringer",
        FreightManagement_Receiver: "Received by",
        FreightManagement_Created: "Created",
        FreightManagement_Comment: "Comment",
        FreightManagement_ApprovalStatus: "Approval status",
        FreightManagement_RequestNumber: "Request number",
        FreightManagement_Vehicle: "Vehicle",
        ApprovalStatus: '',
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        CompanyVehicle: "Company's Vehicle",
        Locale: '',
        Container: "freight-bydepartment-container",
    };

    (function () {
        var overrideCSRDepartmentCtx = {};
        overrideCSRDepartmentCtx.Templates = {};
        overrideCSRDepartmentCtx.Templates.Item = CustomItem_FreightDepartment;
        overrideCSRDepartmentCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCSRDepartmentCtx.ListTemplateType = 10015;
        overrideCSRDepartmentCtx.BaseViewID = 4;
        overrideCSRDepartmentCtx.OnPostRender = PostRender_FreightDepartment;
        overrideCSRDepartmentCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
            "<thead><tr><th id='viewDetailTH_freightDept'>" + FreightRequestByDepartmentConfig.FreightManagement_ViewDetail + "</th>" +
            "<th id='requestNoTH_freightDept'>" + FreightRequestByDepartmentConfig.FreightManagement_RequestNumber + "</th>" +
            "<th id='requesterTH_freightDept'>" + FreightRequestByDepartmentConfig.FreightManagement_Requester + "</th>" +
            "<th id='departmentTH_freightDept'>" + FreightRequestByDepartmentConfig.FreightManagement_Department + "</th>" +
            "<th id='bringerTH_freightDept'>" + FreightRequestByDepartmentConfig.FreightManagement_Bringer + "</th>" +
            "<th id='receiverTH_freightDept'>" + FreightRequestByDepartmentConfig.FreightManagement_Receiver + "</th>" +
            "<th id='createdTH_freightDept'>" + FreightRequestByDepartmentConfig.FreightManagement_Created + "</th>" +
            "<th id='commentTH_freightDept'>" + FreightRequestByDepartmentConfig.FreightManagement_Comment + "</th>" +
            "<th id='isValid_freightDept'>" + FreightRequestByDepartmentConfig.LeaveManagement_IsValid + "</th>" +
            "<th id='approvalStatusTH_freightDept'>" + FreightRequestByDepartmentConfig.FreightManagement_ApprovalStatus + "</th>" +
            "<th id='vehicle_freightDept' style='min-width:80px;'>" + FreightRequestByDepartmentConfig.FreightManagement_Vehicle + "</th>" +
            "<th></th>" +
            "</tr></thead><tbody>";
        overrideCSRDepartmentCtx.Templates.Footer = CreateFooter;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCSRDepartmentCtx);
    })();
    function CreateFooter(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
    function PostRender_FreightDepartment(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            FreightRequestByDepartmentConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(FreightRequestByDepartmentConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + FreightRequestByDepartmentConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(FreightRequestByDepartmentConfig.ListResourceFileName, "Res", OnListResourcesReady_FreightDepartment);
        }, "strings.js", "sp.js", "string.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + FreightRequestByDepartmentConfig.Container + ' .department-locale').each(function () {
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
    function OnListResourcesReady_FreightDepartment() {
        $('#viewDetailTH_freightDept').text(Res.freightManagement_ViewDetail);
        $('#requesterTH_freightDept').text(Res.freightManagement_Requester);
        $("#requestNoTH_freightDept").text(Res.freightManagement_RequestNumber);
        $('#departmentTH_freightDept').text(Res.overtime_Department);
        $('#bringerTH_freightDept').text(Res.freightManagement_Bringer);
        $('#receiverTH_freightDept').text(Res.freightManagement_Receiver);
        $('#createdTH_freightDept').text(Res.createdDate);
        $('#commentTH_freightDept').text(Res.commonComment);
        $('#isValid_freightDept').text(Res.freightList_IsValidRequest);
        $('#approvalStatusTH_freightDept').text(Res.freightManagement_ApprovalStatus);
        $('#vehicle_freightDept').text(Res.freightManagement_Vehicle);
        $('#' + FreightRequestByDepartmentConfig.Container + ' .viewDetail').text(Res.freightManagement_ViewDetail);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        $('.label-danger').text(Res.approvalStatus_Rejected);
        FreightRequestByDepartmentConfig.CompanyVehicle = Res.freightManagement_CompanyVehicle;
        $('.companyvehicle').text(FreightRequestByDepartmentConfig.CompanyVehicle);
    }

    function CustomItem_FreightDepartment(ctx) {
        var lcid = _spPageContextInfo.currentLanguage;
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var requestNo = ctx.CurrentItem.RequestNo != null ? '<td>' + ctx.CurrentItem.RequestNo + '</td>' : '<td></td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var bringer = '<td></td>';
        if (ctx.CurrentItem.Bringer && ctx.CurrentItem.Bringer[0].lookupId > 0) {
            bringer = '<td>' + ctx.CurrentItem.Bringer[0].lookupValue + '</td>';
        }
        else if (ctx.CurrentItem.BringerName && ctx.CurrentItem.BringerName.length > 0) {
            bringer = '<td>' + ctx.CurrentItem.BringerName + '</td>';
        }
        else {
            bringer = '<td class="companyvehicle">' + FreightRequestByDepartmentConfig.CompanyVehicle + '</td>';
        }
        var receiver = ctx.CurrentItem.Receiver != null ? '<td>' + ctx.CurrentItem.Receiver + '</td>' : '<td></td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';
        var comment = ctx.CurrentItem.CommonComment != null ? '<td>' + Functions.parseComment(ctx.CurrentItem.CommonComment) + '</td>' : '<td></td>';

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab3';
        sourceURL = encodeURIComponent(sourceURL);
        var title = '<td><a href="/SitePages/FreightRequest.aspx?subSection=FreightManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

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
        var vehicleValue = "";
        if (ctx.CurrentItem.VehicleLookup[0]) {
            vehicleValue = ctx.CurrentItem.VehicleLookup[0].lookupValue;
        }
        if (lcid == 1066) {
            vehicleValue = ctx.CurrentItem.VehicleVN != null ? ctx.CurrentItem.VehicleVN : "";
        }
        var vehicle = '<td>' + vehicleValue + '</td>';

        var isRequestValidCss = "";
        var isRequestValidTh = "";
        if (ctx.CurrentItem["IsValidRequest.value"] && ctx.CurrentItem["IsValidRequest.value"] === "1") {
            isRequestValidTh = "<td><span style='margin-left:25%; ' class='glyphicon glyphicon-ok'></td>";
        }
        else {
            isRequestValidTh = "<td><span style='margin-left:25%;' class='glyphicon glyphicon-remove'></td>";
            isRequestValidCss = "style='background-color: #fff7e6;'";
        }

        tr = "<tr " + isRequestValidCss + " >" + title + requestNo + requester + department + bringer + receiver + created + comment + isRequestValidTh + statusVal + vehicle + "</tr>";
        return tr;
    }
})();
(function () {
    var FreightRequestListConfig = {
        FreightManagement_ViewDetail: "View Detail",
        FreightManagement_Requester: "Requester",
        FreightManagement_Bringer: "Bringer",
        FreightManagement_Receiver: "Received by",
        FreightManagement_Created: "Created",
        FreightManagement_Comment: "Comment",
        FreightManagement_IsValid: "Is valid",
        FreightManagement_ApprovalStatus: "Approval status",
        FreightManagement_RequestNumber: "Request number",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        CompanyVehicle: "Company's Vehicle",
        Locale: '',
        Container: "freight-request-list-container",
    };

    (function () {
        var overrideFreightRequestCtx = {};
        overrideFreightRequestCtx.Templates = {};
        overrideFreightRequestCtx.Templates.Item = CustomItemFreightRequest;
        overrideFreightRequestCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };

        overrideFreightRequestCtx.ListTemplateType = 10015;
        overrideFreightRequestCtx.BaseViewID = 2;
        overrideFreightRequestCtx.OnPostRender = PostRender_FreightRequestList;
        overrideFreightRequestCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
            "<thead><tr><th id='freight-request-detail'>" + FreightRequestListConfig.FreightManagement_ViewDetail + "</th>" +
            "<th id='freight-request-requestNo'>" + FreightRequestListConfig.FreightManagement_RequestNumber + "</th>" +
            "<th id='freight-request-requester'>" + FreightRequestListConfig.FreightManagement_Requester + "</th>" +
            "<th id='freight-request-bringer'>" + FreightRequestListConfig.FreightManagement_Bringer + "</th>" +
            "<th id='freight-request-receiver'>" + FreightRequestListConfig.FreightManagement_Receiver + "</th>" +
            "<th id='freight-request-created'>" + FreightRequestListConfig.FreightManagement_Created + "</th>" +
            "<th id='freight-request-comment'>" + FreightRequestListConfig.FreightManagement_Comment + "</th>" +
            "<th id='freight-request-status'>" + FreightRequestListConfig.FreightManagement_ApprovalStatus + "</th>" +
            "<th id='freight-request-isValid'>" + FreightRequestListConfig.FreightManagement_IsValid + "</th>" +
            "<th id='freight-request-action'>" + '' + "</th>" +
            "<th></th>" +
            "</tr></thead><tbody>";
        overrideFreightRequestCtx.Templates.Footer = pagingControlFreightRequest;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideFreightRequestCtx);
    })();

    function PostRender_FreightRequestList(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            FreightRequestListConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(FreightRequestListConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + FreightRequestListConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(FreightRequestListConfig.ListResourceFileName, "Res", OnListResourcesReadyFreightRequest);
        }, "strings.js");
    }

    function OnListResourcesReadyFreightRequest() {
        $('.freight-request-cancel').click(function () {
            $(this).attr('disabled', 'true');
            var freightId = $(this).attr('data-id');
            var requestLink = window.location.protocol + "//{0}/_vti_bin/services/Freightmanagement/Freightmanagementservice.svc/CancelFreight/{1}",
            requestLink = RBVH.Stada.WebPages.Utilities.String.format(requestLink, location.host, freightId);
            if (freightId) {
                $.ajax({
                    type: "GET",
                    url: requestLink,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (resultData) {
                        if (resultData.Code === 6) {
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

        $('#freight-request-detail').text(Res.freightManagement_ViewDetail);
        $('#freight-request-requestNo').text(Res.freightManagement_RequestNumber);
        $('#freight-request-requester').text(Res.freightManagement_Requester);
        $('#freight-request-bringer').text(Res.freightManagement_Bringer);
        $('#freight-request-receiver').text(Res.freightManagement_Receiver);
        $('#freight-request-created').text(Res.createdDate);
        $('#freight-request-comment').text(Res.commonComment);
        $('#freight-request-status').text(Res.freightManagement_ApprovalStatus);
        $('#freight-request-isValid').text(Res.freightList_IsValidRequest);
        $('#' + FreightRequestListConfig.Container + ' .viewDetail').text(Res.freightManagement_ViewDetail);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        $('.label-danger').text(Res.approvalStatus_Rejected);
        $('.freight-request-cancel').text(Res.freightManagement_CancelRequest);
        FreightRequestListConfig.CompanyVehicle = Res.freightManagement_CompanyVehicle;
        $('.companyvehicle').text(FreightRequestListConfig.CompanyVehicle);
    }

    function CustomItemFreightRequest(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var bringer = '<td></td>';
        if (ctx.CurrentItem.Bringer && ctx.CurrentItem.Bringer[0].lookupId > 0) {
            bringer = '<td>' + ctx.CurrentItem.Bringer[0].lookupValue + '</td>';
        }
        else if (ctx.CurrentItem.BringerName && ctx.CurrentItem.BringerName.length > 0) {
            bringer = '<td>' + ctx.CurrentItem.BringerName + '</td>';
        }
        else {
            bringer = '<td class="companyvehicle">' + FreightRequestListConfig.CompanyVehicle + '</td>';
        }

        var receiver = ctx.CurrentItem.Receiver != null ? '<td>' + ctx.CurrentItem.Receiver + '</td>' : '<td></td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';
        var comment = ctx.CurrentItem.CommonComment != null ? '<td>' + Functions.parseComment(ctx.CurrentItem.CommonComment) + '</td>' : '<td></td>';

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab1';
        sourceURL = encodeURIComponent(sourceURL);
        var title = '<td><a href="/SitePages/FreightRequest.aspx?subSection=FreightManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

        var status = ctx.CurrentItem.ApprovalStatus + "";
        status = status.toLowerCase();
        var statusVal = '';

        var disabled = '';
        if ((ctx.CurrentItem.Editor[0].id !== ctx.CurrentItem.Author[0].id) || (ctx.CurrentItem.Editor[0].id === ctx.CurrentItem.Author[0].id && status === 'cancelled')) {
            disabled = 'disabled';
        }
        var action = "<td><button type='button' class='btn btn-default btn-sm freight-request-cancel' " + disabled + " data-id='" + ctx.CurrentItem.ID + "'>Cancel Request</button></td>";

        if (status === 'approved') {
            statusVal = '<td><span class="label label-success">Approved</span></td>';
        }
        else if (status === "cancelled") {
            statusVal = '<td><span class="label label-warning">Cancelled</span></td>';
        }
        else if (status === "rejected") {
            statusVal = '<td><span class="label label-danger">Rejected</span></td>';
        }
        else if (status && status.length > 0) {
            statusVal = '<td><span class="label label-default statusmultilang">' + ctx.CurrentItem.ApprovalStatus + '</span></td>';
        }
        else {
            statusVal = '<td><span class="label label-default">In-Progress</span></td>';
        }

        var isRequestValidCss = "";
        var isRequestValidTh = "";
        if (ctx.CurrentItem["IsValidRequest.value"] && ctx.CurrentItem["IsValidRequest.value"] === "1") {
            isRequestValidTh = "<td><span style='margin-left:25%; ' class='glyphicon glyphicon-ok'></td>";
        }
        else {
            isRequestValidTh = "<td><span style='margin-left:25%;' class='glyphicon glyphicon-remove'></td>";
            isRequestValidCss = "style='background-color: #fff7e6;'";
        }
        var requestNo = ctx.CurrentItem.RequestNo != null ? '<td>' + ctx.CurrentItem.RequestNo + '</td>' : '<td></td>';
        tr = "<tr " + isRequestValidCss + " >" + title + requestNo + requester + bringer + receiver + created + comment + statusVal + isRequestValidTh + action + "</tr>";
        return tr;
    }

    function pagingControlFreightRequest(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();
(function () {
    var FreightRequestSecurityConfig = {
        FreightManagement_ViewDetail: "View Detail",
        FreightManagement_Requester: "Requester",
        FreightManagement_Department: "Department",
        FreightManagement_Bringer: "Bringer",
        FreightManagement_Receiver: "Received by",
        FreightManagement_Created: "Created",
        FreightManagement_RequestNumber: "Request number",
        FreightManagement_Vehicle: "Vehicle",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        CompanyVehicle: "Company's Vehicle",
        Locale: '',
        Container: "freight-security-container",
    };
    (function () {
        var overrideCSRDepartmentCtx = {};
        overrideCSRDepartmentCtx.Templates = {};
        overrideCSRDepartmentCtx.Templates.Item = CustomItem_FreightDepartment;
        overrideCSRDepartmentCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCSRDepartmentCtx.ListTemplateType = 10015;
        overrideCSRDepartmentCtx.BaseViewID = 6;
        overrideCSRDepartmentCtx.OnPostRender = PostRender_FreightDepartment;
        overrideCSRDepartmentCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
            "<thead><tr><th id='viewDetailTH_freightSec'>" + FreightRequestSecurityConfig.FreightManagement_ViewDetail + "</th>" +
            "<th id='requestNoTH_freightSec'>" + FreightRequestSecurityConfig.FreightManagement_RequestNumber + "</th>" +
            "<th id='requesterTH_freightSec'>" + FreightRequestSecurityConfig.FreightManagement_Requester + "</th>" +
            "<th id='departmentTH_freightSec'>" + FreightRequestSecurityConfig.FreightManagement_Department + "</th>" +
            "<th id='bringerTH_freightSec'>" + FreightRequestSecurityConfig.FreightManagement_Bringer + "</th>" +
            "<th id='receiverTH_freightSec'>" + FreightRequestSecurityConfig.FreightManagement_Receiver + "</th>" +
            "<th id='createdTH_freightSec'>" + FreightRequestSecurityConfig.FreightManagement_Created + "</th>" +
            "<th id='vehicle_freightSec' style='min-width:80px;'>" + FreightRequestSecurityConfig.FreightManagement_Vehicle + "</th>" +
            //"<th></th>" +
            "</tr></thead><tbody>";
        overrideCSRDepartmentCtx.Templates.Footer = CreateFooter;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCSRDepartmentCtx);
    })();
    function CreateFooter(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
    function PostRender_FreightDepartment(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            FreightRequestSecurityConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(FreightRequestSecurityConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + FreightRequestSecurityConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(FreightRequestSecurityConfig.ListResourceFileName, "Res", OnListResourcesReady_FreightSecurity);
            SP.SOD.registerSod(FreightRequestSecurityConfig.PageResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + FreightRequestSecurityConfig.PageResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(FreightRequestSecurityConfig.PageResourceFileName, "Res", OnPageResourcesReady_FreightSecurity);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + FreightRequestSecurityConfig.Container + ' .department-locale').each(function () {
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
    function OnListResourcesReady_FreightSecurity() {
        $('#viewDetailTH_freightSec').text(Res.freightManagement_ViewDetail);
        $('#requestNoTH_freightSec').text(Res.freightManagement_RequestNumber);
        $('#requesterTH_freightSec').text(Res.freightManagement_Requester);
        $('#departmentTH_freightSec').text(Res.overtime_Department);
        $('#bringerTH_freightSec').text(Res.freightManagement_Bringer);
        $('#receiverTH_freightSec').text(Res.freightManagement_Receiver);
        $('#createdTH_freightSec').text(Res.createdDate);
        $('#vehicle_freightSec').text(Res.freightManagement_Vehicle);
        FreightRequestSecurityConfig.ApprovalStatus_Cancelled = Res.approvalStatus_Cancelled;
        $('#' + FreightRequestSecurityConfig.Container + ' .viewDetail').text(Res.freightManagement_ViewDetail);
        FreightRequestSecurityConfig.CompanyVehicle = Res.freightManagement_CompanyVehicle;
        $('.companyvehicle').text(FreightRequestSecurityConfig.CompanyVehicle);
    }
    function OnPageResourcesReady_FreightSecurity() {
        FreightRequestSecurityConfig.ViewDetail = Res.viewDetail;
    }
    function CustomItem_FreightDepartment(ctx) {
        var tr = "";
        var currentID = ctx.CurrentItem.ID;
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var bringer = '<td></td>';
        if (ctx.CurrentItem.Bringer && ctx.CurrentItem.Bringer[0].lookupId > 0) {
            bringer = '<td>' + ctx.CurrentItem.Bringer[0].lookupValue + '</td>';
        }
        else if (ctx.CurrentItem.BringerName && ctx.CurrentItem.BringerName.length > 0) {
            bringer = '<td>' + ctx.CurrentItem.BringerName + '</td>';
        }
        else {
            bringer = '<td class="companyvehicle">' + FreightRequestSecurityConfig.CompanyVehicle + '</td>';
        }

        var receiver = ctx.CurrentItem.Receiver != null ? '<td>' + ctx.CurrentItem.Receiver + '</td>' : '<td></td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';

        var vehicleName = "";
        if (ctx.CurrentItem.CompanyVehicle && ctx.CurrentItem["CompanyVehicle.value"] && ctx.CurrentItem["CompanyVehicle.value"] === "1") {
            if (_spPageContextInfo.currentLanguage == 1033) {
                if (ctx.CurrentItem.VehicleLookup && ctx.CurrentItem.VehicleLookup.length > 0) {
                    vehicleName = ctx.CurrentItem.VehicleLookup[0].lookupValue;
                }
            }
            else {
                if (ctx.CurrentItem.VehicleVN && ctx.CurrentItem.VehicleVN.length > 0) {
                    vehicleName = ctx.CurrentItem.VehicleVN;
                }
            }
        }
        vehicleName = "<td>" + vehicleName + "</td>";

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab4';
        sourceURL = encodeURIComponent(sourceURL);
        var title = '<td><a href="/SitePages/FreightRequest.aspx?subSection=FreightManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

        var requestNo = ctx.CurrentItem.RequestNo != null ? '<td>' + ctx.CurrentItem.RequestNo + '</td>' : '<td></td>';

        tr = "<tr>" + title + requestNo + requester + department + bringer + receiver + created + vehicleName + "</tr>";
        return tr;
    }
})();
(function () {
    var FreightVehicleOperatorConfig = {
        FreightManagement_ViewDetail: "View Detail",
        FreightManagement_Requester: "Requester",
        FreightManagement_Department: "Department",
        FreightManagement_Bringer: "Bringer",
        FreightManagement_Receiver: "Received by",
        FreightManagement_Created: "Created",
        FreightManagement_Comment: "Comment",
        FreightManagement_ApprovalStatus: "Approval status",
        FreightManagement_RequestNumber: "Request number",
        FreightManagement_Vehicle: "Vehicle",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        CompanyVehicle: "Company's Vehicle",
        Locale: '',
        FreightManagement_UpdateFreightSuccess: "Update vehicle successfully!",
        Container: "freight-vehicle-operator-container",
    };

    (function () {
        var overrideCSRDepartmentCtx = {};
        overrideCSRDepartmentCtx.Templates = {};
        overrideCSRDepartmentCtx.Templates.Item = CustomItem_FreightVehicleOperator;
        overrideCSRDepartmentCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCSRDepartmentCtx.ListTemplateType = 10015;
        overrideCSRDepartmentCtx.BaseViewID = 7;
        overrideCSRDepartmentCtx.OnPostRender = PostRender_FreightVehicleOperator;
        overrideCSRDepartmentCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
            "<thead><tr><th id='viewDetailTH_freightOperator'>" + FreightVehicleOperatorConfig.FreightManagement_ViewDetail + "</th>" +
            "<th id='requestNoTH_freightOperator'>" + FreightVehicleOperatorConfig.FreightManagement_RequestNumber + "</th>" +
            "<th id='requesterTH_freightOperator'>" + FreightVehicleOperatorConfig.FreightManagement_Requester + "</th>" +
            "<th id='departmentTH_freightOperator'>" + FreightVehicleOperatorConfig.FreightManagement_Department + "</th>" +
            "<th id='bringerTH_freightOperator'>" + FreightVehicleOperatorConfig.FreightManagement_Bringer + "</th>" +
            "<th id='receiverTH_freightOperator'>" + FreightVehicleOperatorConfig.FreightManagement_Receiver + "</th>" +
            "<th id='createdTH_freightOperator'>" + FreightVehicleOperatorConfig.FreightManagement_Created + "</th>" +
            "<th id='commentTH_freightOperator'>" + FreightVehicleOperatorConfig.FreightManagement_Comment + "</th>" +
            "<th id='approvalStatusTH_freightOperator'>" + FreightVehicleOperatorConfig.FreightManagement_ApprovalStatus + "</th>" +
            "<th id='vehicle_freightOperator' style='min-width:80px;'>" + FreightVehicleOperatorConfig.FreightManagement_Vehicle + "</th>" +
            "<th></th>" +
            "</tr></thead><tbody>";
        overrideCSRDepartmentCtx.Templates.Footer = CreateFooter_VehicleOperator;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCSRDepartmentCtx);
    })();
    function CreateFooter_VehicleOperator(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
    function PostRender_FreightVehicleOperator(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            FreightVehicleOperatorConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(FreightVehicleOperatorConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + FreightVehicleOperatorConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(FreightVehicleOperatorConfig.ListResourceFileName, "Res", OnListResourcesReady_FreightVehicleOperator);
            SP.SOD.registerSod(FreightVehicleOperatorConfig.PageResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + FreightVehicleOperatorConfig.PageResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(FreightVehicleOperatorConfig.PageResourceFileName, "Res", OnPageResourcesReady_FreightVehicleOperator);
            loadVehicleDropdown();
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + FreightVehicleOperatorConfig.Container + ' .department-locale').each(function () {
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
    function OnListResourcesReady_FreightVehicleOperator() {
        $('#viewDetailTH_freightOperator').text(Res.freightManagement_ViewDetail);
        $('#requesterTH_freightOperator').text(Res.freightManagement_Requester);
        $("#requestNoTH_freightOperator").text(Res.freightManagement_RequestNumber);
        $('#departmentTH_freightOperator').text(Res.overtime_Department);
        $('#bringerTH_freightOperator').text(Res.freightManagement_Bringer);
        $('#receiverTH_freightOperator').text(Res.freightManagement_Receiver);
        $('#createdTH_freightOperator').text(Res.createdDate);
        $('#commentTH_freightOperator').text(Res.commonComment);
        $('#approvalStatusTH_freightOperator').text(Res.freightManagement_ApprovalStatus);
        $('#vehicle_freightOperator').text(Res.freightManagement_Vehicle);
        $('#' + FreightVehicleOperatorConfig.Container + ' .viewDetail').text(Res.freightManagement_ViewDetail);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        $('.label-danger').text(Res.approvalStatus_Rejected);
        FreightVehicleOperatorConfig.CompanyVehicle = Res.freightManagement_CompanyVehicle;
        $('.companyvehicle').text(FreightVehicleOperatorConfig.CompanyVehicle);
    }
    function OnPageResourcesReady_FreightVehicleOperator() {
        FreightVehicleOperatorConfig.FreightManagement_UpdateFreightSuccess = Res.freightManagement_UpdateVehicleSuccess;
    }
    function loadVehicleDropdown() {
        //var lcid = _spPageContextInfo.currentLanguage;
        var vehicleTDs = $("td[name^='vehicleTd_']");
        if (_rbvhContext && _rbvhContext.EmployeeInfo) {
            var serviceUrl = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/Services/FreightManagement/FreightManagementService.svc/GetVehicleOperatorInfo/" + _rbvhContext.EmployeeInfo.ID;
            var getDataPromise = $.ajax({
                url: serviceUrl,
                method: "GET",
                async: false,
                headers: { "Accept": "application/json; odata=verbose" },
            });
            getDataPromise.done(
                function (data) {
                    if (data) {
                        var isHasEditPermission = data.HasPermission;
                        if (vehicleTDs && vehicleTDs.length > 0) {
                            for (var i = 0; i < vehicleTDs.length; i++) {
                                var item = vehicleTDs[i];
                                var vehicleArray = [];
                                var id = $(item).attr("itemId");
                                var selectedId = $(item).attr("selectedVehicleId");
                                var dropdownHtml = getVehicleDropdown(id, data.FreightVehicles, selectedId);
                                if (isHasEditPermission == true) {
                                    $(item).append(dropdownHtml[0]);
                                    $(dropdownHtml[1]).insertAfter(item);
                                }
                                else {
                                    $(item).append(vehicleValue);
                                }
                            }
                        }
                        if (isHasEditPermission == true) {
                            setSelectedVehicle();
                        }
                    }
                    updateFreightEventRegister();
                },
                function (error) {
                    console.log("Error");
                }
            );
        }
    }
    function getVehicleDropdown(id, dataArray, selectedId) {
        var lcid = _spPageContextInfo.currentLanguage;
        var dropdownName = ("ddVehicle_" + id);
        var buttonName = ("button_" + id);
        var controlHtml = '<select style="width: 145px; display: inline;" name="' + dropdownName + '" selectedVehicleId="' + selectedId + '" itemId="' + id + '">';
        var defaultVal = "None";
        if (lcid == 1066) {
            defaultVal = "Không có";
        }
        else {
            defaultVal = "None";
        }
        controlHtml += '<option vehiclevaluevn="" value="0" vehiclevalue="">' + defaultVal + '</option>';
        if (dataArray && dataArray.length > 0) {
            for (var i = 0; i < dataArray.length; i++) {
                var textLabel = dataArray[i].Vehicle;
                if (lcid == 1066) {
                    textLabel = dataArray[i].VehicleVN;
                }
                controlHtml += ('<option vehicleLookupId="' + dataArray[i].ID + '" vehiclevaluevn="' + dataArray[i].VehicleVN + '" vehiclevalue="' + dataArray[i].Vehicle + '" value="' + dataArray[i].ID + '">' + textLabel + '</option>');
            }
        }
        controlHtml += '</select>';
        var actionButtonHtml = '<td><button class="btn btn-primary update-Freight" style="display: inline; margin-left: 5px; font-size: smaller" name="' + buttonName + '" ddName="' + dropdownName + '" type="button">OK</button></td>';
        return [controlHtml, actionButtonHtml];
    }
    function setSelectedVehicle() {
        var vehicleDropdowns = $("select[name^='ddVehicle_']");
        if (vehicleDropdowns && vehicleDropdowns.length > 0) {
            for (var i = 0; i < vehicleDropdowns.length; i++) {
                var item = vehicleDropdowns[i];
                var selectedVehicleValue = $(item).attr("selectedVehicleId");
                if (selectedVehicleValue) {
                    $(item).val(selectedVehicleValue.trim()).change();
                }
            }
        }
    }
    function updateFreightEventRegister() {
        $(".update-Freight").on("click", function () {
            var item = $(this);
            var dropdownName = item.attr("ddName");
            var itemId = $("select[name='" + dropdownName + "']").attr("itemId");
            var selectedOption = $("select[name='" + dropdownName + "'] option:selected");
            var selectedValueVn = selectedOption.attr("vehiclevaluevn");
            var selectedValue = selectedOption.attr("vehiclevalue");
            var vehicleLookupId = selectedOption.attr("value");
            if (itemId != undefined && selectedValueVn != undefined && selectedValue != undefined) {
                var updateVehicleServiceUrl = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/Services/FreightManagement/FreightManagementService.svc/UpdateFreightVehicle";
                var itemData = {};

                itemData.Id = parseInt(itemId);

                var vehicleId = (vehicleLookupId > 0 && vehicleLookupId.length > 0) ? parseInt(vehicleLookupId) : 0;

                itemData.VehicleLookup = { LookupId: parseInt(vehicleId), LookupValue: selectedValue };
                itemData.VehicleVN = { LookupId: parseInt(vehicleId), LookupValue: selectedValueVn };

                $.ajax({
                    url: updateVehicleServiceUrl,
                    method: "POST",
                    async: false,
                    data: JSON.stringify(itemData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (data.Code == 0) {
                            alert(FreightVehicleOperatorConfig.FreightManagement_UpdateFreightSuccess);
                        }
                    },
                    error: function (data) {
                        console.log("Update vehicle failed");
                    }
                });
            }
        });
    }
    function CustomItem_FreightVehicleOperator(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var requestNo = ctx.CurrentItem.RequestNo != null ? '<td>' + ctx.CurrentItem.RequestNo + '</td>' : '<td></td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var bringer = '<td></td>';
        if (ctx.CurrentItem.Bringer && ctx.CurrentItem.Bringer[0].lookupId > 0) {
            bringer = '<td>' + ctx.CurrentItem.Bringer[0].lookupValue + '</td>';
        }
        else if (ctx.CurrentItem.BringerName && ctx.CurrentItem.BringerName.length > 0) {
            bringer = '<td>' + ctx.CurrentItem.BringerName + '</td>';
        }
        else {
            bringer = '<td class="companyvehicle">' + FreightVehicleOperatorConfig.CompanyVehicle + '</td>';
        }
        var receiver = ctx.CurrentItem.Receiver != null ? '<td>' + ctx.CurrentItem.Receiver + '</td>' : '<td></td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';
        var comment = ctx.CurrentItem.CommonComment != null ? '<td>' + Functions.parseComment(ctx.CurrentItem.CommonComment) + '</td>' : '<td></td>';

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab5';
        sourceURL = encodeURIComponent(sourceURL);
        var title = '<td><a href="/SitePages/FreightRequest.aspx?subSection=FreightManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

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
        var vehicleLookupId = "0";
        if (ctx.CurrentItem.VehicleLookup && ctx.CurrentItem.VehicleLookup[0]) {
            vehicleLookupId = ctx.CurrentItem.VehicleLookup[0].lookupId;
        }

        var vehicle = '<td name="vehicleTd_' + ctx.CurrentItem.ID + '" itemId="' + ctx.CurrentItem.ID + '" selectedVehicleId="' + vehicleLookupId + '" ></td>';
        tr = "<tr>" + title + requestNo + requester + department + bringer + receiver + created + comment + statusVal + vehicle + "</tr>";
        return tr;
    }
})();
(function () {
    var MyFreightListConfig = {
        FreightManagement_ViewDetail: "View Detail",
        FreightManagement_Requester: "Requester",
        FreightManagement_Bringer: "Bringer",
        FreightManagement_Receiver: "Received by",
        FreightManagement_Created: "Created",
        FreightManagement_Comment: "Comment",
        FreightManagement_ApprovalStatus: "Approval status",
        FreightManagement_RequestNumber: "Request number",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        CompanyVehicle: "Company's Vehicle",
        Locale: '',
        Container: "my-freight-list-container",
    };
    (function () {
        var overrideMyFreightCtx = {};
        overrideMyFreightCtx.Templates = {};
        overrideMyFreightCtx.Templates.Item = CustomItemMyFreight;
        overrideMyFreightCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideMyFreightCtx.ListTemplateType = 10015;
        overrideMyFreightCtx.BaseViewID = 5;
        overrideMyFreightCtx.OnPostRender = PostRender_MyFreightList;
        overrideMyFreightCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
            "<thead><tr><th id='my-freight-detail'>" + MyFreightListConfig.FreightManagement_ViewDetail + "</th>" +
            "<th id='my-freight-requesterno'>" + MyFreightListConfig.FreightManagement_RequestNumber + "</th>" +
            "<th id='my-freight-requester'>" + MyFreightListConfig.FreightManagement_Requester + "</th>" +
            "<th id='my-freight-bringer'>" + MyFreightListConfig.FreightManagement_Bringer + "</th>" +
            "<th id='my-freight-receiver'>" + MyFreightListConfig.FreightManagement_Receiver + "</th>" +
            "<th id='my-freight-created'>" + MyFreightListConfig.FreightManagement_Created + "</th>" +
            "<th id='my-freight-comment'>" + MyFreightListConfig.FreightManagement_Comment + "</th>" +
            "<th id='my-freight-status'>" + MyFreightListConfig.FreightManagement_ApprovalStatus + "</th>" +
            "<th></th>" +
            "</tr></thead><tbody>";
        overrideMyFreightCtx.Templates.Footer = pagingControlMyFreight;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideMyFreightCtx);
    })();

    function PostRender_MyFreightList(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            MyFreightListConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(MyFreightListConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + MyFreightListConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(MyFreightListConfig.ListResourceFileName, "Res", OnListResourcesReadyMyFreight);
        }, "strings.js");
    }

    function OnListResourcesReadyMyFreight() {
        $('#my-freight-detail').text(Res.freightManagement_ViewDetail);
        $('#my-freight-requester').text(Res.freightManagement_Requester);
        $('#my-freight-bringer').text(Res.freightManagement_Bringer);
        $('#my-freight-requesterno').text(Res.freightManagement_RequestNumber);
        $('#my-freight-receiver').text(Res.freightManagement_Receiver);
        $('#my-freight-created').text(Res.createdDate);
        $('#my-freight-comment').text(Res.commonComment);
        $('#my-freight-status').text(Res.freightManagement_ApprovalStatus);
        $('#' + MyFreightListConfig.Container + ' .viewDetail').text(Res.freightManagement_ViewDetail);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        $('.label-danger').text(Res.approvalStatus_Rejected);
        MyFreightListConfig.CompanyVehicle = Res.freightManagement_CompanyVehicle;
        $('.companyvehicle').text(MyFreightListConfig.CompanyVehicle);
    }

    function CustomItemMyFreight(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var bringer = '<td></td>';
        if (ctx.CurrentItem.Bringer && ctx.CurrentItem.Bringer[0].lookupId > 0) {
            bringer = '<td>' + ctx.CurrentItem.Bringer[0].lookupValue + '</td>';
        }
        else if (ctx.CurrentItem.BringerName && ctx.CurrentItem.BringerName.length > 0) {
            bringer = '<td>' + ctx.CurrentItem.BringerName + '</td>';
        }
        else {
            bringer = '<td class="companyvehicle">' + MyFreightListConfig.CompanyVehicle + '</td>';
        }

        var receiver = ctx.CurrentItem.Receiver != null ? '<td>' + ctx.CurrentItem.Receiver + '</td>' : '<td></td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';
        var comment = ctx.CurrentItem.CommonComment != null ? '<td>' + Functions.parseComment(ctx.CurrentItem.CommonComment) + '</td>' : '<td></td>';

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab0';
        sourceURL = encodeURIComponent(sourceURL);
        var title = '<td><a href="/SitePages/FreightRequest.aspx?subSection=FreightManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

        var status = ctx.CurrentItem.ApprovalStatus + "";
        status = status.toLowerCase();
        var statusVal = '';
        if (status === 'approved') {
            statusVal = '<td><span class="label label-success">Approved</span></td>';
        }
        else if (status === "cancelled") {
            statusVal = '<td><span class="label label-warning">Cancelled</span></td>';
        }
        else if (status === "rejected") {
            statusVal = '<td><span class="label label-danger">Rejected</span></td>';
        }
        else if (status && status.length > 0) {
            statusVal = '<td><span class="label label-default statusmultilang">' + ctx.CurrentItem.ApprovalStatus + '</span></td>';
        }
        else {
            statusVal = '<td><span class="label label-default">In-Progress</span></td>';
        }
        var requestNo = ctx.CurrentItem.RequestNo != null ? '<td>' + ctx.CurrentItem.RequestNo + '</td>' : '<td></td>';
        tr = "<tr>" + title + requestNo + requester + bringer + receiver + created + comment + statusVal + "</tr>";
        return tr;
    }

    function pagingControlMyFreight(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();