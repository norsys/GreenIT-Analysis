rulesManager.registerRule(createStyleSheetsRule(), "harReceived");

function createStyleSheetsRule() {
    return {
        complianceLevel: 'A',
        id: "StyleSheets",
        comment: chrome.i18n.getMessage("rule_StyleSheets_DefaultComment"),
        detailComment: "",
        values: {
            styleSheets: []
        },

        check: function (measures) {
            if (measures.entries.length) measures.entries.forEach(entry => {
                if (getResponseHeaderFromResource(entry, "content-type").toLowerCase().includes('text/css')) {
                    if (this.values.styleSheets.indexOf(entry.request.url) === -1) {
                        this.values.styleSheets.push(entry.request.url);
                        this.detailComment += entry.request.url + "<br>";
                    }
                }
            });
            if (this.values.styleSheets.length > 2) {
                if (this.values.styleSheets.length === 3) this.complianceLevel = 'B';
                else this.complianceLevel = 'C';
                this.comment = chrome.i18n.getMessage("rule_StyleSheets_Comment", String(this.values.styleSheets.length));
            }
        }
    }
}