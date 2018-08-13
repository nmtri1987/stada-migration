﻿<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Import Namespace="RBVH.Stada.Intranet.WebPages.Utils" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="LeaveByDepartmentControl.ascx.cs" Inherits="RBVH.Stada.Intranet.WebPages.CONTROLTEMPLATES.RBVH.Stada.Controls.LeaveManagementControl.LeaveByDepartmentControl" %>

<table style="table-layout: fixed; width: 100% !important" id="leave-dept-list-container">
    <tr>
        <td style="width: 100%" valign="top">
            <div class="form-inline">
                <div class="form-group header-left lbl-fixed-width">
                    <label>
                        <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,CommonDepartment%>" />
                    </label>
                </div>
                <div class="form-group">
                    <select class="form-control" id="cbLeaveDepartment">
                    </select>
                </div>
            </div>
        </td>
    </tr>
    <tr>
        <td style="width: 100%" valign="top">
            <div class="form-inline pt10">
                <div class="form-group header-left lbl-fixed-width">
                    <label>
                    <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,CalendarFromDate%>" />
                    </label>
                </div>
                <div class="form-group month-only">
                    <div class="input-append  date inner-addon right-addon txtCalendar" id="dpFromDate" data-date="102/2012" data-date-format="dd/mm/yyyy" data-autoclose="true" style="width: 120px;">
                    <i class="glyphicon glyphicon-calendar" style="padding: 5px !important; font-size: 19px; color: #0865bd; left:80px;"></i>
                    <asp:TextBox ID="txtFromDate" ClientIDMode="Static" runat="server" CssClass="form-control " ReadOnly="true" Width="110px"></asp:TextBox>
                    </div>
                </div>
            </div>
        </td>
    </tr>
    <tr>
        <td style="width: 100%" valign="top">
            <div class="form-inline pt10">
                <div class="form-group header-left lbl-fixed-width">
                    <label>
                        <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,CalendarToDate%>" />
                    </label>
                </div>
                <div class="form-group">
                    <div class="input-append  date inner-addon right-addon txtCalendar" id="dpMonths" data-date="102/2012" data-date-format="dd/mm/yyyy" data-autoclose="true" style="width: 120px;">
                        <i class="glyphicon glyphicon-calendar" style="padding: 5px !important; font-size: 19px; color: #0865bd; left:80px;"></i>
                        <asp:TextBox ID="txtToDate" ClientIDMode="Static" runat="server" CssClass="form-control " ReadOnly="true" Width="110px"></asp:TextBox>
                        <% if (UserPermission.IsAdminOfHRDepartment) { %>
                            <img src="/styles/images/excel.png" style="width: 27px; height: 27px; cursor:pointer; position: absolute; left: 115px; top: 4px;" id="img-export-excel"/>
                        <% } %>
                    </div>
                </div>
            </div>
        </td>
    </tr>
    <tr>
        <td style="width: 100%;" valign="top">
            <br />
            <WebPartPages:WebPartZone runat="server" FrameType="None" ID="LeaveByDepartmentZone" Title="loc:Main">
            <ZoneTemplate>
                <WebPartPages:XsltListViewWebPart
                runat="server" ViewFlag="" ViewSelectorFetchAsync="False" InplaceSearchEnabled="True" ServerRender="False"
                ClientRender="False" InitialAsyncDataFetch="False" WebId="00000000-0000-0000-0000-000000000000" IsClientRender="False" GhostedXslLink="main.xsl"
                NoDefaultStyle="" EnableOriginalValue="False"
                DisplayName="My Leave" ViewContentTypeId="" Default="TRUE" ListUrl="Lists/LeaveManagement" ListDisplayName="" PageType="PAGE_DEFAULTVIEW" PageSize="-1"
                UseSQLDataSourcePaging="True" DataSourceID=""
                ShowWithSampleData="False" AsyncRefresh="False" ManualRefresh="False" AutoRefresh="False" AutoRefreshInterval="60" Title="Shift Management" FrameType="Default"
                SuppressWebPartChrome="False" Description="My OverTime" IsIncluded="True" ZoneID="Main" PartOrder="2" FrameState="Normal" AllowRemove="True" AllowZoneChange="True"
                AllowMinimize="True" AllowConnect="True" AllowEdit="True" AllowHide="True" IsVisible="True" TitleUrl="/Lists/LeaveManagement" DetailLink="/Lists/LeaveManagement"
                HelpLink="" HelpMode="Modeless" Dir="Default" PartImageSmall="" MissingAssembly="Cannot import this Web Part." PartImageLarge="" IsIncludedFilter="" ExportControlledProperties="False"
                ConnectionID="00000000-0000-0000-0000-000000000000" __MarkupType="vsattributemarkup"
                __AllowXSLTEditing="true" ID="LeaveByDepartmentWebPart" WebPart="true" Height="" Width="">
                <ParameterBindings>
                    <ParameterBinding Name="dvt_sortdir" Location="Postback;Connection"/>
                    <ParameterBinding Name="dvt_sortfield" Location="Postback;Connection"/>
                    <ParameterBinding Name="dvt_startposition" Location="Postback" DefaultValue=""/>
                    <ParameterBinding Name="dvt_firstrow" Location="Postback;Connection"/>
                    <ParameterBinding Name="OpenMenuKeyAccessible" Location="Resource(wss,OpenMenuKeyAccessible)" />
                    <ParameterBinding Name="open_menu" Location="Resource(wss,open_menu)" />
                    <ParameterBinding Name="select_deselect_all" Location="Resource(wss,select_deselect_all)" />
                    <ParameterBinding Name="idPresEnabled" Location="Resource(wss,idPresEnabled)" />
                    <ParameterBinding Name="NoAnnouncements" Location="Resource(wss,noXinviewofY_LIST)" />
                    <ParameterBinding Name="NoAnnouncementsHowTo" Location="Resource(wss,noXinviewofY_DEFAULT)" />
                    <ParameterBinding Name="StartMonth" Location="QueryString(AdminFromDate)" DefaultValue=""/>
                    <ParameterBinding Name="EndMonth" Location="QueryString(AdminToDate)" DefaultValue=""/>
                    <ParameterBinding Name="DepartmentId" Location="QueryString(AdminDeptId)" DefaultValue="1"/>
                </ParameterBindings>
                <DataFields></DataFields>
                <XmlDefinition>
                    <View BaseViewID="4" Type="HTML" WebPartZoneID="Main" DisplayName="Leave By Department List" TabularView="FALSE" MobileView="TRUE" MobileDefaultView="TRUE" SetupPath="pages\viewpage.aspx" ImageUrl="/_layouts/15/images/generic.png?rev=23" Url="LeaveByDepartmentList.aspx">
                          <Query>
                              <Where>
                                  <Eq>
                                      <FieldRef Name='ID' />
                                      <Value Type='Counter'>0</Value>
                                  </Eq>
                              </Where>
                              <OrderBy>
                                  <FieldRef Name="ColForSort" Ascending="TRUE" />
                                  <FieldRef Name="CommonFrom" Ascending="FALSE" />
                                  <FieldRef Name="ID" Ascending="FALSE" />
                              </OrderBy>
                            </Query>
                        <ViewFields>
                            <FieldRef Name="Requester" />
                            <FieldRef Name="RequestFor" />
                            <FieldRef Name="CommonDepartment" />
                            <FieldRef Name="CommonFrom" />
                            <FieldRef Name="To" />
                            <FieldRef Name="LeaveHours" />
                            <FieldRef Name="Reason"/>
                            <FieldRef Name="ApprovalStatus" />
                            <FieldRef Name="CommonComment" />
                            <FieldRef Name="IsValidRequest" />
                            <FieldRef Name="UnexpectedLeave" />
                        </ViewFields>
                        <RowLimit Paged="TRUE">20</RowLimit>
                        <JSLink>clienttemplates.js</JSLink>
                        <XslLink Default="TRUE">main.xsl</XslLink>
                        <Toolbar Type="Standard"/>
                    </View>
                </XmlDefinition>
                <JSLink>~sitecollection/styles/scripts/LeaveModule/JsLink_Leave.min.js?v=CD44ED56-260A-4C8D-A2FE-A3A3FB20FE5C</JSLink>
                </WebPartPages:XsltListViewWebPart>
            </ZoneTemplate>
        </WebPartPages:WebPartZone>
        </td>
    </tr>
