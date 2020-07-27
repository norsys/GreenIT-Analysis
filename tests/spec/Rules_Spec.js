
describe("rules.js", function () {

  describe("#minifiedJsRule", function () {

    beforeEach(function () {

    });



  });

  describe("#NoCookieForStaticRessourcesRule", function () {

    beforeEach(function () {

    });

    it(" 1 static ressource ,  no cookie, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "http://test", headers: [{ name: 'test', value: 'test' }] },
            response: { headers: [{ name: 'content-type', value: 'text/css' }] }
          }]
      };
      let rule = rulesChecker.getRule("NoCookieForStaticRessources");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });
    it(" 1 static ressource ,  one small cookie, it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] },
            response: { headers: [{ name: 'content-type', value: 'text/css' }] }
          }]
      };
      let rule = rulesChecker.getRule("NoCookieForStaticRessources");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });
    it(" 4 static ressources ,  2 cookie with small size, it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [
            { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
            { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
            { request: { url: "http://testb", headers: [{ name: 'test', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
            { request: { url: "http://testc", headers: [{ name: 'test', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
          ]
      };
      let rule = rulesChecker.getRule("NoCookieForStaticRessources");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 4 static ressources ,  2 cookie with total size > 2000 , it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let bigCookie = "";
      for (let i = 0; i < 100; i++) bigCookie += "0123456789"
      const measures = {
        entries:
          [
            { request: { url: "http://test", headers: [{ name: 'cookie', value: bigCookie }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
            { request: { url: "http://testa", headers: [{ name: 'cookie', value: bigCookie }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
            { request: { url: "http://testb", headers: [{ name: 'test', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
            { request: { url: "http://testc", headers: [{ name: 'test', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
          ]
      };
      let rule = rulesChecker.getRule("NoCookieForStaticRessources");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 2 non static ressources with cookie it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let bigCookie = "";
      for (let i = 0; i < 100; i++) bigCookie += "0123456789"
      const measures = {
        entries:
          [
            { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'application/json' }] } },
            { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/html' }] } }
          ]
      };

      let rule = rulesChecker.getRule("NoCookieForStaticRessources");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });
    afterEach(function () {
    });
  });

  describe("#NoRedirectRule", function () {

    beforeEach(function () {

    });

    it(" 0 redirect, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("NoRedirect");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 redirect, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 301, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("NoRedirect");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });


    it(" 2 redirect, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 301, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 307, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("NoRedirect");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });


    afterEach(function () {
    });
  });

  describe("#OptimizeSvgRule", function () {

    beforeEach(function () {

    });

    it(" no svg image , it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const resourceContent = {
        type:"script",
        url:"test"
      };
      let rule = rulesChecker.getRule("OptimizeSvg");
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 svg image not optimized , total < 20Kb , it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let content="";
      for (let i=0;i<100;i++) {content+= "      <tag></tag>";}
      const resourceContent = {
        type:"image",
        url:"test.svg",
        content:window.btoa(content)
      };
      let rule = rulesChecker.getRule("OptimizeSvg");
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 1 svg image not optimized , total > 20Kb , it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let content="";
      for (let i=0;i<2000;i++) {content+= "      <tag></tag>";}   
      const resourceContent = {
        type:"image",
        url:"test.svg",
        content:window.btoa(content)
      };
      
      let rule = rulesChecker.getRule("OptimizeSvg");
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 2 svg image  , total < 20Kb , it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let content="";
      for (let i=0;i<100;i++) {content+= "      <tag></tag>";}   
      const resourceContent = {
        type:"image",
        url:"test.svg",
        content:window.btoa(content)
      };
      let rule = rulesChecker.getRule("OptimizeSvg");
      rule.check("",resourceContent);
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('B');
    });


    it(" 2 svg image  , total > 20Kb , it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let content="";
      for (let i=0;i<1000;i++) {content+= "      <tag></tag>";}   
      const resourceContent = {
        type:"image",
        url:"test.svg",
        content:window.btoa(content)
      };
      let rule = rulesChecker.getRule("OptimizeSvg");
      rule.check("",resourceContent);
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });

  });

  describe("#PluginsRule", function () {

    beforeEach(function () {

    });

    it(" 0 plugin, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { pluginsNumber: 0 };
      let rule = rulesChecker.getRule("Plugins");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });


    it(" 1 plugin, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { pluginsNumber: 1 };
      let rule = rulesChecker.getRule("Plugins");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 5 plugins, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { pluginsNumber: 5 };
      let rule = rulesChecker.getRule("Plugins");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });

  describe("#PrintStyleSheetRule", function () {

    beforeEach(function () {

    });

    it(" 0 print stylesheet, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { printStyleSheetsNumber: 0 };
      let rule = rulesChecker.getRule("PrintStyleSheet");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 1 print stylesheet, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { printStyleSheetsNumber: 1 };
      let rule = rulesChecker.getRule("PrintStyleSheet");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    afterEach(function () {
    });
  });


  describe("#SocialNetworkButtonRule", function () {

    beforeEach(function () {

    });

    it(" 1 url 0 social network script, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/json" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("SocialNetworkButton");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });



    it(" 3 url 0 social network script, it should return  A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "www.acebook.com/test.js" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "http://www.gooel.fr/test2.js" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/html" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("SocialNetworkButton");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 3 url , a facebook social network script, it should return  C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "www.acebook.com/test.js" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "connect.facebook.net/sdk.js" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/html" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("SocialNetworkButton");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });


    it(" 3 url , a linkedin social network script, it should return  C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "www.acebook.com/test.js" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "platform.linkedin.com/in.js" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/html" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("SocialNetworkButton");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });
    it(" 3 url , 2 social network scripts, it should return  C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "platform.twitter.com/widgets.js" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "platform.linkedin.com/in.js" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/html" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("SocialNetworkButton");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });



  describe("#StyleSheetsRule", function () {

    beforeEach(function () {

    });

    it(" 0 stylesheet, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/json" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("StyleSheets");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 2 stylesheet, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/html" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("StyleSheets");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 3 stylesheet, it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("StyleSheets");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it("  4 stylesheet, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test4" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("StyleSheets");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });

  describe("#UseETagsRule", function () {

    beforeEach(function () {

    });

    it(" 1 static ressources with ETag, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("UseETags");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 static ressources with no ETag, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("UseETags");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 2 static ressources with no ETag, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("UseETags");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 3 static ressources with ETag, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("UseETags");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 3 static ressources with 2 ETag, 91% with e-tag it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:90}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content:{size:810}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("UseETags");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 3 static ressources with 2 ETag, 80% with e-tag it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:200}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content:{size:700}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("UseETags");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });
  });

  describe("#UseStandardTypefacesRule", function () {

    beforeEach(function () {

    });

    it(" 0 specific font, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          }],
          dataEntries :[]
      };
      let rule = rulesChecker.getRule("UseStandardTypefaces");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });




    it(" 1 specific font file with size < 10KB  should return  B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content : {size : 1000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "application/font-woff" }]
            }
          }],
          dataEntries :[]
      };
      let rule = rulesChecker.getRule("UseStandardTypefaces");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 2 specific font files  with size < 10KB  should return  B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content : {size : 1000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "application/font-woff" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content : {size : 2000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "application/font-woff" }]
            }
          }],
          dataEntries :[]
      };
      let rule = rulesChecker.getRule("UseStandardTypefaces");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 1 specific font file  with size > 10KB  should return  C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content : {size : 100000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "application/font-woff" }]
            }
          }],
          dataEntries :[]
      };
      let rule = rulesChecker.getRule("UseStandardTypefaces");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 2 specific font files  with size > 10KB  should return  C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content : {size : 10000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "application/font-woff" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content : {size : 20000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "application/font-woff" }]
            }
          }],
          dataEntries :[]
      };
      let rule = rulesChecker.getRule("UseStandardTypefaces");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });
});