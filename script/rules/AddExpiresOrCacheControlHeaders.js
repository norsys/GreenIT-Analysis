rulesManager.registerRule({
    complianceLevel: 'A',
    id: "AddExpiresOrCacheControlHeaders",
    comment: "",
    detailComment: "",
    values : {
        staticResourcesSize: 0,
        staticResourcesWithCache: 0
    },

    check: function (measures) {

        if (measures.entries.length) measures.entries.forEach(entry => {
            if (isStaticRessource(entry)) {
                this.values.staticResourcesSize += entry.response.content.size;
                if (hasValidCacheHeaders(entry)) {
                    this.values.staticResourcesWithCache += entry.response.content.size;
                }
                else this.detailComment += chrome.i18n.getMessage("rule_AddExpiresOrCacheControlHeaders_DetailComment",`${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}`) + '<br>';
            }
        });

        if (this.values.staticResourcesSize > 0) {
            const cacheHeaderRatio = this.values.staticResourcesWithCache / this.values.staticResourcesSize * 100;
            if (cacheHeaderRatio < 95) {
                if (cacheHeaderRatio < 90) this.complianceLevel = 'C'
                else this.complianceLevel = 'B';
            }
            else this.complianceLevel = 'A';
            this.comment = chrome.i18n.getMessage("rule_AddExpiresOrCacheControlHeaders_Comment",
                String(Math.round(cacheHeaderRatio * 10) / 10) + "%");
        }
    }
}, "harReceived");  