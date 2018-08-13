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