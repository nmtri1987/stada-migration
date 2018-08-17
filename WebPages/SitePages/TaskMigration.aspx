<%@ Assembly Name="RBVH.Stada.Intranet.WebPages, Version=1.0.0.0, Culture=neutral, PublicKeyToken=2c1266c12d78d768" %>

<%@ Page Language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage,Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Import Namespace="RBVH.Stada.Intranet.WebPages.Utils" %>
<%@ Import Namespace="RBVH.Stada.Intranet.Biz.Constants" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=16.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ID="PageHead" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <link type="text/css" rel="stylesheet" href="/styles/libs/select2/select2.min.css" />
    <link type="text/css" rel="stylesheet" href="/styles/libs/jsGrid/jsgrid.common.min.css?v=CD44ED56-260A-4C8D-A2FE-A3A3FB20FE5C" />
    <link type="text/css" rel="stylesheet" href="/styles/css/Migration/default.css" />

    <script type="text/javascript" src="/styles/libs/select2/select2.min.js"></script>
    <script type="text/javascript" src="/styles/libs/select2/select2.multi-checkboxes.js"></script>
    <script type="text/javascript" src="/styles/libs/jsGrid/jsgrid.common.min.js?v=CD44ED56-260A-4C8D-A2FE-A3A3FB20FE5C"></script>
    <script type="text/javascript" src="/styles/scripts/Migration/TaskMigration.js"></script>
</asp:Content>
<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
	<div class="form-group">
        <label for="pwd">Department</label>
        <div>
            <select id="cbo-departments" style="display: block; border: solid 1px #464a4c !important;">
            </select>
        </div>
    </div>
    <div class="form-group" id="employee-container" style="display: none;">
        <label for="pwd">Employee</label>
        <div>
            <select id="cbo-employees" style="display: block; border: solid 1px #464a4c !important;">
            </select>
        </div>
    </div>
    <div class="form-group">
        <label for="pwd">Module</label>
        <div>
            <select id="cbo-modules" multiple style="display: block; border: solid 1px #464a4c !important;">
            </select>
        </div>
    </div>
   
    <div id="cb-data-container">
        <div class="checkbox">
            <label>
                <input type="checkbox" style="position: relative; top: -1px;" id="cb-data-overwrite" checked>Overwrite old data
            </label>
        </div>
    </div>

    <div class="checkbox">
        <label>
            <input type="checkbox" style="position: relative; top: -1px;" id="cb-include-delegation">Include delegation
        </label>
    </div>

    <%--<div class="checkbox" style="margin-top: 10px !important; font-style: italic; font-weight: bold;">
        <label style="font-weight: bold;">
            <input type="checkbox" style="position: relative; top: -1px; " id="cb-unit-test">Unit test
        </label>
    </div>--%>

    <button type="button" class="btn btn-success" id="btn-do-migration">
        <span class="glyphicon glyphicon-play"></span>&nbsp;&nbsp;Do Migration
    </button>
    <button type="button" class="btn btn-danger" id="btn-do-delete">
        <span class="glyphicon glyphicon-trash"></span>&nbsp;&nbsp;Delete Data
    </button>
    <button type="button" class="btn btn-primary" id="btn-do-search">
        <span class="glyphicon glyphicon-search"></span>&nbsp;&nbsp;Search
    </button>

    <button type="button" class="btn btn-info" id="btn-do-unit-test" style="">
        <span class="glyphicon glyphicon-eye-open"></span>&nbsp;&nbsp;Run unit test
    </button>

    <hr />
	
	<div>
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active">
				<a href="#tab1" aria-controls="tab1" role="tab" data-toggle="tab">
					Search Result
				</a>
			</li>
            <li role="presentation">
				<a href="#tab2" aria-controls="tab2" role="tab" data-toggle="tab">
					Unit test Result
				</a>
			</li>
            
            
        </ul>
        <!-- Tab panes -->
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane active" id="tab1">
				<div class="panel panel-primary">
					<div class="panel-body">
						<div class="grid-content">
							<br />
							<div id="jsGrid-task">
							</div>
						</div>
					</div>
				</div>
            </div>
            <div role="tabpanel" class="tab-pane" id="tab2">
                <div class="panel panel-primary">
					<div class="panel-body">
						<div class="grid-content">
							<br />
							<div id="jsGrid-unit-test">
							</div>
						</div>
					</div>
				</div>
            </div>
            
        </div>
    </div>
    
	
	<div id="dialog" title="Confirmation" style="display: none;">
		<p>Are you sure you want to delete all Task list or just delete items by module and department ?</p>
	</div>

    <script type="text/javascript">
        $(document).ready(function () {
            var settings = {
                Controls:
                {
                    ModuleSelector: '#cbo-modules',
                    EmployeeSelector: '#cbo-employees',
                    DepartmentSelector: '#cbo-departments',
                    DataContainerSelector: '#cb-data-container',
                    DataIdContainerSelector: 'cb-data',
                    DeleteOldDataSelector: '#cb-data-delete',
                    OverwriteOldDataSelector: '#cb-data-overwrite',
                    IncludeDelegationSelector: '#cb-include-delegation',
                    UnitTestSelector: '#cb-unit-test',
                    EmployeeContainerSelector: '#employee-container',
                    DoMigrationButtonSelector: '#btn-do-migration',
                    DoSearchButtonSelector: '#btn-do-search',
                    DoUnitTestButtonSelector: '#btn-do-unit-test',
                    DoDeleteButtonSelector: '#btn-do-delete',
                    GridResultSelector: '#jsGrid-task',
                    GridUnitTestResultSelector: '#jsGrid-unit-test',
                    ShaderCssClass: '.jsgrid-load-shader',
                    LoadPanelCssClass: '.jsgrid-load-panel',
                }
            };

            TaskMigrationModule.Initialize(settings);
        });
    </script>
</asp:Content>
<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
    <SharePoint:ProjectProperty Property="Title" runat="server" />
    - Task Migration
</asp:Content>
<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Task Migration
</asp:Content>
