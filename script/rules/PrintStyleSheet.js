rulesManager.registerRule({
    complianceLevel: 'C',
    id: "PrintStyleSheet",
    comment: chrome.i18n.getMessage("rule_PrintStyleSheet_DefaultComment"),
    detailComment: "",
    values :{
      printStyleSheetsNumber : 0
    },
  
    check: function (measures) {
      this.values.printStyleSheetsNumber = measures.printStyleSheetsNumber;
      if (this.values.printStyleSheetsNumber > 0) {
        this.complianceLevel = 'A';
        this.comment = chrome.i18n.getMessage("rule_PrintStyleSheet_Comment", String(this.values.printStyleSheetsNumber));
      }
    }
  }, "frameMeasuresReceived");