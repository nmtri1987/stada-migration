(function () {
    var BusinessTripApprovalConfig = {
        BusinessTripManagement_ViewDetail: "View Detail",
        BusinessTripManagement_Requester: "Requester",
        BusinessTripManagement_Department: "Department",
        BusinessTripManagement_PurposeTitle: "Purpose",
        BusinessTripManagement_BusinessTripTypeTitle: "Business trip type",
        BusinessTripManagement_Created: "Created",
        BusinessTripManagement_ApprovalStatus: "Approval status",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        Container: "business-trip-approval-container",
    };

    (function () {
        var overrideCSRDepartmentCtx = {};
        overrideCSRDepartmentCtx.Templates = {};
        overrideCSRDepartmentCtx.Templates.Item = CustomItem_BusinessTripApproval;
        overrideCSRDepartmentCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCSRDepartmentCtx.ListTemplateType = 10059;
        overrideCSRDepartmentCtx.BaseViewID = 3;
        overrideCSRDepartmentCtx.OnPostRender = PostRender_BusinessTripDepartment;
        overrideCSRDepartmentCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='viewDetailTH_businessTripApproval'>" + BusinessTripApprovalConfig.BusinessTripManagement_ViewDetail + "</th>" +
            "<th id='requesterTH_businessTripApproval'>" + BusinessTripApprovalConfig.BusinessTripManagement_Requester + "</th>" +
            "<th id='departmentTH_businessTripApproval'>" + BusinessTripApprovalConfig.BusinessTripManagement_Department + "</th>" +
            "<th id='businessTripType_businessTripApproval'>" + BusinessTripApprovalConfig.BusinessTripManagement_BusinessTripTypeTitle + "</th>" +
            "<th id='purpose_businessTripApproval'>" + BusinessTripApprovalConfig.BusinessTripManagement_PurposeTitle + "</th>" +
            "<th id='createdTH_businessTripApproval'>" + BusinessTripApprovalConfig.BusinessTripManagement_Created + "</th>" +
            "<th id='approvalStatusTH_businessTripApproval'>" + BusinessTripApprovalConfig.BusinessTripManagement_ApprovalStatus + "</th>" +
            "<th></th>" +
        "</tr></thead><tbody>";
        overrideCSRDepartmentCtx.Templates.Footer = CreateFooter;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCSRDepartmentCtx);
    })();
    function CreateFooter(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
    function PostRender_BusinessTripDepartment(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            BusinessTripApprovalConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(BusinessTripApprovalConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + BusinessTripApprovalConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(BusinessTripApprovalConfig.ListResourceFileName, "Res", OnListResourcesReady_BusinessTripDepartment);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + BusinessTripApprovalConfig.Container + ' .department-locale').each(function () {
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
    function OnListResourcesReady_BusinessTripDepartment() {
        $('#viewDetailTH_businessTripApproval').text(Res.businessTripManagement_ViewDetail);
        $('#requesterTH_businessTripApproval').text(Res.businessTripManagement_RequesterTitle);
        $('#departmentTH_businessTripApproval').text(Res.overtime_Department);
        $('#businessTripType_businessTripApproval').text(Res.businessTripManagement_BusinessTripTypeTitle);
        $('#purpose_businessTripApproval').text(Res.businessTripManagement_PurposeTitle);
        $('#createdTH_businessTripApproval').text(Res.createdDate);
        $('#approvalStatusTH_businessTripApproval').text(Res.approval_Status);
        $('#' + BusinessTripApprovalConfig.Container + ' .viewDetail').text(Res.businessTripManagement_ViewDetail);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        $('.label-danger').text(Res.approvalStatus_Rejected);
        $('.internal-trip').html(Res.businessTripManagement_BusinessTripTypeInternalTitle);
        $('.external-trip').html(Res.businessTripManagement_BusinessTripTypeExternalTitle);
    }

    function CustomItem_BusinessTripApproval(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var businessTripType = (ctx.CurrentItem["Domestic.value"] && ctx.CurrentItem["Domestic.value"] === "1") ? '<td class="internal-trip">' + '</td>' : '<td class="external-trip"></td>';
        var purpose = ctx.CurrentItem.BusinessTripPurpose != null ? '<td>' + ctx.CurrentItem.BusinessTripPurpose + '</td>' : '<td></td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';
        var comment = ctx.CurrentItem.CommonComment != null ? '<td>' + Functions.parseComment(ctx.CurrentItem.CommonComment) + '</td>' : '<td></td>';
        var status = ctx.CurrentItem.ApprovalStatus + "";
        status = status.toLowerCase();
        var statusVal = '';

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab2';
        sourceURL = encodeURIComponent(sourceURL);
        var title = '<td><a href="/SitePages/BusinessTripRequest.aspx?subSection=BusinessTripManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

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
        tr = "<tr>" + title + requester + department + businessTripType + purpose + created + statusVal + "</tr>";
        return tr;
    }
})();
(function () {
    var BusinessTripRequestByDepartmentConfig = {
        BusinessTripManagement_ViewDetail: "View Detail",
        BusinessTripManagement_Requester: "Requester",
        BusinessTripManagement_Department: "Department",
        BusinessTripManagement_PurposeTitle: "Purpose",
        BusinessTripManagement_BusinessTripTypeTitle: "Business trip type",
        BusinessTripManagement_Created: "Created",
        BusinessTripManagement_Comment: "Comment",
        BusinessTripManagement_ApprovalStatus: "Approval status",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        Container: "businesstrip-bydepartment-container",
    };

    (function () {
        var overrideCSRDepartmentCtx = {};
        overrideCSRDepartmentCtx.Templates = {};
        overrideCSRDepartmentCtx.Templates.Item = CustomItem_BusinessTripDepartment;
        overrideCSRDepartmentCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCSRDepartmentCtx.ListTemplateType = 10059;
        overrideCSRDepartmentCtx.BaseViewID = 4;
        overrideCSRDepartmentCtx.OnPostRender = PostRender_BusinessTripByDepartment;
        overrideCSRDepartmentCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='viewDetailTH_businessTripByDept'>" + BusinessTripRequestByDepartmentConfig.BusinessTripManagement_ViewDetail + "</th>" +
            "<th id='requesterTH_businessTripByDept'>" + BusinessTripRequestByDepartmentConfig.BusinessTripManagement_Requester + "</th>" +
            "<th id='departmentTH_businessTripByDept'>" + BusinessTripRequestByDepartmentConfig.BusinessTripManagement_Department + "</th>" +
            "<th id='businessTripType_businessTripByDept'>" + BusinessTripRequestByDepartmentConfig.BusinessTripManagement_BusinessTripTypeTitle + "</th>" +
            "<th id='purpose_businessTripByDept'>" + BusinessTripRequestByDepartmentConfig.BusinessTripManagement_PurposeTitle + "</th>" +
            "<th id='createdTH_businessTripByDept'>" + BusinessTripRequestByDepartmentConfig.BusinessTripManagement_Created + "</th>" +
            "<th id='commentTH_businessTripByDept'>" + BusinessTripRequestByDepartmentConfig.BusinessTripManagement_Comment + "</th>" +
            "<th id='approvalStatusTH_businessTripByDept'>" + BusinessTripRequestByDepartmentConfig.BusinessTripManagement_ApprovalStatus + "</th>" +
            "<th></th>" +
        "</tr></thead><tbody>";
        overrideCSRDepartmentCtx.Templates.Footer = CreateFooter;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCSRDepartmentCtx);
    })();
    function CreateFooter(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
    function PostRender_BusinessTripByDepartment(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            BusinessTripRequestByDepartmentConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(BusinessTripRequestByDepartmentConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + BusinessTripRequestByDepartmentConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(BusinessTripRequestByDepartmentConfig.ListResourceFileName, "Res", OnListResourcesReady_BusinessTripDepartment);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + BusinessTripRequestByDepartmentConfig.Container + ' .department-locale').each(function () {
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
    function OnListResourcesReady_BusinessTripDepartment() {
        $('#viewDetailTH_businessTripByDept').text(Res.businessTripManagement_ViewDetail);
        $('#requesterTH_businessTripByDept').text(Res.businessTripManagement_RequesterTitle);
        $('#departmentTH_businessTripByDept').text(Res.overtime_Department);
        $('#businessTripType_businessTripByDept').text(Res.businessTripManagement_BusinessTripTypeTitle);
        $('#purpose_businessTripByDept').text(Res.businessTripManagement_PurposeTitle);
        $('#createdTH_businessTripByDept').text(Res.createdDate);
        $('#commentTH_businessTripByDept').text(Res.commonComment);
        $('#approvalStatusTH_businessTripByDept').text(Res.approval_Status);
        $('#' + BusinessTripRequestByDepartmentConfig.Container + ' .viewDetail').text(Res.businessTripManagement_ViewDetail);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        $('.label-danger').text(Res.approvalStatus_Rejected);
        $('.internal-trip').html(Res.businessTripManagement_BusinessTripTypeInternalTitle);
        $('.external-trip').html(Res.businessTripManagement_BusinessTripTypeExternalTitle);
    }

    function CustomItem_BusinessTripDepartment(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var businessTripType = (ctx.CurrentItem["Domestic.value"] && ctx.CurrentItem["Domestic.value"] === "1") ? '<td class="internal-trip">' + '</td>' : '<td class="external-trip"></td>';
        var purpose = ctx.CurrentItem.BusinessTripPurpose != null ? '<td>' + ctx.CurrentItem.BusinessTripPurpose + '</td>' : '<td></td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';
        var comment = ctx.CurrentItem.CommonComment != null ? '<td>' + Functions.parseComment(ctx.CurrentItem.CommonComment) + '</td>' : '<td></td>';
        var status = ctx.CurrentItem.ApprovalStatus + "";
        status = status.toLowerCase();
        var statusVal = '';

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab3';
        sourceURL = encodeURIComponent(sourceURL);
        var title = '<td><a href="/SitePages/BusinessTripRequest.aspx?subSection=BusinessTripManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

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
        tr = "<tr>" + title + requester + department + businessTripType + purpose + created + comment + statusVal + "</tr>";
        return tr;
    }
})();
(function () {
    var BusinessTripRequestByExtAdminConfig = {
        BusinessTripManagement_ViewDetail: "View Detail",
        BusinessTripManagement_Requester: "Requester",
        BusinessTripManagement_Department: "Department",
        BusinessTripManagement_PurposeTitle: "Purpose",
        BusinessTripManagement_BusinessTripTypeTitle: "Business trip type",
        BusinessTripManagement_Created: "Created",
        BusinessTripManagement_Comment: "Comment",
        BusinessTripManagement_ApprovalStatus: "Approval status",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        Container: "businesstrip-by-ext-admin-container",
    };

    (function () {
        var overrideCSRDepartmentCtx = {};
        overrideCSRDepartmentCtx.Templates = {};
        overrideCSRDepartmentCtx.Templates.Item = CustomItem_BusinessTripExtAdmin;
        overrideCSRDepartmentCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };
        overrideCSRDepartmentCtx.ListTemplateType = 10059;
        overrideCSRDepartmentCtx.BaseViewID = 4;
        overrideCSRDepartmentCtx.OnPostRender = PostRender_BusinessTripByExtAdmin;
        overrideCSRDepartmentCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
        "<thead><tr><th id='viewDetailTH_businessTripByExtAdmin'>" + BusinessTripRequestByExtAdminConfig.BusinessTripManagement_ViewDetail + "</th>" +
            "<th id='requesterTH_businessTripByExtAdmin'>" + BusinessTripRequestByExtAdminConfig.BusinessTripManagement_Requester + "</th>" +
            "<th id='departmentTH_businessTripByExtAdmin'>" + BusinessTripRequestByExtAdminConfig.BusinessTripManagement_Department + "</th>" +
            "<th id='businessTripType_businessTripByExtAdmin'>" + BusinessTripRequestByExtAdminConfig.BusinessTripManagement_BusinessTripTypeTitle + "</th>" +
            "<th id='purpose_businessTripByExtAdmin'>" + BusinessTripRequestByExtAdminConfig.BusinessTripManagement_PurposeTitle + "</th>" +
            "<th id='createdTH_businessTripByExtAdmin'>" + BusinessTripRequestByExtAdminConfig.BusinessTripManagement_Created + "</th>" +
            "<th id='commentTH_businessTripByExtAdmin'>" + BusinessTripRequestByExtAdminConfig.BusinessTripManagement_Comment + "</th>" +
            "<th id='approvalStatusTH_businessTripByExtAdmin'>" + BusinessTripRequestByExtAdminConfig.BusinessTripManagement_ApprovalStatus + "</th>" +
            "<th></th>" +
        "</tr></thead><tbody>";
        overrideCSRDepartmentCtx.Templates.Footer = CreateFooter;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCSRDepartmentCtx);
    })();
    function CreateFooter(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
    function PostRender_BusinessTripByExtAdmin(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            BusinessTripRequestByExtAdminConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(BusinessTripRequestByExtAdminConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + BusinessTripRequestByExtAdminConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(BusinessTripRequestByExtAdminConfig.ListResourceFileName, "Res", OnListResourcesReady_BusinessTripExtAdmin);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + BusinessTripRequestByExtAdminConfig.Container + ' .department-locale').each(function () {
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
    function OnListResourcesReady_BusinessTripExtAdmin() {
        $('#viewDetailTH_businessTripByExtAdmin').text(Res.businessTripManagement_ViewDetail);
        $('#requesterTH_businessTripByExtAdmin').text(Res.businessTripManagement_RequesterTitle);
        $('#departmentTH_businessTripByExtAdmin').text(Res.overtime_Department);
        $('#businessTripType_businessTripByExtAdmin').text(Res.businessTripManagement_BusinessTripTypeTitle);
        $('#purpose_businessTripByExtAdmin').text(Res.businessTripManagement_PurposeTitle);
        $('#createdTH_businessTripByExtAdmin').text(Res.createdDate);
        $('#commentTH_businessTripByExtAdmin').text(Res.commonComment);
        $('#approvalStatusTH_businessTripByExtAdmin').text(Res.approval_Status);
        $('#' + BusinessTripRequestByExtAdminConfig.Container + ' .viewDetail').text(Res.businessTripManagement_ViewDetail);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        $('.label-danger').text(Res.approvalStatus_Rejected);
        $('.internal-trip').html(Res.businessTripManagement_BusinessTripTypeInternalTitle);
        $('.external-trip').html(Res.businessTripManagement_BusinessTripTypeExternalTitle);
    }

    function CustomItem_BusinessTripExtAdmin(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var businessTripType = (ctx.CurrentItem["Domestic.value"] && ctx.CurrentItem["Domestic.value"] === "1") ? '<td class="internal-trip">' + '</td>' : '<td class="external-trip"></td>';
        var purpose = ctx.CurrentItem.BusinessTripPurpose != null ? '<td>' + ctx.CurrentItem.BusinessTripPurpose + '</td>' : '<td></td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';
        var comment = ctx.CurrentItem.CommonComment != null ? '<td>' + Functions.parseComment(ctx.CurrentItem.CommonComment) + '</td>' : '<td></td>';
        var status = ctx.CurrentItem.ApprovalStatus + "";
        status = status.toLowerCase();
        var statusVal = '';

        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab3';
        sourceURL = encodeURIComponent(sourceURL);
        var title = '<td><a href="/SitePages/BusinessTripRequest.aspx?subSection=BusinessTripManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

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
        tr = "<tr>" + title + requester + department + businessTripType + purpose + created + comment + statusVal + "</tr>";
        return tr;
    }
})();
(function () {
    var BusinessTripCashierListConfig = {
        BusinessTripManagement_ViewDetail: "View Detail",
        BusinessTripManagement_Requester: "Requester",
        BusinessTripManagement_Department: "Department",
        BusinessTripManagement_BusinessTripTypeTitle: "Business trip type",
        BusinessTripManagement_PurposeTitle: "Purpose",
        BusinessTripManagement_Created: "Created",
        BusinessTripManagement_Comment: "Comment",
        BusinessTripManagement_ApprovalStatus: "Approval status",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        Container: "businessTrip-cashier-container",
    };

    (function () {
        var overrideBusinessTripCashierCtx = {};
        overrideBusinessTripCashierCtx.Templates = {};
        overrideBusinessTripCashierCtx.Templates.Item = CustomItemBusinessTripCashier;
        overrideBusinessTripCashierCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };

        overrideBusinessTripCashierCtx.ListTemplateType = 10059;
        overrideBusinessTripCashierCtx.BaseViewID = 6;
        overrideBusinessTripCashierCtx.OnPostRender = PostRender_BusinessTripCashier;
        overrideBusinessTripCashierCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
            "<thead><tr><th id='businessTrip-cashier-detail'>" + BusinessTripCashierListConfig.BusinessTripManagement_ViewDetail + "</th>" +
            "<th id='businessTrip-cashier-requester'>" + BusinessTripCashierListConfig.BusinessTripManagement_Requester + "</th>" +
            "<th id='businessTrip-cashier-department'>" + BusinessTripCashierListConfig.BusinessTripManagement_Department + "</th>" +
            "<th id='businessTrip-cashier-businessTripType'>" + BusinessTripCashierListConfig.BusinessTripManagement_BusinessTripTypeTitle + "</th>" +
            "<th id='businessTrip-cashier-purpose'>" + BusinessTripCashierListConfig.BusinessTripManagement_PurposeTitle + "</th>" +
            "<th id='businessTrip-cashier-created'>" + BusinessTripCashierListConfig.BusinessTripManagement_Created + "</th>" +
            "<th id='businessTrip-cashier-comment'>" + BusinessTripCashierListConfig.BusinessTripManagement_Comment + "</th>" +
            "<th id='businessTrip-cashier-status'>" + BusinessTripCashierListConfig.BusinessTripManagement_ApprovalStatus + "</th>" +
            "<th></th>" +
            "</tr></thead><tbody>";
        overrideBusinessTripCashierCtx.Templates.Footer = pagingControlBusinessTripCashier;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideBusinessTripCashierCtx);
    })();

    function PostRender_BusinessTripCashier(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            BusinessTripCashierListConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(BusinessTripCashierListConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + BusinessTripCashierListConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(BusinessTripCashierListConfig.ListResourceFileName, "Res", OnListResourcesReadyBusinessTripCashier);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + BusinessTripCashierListConfig.Container + ' .department-locale').each(function () {
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

    function OnListResourcesReadyBusinessTripCashier() {
        $('#businessTrip-cashier-detail').text(Res.businessTripManagement_ViewDetail);
        $('#businessTrip-cashier-requester').text(Res.businessTripManagement_RequesterTitle);
        $('#businessTrip-cashier-department').text(Res.overtime_Department);
        $('#businessTrip-cashier-businessTripType').text(Res.businessTripManagement_BusinessTripTypeTitle);
        $('#businessTrip-cashier-purpose').text(Res.businessTripManagement_PurposeTitle);
        $('#businessTrip-cashier-created').text(Res.createdDate);
        $('#businessTrip-cashier-comment').text(Res.commonComment);
        $('#businessTrip-cashier-status').text(Res.businessTripManagement_ApprovalStatus);
        $('#' + BusinessTripCashierListConfig.Container + ' .viewDetail').text(Res.businessTripManagement_ViewDetail);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        $('.label-danger').text(Res.approvalStatus_Rejected);
        $('.internal-trip').html(Res.businessTripManagement_BusinessTripTypeInternalTitle);
        $('.external-trip').html(Res.businessTripManagement_BusinessTripTypeExternalTitle);
    }

    function CustomItemBusinessTripCashier(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';
        var comment = ctx.CurrentItem.CommonComment != null ? '<td>' + Functions.parseComment(ctx.CurrentItem.CommonComment) + '</td>' : '<td></td>';
        var businessTripType = (ctx.CurrentItem["Domestic.value"] && ctx.CurrentItem["Domestic.value"] === "1") ? '<td class="internal-trip">' + '</td>' : '<td class="external-trip"></td>';
        var purpose = ctx.CurrentItem.BusinessTripPurpose != null ? '<td>' + ctx.CurrentItem.BusinessTripPurpose + '</td>' : '<td></td>';
        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab4';
        sourceURL = encodeURIComponent(sourceURL);
        var title = '<td><a href="/SitePages/BusinessTripRequest.aspx?subSection=BusinessTripManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

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

        tr = "<tr>" + title + requester + department + businessTripType + purpose + created + comment + statusVal + "</tr>";
        return tr;
    }

    function pagingControlBusinessTripCashier(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();
(function () {
    var BusinessTripDriverListConfig = {
        BusinessTripManagement_ViewDetail: "View Detail",
        BusinessTripManagement_Requester: "Requester",
        BusinessTripManagement_Department: "Department",
        BusinessTripManagement_BusinessTripTypeTitle: "Business trip type",
        BusinessTripManagement_PurposeTitle: "Purpose",
        BusinessTripManagement_Created: "Created",
        BusinessTripManagement_Comment: "Comment",
        BusinessTripManagement_ApprovalStatus: "Approval status",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        Container: "businessTrip-driver-container",
    };

    (function () {
        var overrideBusinessTripDriverCtx = {};
        overrideBusinessTripDriverCtx.Templates = {};
        overrideBusinessTripDriverCtx.Templates.Item = CustomItemBusinessTripDriver;
        overrideBusinessTripDriverCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };

        overrideBusinessTripDriverCtx.ListTemplateType = 10059;
        overrideBusinessTripDriverCtx.BaseViewID = 5;
        overrideBusinessTripDriverCtx.OnPostRender = PostRender_BusinessTripDriver;
        overrideBusinessTripDriverCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
            "<thead><tr><th id='businessTrip-driver-detail'>" + BusinessTripDriverListConfig.BusinessTripManagement_ViewDetail + "</th>" +
            "<th id='businessTrip-driver-requester'>" + BusinessTripDriverListConfig.BusinessTripManagement_Requester + "</th>" +
            "<th id='businessTrip-driver-department'>" + BusinessTripDriverListConfig.BusinessTripManagement_Department + "</th>" +
            "<th id='businessTrip-driver-businessTripType'>" + BusinessTripDriverListConfig.BusinessTripManagement_BusinessTripTypeTitle + "</th>" +
            "<th id='businessTrip-driver-purpose'>" + BusinessTripDriverListConfig.BusinessTripManagement_PurposeTitle + "</th>" +
            "<th id='businessTrip-driver-created'>" + BusinessTripDriverListConfig.BusinessTripManagement_Created + "</th>" +
            "<th id='businessTrip-driver-comment'>" + BusinessTripDriverListConfig.BusinessTripManagement_Comment + "</th>" +
            "<th id='businessTrip-driver-status'>" + BusinessTripDriverListConfig.BusinessTripManagement_ApprovalStatus + "</th>" +
            "<th></th>" +
            "</tr></thead><tbody>";
        overrideBusinessTripDriverCtx.Templates.Footer = pagingControlBusinessTripDriver;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideBusinessTripDriverCtx);
    })();

    function PostRender_BusinessTripDriver(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            BusinessTripDriverListConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(BusinessTripDriverListConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + BusinessTripDriverListConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(BusinessTripDriverListConfig.ListResourceFileName, "Res", OnListResourcesReadyBusinessTripDriver);
        }, "strings.js");

        var url = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/Services/Department/DepartmentService.svc/GetDepartments/' + _spPageContextInfo.currentUICultureName + '/' + _rbvhContext.EmployeeInfo.FactoryLocation.LookupId;
        $.ajax({
            url: url,
            method: "GET",
            async: true,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data && data.length > 0) {
                    $('#' + BusinessTripDriverListConfig.Container + ' .department-locale').each(function () {
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

    function OnListResourcesReadyBusinessTripDriver() {
        $('#businessTrip-driver-detail').text(Res.businessTripManagement_ViewDetail);
        $('#businessTrip-driver-requester').text(Res.businessTripManagement_RequesterTitle);
        $('#businessTrip-driver-department').text(Res.overtime_Department);
        $('#businessTrip-driver-businessTripType').text(Res.businessTripManagement_BusinessTripTypeTitle);
        $('#businessTrip-driver-purpose').text(Res.businessTripManagement_PurposeTitle);
        $('#businessTrip-driver-created').text(Res.createdDate);
        $('#businessTrip-driver-comment').text(Res.commonComment);
        $('#businessTrip-driver-status').text(Res.businessTripManagement_ApprovalStatus);
        $('#' + BusinessTripDriverListConfig.Container + ' .viewDetail').text(Res.businessTripManagement_ViewDetail);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        $('.label-danger').text(Res.approvalStatus_Rejected);
        $('.internal-trip').html(Res.businessTripManagement_BusinessTripTypeInternalTitle);
        $('.external-trip').html(Res.businessTripManagement_BusinessTripTypeExternalTitle);
    }

    function CustomItemBusinessTripDriver(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var department = '<td class="department-locale" data-id="' + ctx.CurrentItem.CommonDepartment[0].lookupId + '">' + ctx.CurrentItem.CommonDepartment[0].lookupValue + '</td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';
        var comment = ctx.CurrentItem.CommonComment != null ? '<td>' + Functions.parseComment(ctx.CurrentItem.CommonComment) + '</td>' : '<td></td>';
        var businessTripType = (ctx.CurrentItem["Domestic.value"] && ctx.CurrentItem["Domestic.value"] === "1") ? '<td class="internal-trip">' + '</td>' : '<td class="external-trip"></td>';
        var purpose = ctx.CurrentItem.BusinessTripPurpose != null ? '<td>' + ctx.CurrentItem.BusinessTripPurpose + '</td>' : '<td></td>';
        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab5';
        sourceURL = encodeURIComponent(sourceURL);
        var title = '<td><a href="/SitePages/BusinessTripRequest.aspx?subSection=BusinessTripManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

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

        tr = "<tr>" + title + requester + department + businessTripType + purpose + created + comment + statusVal + "</tr>";
        return tr;
    }

    function pagingControlBusinessTripDriver(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();
(function () {
    var BusinessTripRequestListConfig = {
        BusinessTripManagement_ViewDetail: "View Detail",
        BusinessTripManagement_Requester: "Requester",
        BusinessTripManagement_PurposeTitle: "Purpose",
        BusinessTripManagement_BusinessTripTypeTitle: "Business trip type",
        BusinessTripManagement_Created: "Created",
        BusinessTripManagement_Comment: "Comment",
        BusinessTripManagement_ApprovalStatus: "Approval status",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        Container: "businessTrip-request-list-container",
    };

    (function () {
        var overrideBusinessTripRequestListCtx = {};
        overrideBusinessTripRequestListCtx.Templates = {};
        overrideBusinessTripRequestListCtx.Templates.Item = CustomItemBusinessTripRequest;
        overrideBusinessTripRequestListCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };

        overrideBusinessTripRequestListCtx.ListTemplateType = 10059;
        overrideBusinessTripRequestListCtx.BaseViewID = 2;
        overrideBusinessTripRequestListCtx.OnPostRender = PostRender_BusinessTripRequestList;
        overrideBusinessTripRequestListCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
            "<thead><tr><th id='businessTrip-request-detail'>" + BusinessTripRequestListConfig.BusinessTripManagement_ViewDetail + "</th>" +
            "<th id='businessTrip-request-requester'>" + BusinessTripRequestListConfig.BusinessTripManagement_Requester + "</th>" +
            "<th id='businessTrip-request-businessTripType'>" + BusinessTripRequestListConfig.BusinessTripManagement_BusinessTripTypeTitle + "</th>" +
            "<th id='businessTrip-request-purpose'>" + BusinessTripRequestListConfig.BusinessTripManagement_PurposeTitle + "</th>" +
            "<th id='businessTrip-request-created'>" + BusinessTripRequestListConfig.BusinessTripManagement_Created + "</th>" +
            "<th id='businessTrip-request-comment'>" + BusinessTripRequestListConfig.BusinessTripManagement_Comment + "</th>" +
            "<th id='businessTrip-request-status'>" + BusinessTripRequestListConfig.BusinessTripManagement_ApprovalStatus + "</th>" +
            "<th id='businessTrip-request-action'>" + '' + "</th>" +
            "<th></th>" +
            "</tr></thead><tbody>";
        overrideBusinessTripRequestListCtx.Templates.Footer = pagingControlBusinessTripRequest;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideBusinessTripRequestListCtx);
    })();

    function PostRender_BusinessTripRequestList(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            BusinessTripRequestListConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(BusinessTripRequestListConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + BusinessTripRequestListConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(BusinessTripRequestListConfig.ListResourceFileName, "Res", OnListResourcesReadyBusinessTripRequest);
        }, "strings.js");
    }

    function OnListResourcesReadyBusinessTripRequest() {
        $('.businessTrip-request-cancel').click(function () {
            $(this).attr('disabled', 'true');
            var businessTripId = $(this).attr('data-id');
            var requestLink = window.location.protocol + "//{0}/_vti_bin/services/BusinessTripManagement/BusinessTripManagementService.svc/CancelBusinessTrip/{1}",
            requestLink = RBVH.Stada.WebPages.Utilities.String.format(requestLink, location.host, businessTripId);
            if (businessTripId) {
                $.ajax({
                    type: "GET",
                    url: requestLink,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (resultData) {
                        if (resultData.Code === 5) {
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

        $('#businessTrip-request-detail').text(Res.businessTripManagement_ViewDetail);
        $('#businessTrip-request-requester').text(Res.businessTripManagement_RequesterTitle);
        $('#businessTrip-request-businessTripType').text(Res.businessTripManagement_BusinessTripTypeTitle);
        $('#businessTrip-request-purpose').text(Res.businessTripManagement_PurposeTitle);
        $('#businessTrip-request-created').text(Res.createdDate);
        $('#businessTrip-request-comment').text(Res.commonComment);
        $('#businessTrip-request-status').text(Res.businessTripManagement_ApprovalStatus);
        $('#' + BusinessTripRequestListConfig.Container + ' .viewDetail').text(Res.businessTripManagement_ViewDetail);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        $('.label-danger').text(Res.approvalStatus_Rejected);
        $('.businessTrip-request-cancel').text(Res.businesstripManagement_CancelRequest);
        $('.internal-trip').html(Res.businessTripManagement_BusinessTripTypeInternalTitle);
        $('.external-trip').html(Res.businessTripManagement_BusinessTripTypeExternalTitle);
    }

    function CustomItemBusinessTripRequest(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';
        var comment = ctx.CurrentItem.CommonComment != null ? '<td>' + Functions.parseComment(ctx.CurrentItem.CommonComment) + '</td>' : '<td></td>';
        var businessTripType = (ctx.CurrentItem["Domestic.value"] && ctx.CurrentItem["Domestic.value"] === "1") ? '<td class="internal-trip">' + '</td>' : '<td class="external-trip"></td>';
        var purpose = ctx.CurrentItem.BusinessTripPurpose != null ? '<td>' + ctx.CurrentItem.BusinessTripPurpose + '</td>' : '<td></td>';
        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab1';
        sourceURL = encodeURIComponent(sourceURL);
        var title = '<td><a href="/SitePages/BusinessTripRequest.aspx?subSection=BusinessTripManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

        var status = ctx.CurrentItem.ApprovalStatus + "";
        status = status.toLowerCase();

        var disabled = '';
        if ((ctx.CurrentItem.Editor[0].id !== ctx.CurrentItem.Author[0].id) || (ctx.CurrentItem.Editor[0].id === ctx.CurrentItem.Author[0].id && (status === 'approved' || status === 'cancelled' || status === 'rejected'))) {
            disabled = 'disabled';
        }
        var action = "<td><button type='button' class='btn btn-default btn-sm businessTrip-request-cancel' " + disabled + " data-id='" + ctx.CurrentItem.ID + "'>Cancel Request</button></td>";

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

        tr = "<tr>" + title + requester + businessTripType + purpose + created + comment + statusVal + action + "</tr>";
        return tr;
    }

    function pagingControlBusinessTripRequest(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();
(function () {
    var MyBusinessTripListConfig = {
        BusinessTripManagement_ViewDetail: "View Detail",
        BusinessTripManagement_Requester: "Requester",
        BusinessTripManagement_PurposeTitle: "Purpose",
        BusinessTripManagement_BusinessTripTypeTitle: "Business trip type",
        BusinessTripManagement_Created: "Created",
        BusinessTripManagement_Comment: "Comment",
        BusinessTripManagement_ApprovalStatus: "Approval status",
        ListResourceFileName: "RBVHStadaLists",
        PageResourceFileName: "RBVHStadaWebpages",
        Locale: '',
        Container: "my-business-trip-container",
    };

    (function () {
        var overrideMyBusinessTripCtx = {};
        overrideMyBusinessTripCtx.Templates = {};
        overrideMyBusinessTripCtx.Templates.Item = CustomItemMyBusinessTrip;
        overrideMyBusinessTripCtx.OnPreRender = function (ctx) {
            $('.ms-menutoolbar').hide();
        };

        overrideMyBusinessTripCtx.ListTemplateType = 10059;
        overrideMyBusinessTripCtx.BaseViewID = 7;
        overrideMyBusinessTripCtx.OnPostRender = PostRender_MyBusinessTrip;
        overrideMyBusinessTripCtx.Templates.Header = "<div class='col-md-12'><table class='table'>" +
            "<thead><tr><th id='myBusinessTrip-detail'>" + MyBusinessTripListConfig.BusinessTripManagement_ViewDetail + "</th>" +
            "<th id='myBusinessTrip-requester'>" + MyBusinessTripListConfig.BusinessTripManagement_Requester + "</th>" +
            "<th id='myBusinessTrip-businessTripType'>" + MyBusinessTripListConfig.BusinessTripManagement_BusinessTripTypeTitle + "</th>" +
            "<th id='myBusinessTrip-purpose'>" + MyBusinessTripListConfig.BusinessTripManagement_PurposeTitle + "</th>" +
            "<th id='myBusinessTrip-created'>" + MyBusinessTripListConfig.BusinessTripManagement_Created + "</th>" +
            "<th id='myBusinessTrip-comment'>" + MyBusinessTripListConfig.BusinessTripManagement_Comment + "</th>" +
            "<th id='myBusinessTrip-status'>" + MyBusinessTripListConfig.BusinessTripManagement_ApprovalStatus + "</th>" +
            "<th id='myBusinessTrip-action'>" + '' + "</th>" +
            "<th></th>" +
            "</tr></thead><tbody>";
        overrideMyBusinessTripCtx.Templates.Footer = pagingControlMyBusinessTrip;
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideMyBusinessTripCtx);
    })();

    function PostRender_MyBusinessTrip(ctx) {
        SP.SOD.executeOrDelayUntilScriptLoaded(function () {
            MyBusinessTripListConfig.Locale = Strings.STS.L_CurrentUICulture_Name;
            SP.SOD.registerSod(MyBusinessTripListConfig.ListResourceFileName, "/_layouts/15/ScriptResx.ashx?name=" + MyBusinessTripListConfig.ListResourceFileName + "&culture=" + STSHtmlEncode(Strings.STS.L_CurrentUICulture_Name));
            SP.SOD.executeFunc(MyBusinessTripListConfig.ListResourceFileName, "Res", OnListResourcesReadyMyBusinessTrip);
        }, "strings.js");
    }

    function OnListResourcesReadyMyBusinessTrip() {
        $('#myBusinessTrip-detail').text(Res.businessTripManagement_ViewDetail);
        $('#myBusinessTrip-requester').text(Res.businessTripManagement_RequesterTitle);
        $('#myBusinessTrip-businessTripType').text(Res.businessTripManagement_BusinessTripTypeInternalTitle);
        $('#myBusinessTrip-purpose').text(Res.businessTripManagement_PurposeTitle);
        $('#myBusinessTrip-created').text(Res.createdDate);
        $('#myBusinessTrip-comment').text(Res.commonComment);
        $('#myBusinessTrip-status').text(Res.businessTripManagement_ApprovalStatus);
        $('#' + MyBusinessTripListConfig.Container + ' .viewDetail').text(Res.businessTripManagement_ViewDetail);
        $('.label-success').text(Res.approvalStatus_Approved);
        $('.label-warning').text(Res.approvalStatus_Cancelled);
        $('.label-danger').text(Res.approvalStatus_Rejected);
        $('.internal-trip').html(Res.businessTripManagement_BusinessTripTypeInternalTitle);
        $('.external-trip').html(Res.businessTripManagement_BusinessTripTypeExternalTitle);
    }
    
    function CustomItemMyBusinessTrip(ctx) {
        var tr = "";
        var requester = '<td>' + ctx.CurrentItem.Requester[0].lookupValue + '</td>';
        var created = '<td>' + ctx.CurrentItem.Created + '</td>';
        var comment = ctx.CurrentItem.CommonComment != null ? '<td>' + Functions.parseComment(ctx.CurrentItem.CommonComment) + '</td>' : '<td></td>';
        var businessTripType = (ctx.CurrentItem["Domestic.value"] && ctx.CurrentItem["Domestic.value"] === "1") ? '<td class="internal-trip">' + '</td>' : '<td class="external-trip"></td>';
        var purpose = ctx.CurrentItem.BusinessTripPurpose != null ? '<td>' + ctx.CurrentItem.BusinessTripPurpose + '</td>' : '<td></td>';
        var sourceURL = window.location.href.split('#')[0];
        sourceURL = Functions.removeParam('lang', sourceURL);
        sourceURL += '#tab1';
        sourceURL = encodeURIComponent(sourceURL);
        var title = '<td><a href="/SitePages/BusinessTripRequest.aspx?subSection=BusinessTripManagement&itemId=' + ctx.CurrentItem.ID + '&Source=' + sourceURL + '"   class="viewDetail" \>View Detail</a></td>';

        var status = ctx.CurrentItem.ApprovalStatus + "";
        status = status.toLowerCase();
        var statusVal = '';
        //var disabled = '';
        //if ((ctx.CurrentItem.Editor[0].id !== ctx.CurrentItem.Author[0].id) || (ctx.CurrentItem.Editor[0].id === ctx.CurrentItem.Author[0].id && status === 'cancelled')) {
        //    disabled = 'disabled';
        //}

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

        tr = "<tr>" + title + requester + businessTripType + purpose + created + comment + statusVal + "</tr>";
        return tr;
    }

    function pagingControlMyBusinessTrip(ctx) {
        return ViewUtilities.Paging.InstanceHtml(ctx);
    }
})();