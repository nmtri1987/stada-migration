﻿<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="MyFreightControl.ascx.cs" Inherits="RBVH.Stada.Intranet.WebPages.CONTROLTEMPLATES.RBVH.Stada.Controls.FreightManagementControl.MyFreightControl" %>

<table style="table-layout: fixed; width: 100% !important" id="my-freight-list-container">
    <tr>
        <td style="width: 100%;" valign="top">
            <asp:HiddenField ID="ParamBringerLookupIDHidden" runat="server"></asp:HiddenField>
            <br />
            <WebPartPages:WebPartZone runat="server" FrameType="None" ID="MyFreightZone" Title="loc:Main">
            <ZoneTemplate>
                <WebPartPages:XsltListViewWebPart
                runat="server" ViewFlag="" ViewSelectorFetchAsync="False" InplaceSearchEnabled="True" ServerRender="False"
                ClientRender="False" InitialAsyncDataFetch="False" WebId="00000000-0000-0000-0000-000000000000" IsClientRender="False" GhostedXslLink="main.xsl"
                NoDefaultStyle="" ViewGuid="" EnableOriginalValue="False"
                DisplayName="My Freight" ViewContentTypeId="" Default="TRUE" ListUrl="Lists/FreightManagement" ListDisplayName="" PageType="PAGE_DEFAULTVIEW" PageSize="-1"
                UseSQLDataSourcePaging="True" DataSourceID=""
                ShowWithSampleData="False" AsyncRefresh="False" ManualRefresh="False" AutoRefresh="False" AutoRefreshInterval="60" Title="Freight Management" FrameType="Default"
                SuppressWebPartChrome="False" Description="My Freight" IsIncluded="True" ZoneID="Main" PartOrder="2" FrameState="Normal" AllowRemove="True" AllowZoneChange="True"
                AllowMinimize="True" AllowConnect="True" AllowEdit="True" AllowHide="True" IsVisible="True" TitleUrl="/Lists/FreightManagement" DetailLink="/Lists/FreightManagement"
                HelpLink="" HelpMode="Modeless" Dir="Default" PartImageSmall="" MissingAssembly="Cannot import this Web Part." PartImageLarge="" IsIncludedFilter="" ExportControlledProperties="False"
                ConnectionID="00000000-0000-0000-0000-000000000000" __MarkupType="vsattributemarkup"
                __AllowXSLTEditing="true" ID="MyFreightWebPart" WebPart="true" Height="" Width="">
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
                    <ParameterBinding Name="BringerLookupID" Location="Control(ParamBringerLookupIDHidden, Value)" DefaultValue="1"/>
                </ParameterBindings>
                <DataFields></DataFields>
                <XmlDefinition>
                    <View BaseViewID="5" Type="HTML" WebPartZoneID="Main" DisplayName="My Freight List" TabularView="FALSE" MobileView="TRUE" MobileDefaultView="TRUE" SetupPath="pages\viewpage.aspx" ImageUrl="/_layouts/15/images/generic.png?rev=23" Url="MyFreightList.aspx">
                        <Query>
                            <Where>
                                <Eq>
                                    <FieldRef Name='Bringer' LookupId="TRUE"/>
                                    <Value Type='Lookup'>{BringerLookupID}</Value>
                                </Eq>
                            </Where>
                            <OrderBy>
                                <FieldRef Name="ColForSort" Ascending="TRUE" />
                                <FieldRef Name="Created" Ascending="FALSE" />
                                <FieldRef Name="ID" Ascending="FALSE" />
                            </OrderBy>
                        </Query>
                        <ViewFields>
                              <FieldRef Name="Requester" />
                              <FieldRef Name="RequestNo" />
                              <FieldRef Name="CommonDepartment" />
                              <FieldRef Name="Bringer" />
                              <FieldRef Name="BringerName" />
                              <FieldRef Name="CompanyVehicle" />
                              <FieldRef Name="Receiver" />
                              <FieldRef Name="ApprovalStatus" />
                              <FieldRef Name="CommonComment" />
                              <FieldRef Name="Author"/>
                              <FieldRef Name="Editor"/>
                              <FieldRef Name="Created"/>
                        </ViewFields>
                        <RowLimit Paged="TRUE">20</RowLimit>
                        <JSLink>clienttemplates.js</JSLink>
                        <XslLink Default="TRUE">main.xsl</XslLink>
                        <Toolbar Type="Standard"/>
                    </View>
                </XmlDefinition>
                <JSLink>~sitecollection/styles/scripts/FreightModule/JSLink_Freight.min.js?v=CD44ED56-260A-4C8D-A2FE-A3A3FB20FE5C</JSLink>
                </WebPartPages:XsltListViewWebPart>
            </ZoneTemplate>
        </WebPartPages:WebPartZone>
        </td>
    </tr>
</table>
