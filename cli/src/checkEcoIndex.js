const puppeteer = require('puppeteer');
const fs = require('fs');
const os = require('os');
const fse = require('fs-extra');
const path = require('path');
const { makeBadge } = require('badge-maker');

export async function openBrowser(chromePath) {

  let fullPathName = new URL(import.meta.url).pathname;
  if (os.platform().indexOf("win32")!=-1) {
    // delete first '/' in windows file system
     fullPathName = fullPathName.substr(1, fullPathName.length)
  }
  const extensionPath = path.resolve(
    fullPathName.substr(fullPathName.indexOf('/')),
    '../../crx/'
  );

  return await puppeteer.launch({
      executablePath: chromePath,
      headless: false, // extension are allowed only in the head-full mode
      args: [
          `--disable-extensions-except=${extensionPath}`,
          `--load-extension=${extensionPath}`,
          '--auto-open-devtools-for-tabs'
      ]
  });
}

export async function launchGreenITAnalysis(scenario, browser, task) {
  let page = (await browser.pages())[0];
  await page.setViewport({width: 1200, height: 900});
  await page.setCacheEnabled(false);

  let isFirstPage = true;
  let isLogguedIn = false;
  let greenItPlugInPage;
  for (const endpoint of scenario.endpoints) {

    if(endpoint.hasToBeLoggedIn && !isLogguedIn){
        task.output = 'Login in ...';
        await page.goto(scenario.loginUrl, {waitUntil: 'networkidle2'});
        await page.type(scenario.userDivSelector, scenario.user);
        await page.type(scenario.passwordDivSelector, scenario.password);
        await page.waitForSelector(scenario.loginBtnSelector);
        page.click(scenario.loginBtnSelector);
        await page.waitForNavigation();

        isLogguedIn =true;
        task.output = 'Logged ...';
    }

    task.output = 'Analysing : '+endpoint.name;
    await page.goto(endpoint.url, {waitUntil: 'networkidle2'});

    if(isFirstPage) {
        greenItPlugInPage = await getGreenItPanel(browser);
        isFirstPage = false;
    }
    await runGreenItForURL(endpoint.name, greenItPlugInPage, scenario.resultPath);
    task.output = 'End Analyse';
  }
}

async function getGreenItPanel(browser) {
  let targets = await browser.targets();
  const devtoolsTarget = targets.filter((t) => {
      return t.type() === 'other' && t.url().startsWith('devtools://');
  })[0];

  if (!devtoolsTarget) {
    throw new Error('Fail to find dev tool target');
  }

  // Hack to get a page pointing to the devtools
  devtoolsTarget._targetInfo.type = 'page';

  var focusNextPanelKey = 'Control'
  if (os.platform().indexOf("darwin")!=-1) {
        focusNextPanelKey = 'MetaLeft'
  }

  const devtoolsPage = await devtoolsTarget.page();
  await devtoolsPage.keyboard.down(focusNextPanelKey);
  await devtoolsPage.keyboard.press('[');
  await devtoolsPage.keyboard.up(focusNextPanelKey);

  let extensionPanelTarget = targets.filter((t) => {
      return t.type() === 'other' &&
          t.url().startsWith('chrome-extension://') &&
          t.url().endsWith('/GreenIT-Analysis.html');
  })[0];
  if (!extensionPanelTarget) {
    throw new Error('Fail to find GreenIt-Analysis Panel Target');
  }

  // Hack to get a page pointing to the devtools extension panel.
  extensionPanelTarget._targetInfo.type = 'page';

  // Most APIs on `Page` fail as `mainFrame()` is `undefined` (frame has a `parentId`).
  await extensionPanelTarget.page();

  // And now we can finally interact with our extension panel frame!
  targets = await browser.targets();
  extensionPanelTarget = targets.filter((t) => {
      return t.type() === 'other' &&
          t.url().startsWith('chrome-extension://') &&
          t.url().endsWith('/GreenPanel.html');
  })[0];
  if (!extensionPanelTarget) {
    throw new Error('Fail to find GreenIt-Analysis Panel Target');
  }

  extensionPanelTarget._targetInfo.type = 'page';
  // Most APIs on `Page` fail as `mainFrame()` is `undefined` (frame has a `parentId`).
  return await extensionPanelTarget.page();
}

async function runGreenItForURL(reportName, greenItPlugInPage, resultPath) {
    var dir = `${resultPath}/${reportName}`;
    greenItPlugInPage.on('response', async (response) => {
        const url = new URL(response.url());
        let filePath = path.resolve(`${dir}${url.pathname}`);
        await fse.outputFile(filePath, await response.buffer());
      });

    // Getting the first frame and working with that instead provides something usable.
    const greenItPlugInFrame = greenItPlugInPage.frames()[0]
    await greenItPlugInFrame.waitForSelector('body');
    const measure = await greenItPlugInFrame.evaluate(() => {
        analyseBestPractices = true;
        launchAnalyse();
        return new Promise(resolve => setTimeout(resolve, 1000)).then(() => measuresAcquisition.getMeasures());
    });
   
    const html = await greenItPlugInFrame.content();
    const svg = createBadge(measure);

    let errorLog = (err) => {
        if (err) {
          throw new Error(err);
        }
    }
   
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir,{ recursive: true });
    }
    fs.writeFile(dir+'/ecoIndex.html', html, errorLog);
    fs.writeFile(dir+'/ecoIndex.svg', svg, errorLog);
    fs.writeFile(dir+'/ecoIndex.json', JSON.stringify(measure), errorLog);
}

function createBadge(measure) {
  const grade = measure.grade;
  const color = (function (grade) {
    switch (grade) {
      case 'A':
        return '#349A47';
      case 'B':
        return '#51B84B';
      case 'C':
        return '#CADB2A';
      case 'D':
        return '#F6EB15';
      case 'E':
        return '#FECD06';
      case 'F':
        return '#F99839';
      default:
        return '#ED2124';
    }
  })(grade);
  const format = {
    label: 'EcoIndex',
    message: grade,
    color: color,
  };

  return makeBadge(format);
}
