$(document).ready(function () {
    SP.SOD.executeFunc('SP.js', 'SP.ClientContext',
	    function () {
	        loadDepartmentName();
	    });
});

function loadDepartmentName() {
    var context = new SP.ClientContext;
    var departmentUrl = context.get_url();
    if (departmentUrl && departmentUrl.length > 0) {
        departmentCode = departmentUrl.replace("/", "");
        var lcid = _spPageContextInfo.currentLanguage;
        var url = "/_vti_bin/Services/Department/DepartmentService.svc/GetByCode/" + departmentCode + "/" + lcid;
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (result) {
                if (result) {
                    $("#pageTitle").text(result.DepartmentName);
                }
            }
        });
    }
}