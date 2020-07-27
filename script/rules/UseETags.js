rulesManager.registerRule(createUseETagsRule(), "harReceived");

function createUseETagsRule() {
    return {
        complianceLevel: 'A',
        id: "UseETags",
        comment: "",
        detailComment: "",
        values: {
            staticResourcesWithETagsSize: 0,
            staticResourcesSize: 0
        },

        check: function (measures) {
            if (measures.entries.length) measures.entries.forEach(entry => {
                if (isStaticRessource(entry)) {
                    this.values.staticResourcesSize += entry.response.content.size;
                    if (isRessourceUsingETag(entry)) {
                        this.values.staticResourcesWithETagsSize += entry.response.content.size;
                    } else this.detailComment += chrome.i18n.getMessage("rule_UseETags_DetailComment", `${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}`) + '<br>';
                }
            });
            if (this.values.staticResourcesSize > 0) {
                let eTagsRatio = this.values.staticResourcesWithETagsSize / this.values.staticResourcesSize * 100;
                if (eTagsRatio < 95) {
                    if (eTagsRatio < 90) this.complianceLevel = 'C'
                    else this.complianceLevel = 'B';
                } else this.complianceLevel = 'A';
                this.comment = chrome.i18n.getMessage("rule_UseETags_Comment",
                    Math.round(eTagsRatio * 10) / 10 + "%");
            }
        }
    }
}