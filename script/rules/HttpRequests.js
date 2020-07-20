rulesManager.registerRule({
    complianceLevel: 'A',
    id: "HttpRequests",
    comment: "",
    detailComment: "",
    values : {
        nbRequest : 0
    },

    check: function (measures) {
        this.values.nbRequest = measures.nbRequest
        if (measures.entries.length) measures.entries.forEach(entry => {
            this.detailComment += entry.request.url + "<br>";
        });
        if (this.values.nbRequest > 40) this.complianceLevel = 'C';
        else if (this.values.nbRequest > 26) this.complianceLevel = 'B';
        this.comment = chrome.i18n.getMessage("rule_HttpRequests_Comment", String(this.values.nbRequest));
    }
}, "harReceived");