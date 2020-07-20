rulesManager.registerRule({
    complianceLevel: 'A',
    id: "DomainsNumber",
    comment: "",
    detailComment: "",
    values : {
        domains : []
    },

    check: function (measures) {
        if (measures.entries.length) measures.entries.forEach(entry => {
            let domain = getDomainFromUrl(entry.request.url);
            if (this.values.domains.indexOf(domain) === -1) {
                this.values.domains.push(domain);
            }
        });
        if (this.values.domains.length > 2) {
            if (this.values.domains.length === 3) this.complianceLevel = 'B';
            else this.complianceLevel = 'C';
        }
        this.values.domains.forEach(domain => {
            this.detailComment += domain + "<br>";
        });

        this.comment = chrome.i18n.getMessage("rule_DomainsNumber_Comment", String(this.values.domains.length));
    }
}, "harReceived");