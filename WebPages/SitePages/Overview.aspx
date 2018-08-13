<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ID="PageHead" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <link type="text/css" rel="stylesheet" href="/styles/libs/jsGrid/jsgrid.common.min.css?v=CD44ED56-260A-4C8D-A2FE-A3A3FB20FE5C" />
    <link type="text/css" rel="stylesheet" href="/styles/css/OverviewModule/default.min.css?v=CD44ED56-260A-4C8D-A2FE-A3A3FB20FE5C" />

    <script type="text/javascript" src="/styles/libs/highchart/highcharts.js"></script>
    <script type="text/javascript" src="/styles/libs/highchart/data.js"></script>
    <script type="text/javascript" src="/styles/libs/highchart/exporting.js"></script>
    
    <script type="text/javascript" src="/styles/libs/jsGrid/jsgrid.common.min.js?v=CD44ED56-260A-4C8D-A2FE-A3A3FB20FE5C"></script>
    <script type="text/javascript" src="/styles/scripts/OverviewModule/Overview.min.js?v=A39DB549-89B1-463C-A897-A9D0D8C0C7C4"></script>
</asp:Content>

<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
    <SharePoint:ProjectProperty Property="Title" runat="server"/> - <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_PageTitle%>" />
</asp:Content>

<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_PageTitleArea%>" />
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class="grid-container" style="margin-top: 0px;">
        <h2 class="conner" style="text-align: center; text-transform: uppercase;">
            <span class="s-expand show-hide"></span>
            <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Chart_Title%>" />
        </h2>
        <div class="grid-content">
            <div id="container" style="height: 300px; width: 100%; margin: 0 auto"></div>
            <div class="chart-shader" style="display: none;"></div>
            <div class="chart-loader" style="display: none;">
                <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Grid_LoadMessageTitle%>" />
            </div>
        </div>
    </div>
    

    <div class="grid-container">
        <h2 class="conner">
            <span class="s-expand show-hide"></span>
            <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Grid_Title%>" />
            <span id="task-list-title"></span>
            <%--<span class="s-counter">5</span>--%>
        </h2>
        <div class="grid-content">
            <div id="jsGrid-task">
            </div>
        </div>
    </div>
    <script type="text/javascript">
        $(document).ready(function () {
            var settings = {
                Chart: {
                    Title: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Chart_Title%>" />',
                    Label: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Chart_Label%>" />',
                    ShaderSelector: '.chart-shader',
                    LoaderSelector: '.chart-loader',
                    Columns:
                    {
                        Title:
                        {
                            LeftColumnTitle: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Chart_LeftColumnTitle%>" />',
                            WaitingApprovalTitle: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Chart_WaitingApprovalTitle%>" />',
                            WaitingApprovalTodayTitle: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Chart_WaitingApprovalTodayTitle%>" />',
                            InProcessTitle: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Chart_InProcessTitle%>" />',
                            ApprovedTodayTitle: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Chart_ApprovedTodayTitle%>" />',
                        }
                    }
                },
                Grid: {
                    Selector: '#jsGrid-task',
                    PagerFormat: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Grid_PagerFormat%>" />',
                    TaskListTitleSelector: '#task-list-title',
                    Title: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Grid_Title%>" />',
                    EmptyDataTitle: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Grid_EmptyDataTitle%>" />',
                    LoadMessageTitle: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Grid_LoadMessageTitle%>" />',
                    Columns:
                    {
                        Title:
                        {
                            Module: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Grid_Column_ModuleTitle%>" />',
                            Requester: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Grid_Column_RequesterTitle%>" />',
                            Description: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Grid_Column_DescriptionTitle%>" />',
                            Department: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Grid_Column_DepartmentTitle%>" />',
                            ApprovalStatus: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Grid_Column_ApprovalStatusTitle%>" />',
                            CreatedDate: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Grid_Column_CreatedDateTitle%>" />',
                            DueDate: '<asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,Overview_Grid_Column_DueDateTitle%>" />',
                        }
                    }
                }
            };

            overviewInstance = new RBVH.Stada.WebPages.pages.Overview(settings);
        });
    </script>
</asp:Content>
