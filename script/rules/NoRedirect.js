rulesManager.registerRule({
    complianceLevel: 'A',
    id: "NoRedirect",
    comment: "",
    detailComment: "",
    values :{
      redirectNumber : 0
    },
  
    check: function (measures) {
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (entry.response) {
          if (isHttpRedirectCode(entry.response.status)) {
            this.detailComment += entry.response.status + " " + entry.request.url + "<br>";
            this.values.redirectNumber++;
          }
        }
      });
      if (this.values.redirectNumber > 0) this.complianceLevel = 'C';
      this.comment = chrome.i18n.getMessage("rule_NoRedirect_Comment", String(this.values.redirectNumber));
    }
  }, "harReceived");