<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ChangeShiftManagementManager.aspx.cs" Inherits="RBVH.Stada.Intranet.WebPages.Layouts.RBVH.Stada.Intranet.WebPages.ChangeShiftManagement.ChangeShiftManagementManager" DynamicMasterPageFile="~masterurl/default.master" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Src="~/_controltemplates/15/RBVH.Stada.Controls/ChangeShiftManagementControl/ChangeShiftApprovalControl.ascx" TagPrefix="ChangeShiftApproval" TagName="ChangeShiftApprovalControl" %>
<%@ Register Src="~/_controltemplates/15/RBVH.Stada.Controls/ChangeShiftManagementControl/ChangeShiftByDepartmentControl.ascx" TagPrefix="ChangeShiftByDepartment" TagName="ChangeShiftByDepartmentControl" %>

<asp:Content ID="PageHead" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <link type="text/css" rel="stylesheet" href="/styles/libs/Bootstrap/DatePicker/css/datepicker.min.css" />
    <link type="text/css" rel="stylesheet" href="/styles/libs/jsGrid/jquery-ui.min.css" />
    <script type="text/javascript" src="/styles/libs/Bootstrap/DatePicker/js/bootstrap-datepicker.min.js"></script>
    <script type="text/javascript" src="/styles/scripts/ChangeShiftModule/ChangeShiftByDepartment.min.js?v=3A09E3D0-DF78-45B9-B6B5-2CAC0DC27CA0"></script>
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class="col-md-12">
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#tab2" aria-controls="tab2" role="tab" data-toggle="tab">
                <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,ChangeShift_MyApprovalList%>" />
            </a></li>
            <li role="presentation"><a href="#tab3" aria-controls="tab3" role="tab" data-toggle="tab">
                <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,ChangeShift_ChangeShiftByDepartment%>" />
            </a></li>
        </ul>
        <!-- Tab panes -->
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="tab2">
                <div class="panel panel-primary">
                    <div class="panel-body">
                        <ChangeShiftApproval:ChangeShiftApprovalControl id="ChangeShiftApprovalControl" runat="server"></ChangeShiftApproval:ChangeShiftApprovalControl>
                    </div>
                </div>
            </div>
            <div role="tabpanel" class="tab-pane" id="tab3">
                <div class="panel panel-primary">
                    <div class="panel-body">
                        <ChangeShiftByDepartment:ChangeShiftByDepartmentControl id="ChangeShiftByDepartmentControl" runat="server"></ChangeShiftByDepartment:ChangeShiftByDepartmentControl>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/javascript">
        $(document).ready(function () {
            var settings = {
                MonthControlSelector: '#txtChangeShiftDateByDepartment',
                DepartmentControlSelector: '#cbChangeShiftAdminDepartment',
                CurrentDepartmentId: <%= IsAdminDepartment ? 0 : CurrentDepartmentId %> };

            changeShiftByDepartmentInstance = new RBVH.Stada.WebPages.pages.ChangeShiftByDepartment(settings);

            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var targetTab = $(e.target).attr("href") // activated tab
                window.location.hash = targetTab;
            });
            //Get current tabe and set active
            var hashTab = window.location.hash;
            if (!hashTab) {
                hashTab = "#tab2";
            }
            window.location.hash = hashTab;
            $('[href="' + hashTab + '"]').trigger('click');
        });
    </script>

</asp:Content>

<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
    <SharePoint:ProjectProperty Property="Title" runat="server"/> - <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,ChangeShiftManagement_PageTitle%>" />
</asp:Content>

<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,ChangeShiftManagement_PageTitleArea%>" />
</asp:Content>
