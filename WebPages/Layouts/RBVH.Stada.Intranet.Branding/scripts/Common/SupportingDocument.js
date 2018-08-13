RBVH.Stada.javascript.common.NamespaceManager.register("RBVH.Stada.WebPages.pages");

RBVH.Stada.WebPages.pages.SupportingDocument = function (settings) {
    this.Settings = {
        DocumentCount: 0,
        DeletedItems: []
    }
    $.extend(true, this.Settings, settings);
    this.Initialize();
};

RBVH.Stada.WebPages.pages.SupportingDocument.prototype =
{
    Initialize: function () {
        var that = this;
        $(document).ready(function () {
            that.InitControls();
            that.EventsRegister();
        });
    },

    InitControls: function () {
        var that = this;

        $(that.Settings.Controls.GridSupportingDocumentSelector + ' .span-delete').toggle($(that.Settings.Controls.AddMoreFileSelector).is(':visible'));
    },
    EventsRegister: function () {
        var that = this;

        $(document).on("click", that.Settings.Controls.AddMoreFileSelector, function () {
            that.AppendInputFile();
        })
        // debugger;
        // $(that.Settings.Controls.AddDocumentButtonSelector).on("click", function(){
        //     that.AppendInputFile();
        // });    

        $(document).on("click", ".span-remove", function () {
            var currentSpan = $(this);
            var inputParent = currentSpan.attr("id");
            $("input[name='" + inputParent + "']").remove();
            $("span[id='" + inputParent + "']").next().remove();
            $("span[id='" + inputParent + "']").next().remove();
            $("span[id='" + inputParent + "']").remove();
        });

        $(document).on("click", ".span-delete", function () {
            var docUrl = $(this).prev('a').attr('href');
            if (that.Settings.DeletedItems.indexOf(docUrl) == -1)
                that.Settings.DeletedItems.push(docUrl);

            $(that.Settings.Controls.hfDeletedItemsSelector).val(JSON.stringify(that.Settings.DeletedItems));

            // Remove element
            $(this).prev('a').remove();
            $(this).next('br').remove();
            $(this).remove();
        });

    },
    AppendInputFile: function () {
        var that = this;
        var countNumer = that.Settings.DocumentCount++;
        $(that.Settings.Controls.GridSupportingDocumentSelector).append("<input type='file' name='supportingDocument" + countNumer + "' style='display:inline'>  <span id='supportingDocument" + countNumer + "' class='glyphicon glyphicon-trash span-remove'></span>  <span spanErrorName='supportingDocument" + countNumer + "' class='ms-formvalidation ms-csrformvalidation'></span><br/>")
    },
    ValidateAttachments: function () {
        var errorCount = 0;
        var that = this;
        var inputFileControls = $("input[name^='supportingDocument']");
        $("span[spanErrorName^='supportingDocument']").html("");
        if (inputFileControls && inputFileControls.length > 0) {
            for (var idx = 0; idx < inputFileControls.length; idx++) {
                var fileName = inputFileControls[idx].value;
                var currentfileInputControlName = $(inputFileControls[idx]).attr("name");

                if (!fileName || fileName == "") {
                    $("span[spanErrorName='" + currentfileInputControlName + "']").html(that.Settings.Message.CantLeaveTheBlank);
                    errorCount++;
                }
                else {
                    $("span[spanErrorName='" + currentfileInputControlName + "']").html("");
                    if (that.IsValidFileName(fileName) == false) {
                        if (currentfileInputControlName) {
                            $("span[spanErrorName='" + currentfileInputControlName + "']").html(that.Settings.Message.InvalidFileName);
                            errorCount++;
                        }
                    }
                    if (inputFileControls[idx] && inputFileControls[idx].files[0] && inputFileControls[idx].files[0].size == 0) {
                        $("span[spanErrorName='" + currentfileInputControlName + "']").html(that.Settings.Message.FileEmpty);
                        errorCount++;
                    }
                }
            }
        }
        return errorCount == 0;
    },
    IsValidFileName: function (fileName) {
        if (!fileName)
            return false;
        return !(fileName.indexOf("#") !== -1);
    },
}