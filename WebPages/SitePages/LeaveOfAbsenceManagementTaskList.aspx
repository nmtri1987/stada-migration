﻿<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ID="PageHead" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <table style="table-layout: fixed; width: 100% !important">
        <tr>
            <td style="width: 100%;" valign="top">
                <asp:HiddenField ID="ParamRequesterLookupIDHidden" runat="server"></asp:HiddenField>
                <br />
                <WebPartPages:WebPartZone runat="server" FrameType="None" ID="WebPartZone1" Title="loc:Main">
                    <ZoneTemplate>
                        <WebPartPages:XsltListViewWebPart runat="server" ViewFlag="" ViewSelectorFetchAsync="False" InplaceSearchEnabled="False"
                            ServerRender="False" ClientRender="True" InitialAsyncDataFetch="False" WebId="00000000-0000-0000-0000-000000000000"
                            IsClientRender="False" GhostedXslLink="main.xsl" NoDefaultStyle="" ViewGuid="00000000-0000-0000-0000-000000000000"
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
                            ConnectionID="00000000-0000-0000-0000-000000000000" ID="MyLeaveAbsenceRequestID" __MarkupType="vsattributemarkup"
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
                            <View Name="MyLeaveAbsenceRequests" DefaultView="TRUE" MobileView="TRUE" 
                                MobileDefaultView="TRUE" Type="HTML" DisplayName="My Leave Absence Requests" 
                                Url="MyLeaveAbsenceRequests.aspx"
                                 Level="1" BaseViewID="1" ContentTypeID="0x" ImageUrl="/_layouts/15/images/generic.png?rev=23" >
                                <Query>
                                    <Where>
                                    <And>
                                        <Eq>
                                            <FieldRef Name='CommonApprover1' LookupId="True" />
                                            <Value Type='User' LookupId="True"><UserID/></Value>
                                        </Eq>
                                        <IsNull>
                                            <FieldRef Name='ApprovalStatus' />
                                        </IsNull>
                                    </And>
                                    </Where>
                                    <OrderBy><FieldRef Name="ID" Ascending="False" /></OrderBy>
                                </Query>
                                <ViewFields>
                                    <FieldRef Name="Requester"/>
                                    <FieldRef Name="DepartmentName"/>
                                    <FieldRef Name="HoursPerDay"/>
                                    <FieldRef Name="CommonDate"/>
                                    <FieldRef Name="CommonFrom"/>
                                    <FieldRef Name="To"/>
                                    <FieldRef Name="Reason"/>
                                    <FieldRef Name="ApprovalStatus"/>
                                    <FieldRef Name="Title"/>
                                </ViewFields>
                                <RowLimit Paged="TRUE">20</RowLimit><JSLink>clienttemplates.js</JSLink>
                                <XslLink Default="TRUE">main.xsl</XslLink><Toolbar Type="Standard"/>
                            </View>
                               
                            </XmlDefinition>
                            <JSLink>~sitecollection/styles/scripts/NotOvertimeModule/JSLink_TaskList_NotOvertime_Approval.min.js?v=CD44ED56-260A-4C8D-A2FE-A3A3FB20FE5C</JSLink>
                        </WebPartPages:XsltListViewWebPart>
                    </ZoneTemplate>
                </WebPartPages:WebPartZone>
            </td>
        </tr>
    </table>
</asp:Content>

<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
    <SharePoint:ProjectProperty Property="Title" runat="server"/> - <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,NotOvertimeTaskListManagement_PageTitle%>" />
</asp:Content>

<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,NotOvertimeTaskListManagement_PageTitleArea%>" />
</asp:Content>
