rulesManager.registerRule({
    complianceLevel: 'A',
    id: "OptimizeBitmapImages",
    comment: chrome.i18n.getMessage("rule_OptimizeBitmapImages_DefaultComment"),
    detailComment: "",
    values :{
      nbImagesToOptimize : 0,
      totalMinGains : 0
    },

    check: function (measures) {
      if (measures.entries) measures.entries.forEach(entry => {
        if (entry.response) {
          const imageType = getImageTypeFromResource(entry);
          if (imageType !== "") {
            var myImage = new Image();
            myImage.src = entry.request.url;
            // needed to access object in the function after
            myImage.rule = this;
  
            myImage.size = entry.response.content.size;
            myImage.onload = function () {
  
              const minGains = getMinOptimisationGainsForImage(this.width * this.height, this.size, imageType);
              if (minGains > 500) { // exclude small gain 
                this.rule.values.nbImagesToOptimize++;
                this.rule.values.totalMinGains += minGains;
                this.rule.detailComment += chrome.i18n.getMessage("rule_OptimizeBitmapImages_DetailComment", [this.src + " , " + Math.round(this.size / 1000),this.width + "x" + this.height,String(Math.round(minGains / 1000))]) + "<br>";
              }
              if (this.rule.values.nbImagesToOptimize > 0) {
                if (this.rule.values.totalMinGains < 50000) this.rule.complianceLevel = 'B';
                else this.rule.complianceLevel = 'C';
                this.rule.comment = chrome.i18n.getMessage("rule_OptimizeBitmapImages_Comment", [String(this.rule.values.nbImagesToOptimize), String(Math.round(this.rule.values.totalMinGains / 1000))]);
                showEcoRuleOnUI(this.rule);
              }
            }
          }
        }
      });
    }
  }, "harReceived");