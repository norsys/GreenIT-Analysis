rulesManager.registerRule(createJsValidateRule(), "resourceContentReceived");

function createJsValidateRule() {
    return {
        complianceLevel: 'A',
        id: "JsValidate",
        comment: chrome.i18n.getMessage("rule_JsValidate_DefaultComment"),
        detailComment: "",
        values: {
            errors: 0,
            totalJsSize: 0
        },

        check: function (measures, resourceContent) {
            if (resourceContent.type === "script") {
                this.values.totalJsSize += resourceContent.content.length;
                let errorNumber = computeNumberOfErrorsInJSCode(resourceContent.content, resourceContent.url);
                if (errorNumber > 0) {
                    this.detailComment += (`URL ${resourceContent.url} has ${errorNumber} error(s) <br>`);
                    this.values.errors += errorNumber;
                    this.complianceLevel = 'C';
                    this.comment = chrome.i18n.getMessage("rule_JsValidate_Comment", String(this.values.errors));
                }
            }
        }
    }
}