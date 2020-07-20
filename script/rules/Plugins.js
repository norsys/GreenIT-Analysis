rulesManager.registerRule({
    complianceLevel: 'A',
    id: "Plugins",
    comment: chrome.i18n.getMessage("rule_Plugins_DefaultComment"),
    detailComment: "",
    values :{
      pluginsNumber : 0
    },
  
    check: function (measures) {
      this.values.pluginsNumber = measures.pluginsNumber;
      if (this.values.pluginsNumber > 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_Plugins_Comment", String(this.values.pluginsNumber));
      }
    }
  }, "frameMeasuresReceived");