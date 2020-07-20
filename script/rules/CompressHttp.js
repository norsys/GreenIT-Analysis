rulesManager.registerRule({
    complianceLevel: 'A',
    id: "CompressHttp",
    comment: "",
    detailComment: "",
    values : {
        compressibleResourcesSize : 0,
        compressibleResourcesCompressedSize : 0
    },

    check: function (measures) {
        if (measures.entries.length) measures.entries.forEach(entry => {
            if (isCompressibleResource(entry)) {
                this.values.compressibleResourcesSize += entry.response.content.size;
                if (isResourceCompressed(entry)) {
                    this.values.compressibleResourcesCompressedSize += entry.response.content.size;
                }
                else this.detailComment += chrome.i18n.getMessage("rule_CompressHttp_DetailComment",`${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}`) + '<br>';
            }
        });
        if (this.values.compressibleResourcesSize > 0) {
            const compressRatio = this.values.compressibleResourcesCompressedSize / this.values.compressibleResourcesSize * 100;
            if (compressRatio < 95) {
                if (compressRatio < 90) this.complianceLevel = 'C'
                else this.complianceLevel = 'B';
            }
            else this.complianceLevel = 'A';
            this.comment = chrome.i18n.getMessage("rule_CompressHttp_Comment",
                String(Math.round(compressRatio * 10) / 10) + "%");
        }
    }
}, "harReceived");