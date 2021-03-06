﻿<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="TransportationRequestControl.ascx.cs" Inherits="RBVH.Stada.Intranet.WebPages.CONTROLTEMPLATES.RBVH.Stada.Controls.TransportationManagementControl.TransportationRequestControl" %>

<div class="panel panel-primary">
    <div class="panel-body">
        <div  style="margin-bottom: 20px; margin-left:-5px">
        <button type="button"  id="btnAddNewTransport"  class="btn btn-primary">
            <i class='fa fa-plus' aria-hidden='true'></i> &nbsp; <asp:Literal runat="server" Text="<%$Resources:RBVHStadaWebpages,VehicleManagement_AddNew%>" />
        </button>
    </div>
   <table style="table-layout: fixed; width: 100% !important" id="vehicle-request-container">
       <tr>
          <td style="width: 100%;" valign="top">
             <asp:HiddenField ID="ParamRequesterLookupIDHidden" runat="server"></asp:HiddenField>
             <br />
             <WebPartPages:WebPartZone runat="server" frametype="None" id="TransportationRequestControlWebPartZone" title="loc:Main">
                <ZoneTemplate>
                   <WebPartPages:XsltListViewWebPart 
                      runat="server" ViewFlag="" ViewSelectorFetchAsync="False" InplaceSearchEnabled="True" ServerRender="False"
                      ClientRender="False" InitialAsyncDataFetch="False" WebId="00000000-0000-0000-0000-000000000000" IsClientRender="False" GhostedXslLink="main.xsl" 
                      NoDefaultStyle=""  EnableOriginalValue="False"
                      DisplayName="My Change Shift" ViewContentTypeId="" Default="TRUE" ListUrl="Lists/VehicleManagement" ListDisplayName="" PageType="PAGE_DEFAULTVIEW" PageSize="-1"
                      UseSQLDataSourcePaging="True" DataSourceID=""
                      ShowWithSampleData="False" AsyncRefresh="False" ManualRefresh="False" AutoRefresh="False" AutoRefreshInterval="60" Title="Change Shift Management" FrameType="Default"
                      SuppressWebPartChrome="False" Description="Overtime Management" IsIncluded="True" ZoneID="Main" PartOrder="2" FrameState="Normal" AllowRemove="True" AllowZoneChange="True"
                      AllowMinimize="True" AllowConnect="True" AllowEdit="True" AllowHide="True" IsVisible="True" TitleUrl="/Lists/VehicleManagement" DetailLink="/Lists/VehicleManagement"
                      HelpLink="" HelpMode="Modeless" Dir="Default" PartImageSmall="" MissingAssembly="Cannot import this Web Part." PartImageLarge="" IsIncludedFilter="" ExportControlledProperties="False"
                      ConnectionID="00000000-0000-0000-0000-000000000000" __MarkupType="vsattributemarkup"
                      __AllowXSLTEditing="true" ID="TransportationRequestControlWP"  WebPart="true" Height="" Width="">
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
                      <DataFields></DataFields>
                      <XmlDefinition>
                         <View BaseViewID="3" Type="HTML" WebPartZoneID="Main" DisplayName="Transpotation Management View 3" SetupPath="pages\viewpage.aspx" ImageUrl="/_layouts/15/images/generic.png?rev=23" Url="TranspotationManagementView3.aspx">
                            <Query>
                                <Where>
                                    <Eq>
                                        <FieldRef Name="Requester" LookupId="TRUE"/>
                                        <Value Type="Lookup">{RequesterLookupID}</Value>
                                    </Eq>
                                </Where>
                                <OrderBy>
                                    <FieldRef Name="ColForSort" Ascending="TRUE" />
                                    <FieldRef Name='CommonFrom' Ascending='FALSE' />
                                    <FieldRef Name="ID" Ascending="FALSE" />
                                </OrderBy>
                            </Query>
                            <ViewFields>
                                <FieldRef Name="Requester" />
                                <FieldRef Name="VehicleType" />
                                <FieldRef Name="CommonFrom" />
                                <FieldRef Name="To" />
                                <FieldRef Name="Reason" />
                                <FieldRef Name="CompanyPickup" />
                                <FieldRef Name="ApprovalStatus" />
                                <FieldRef Name="CommonComment"/>
                            </ViewFields>
                            <RowLimit Paged="TRUE">20</RowLimit>
                            <JSLink>clienttemplates.js</JSLink>
                            <XslLink Default="TRUE">main.xsl</XslLink>
                            <Toolbar Type="Standard"/>
                         </View>
                      </XmlDefinition>
                       <JSLink>~sitecollection/styles/scripts/TransportationModule/JSLink_Vehicle.min.js?v=54432E72-85CE-4B6F-A4BD-FEF2EC7D1D09</JSLink>
                   </WebPartPages:XsltListViewWebPart>
                </ZoneTemplate>
             </WebPartPages:WebPartZone>
          </td>
       </tr>
    </table>
    <script type="text/javascript">
        $(document).ready(function () {
            $('#btnAddNewTransport').on('click', function () {
                var sourceURL = window.location.href;
                sourceURL = Functions.removeParam('lang', sourceURL);
                sourceURL = encodeURIComponent(sourceURL);
                window.location = '//' + location.host + '/Lists/VehicleManagement/NewForm.aspx?subSection=TransportationManagement&Source=' + sourceURL;
            });
        });
    </script>
    </div>
</div>
