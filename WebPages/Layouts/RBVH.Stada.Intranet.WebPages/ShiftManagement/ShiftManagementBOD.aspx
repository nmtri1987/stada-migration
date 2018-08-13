<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ShiftManagementBOD.aspx.cs" Inherits="RBVH.Stada.Intranet.WebPages.Layouts.RBVH.Stada.Intranet.WebPages.ShiftManagement.ShiftManagementBOD" DynamicMasterPageFile="~masterurl/default.master" %>
<%@ Register Src="~/_controltemplates/15/RBVH.Stada.Controls/ShiftManagement/ShiftForDepartmentControl.ascx" TagPrefix="sd" TagName="ShiftForDepartmentControl" %>
<asp:Content ID="PageHead" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <link type="text/css" rel="stylesheet" href="/styles/libs/Bootstrap/DatePicker/css/datepicker.min.css?v=CD44ED56-260A-4C8D-A2FE-A3A3FB20FE5C"/>
    <link type="text/css" rel="stylesheet" href="/styles/css/ShiftModule/default.min.css?v=CD44ED56-260A-4C8D-A2FE-A3A3FB20FE5C" />

    <script type="text/javascript" src="/styles/libs/Bootstrap/DatePicker/js/bootstrap-datepicker.min.js?v=CD44ED56-260A-4C8D-A2FE-A3A3FB20FE5C"></script>
    <script type="text/javascript" src="/styles/scripts/ShiftModule/ShiftByDepartment.min.js?v=CD44ED56-260A-4C8D-A2FE-A3A3FB20FE5C"></script>
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class="col-md-12">
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active"><a href="#tab3" aria-controls="tab3" role="tab" data-toggle="tab">
                <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,ShiftManagement_ShiftsInDepartmentTitle%>" />
            </a></li>
        </ul>
        <!-- Tab panes -->
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="tab3">
                <sd:ShiftForDepartmentControl id="ShiftForDepartmentControl1" runat="server" />
            </div>
        </div>
    </div>
    <script type="text/javascript">
        $(document).ready(function () {
            var settings = {
                MonthControlSelector: '#txtShiftDateByDepartment',
                DepartmentControlSelector: '#cbShiftAdminDepartment',
                CurrentDepartmentId: 0,
                };
            shiftByDepartmentInstance = new RBVH.Stada.WebPages.pages.ShiftByDepartment(settings);
        });
    </script>
</asp:Content>

<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
    <SharePoint:ProjectProperty Property="Title" runat="server"/> - <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,ShiftManagement_PageTitle%>" />
</asp:Content>

<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server" >
<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,ShiftManagement_PageTitleArea%>" />
</asp:Content>
