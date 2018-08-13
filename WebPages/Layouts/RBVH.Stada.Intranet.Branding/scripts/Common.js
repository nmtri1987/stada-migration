function updateUrlParameter(uri, key, value) {
    // remove the hash part before operating on the uri
    var i = uri.indexOf('#');
    var hash = i === -1 ? '' : uri.substr(i);
    uri = i === -1 ? uri : uri.substr(0, i);

    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";

    if (!value) {
        // remove key-value pair if value is empty
        uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), '');
        if (uri.slice(-1) === '?') {
            uri = uri.slice(0, -1);
        }
        // replace first occurrence of & by ? if no ? is present
        if (uri.indexOf('?') === -1) uri = uri.replace(/&/, '?');
    } else if (uri.match(re)) {
        uri = uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        uri = uri + separator + key + "=" + value;
    }
    return uri + hash;
}
if (typeof RBVH == 'undefined' || !RBVH) RBVH = {};
if (typeof RBVH.Stada == 'undefined' || !RBVH.Stada) RBVH.Stada = {};
if (typeof RBVH.Stada.javascript == 'undefined' || !RBVH.Stada.javascript) RBVH.Stada.javascript = {};
if (typeof RBVH.Stada.javascript.common == 'undefined' || !RBVH.Stada.javascript.common) RBVH.Stada.javascript.common = {};
RBVH.Stada.javascript.common.NamespaceManager = {
    register: function (namespace) {
        namespace = namespace.split('.');

        if (!window[namespace[0]])
            window[namespace[0]] = {};

        var strFullNamespace = namespace[0];
        for (var i = 1; i < namespace.length; i++) {
            strFullNamespace += "." + namespace[i];
            eval("if(typeof window." + strFullNamespace + "== 'undefined' || !window." + strFullNamespace + ") window." + strFullNamespace + "={};");
        }
    }
};

RBVH.Stada.javascript.common.NamespaceManager.register("RBVH.Stada.WebPages.Utilities");
RBVH.Stada.WebPages.Utilities = {
    GetValueByParam: function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0].toUpperCase() == variable.toUpperCase()) {
                return pair[1];
            }
        }
    },
    GetValueByParamURL: function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    UpdateQueryStringParameter: function (uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    },
    /** @Register tab change event to support F5 on browsers */
    RegisterTabChangeEvent: function () {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var targetTab = $(e.target).attr("href") // activated tab
            targetTab = targetTab.substr(1);

            var url = window.location.href;

            var paddingParam = '';
            if (url.indexOf('?') >= 0) {
                paddingParam = '&';
            }
            else {
                paddingParam = '?';
            }


            if (url.indexOf('Tab=') > 0)
                url = url.replace(/(Tab=)[^\&]+/, '$1' + targetTab);
            else
                url = url + paddingParam + 'Tab=' + targetTab;

            history.pushState(null, '', url);
        });

    },
    String:
    {
        format: function () {
            var s = arguments[0];
            for (var i = 0; i < arguments.length - 1; i++) {

                var reg = new RegExp("\\{" + i + "\\}", "gm");
                s = s.replace(reg, arguments[i + 1]);
            }
            return s;
        },
        toJSDate: function () {
            var value = arguments[0]; //"/Date(1337878800000+0700)/";
            if (value.substring(0, 6) == "/Date(") {
                var dt = new Date(parseInt(value.substring(6, value.length - 2)));
                return dt;
            }
            return null;
        },
        toISOString: function () {
            var value = arguments[0];
            if (value instanceof Date) {
                return value.getUTCFullYear() + '-' + '0' + (value.getUTCMonth() + 1) + value.getUTCDate();
            }
            return '';
        },
        toMomentDateTime: function () {
            var value = arguments[0];

            try {
                //var dateFormat = arguments[1];
                //var lcid = arguments[1];
                //if (lcid == "1066") // vi-VN
                //{
                //    return moment(value).toDate();
                //}
                //else if (lcid == "1033") // en-US
                //{
                //    return moment(value).toDate();
                //}
                return moment(value).toDate();
            }
            catch (err) {
                return value;
            }
        },
        parseISOLocal: function (s) {
            var b = s.split(/\D/);
            return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
        },
        padDate: function (str) {
            if (str !== undefined && str !== "") {
                return str <= 9 ? ("0" + str) : str;
            }
            return "";
        },
        toISOStringTZ: function (dateObject) {
            var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            var localISOTime = (new Date(dateObject.getTime() - tzoffset)).toISOString().slice(0, -1);
            return localISOTime;
        },
    },
    GUI: {
        generateItemStatus: function (status) {
            var that = this;
            var className = 'label label-default';
            var statusText = status;
            if (status == RBVH.Stada.WebPages.Constants.ApprovalStatus.En_US.Approved || status == RBVH.Stada.WebPages.Constants.ApprovalStatus.Vi_VN.Approved) {
                className = 'label label-success';
                if (_spPageContextInfo.currentLanguage == '1066') // vi-VN
                    statusText = RBVH.Stada.WebPages.Constants.ApprovalStatus.Vi_VN.Approved
            }
            else if (status == RBVH.Stada.WebPages.Constants.ApprovalStatus.En_US.Completed || status == RBVH.Stada.WebPages.Constants.ApprovalStatus.Vi_VN.Completed) {
                className = 'label label-success';
                if (_spPageContextInfo.currentLanguage == '1066') // vi-VN
                    statusText = RBVH.Stada.WebPages.Constants.ApprovalStatus.Vi_VN.Completed
            }
            else if (status == RBVH.Stada.WebPages.Constants.ApprovalStatus.En_US.Cancelled || status == RBVH.Stada.WebPages.Constants.ApprovalStatus.Vi_VN.Cancelled) {
                className = 'label label-warning';
                if (_spPageContextInfo.currentLanguage == '1066') // vi-VN
                    statusText = RBVH.Stada.WebPages.Constants.ApprovalStatus.Vi_VN.Cancelled
            }
            else if (status == RBVH.Stada.WebPages.Constants.ApprovalStatus.En_US.Rejected || status == RBVH.Stada.WebPages.Constants.ApprovalStatus.Vi_VN.Rejected) {
                className = 'label label-danger';
                if (_spPageContextInfo.currentLanguage == '1066') // vi-VN
                    statusText = RBVH.Stada.WebPages.Constants.ApprovalStatus.Vi_VN.Rejected
            }
            else if (status == RBVH.Stada.WebPages.Constants.ApprovalStatus.En_US.InProcess || status == RBVH.Stada.WebPages.Constants.ApprovalStatus.Vi_VN.InProcess) {
                className = 'label label-primary';
                if (_spPageContextInfo.currentLanguage == '1066') // vi-VN
                    statusText = RBVH.Stada.WebPages.Constants.ApprovalStatus.Vi_VN.InProcess
            }

            statusText = that.processApprovalStatus(statusText);
            return $('<span />').attr('class', className).html(statusText);
        },
        showRequestExpired: function (errCtrlContainer, errCtrlId, msg) {
            $(errCtrlId).html('<span class="label label-danger">' + msg + '</span>');
            $(errCtrlContainer).show();
        },
        processApprovalStatus: function (statusStr) {
            var retVal = statusStr;
            try {
                var approvalStatusArr = statusStr.split('/');
                if (approvalStatusArr && approvalStatusArr.length > 1) {
                    if (_spPageContextInfo.currentLanguage == 1033) {
                        retVal = approvalStatusArr[0];
                    }
                    else {
                        retVal = approvalStatusArr[1];
                    }
                }
            }
            catch (err) { }

            return retVal;
        },
        showApprovalStatus: function (selector) {
            var that = this;
            var approvalStatusCollection = $(selector);
            if (approvalStatusCollection && approvalStatusCollection.length > 0) {
                $.each(approvalStatusCollection, function (idx, obj) {
                    var approvalStatusStr = $(obj).text();
                    var retVal = that.processApprovalStatus(approvalStatusStr);
                    $(obj).text(retVal);
                });
            }

            $(selector).show();
        }
    }
};

