rulesManager.registerRule({
    complianceLevel: 'A',
    id: "NoCookieForStaticRessources",
    comment: chrome.i18n.getMessage("rule_NoCookieForStaticRessources_DefaultComment"),
    detailComment: "",
    values :{
      nbRessourcesStaticWithCookie : 0,
      totalCookiesSize : 0
    },
  
    check: function (measures) {
      if (measures.entries.length) measures.entries.forEach(entry => {
        const cookiesLength = getCookiesLength(entry);
        if (isStaticRessource(entry) && (cookiesLength > 0)) {
          this.values.nbRessourcesStaticWithCookie++;
          this.values.totalCookiesSize += cookiesLength + 7; // 7 is size for the header name "cookie:"
          this.detailComment += chrome.i18n.getMessage("rule_NoCookieForStaticRessources_DetailComment",entry.request.url) + "<br> ";
        }
      });
      if (this.values.nbRessourcesStaticWithCookie > 0) {
        if (this.values.totalCookiesSize > 2000) this.complianceLevel = 'C';
        else this.complianceLevel = 'B';
        this.comment = chrome.i18n.getMessage("rule_NoCookieForStaticRessources_Comment", [String(this.values.nbRessourcesStaticWithCookie), String(Math.round(this.values.totalCookiesSize / 100) / 10)]);
      }
    }
  }, "harReceived");