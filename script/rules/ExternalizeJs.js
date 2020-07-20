rulesManager.registerRule({
    complianceLevel: 'A',
    id: "ExternalizeJs",
    comment: chrome.i18n.getMessage("rule_ExternalizeJs_DefaultComment"),
    detailComment: "",
    values : {
        inlineJsScriptsNumber : 0
    },

    check: function (measures) {
        this.values.inlineJsScriptsNumber = measures.inlineJsScriptsNumber;
        if (this.values.inlineJsScriptsNumber > 0) {
            if (this.values.inlineJsScriptsNumber > 1) this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_ExternalizeJs_Comment", String(this.values.inlineJsScriptsNumber));

        }
    }
}, "frameMeasuresReceived");