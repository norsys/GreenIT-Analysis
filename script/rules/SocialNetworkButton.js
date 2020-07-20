rulesManager.registerRule({
    complianceLevel: 'A',
    id: "SocialNetworkButton",
    comment: chrome.i18n.getMessage("rule_SocialNetworkButton_DefaultComment"),
    detailComment: "",
    values : {
        nbSocialNetworkButton : 0,
        socialNetworks : []
    },

    check: function (measures) {
        if (measures.entries.length) measures.entries.forEach(entry => {
            const officalSocialButton = getOfficialSocialButtonFormUrl(entry.request.url);
            if (officalSocialButton.length > 0) {
                if (this.values.socialNetworks.indexOf(officalSocialButton) === -1) {
                    this.values.socialNetworks.push(officalSocialButton);
                    this.detailComment += chrome.i18n.getMessage("rule_SocialNetworkButton_detailComment", officalSocialButton) + "<br>";
                    this.values.nbSocialNetworkButton++;
                }
            }
        });
        if (this.values.nbSocialNetworkButton > 0) {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_SocialNetworkButton_Comment", String(this.values.nbSocialNetworkButton));
        }
    }
}, "harReceived");