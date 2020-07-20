rulesManager.registerRule({
    complianceLevel: 'A',
    id: "MinifiedCss",
    comment: chrome.i18n.getMessage("rule_MinifiedCss_DefaultComment"),
    detailComment: "",
    values : {
        totalCssSize: 0,
        minifiedCssSize: 0
    },

    check: function (measures, resourceContent) {
        if (resourceContent.type === "stylesheet") {
            this.values.totalCssSize += resourceContent.content.length;
            if (!isMinified(resourceContent.content)) this.detailComment += chrome.i18n.getMessage("rule_MinifiedCss_DetailComment",resourceContent.url) + '<br>';
            else this.values.minifiedCssSize += resourceContent.content.length;
            const percentMinifiedCss = this.values.minifiedCssSize / this.values.totalCssSize * 100;
            this.complianceLevel = 'A';
            if (percentMinifiedCss < 90) this.complianceLevel = 'C';
            else if (percentMinifiedCss < 95) this.complianceLevel = 'B';
            this.comment = chrome.i18n.getMessage("rule_MinifiedCss_Comment", String(Math.round(percentMinifiedCss * 10) / 10));
        }
    }
}, "resourceContentReceived");
