﻿<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="LeaveOfAbsenceRequestControl.ascx.cs" Inherits="RBVH.Stada.Intranet.WebPages.CONTROLTEMPLATES.RBVH.Stada.Controls.LeaveOfAbsenceManagementControl.LeaveOfAbsenceRequestControl" %>
<div style="margin-bottom: 20px; margin-left: -5px">
    <button type="button" id="btnAddNewChangeShift" class="btn btn-primary add-new-not-overtime">
        <i class='fa fa-plus' aria-hidden='true'></i>&nbsp;
            <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,NotOvertimeManagement_AddNew%>" />
    </button>
</div>
<table style="table-layout: fixed; width: 100% !important" id="leaveOfAbsenceRequestContainer">
    <tr>
        <td style="width: 100%;" valign="top">
            <asp:HiddenField ID="ParamRequesterLookupIDHidden" runat="server"></asp:HiddenField>
            <br />
            <WebPartPages:WebPartZone runat="server" FrameType="None" ID="NotOverTimeRequestWP" Title="loc:Main">
                <ZoneTemplate>
                    <WebPartPages:XsltListViewWebPart runat="server" ViewFlag="" ViewSelectorFetchAsync="False" InplaceSearchEnabled="False"
                        ServerRender="False" ClientRender="True" InitialAsyncDataFetch="False" WebId="00000000-0000-0000-0000-000000000000"
                        IsClientRender="False" GhostedXslLink="main.xsl" NoDefaultStyle=""
                        EnableOriginalValue="False" DisplayName="My Leave Absence Request" ViewContentTypeId="" Default="TRUE"
                        ListUrl="Lists/NotOverTimeManagement" ListDisplayName="" PageType="PAGE_DEFAULTVIEW" PageSize="-1"
                        UseSQLDataSourcePaging="True" DataSourceID="" ShowWithSampleData="False" AsyncRefresh="False" ManualRefresh="False"
                        AutoRefresh="False" AutoRefreshInterval="60" Title="Leave Of Absence For Ovetime Management"
                        FrameType="Default" SuppressWebPartChrome="False" Description="Not OverTime Management"
                        IsIncluded="True" ZoneID="Main" PartOrder="2" FrameState="Normal"
                        AllowRemove="True" AllowZoneChange="True" AllowMinimize="True" AllowConnect="True" AllowEdit="True"
                        AllowHide="True" IsVisible="True" TitleUrl="/Lists/NotOverTimeManagement" DetailLink="/Lists/NotOverTimeManagement"
                        HelpLink="" HelpMode="Modeless" Dir="Default" PartImageSmall="" MissingAssembly="Cannot import this Web Part."
                        PartImageLarge="" IsIncludedFilter="" ExportControlledProperties="False"
                        ConnectionID="00000000-0000-0000-0000-000000000000" ID="NotOverTimeRequestControl" __MarkupType="vsattributemarkup"
                        WebPart="true" Height="" Width="">
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
                                 <ParameterBinding Name="RequesterLookupID" Location="Control(ParamRequesterLookupIDHidden, Value)" DefaultValue="1"/>
                        </ParameterBindings>
                        <DataFields>
                        </DataFields>
                        <XmlDefinition>
                         <View BaseViewID="3" Type="HTML" WebPartZoneID="Main" DisplayName="Requests View"  MobileView="TRUE"  SetupPath="pages\viewpage.aspx" ImageUrl="/_layouts/15/images/generic.png?rev=23" Url="Requests.aspx">
                                <Query>   
                                    <Where>
                                        <Eq>
                                            <FieldRef Name="Requester" LookupId="TRUE"/>
                                            <Value Type="Lookup">{RequesterLookupID}</Value>
                                        </Eq>
                                    </Where>
                                    <OrderBy>
                                        <FieldRef Name="ColForSort" Ascending="TRUE" />
                                        <FieldRef Name="CommonFrom" Ascending="FALSE" />
                                        <FieldRef Name="ID" Ascending="FALSE" />
                                    </OrderBy>
                                </Query>
                                <ViewFields>
                                    <FieldRef Name="Requester"/>
                                    <FieldRef Name="CommonDepartment"/>
                                    <FieldRef Name="HoursPerDay"/>
                                    <FieldRef Name="CommonDate"/>
                                    <FieldRef Name="CommonFrom"/>
                                    <FieldRef Name="To"/>
                                    <FieldRef Name="Reason"/>
                                    <FieldRef Name="ApprovalStatus"/>
                                    <FieldRef Name="Title"/>
                                    <FieldRef Name="CommonComment"/>
                                </ViewFields>
                                <RowLimit Paged="TRUE">20</RowLimit>
                                <JSLink>clienttemplates.js</JSLink>
                                <XslLink Default="TRUE">main.xsl</XslLink>
                                <Toolbar Type="Standard"/>
                            </View>
                        </XmlDefinition>
                        <JSLink>~sitecollection/styles/scripts/NotOvertimeModule/JSLink_NotOvertimeView.min.js?v=3A09E3D0-DF78-45B9-B6B5-2CAC0DC27CA0</JSLink>
                    </WebPartPages:XsltListViewWebPart>
                </ZoneTemplate>
            </WebPartPages:WebPartZone>
        </td>
    </tr>
</table>
<script type="text/javascript">
    $(document).ready(function () {
        $('.add-new-not-overtime').on('click', function () {
            var sourceURL = window.location.href;
            sourceURL = Functions.removeParam('lang', sourceURL);
            sourceURL = encodeURIComponent(sourceURL);
            window.location = '//' + location.host + '/Lists/NotOvertimeManagement/NewForm.aspx?subSection=LeaveOfAbsenceManagement&Source=' + sourceURL;
        });
    });
</script>
