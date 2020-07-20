rulesManager.registerRule({
    complianceLevel: 'A',
    id: "EmptySrcTag",
    comment: chrome.i18n.getMessage("rule_EmptySrcTag_DefaultComment"),
    detailComment: "",
    values : {
        emptySrcTagNumber : 0
    },

    check: function (measures) {
        this.values.emptySrcTagNumber = measures.emptySrcTagNumber;
        if (this.values.emptySrcTagNumber > 0) {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_EmptySrcTag_Comment", String(this.values.emptySrcTagNumber));
        }
    }
}, "frameMeasuresReceived");