function getQueryStringParameter(paramToRetrieve) {
    var params =
    document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
}

function openModalDialog(title, url, dialogReturnValueCallback, args) {
    var options = {
        title: title,
        url: url,
        allowMaximize: false,
        showMaximized: false,
        showClose: false,
        autoSize: true,
        dialogReturnValueCallback: dialogReturnValueCallback,
        args: args
    };

    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);
}
var Functions =
    {
        getDisplayName: function (ctx, name) {
            var FieldName = 'FieldName';
            for (var i = 0, len = ctx.ListSchema.Field.length; i < len; i++) {
                if (ctx.ListSchema.Field[i].Name == name) {
                    FieldName = ctx.ListSchema.Field[i].DisplayName
                }
            }
            return FieldName;
        },
        getSPFieldRender: function (ctx, fieldName) {
            var fieldContext = ctx;
            var result = ctx.ListSchema.Field.filter(function (obj) {
                return obj.Name === fieldName;
            });
            fieldContext.CurrentFieldSchema = result[0];
            fieldContext.CurrentFieldValue = ctx.ListData.Items[0][fieldName];
            return ctx.Templates.Fields[fieldName](fieldContext);
        },
        getSPFieldValue: function (ctx, fieldName) {
            var isExisted = false;
            for (var i = 0; i < ctx.ListSchema.Field.length; i++) {
                if (ctx.ListSchema.Field[i].Name === fieldName) {
                    isExisted = true;
                    break;
                }
            }

            if (isExisted === true) {
                return ctx.ListData.Items[0][fieldName];
            }
            return "";
        },
        getSPFieldLookupId: function (ctx, fieldName) {
            var currentItem = ctx.ListData.Items[0];
            var itemArray = currentItem[fieldName].split("#");
            if (itemArray && itemArray.length > 1) {
                return itemArray[0];
            }
            else {
                return "";
            }
        },
        getSPFieldLookupValue: function (ctx, fieldName) {
            var currentItem = ctx.ListData.Items[0];
            var itemArray = currentItem[fieldName].split("#");
            if (itemArray && itemArray.length > 1) {
                return itemArray[itemArray.length - 1];
            }
            else {
                return "";
            }
        },
        getSPFieldTitle: function (ctx, fieldName) {
            var result = ctx.ListSchema.Field.filter(function (obj) {
                return obj.Name === fieldName;
            });
            return result[0].Title;
        },
        populateApprovertoPeoplePicker: function (dataArray, currentEmployeeListIemId, control) {
            var loadApproverURL = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/Services/Employee/EmployeeService.svc/GetEmployeeApprovers/" + currentEmployeeListIemId; //listItemID
            var loadApproversPromise = $.ajax({
                type: "GET",
                url: loadApproverURL,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });

            loadApproversPromise.then(
                function (data) {
                    if (data != null) {
                        if (data != undefined && data.Approver1 != null && dataArray[0] != null) {
                            Functions.setUserFieldValue(dataArray[0].InternalFieldName, dataArray[0].FullLoginUserName, control)
                        }
                        if (data.Approver2 != undefined && data.Approver2 != null && dataArray[1] != null) {
                            Functions.setUserFieldValue(dataArray[1].InternalFieldName, dataArray[1].FullLoginUserName, control)
                        }
                        if (data.Approver3 != undefined && data.Approver3 != null && dataArray[2] != null) {
                            Functions.setUserFieldValue(dataArray[2].InternalFieldName, dataArray[2].FullLoginUserName, control)
                        }
                    }
                    else {
                        //console.log("Common function: can not get approvers")
                    }
                },
                function () {
                    //console.log("Common function: can not get approvers")
                });
        },
        setUserFieldValue: function (internalFieldName, userName, control) {
            var _PeoplePicker = $("div[id ^='" + internalFieldName + "']");
            var _PeoplePickerTopId = _PeoplePicker.attr('id');

            var _PeoplePickerEditer = $("input[id ^='" + internalFieldName + "']");
            _PeoplePickerEditer.val(userName);
            var _PeoplePickerOject = SPClientPeoplePicker.SPClientPeoplePickerDict[_PeoplePickerTopId];
            _PeoplePickerOject.AddUnresolvedUserFromEditor(true);
            if (control != undefined) {
                control.css('pointer-events', 'none');
            }
        },

        hideDatePartInDatetimePicker: function (controlNameArray) {
            $.each(controlNameArray, function (index, value) {
                $("table[id ^='" + value + "_'] input:first").hide();
                $("table[id ^='" + value + "_'] a").hide();
                $("table[id ^='" + value + "_'] td[class='ms-dttimeinput']").css("margin-left", "-6px")
            });
        },
        hideDatePickerDisplayForm: function (ctx) {
            var datetime = ctx.CurrentItem[ctx.CurrentFieldSchema.Name].trim();
            var datetimeArray = datetime.split(" ");
            var newDatetime = "";
            if (datetimeArray.length == 3) {
                newDatetime = datetimeArray[1] + " " + datetimeArray[2];
            }
            else newDatetime = text;
            return newDatetime;
        },
        getParameterByName: function (name) {
            url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        getParamByName: function (name, url) {
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        loadDepartment: function (departmentID, controlToBindData, departmentLabelResoure, lcid) {
            var languageParam = "";
            if (lcid == "") {
                languageParam = Functions.getParameterByName("lang");
                if (languageParam === undefined || languageParam == null || languageParam == "") {
                    languageParam = "en-US"
                }
            }
            else {
                languageParam = lcid;
            }

            var loadDepartmentURL = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/Services/Department/DepartmentService.svc/GetDepartmentByIdLanguageCode/" + departmentID + "/" + languageParam;

            var loadDepartmentPromise = $.ajax({
                type: "GET",
                url: loadDepartmentURL,
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            });

            loadDepartmentPromise.then(
                function (result) {
                    if (result.DepartmentName != undefined && result.DepartmentName != "") {
                        if (departmentLabelResoure != "") {
                            $(controlToBindData).html(departmentLabelResoure + ": " + result.DepartmentName);
                        }
                        else {
                            $(controlToBindData).html(result.DepartmentName);
                        }
                    }
                    else {
                        $(controlToBindData).html("");
                    }
                },
                function () {
                    //console.log("Common Functions: can not load department")
                }
            )
        },

        isTwoApproverDifference: function (control1, control1TitleResoure, control2, control2TitleResource, controlToBindError, mustBeDifferent) {
            var control1Value = $(control1).val();
            var control2Value = $(control2).val();
            var isValid = false;
            if (control1Value.length > 0 && control1Value != "" && control1Value != "[]" && control2Value.length > 0 && control2Value != "" && control2Value != "[]") {
                var value1Object = $.parseJSON(control1Value);
                var value2Object = $.parseJSON(control2Value);
                if (value1Object[0].Key === value2Object[0].Key) {
                    isValid = false;
                    $(controlToBindError).html(control1TitleResoure + ", " + control2TitleResource + " " + mustBeDifferent);
                }
                else {
                    isValid = true;
                    $(controlToBindError).html("");
                }
            }
            else {
                isValid = true;
            }
            return isValid;
        },

        removeParam: function (key, sourceURL) {
            var rtn = sourceURL.split("?")[0],
                param,
                params_arr = [],
                queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
            if (queryString !== "") {
                params_arr = queryString.split("&");
                for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                    param = params_arr[i].split("=")[0];
                    if (param === key) {
                        params_arr.splice(i, 1);
                    }
                }
                rtn = rtn + "?" + params_arr.join("&");
            }
            return rtn;
        },

        redirectToSource: function (substituteRedirectUrl) {
            var url = "";
            var sourceParam = Functions.getParameterByName("Source");
            if (sourceParam) {
                url = sourceParam;
            }
            else if (substituteRedirectUrl) {
                url = substituteRedirectUrl;
            }
            else {
                url = "/"
            }
            window.location.href = url;
        },
        padDate: function (n) {
            return (n < 10) ? ("0" + n) : n;
        },
        parseDate: function (dateString) {
            // debugger;
            // if (!dateString || dateString.length < 6 || dateString.length > 10)
            //     return false;
            // //var f = new Date(from[2], from[1] - 1, from[0]);
            // var dateStringArray = dateString.split("/"); //DD/mm/yyyy
            // return new Date(dateStringArray[2], dateStringArray[1] * 1 - 1, dateStringArray[0]);
            return new Date(dateString);
        },
        parseVietNameseDate: function (dateString) {
            // debugger;
            var parts = dateString.split("/");
            return new Date(parts[2], parts[1] - 1, parts[0]);
            //return new Date(dateString);
        },
        parseDateTimeToMMDDYYYY: function (dateString) {
            var date = Functions.parseDate(dateString);
            return Functions.padDate(date.getMonth() * 1 + 1) + "-" + Functions.padDate(date.getDate()) + "-" + Functions.padDate(date.getFullYear());
        },
        parseVietnameseDateTimeToMMDDYYYY: function (dateString) {
            var date = Functions.parseVietNameseDate(dateString);
            return Functions.padDate(date.getMonth() * 1 + 1) + "-" + Functions.padDate(date.getDate()) + "-" + Functions.padDate(date.getFullYear());
        },

        parseDateTimeToMMDDYYYY2: function (dateString) {
            var date = Functions.parseDate(dateString);
            return Functions.padDate(date.getMonth() * 1 + 1) + "/" + Functions.padDate(date.getDate()) + "/" + Functions.padDate(date.getFullYear());
        },
        parseVietnameseDateTimeToDDMMYYYY2: function (dataObject) {
            return Functions.padDate(dataObject.getDate()) + "/" + Functions.padDate(dataObject.getMonth() * 1 + 1) + "/" + Functions.padDate(dataObject.getFullYear());
        },

        removeInvalidValue: function (string) {
            if (string) {
                return string;
            }
            else {
                return "";
            }
        },
        //Groups:
        isCurrentUserMemberOfGroup: function (groupName, OnComplete) {
            var currentContext = new SP.ClientContext.get_current();
            var currentWeb = currentContext.get_web();
            var currentUser = currentContext.get_web().get_currentUser();
            currentContext.load(currentUser);

            var allGroups = currentWeb.get_siteGroups();
            currentContext.load(allGroups);

            var group = allGroups.getByName(groupName);
            currentContext.load(group);

            var groupUsers = group.get_users();
            currentContext.load(groupUsers);

            currentContext.executeQueryAsync(OnSuccess, OnFailure);
            function OnSuccess(sender, args) {
                var userInGroup = false;
                var groupUserEnumerator = groupUsers.getEnumerator();
                while (groupUserEnumerator.moveNext()) {
                    var groupUser = groupUserEnumerator.get_current();
                    if (groupUser.get_id() == currentUser.get_id()) {
                        userInGroup = true;
                        break;
                    }
                }
                OnComplete(userInGroup);
            }
            function OnFailure(sender, args) {
                OnComplete(false);
            }
        },
        getAttachments: function (listName, itemId) {
            var url = _spPageContextInfo.webAbsoluteUrl;
            var requestUri = url + "/_api/web/lists/getbytitle('" + listName + "')/items(" + itemId + ")/AttachmentFiles";
            var str = "";
            // execute AJAX request
            $.ajax({
                url: requestUri,
                type: "GET",
                headers: { "ACCEPT": "application/json;odata=verbose" },
                async: false,
                success: function (data) {
                    if (data && data.d && data.d.results[0]) {
                        str = encodeURI(data.d.results[0].ServerRelativeUrl);
                    }
                },
                error: function (err) {
                    //alert(err);
                }
            });
            return str;
        },
        parseComment: function (comment) {
            var htmlComments = '';
            if (comment && comment.length > 0) {
                var arrComment = comment.split('###');
                arrComment.forEach(function (item) {
                    var modComment = item.replace(/\:/, '___').split('___'); // [0] User: [1] Comment
                    htmlComments = htmlComments + '<b>' + modComment[0] + '</b>:' + modComment[1] + '<br />';
                });
            }

            return htmlComments;
        },
        generateApprovalHistoryTable: function (taskManagements, tableHeaders, approvalStatus, noDataAvailableMsg) {
            var tableHtml = '<table class="table gridView" style="border-collapse: collapse;" border="1" rules="all" cellspacing="0">';
            if (taskManagements && taskManagements.length > 0) {
                tableHtml += '<tr><th scope="col">' + tableHeaders[0] + '</th><th scope="col">' + tableHeaders[1] + '</th><th scope="col">' + tableHeaders[2] + '</th><th scope="col">' + tableHeaders[3] + '</th></tr>';
                for (var i = 0; i < taskManagements.length; i++) {
                    var desc = '';
                    if (taskManagements[i].Description) {
                        desc = taskManagements[i].Description;
                    }
                    var taskOutcome = approvalStatus[0];
                    if (taskManagements[i].TaskOutcome !== 'Approved') {
                        taskOutcome = approvalStatus[1];
                    }

                    taskOutcome = RBVH.Stada.WebPages.Utilities.GUI.processApprovalStatus(taskOutcome);

                    tableHtml += '<tr><td style="width: 200px;">' + taskOutcome + '</td><td style="width: 250px;">' + taskManagements[i].AssignedTo.FullName + '</td><td style="width: 200px;">' + taskManagements[i].Modified + '</td><td>' + desc + '</td></tr>';
                }
            }
            else {
                tableHtml += '<span>' + noDataAvailableMsg + '</span>';
            }
            tableHtml += '</table>';

            return tableHtml;
        },
        getConfigValue: function (source, key) {
            var ret = null;
            if (source) {
                $.each(source, function (idx, obj) {
                    if (obj.Key.trim().toLowerCase() === key.trim().toLowerCase()) {
                        if (obj.Value && obj.Value.length > 0) {
                            ret = obj.Value.trim();
                            return false;
                        }
                    }
                });
            }

            return ret;
        },
        getDisplayTextOfItemAll: function (languageId) {
            if (languageId == 1033) {
                return "All";
            }
            else {
                return "Tất cả";
            }
        }
    }

var ViewUtilities = ViewUtilities || {};
ViewUtilities.Paging = ViewUtilities.Paging || {};
ViewUtilities.Paging.InstanceHtml = function (ctx) {
    var firstRow = ctx.ListData.FirstRow;
    var lastRow = ctx.ListData.LastRow;
    var next = ctx.ListData.NextHref;
    var html = "<div class='Paging'>";

    ///custom PreLink
    if (ctx.ListData.PrevHref) {

        var prevIndex = firstRow - RBVH.Stada.WebPages.Constants.PageLimit;
        var prev = RBVH.Stada.WebPages.Utilities.UpdateQueryStringParameter(ctx.ListData.PrevHref, 'PageFirstRow', prevIndex);
    }
    if (lastRow != undefined) {
        html += prev ? "<a class='ms-commandLink ms-promlink-button ms-promlink-button-enabled navigate-page' data-href='" + prev + "' ><span class='ms-promlink-button-image'><img class='ms-promlink-button-left' src='/_layouts/15/images/spcommon.png?rev=40' /></span></a>" : "";
        html += "<span class='ms-paging'><span class='First'>" + firstRow + "</span> - <span class='Last'>" + lastRow + "</span></span>";
        html += next ? "<a class='ms-commandLink ms-promlink-button ms-promlink-button-enabled navigate-page' data-href='" + next + "&PagingEnd' ><span class='ms-promlink-button-image'><img class='ms-promlink-button-right' src='/_layouts/15/images/spcommon.png?rev=40'/></span></a>" : "";
        html += "</div>";
    }
    else {
        html = '';
    }
    return "</tbody></table></div>" + html;
}
ViewUtilities.Paging.RemovePagingCurrentURL = function () {
    var currentURl = window.location.search.replace('?', '');
    var keySubstring = '&PagingEnd&';
    if (currentURl.indexOf(keySubstring) > 0) {

        var substring = currentURl.substring(currentURl.indexOf(keySubstring) + keySubstring.length, currentURl.length);
        currentURl = substring;

    }
    return currentURl;
}
ViewUtilities.Paging.RemovePagingURL = function (url) {
    var currentURl = url;
    var keySubstring = '&PagingEnd&';
    if (currentURl.indexOf(keySubstring) > 0) {

        var substring = currentURl.substring(currentURl.indexOf(keySubstring) + keySubstring.length, currentURl.length);
        currentURl = "?" + substring;

    }
    return currentURl;
}

$.fn.showOption = function () {
    this.each(function () {
        if (this.tagName == "OPTION") {
            var opt = this;
            if ($(this).parent().get(0).tagName == "SPAN") {
                var span = $(this).parent().get(0);
                $(span).replaceWith(opt);
                $(span).remove();
            }
            opt.disabled = false;
            $(opt).show();
        }
    });
    return this;
}
$.fn.hideOption = function () {
    this.each(function () {
        if (this.tagName == "OPTION") {
            var opt = this;
            if ($(this).parent().get(0).tagName == "SPAN") {
                var span = $(this).parent().get(0);
                $(span).hide();
            } else {
                $(opt).wrap("span").hide();
            }
            opt.disabled = true;
        }
    });
    return this;
}
/// instance control event
$(document).ready(function () {
    $('.navigate-page').click(function () {
        var currentURl = ViewUtilities.Paging.RemovePagingCurrentURL();
        var url = $(this).attr('data-href') + '&' + currentURl + window.location.hash;
        window.location = url;
    });
});


//Insert links here  to display leftmenu
var displayUrls = [
    "Overview",
    "Leave",
    //"Policies",
    "/Shift",
    "Login",
    "/Overtime",
    "/LeaveManagement",
    "/ChangeShiftManagement",
    //"/NotOverTimeManagement"
];

var DisplayFullUrls = ["/SitePages/Overview.aspx",
			"/_layouts/15/people.aspx",
            "/SitePages/OvertimeRequest.aspx",
            "/SitePages/OvertimeApprovalList.aspx",
            "/SitePages/OvertimeApproval.aspx",
            "/SitePages/ShiftRequest.aspx",
            "/SitePages/ShiftApprovalList.aspx",
            "/SitePages/ShiftApproval.aspx",
            "/SitePages/OvertimeManagement.aspx",
            "/SitePages/LeaveOfAbsenceManagement.aspx",
            "/SitePages/LeaveOfAbsenceManagementTaskList.aspx",
            "/SitePages/ChangeShiftManagement.aspx",
            "/SitePages/ChangeShiftManagementTaskList.aspx",
            "/SitePages/TransportationManagement.aspx",
            "/SitePages/TransportationManagementTaskList.aspx",
            "/SitePages/LeaveRequest.aspx",
            "/SitePages/FreightRequest.aspx",
            "/SitePages/BusinessTripRequest.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/MyShiftTime.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/MyOvertime.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveManagement.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/SecurityLeaveManagement.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveManagementApprovalTask.aspx",
            "/Lists/VehicleManagement/NewForm.aspx",
            "/Lists/VehicleManagement/EditForm.aspx",
            "/Lists/VehicleManagement/DispForm.aspx",
            "/Lists/NotOvertimeManagement/NewForm.aspx",
            "/Lists/ChangeShiftManagement/NewForm.aspx",

            "/_layouts/15/RBVH.Stada.Intranet.WebPages/OvertimeManagement/OvertimeManagementAdmin.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/OvertimeManagement/OvertimeManagementManager.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/OvertimeManagement/OvertimeManagementBOD.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/OvertimeManagement/OvertimeManagementMember.aspx",

            "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveOfAbsenceManagement/LeaveOfAbsenceManagementAdmin.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveOfAbsenceManagement/LeaveOfAbsenceManagementBOD.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveOfAbsenceManagement/LeaveOfAbsenceManagementManager.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveOfAbsenceManagement/LeaveOfAbsenceManagementMember.aspx",

            "/_layouts/15/RBVH.Stada.Intranet.WebPages/ShiftManagement/ShiftManagementAdmin.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/ShiftManagement/ShiftManagementMember.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/ShiftManagement/ShiftManagementManager.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/ShiftManagement/ShiftManagementBOD.aspx",

            "/_layouts/15/RBVH.Stada.Intranet.WebPages/ChangeShiftManagement/ChangeShiftManagementMember.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/ChangeShiftManagement/ChangeShiftManagementAdmin.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/ChangeShiftManagement/ChangeShiftManagementManager.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/ChangeShiftManagement/ChangeShiftManagementBOD.aspx",

            "/_layouts/15/RBVH.Stada.Intranet.WebPages/TransportationManagement/TransportationManagementAdmin.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/TransportationManagement/TransportationManagementBOD.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/TransportationManagement/TransportationManagementManager.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/TransportationManagement/TransportationManagementMember.aspx",

            "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveManagement/LeaveManagementAdmin.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveManagement/LeaveManagementBOD.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveManagement/LeaveManagementManager.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveManagement/LeaveManagementMember.aspx",

            "/_layouts/15/RBVH.Stada.Intranet.WebPages/RequestManagement/RequestList.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/RequestManagement/RequestForm.aspx",

            "/_layouts/15/RBVH.Stada.Intranet.WebPages/RecruitmentManagement/RecruitmentList.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/RecruitmentManagement/RecruitmentForm.aspx",

            "/_layouts/15/RBVH.Stada.Intranet.WebPages/FreightManagement/FreightManagementAdmin.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/FreightManagement/FreightManagementBOD.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/FreightManagement/FreightManagementManager.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/FreightManagement/FreightManagementMember.aspx",

            "_layouts/15/RBVH.Stada.Intranet.WebPages/RequestForDiplomaSupplyManagement/RequestForDiplomaSupplyForm.aspx",
            "_layouts/15/RBVH.Stada.Intranet.WebPages/RequestForDiplomaSupplyManagement/RequestForDiplomaSupplyList.aspx",

            "/_layouts/15/RBVH.Stada.Intranet.WebPages/BusinessTripManagement/BusinessTripManagementAdmin.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/BusinessTripManagement/BusinessTripManagementBOD.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/BusinessTripManagement/BusinessTripManagementManager.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/BusinessTripManagement/BusinessTripManagementMember.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/DelegationManagement/DelegationList.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/DelegationManagement/DelegationForm.aspx",

            "/_layouts/15/RBVH.Stada.Intranet.WebPages/LeaveOfAbsenceManagement/LeaveOfAbsenceApprovalDelegation.aspx",
            "/_layouts/15/RBVH.Stada.Intranet.WebPages/ChangeShiftManagement/ChangeShiftApprovalDelegation.aspx",
];

var DisplayGroup = ["/_layouts/15/people.aspx",
];

$(document).ready(function () {
    var currentUrl = window.location.href;
    // Check Site Admin -> Hide left menu
    if (_spPageContextInfo && (_spPageContextInfo.userId === 1073741823 || _spPageContextInfo.isSiteAdmin))
    {
        $("#ctl00_PlaceHolderLeftNavBar_QuickLaunchNavigationManager").css("display", "none");
        if (currentUrl.indexOf("_layouts") < 0) {
            $('#contentRow').css("margin-left", "2%");
            $('#contentRow').css("margin-right", "2%");
        }
        else {
            $('#contentRow').css("margin-left", "10px");
        }

        $('#contentBox').css("margin-left", "0%");

        ShowPolicyMenu(currentUrl);

        return;
    }
    
    $("#ContentDiv .ms-core-listMenu-verticalBox").css("display", "none");
    $("#ctl00_PlaceHolderLeftNavBar_QuickLaunchNavigationManager").css("display", "none");
    //$('.stada-leftmenu').css('border',"none");
    $('#contentBox').css("margin-left", "0");
    if (currentUrl.indexOf("_layouts") < 0) {
        $('#contentRow').css("margin-left", "2%");
        $('#contentRow').css("margin-right", "2%");
    }
    else {
        $('#contentRow').css("margin-left", "10px");
    }
    HideLeftMenu(currentUrl);
    ShowPolicyMenu(currentUrl);
});

function HideLeftMenu(url) {
    $.each(displayUrls, function (index, value) {
        if (url.indexOf(value) >= 0 && url.indexOf("_layouts") < 0) //display left menu
        {
            $("#ContentDiv .ms-core-listMenu-verticalBox").css("display", "block");
            $("#ctl00_PlaceHolderLeftNavBar_QuickLaunchNavigationManager").css("display", "block");
            $('#contentBox').css("margin-left", "");
            $('#contentRow').css("margin-left", "");
            $('#contentRow').css("margin-right", "");
            $('.ms-core-sideNavBox-removeLeftMargin').css("border", "solid 1px #e6e0e0");
        }
    });

    $.each(DisplayFullUrls, function (index, value) {
        if (url.toLowerCase().indexOf(value.toLowerCase()) >= 0) //display left menu
        {
            $("#ctl00_PlaceHolderLeftNavBar_QuickLaunchNavigationManager").css("display", "block");
            $("#ContentDiv .ms-core-listMenu-verticalBox").css("display", "block");
            $('#contentBox').css("margin-left", "");
            $('#contentRow').css("margin-left", "");
            $('#contentRow').css("margin-right", "");
            //$('.ms-core-sideNavBox-removeLeftMargin').css("border", "solid 1px #e6e0e0");
            $('.ms-core-sideNavBox-removeLeftMargin').css("border", "none");
        }
    });
    $.each(DisplayGroup, function (index, value) {
        if (url.toLowerCase().indexOf(value.toLowerCase()) >= 0) //display left menu
        {
            $("#ctl00_PlaceHolderLeftNavBar_QuickLaunchNavigationManager").css("display", "none");
            $("#ContentDiv .ms-core-listMenu-verticalBox").css("display", "block");
            $('#contentBox').css("margin-left", "");
            $('#contentRow').css("margin-left", "");
            $('#contentRow').css("margin-right", "");
            $('.ms-core-sideNavBox-removeLeftMargin').css("border", "solid 1px #e6e0e0");
        }
    });
}

function ShowPolicyMenu(url)
{
    $('.default-leftmenu').hide();
    $(".ms-core-listMenu-verticalBox", ".default-leftmenu").hide();
    url = url.toLowerCase();
    if (url.indexOf('/policies/pages/forms/') < 0 && (url.indexOf('/policies/pages/') >= 0 || url.indexOf('/policies/sitepages/') >= 0)) //display left menu
    {
        //$("#ctl00_PlaceHolderLeftNavBar_QuickLaunchNavigationManager").show();
        //$("#ContentDiv .ms-core-listMenu-verticalBox").show();
        //$('.stada-leftmenu').hide();
        //$("#ContentDiv .ms-core-listMenu-verticalBox", ".stada-leftmenu").hide();
        $('.default-leftmenu').show();
        $(".ms-core-listMenu-verticalBox", ".default-leftmenu").show();

        // Restyle CSS:
        $('#contentRow').css('margin', '0%');
    }
    // Add margin left for Home page:
    if (url.indexOf('/sitepages/home.aspx') > 0)
    {
        $('#contentRow').css('margin-left', '2%');
    }
}
var DepartmentMenu = {
    DepartmentList: "Departments",
    DepartmentNameField: "CommonName",
    VietnameseLanguageCultureId: 1066,
    MenuClientId: "#DepartmentMenuul",
    renderDepartments: function () {
        var lcid = _spPageContextInfo.currentLanguage;
        var orderby = "?$orderby= " + DepartmentMenu.DepartmentNameField;
        if (lcid === DepartmentMenu.VietnameseLanguageCultureId) {
            orderby = "?$orderby= " + DepartmentMenu.DepartmentNameField + lcid;
        }
        var url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getByTitle('" + DepartmentMenu.DepartmentList + "')/items" + orderby;// + query + orderby;
        try {
            $.ajax({
                url: url,
                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                cache: true,
                async: true,
                success: function (data) {
                    $(DepartmentMenu.MenuClientId).empty();
                    if (data && data.d && data.d.results) {
                        var departmentResults = data.d.results;
                        var parentDepartmentList = [];
                        if (departmentResults && departmentResults.length > 0) {
                            var parentDepartmentList = [];
                            var childDepartmentList = [];

                            for (var index1 = 0; index1 < departmentResults.length; index1++) {
                                if (typeof departmentResults[index1].IsVisible == 'undefined' || departmentResults[index1].IsVisible == true) {
                                    if (departmentResults[index1].UpperDepartmentId == null) {
                                        parentDepartmentList.push(departmentResults[index1]);
                                    }
                                    else {
                                        childDepartmentList.push(departmentResults[index1]);
                                    }
                                }
                            }
                            for (var index = 0; index < parentDepartmentList.length; index++) {
                                var department = parentDepartmentList[index];
                                var departmentName = department.CommonName;
                                if (lcid === DepartmentMenu.VietnameseLanguageCultureId) {
                                    departmentName = department[DepartmentMenu.DepartmentNameField + lcid];
                                }
                                $(DepartmentMenu.MenuClientId).append("<li id='Department" + department.Code + "li'><a href='/" + department.Code + "' item-data='/" + department.Code + "'>" + departmentName + "</a></li>");
                                DepartmentMenu.renderSubDepartments(childDepartmentList, department, lcid);
                            }
                        }
                    }
                }
            });
        } catch (e) {
            //console.log(e.message);
        }
    },
    renderSubDepartments: function (childDepartmentList, parentDepartment, lcid) {
        var childrenList = [];
        for (var index = 0; index < childDepartmentList.length; index++) {
            if (parentDepartment.ID === childDepartmentList[index].UpperDepartmentId) {
                childrenList.push(childDepartmentList[index]);
            }
        }
        var subMenuItemContent = "";
        for (var index = 0; index < childrenList.length; index++) {
            var subDepartment = childrenList[index];
            var departmentName = subDepartment.CommonName;
            if (lcid === DepartmentMenu.VietnameseLanguageCultureId) {
                departmentName = subDepartment[DepartmentMenu.DepartmentNameField + lcid];
            }
            subMenuItemContent += "<li><a href='/" + subDepartment.Code + "' item-data='/" + subDepartment.Code + "'> " + departmentName + "</a></li>";
        }
        if (subMenuItemContent !== "") {
            subMenuItemContent = "<ul class='dropdown-menu'>" + subMenuItemContent + "</ul>";
            $("#Department" + parentDepartment.Code + "li").addClass("dropdown-submenu");
            $("#Department" + parentDepartment.Code + "li").append(subMenuItemContent);
        }
    }
};

//$(function () {
//    setNavigation();
//});

function setNavigation() {
    var path = window.location.pathname;
    path = path.replace(/\/$/, "");
    path = decodeURIComponent(path);

    $("ul.nav li").each(function () {
        var href = $(this).find('a').attr("item-data");
        if (path.indexOf(href)>=0) {
            $(this).closest('li').css("background", "rgb(226, 226, 226)");
            setParent($(this));
        }
    });
}


function setParent(element)
{
    var parent = element.parent().closest("li");
    if(parent == null || parent.length == 0)
    {
        return;
    }
    else
    {
        parent.closest('li').css("background", "rgb(226, 226, 226)");
        setParent(parent);
    }

}
// Module pattern
var TopMenuModule = (function () {
    var firstLoad = true;
    var userIsInGroup = false;

    var _doShowHide = function () {
        if (userIsInGroup == true) {
            $("#topmenu_Admin a.dropdown-toggle").removeClass('disabled');
            $("#topmenu_Admin span.caret").show();
            // trigger click again for first load
            if (firstLoad)
            {
                firstLoad = false;
                $("#topmenu_Admin a.dropdown-toggle").trigger('click');
            }
        }
        else {
            firstLoad = false;
            $("#topmenu_Admin a.dropdown-toggle").addClass('disabled');
        }
    }

    var _showHideAdminMenu = function () {
        if (firstLoad) { // Call AJAX to check current user is in 'SYSTEM ADMIN' group or not
            $.ajax({
                headers: { "accept": "application/json; odata=verbose" },
                method: "GET",
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/currentuser/groups",
                success: function (data) {
                    if (data && data.d && data.d.results) {
                        data.d.results.forEach(function (value) {
                            if (value.Title.toUpperCase() == 'SYSTEM ADMIN') {
                                userIsInGroup = true;
                            }
                        });
                    }
                    _doShowHide(userIsInGroup);
                },
                error: function (response) {
                    _doShowHide(false);
                    console.log(response.status);
                },
            });
        }
    }

    return {
        ShowHideAdminMenu: _showHideAdminMenu
    }
})();


RBVH.Stada.javascript.common.NamespaceManager.register("RBVH.Stada.WebPages.Constants");
RBVH.Stada.WebPages.Constants = {
    DateTimeFormat: {
        VietNameseDateTime: 'DD/MM/YYYY HH:mm'
    },
    PageLimit: 20,

    EmployeeLevel:
    {
        BOD: 7,
        DepartmentHead: 5,
        GroupLeader: 4,
        Administrator: 3,
        TeamLeader: 3.2, //To Truong
        AssociateTeamLeader: 3.1, //To Pho
        ShiftLeader: 3.3,
        Employee: 2,
        Helper: 1,
        SecurityGuard: 1,
        Gardener: 1,
        DirectManagement: 6,
    },

    ApprovalStatus: {
        En_US: {
            InProgress: 'Approval',
            Approved: 'Approved',
            Cancelled: 'Cancelled',
            Rejected: 'Rejected',
            InProcess: 'In-Process',
            Completed: 'Completed'
        },
        Vi_VN: {
            InProgress: 'Approval',
            Approved: 'Đã duyệt',
            Cancelled: 'Đã hủy',
            Rejected: 'Từ chối',
            InProcess: 'Đang thực hiện',
            Completed: 'Hoàn thành'
        }
    }
};


var CalendarControl = CalendarControl || {};
CalendarControl.CalendarControlSide = ".ms-core-navigation";
CalendarControl.DatePicker = "#DatePickerDiv";
CalendarControl.IsLoaded = false;
$(document).ready(function () {
    
    var CalendarControlSide = $(CalendarControl.CalendarControlSide);

    CalendarControlSide.each(function () {

        if ($(this).find(CalendarControl.DatePicker).length > 0) {

            CalendarControlSide.css({ "display": "flex", "width": "500px" });
        };
    });

    var calendarControl = $('#AsynchronousViewDefault_CalendarView');
    var datepickerControl = $('#DatePickerDiv');
    if (calendarControl.length > 0 && datepickerControl.length && window.browseris.ie) {
        if (!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }


        $(window).resize(function () {
            if (CalendarControl.IsLoaded) {
                window.location.reload();
            }
            CalendarControl.IsLoaded = true;
        });

    }

});
$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return decodeURI(results[1]) || 0;
    }
}
$(function () {

    // "Layouts/RBVH.Stada.Intranet.Branding/scripts/Language_flags.js"
    $(".ms-cui-topBar2 #RibbonContainer-TabRowRight").append("<span id ='flag' class='ms-qatbutton'><a id='enUSLang' href=''><img src='/styles/images/language_flag/en.png'/></a><a id='viVNLang' href=''><img src='/styles/images/language_flag/vn.png'/></a></span>");

    $('#viVNLang').click(function () {
        var url = document.URL;
        var viUrl = updateUrlParameter(url, "lang", "vi-VN");
        window.location.href = viUrl;
        return false;
    });

    $('#enUSLang').click(function () {
        var url = document.URL;
        var enUrl = updateUrlParameter(url, "lang", "en-US");
        window.location.href = enUrl;
        return false;
    });

    // "Layouts/RBVH.Stada.Intranet.Branding/scripts/DepartmentMenu.js"
    var departmentMenu = DepartmentMenu || {};
    $('#DepartmentMenuul').prev('a').on('click', function () {
        if ($('#DepartmentMenuul li').length == 0)
            departmentMenu.renderDepartments();
    });

    // "Layouts/RBVH.Stada.Intranet.Branding/scripts/MenuItemActive.js"
    setNavigation();

    // "Layouts/RBVH.Stada.Intranet.Branding/scripts/TopMenuItemActive.js"
    $('#topmenu_Admin a').on('click', function () {
        TopMenuModule.ShowHideAdminMenu();
    });

    // "Layouts/RBVH.Stada.Intranet.Branding/scripts/TaskNotification.js"
    // TODO: Meeting 19.7.2018: Remove
    //var settings = {
    //    CounterSelector: '.notification-counter',
    //    CounterContainerSelector: '#notifycation-bell',
    //    Tooltip: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Notification_Tooltip%>" />',
    //};

    //taskNotification = new RBVH.Stada.WebPages.pages.TaskNotification(settings);

    RBVH.Stada.WebPages.Utilities.GUI.showApprovalStatus(".statusmultilang");
});

$(window).load(function () {
    // Animate loader off screen
    $(".se-pre-con").fadeOut(0);
});