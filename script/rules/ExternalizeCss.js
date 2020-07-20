rulesManager.registerRule({
    complianceLevel: 'A',
    id: "ExternalizeCss",
    comment: chrome.i18n.getMessage("rule_ExternalizeCss_DefaultComment"),
    detailComment: "",
    values : {
        inlineStyleSheetsNumber : 0
    },

    check: function (measures) {
        this.values.inlineStyleSheetsNumber = measures.inlineStyleSheetsNumber;
        if ( this.values.inlineStyleSheetsNumber > 0) {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_ExternalizeCss_Comment", String(this.values.inlineStyleSheetsNumber));
        }
    }
}, "frameMeasuresReceived");