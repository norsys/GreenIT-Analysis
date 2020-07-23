rulesManager.registerRule(createHttpErrorRule(), "harReceived");

function createHttpErrorRule() {
    return {
        complianceLevel: 'A',
        id: "HttpError",
        comment: "",
        detailComment: "",
        values : {
            errorNumber : 0
        },

        check: function (measures) {
            if (measures.entries.length) measures.entries.forEach(entry => {
                if (entry.response) {
                    if (entry.response.status >=400  ) {
                        this.detailComment += entry.response.status + " " + entry.request.url + "<br>";
                        this.values.errorNumber++;
                    }
                }
            });
            if (this.values.errorNumber > 0) this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_HttpError_Comment", String(this.values.errorNumber));
        }
    };
}