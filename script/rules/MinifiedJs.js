rulesManager.registerRule(createMinifiedJsRule(), "resourceContentReceived");

function createMinifiedJsRule() {
    return{
    complianceLevel: 'A',
    id: "MinifiedJs",
    comment: chrome.i18n.getMessage("rule_MinifiedJs_DefaultComment"),
    detailComment: "",
    values : {
        totalJsSize: 0,
        minifiedJsSize: 0
    },

    check: function (measures, resourceContent) {
        if (resourceContent.type === "script") {
            this.values.totalJsSize += resourceContent.content.length;
            if (!isMinified(resourceContent.content)) this.detailComment += chrome.i18n.getMessage("rule_MinifiedJs_DetailComment",resourceContent.url) + '<br>';
            else this.values.minifiedJsSize += resourceContent.content.length;
            const percentMinifiedJs = this.values.minifiedJsSize / this.values.totalJsSize * 100;
            this.complianceLevel = 'A';
            if (percentMinifiedJs < 90) this.complianceLevel = 'C';
            else if (percentMinifiedJs < 95) this.complianceLevel = 'B';
            this.comment = chrome.i18n.getMessage("rule_MinifiedJs_Comment", String(Math.round(percentMinifiedJs * 10) / 10));
        }
    }
}}
