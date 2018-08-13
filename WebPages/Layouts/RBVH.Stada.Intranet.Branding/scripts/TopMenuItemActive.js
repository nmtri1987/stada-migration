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