</table>
<script type="text/javascript">
    $(document).ready(function () {
        <% if (UserPermission.IsAdminDepartment) { %>
            var settings = {
                IsAdminOfHRDepartment: <%=UserPermission.IsAdminOfHRDepartment?1:0 %> };
        <% } %>
        
        try{
            if(settings && settings.IsAdminOfHRDepartment == 1){
                $('#leave-dept-list-container').find('th').each(function($index){
                    if($(this).attr('id') == 'comment_leaveDept')
                    {
                        var table = $(this).closest('table');
                        $(this).hide();
                        $(table).find('tr').find('td:nth(' + $index + ')').hide();
                    }
                });
            }
            else{
                $('#leave-dept-list-container').find('th').each(function($index){
                    if($(this).attr('id') == 'unexpected_leaveDept')
                    {
                        var table = $(this).closest('table');
                        $(this).hide();
                        $(table).find('tr').find('td:nth(' + $index + ')').hide();
                    }
                });
                $('#leave-dept-list-container').find('th').each(function($index){
                    if($(this).attr('id') == 'isValid_leaveDept')
                    {
                        var table = $(this).closest('table');
                        $(this).hide();
                        $(table).find('tr').find('td:nth(' + $index + ')').hide();
                    }
                });
            }
        }catch(ex){}
    });
</script>