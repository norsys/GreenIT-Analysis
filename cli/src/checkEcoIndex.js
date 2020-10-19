import puppeteer from 'puppeteer';
import fs from 'fs';
import os from 'os';
import fse from 'fs-extra';
import path from 'path';
import {findLocalPath, createReport} from './createReport';

export async function openBrowser(chromePath) {
  const extensionPath = findLocalPath('../../crx/');

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
    await page.goto(endpoint.url, {waitUntil: 'load'});

    if(isFirstPage) {
        greenItPlugInPage = await getGreenItPanel(browser);
        isFirstPage = false;
    }
    await runGreenItForURL(endpoint, greenItPlugInPage, scenario.resultPath);
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

async function runGreenItForURL(endpoint, greenItPlugInPage, resultPath) {
    // Getting the first frame and working with that instead provides something usable.
    const greenItPlugInFrame = greenItPlugInPage.frames()[0]
    await greenItPlugInFrame.waitForSelector('body');
    const measure = await greenItPlugInFrame.evaluate(() => {
        analyseBestPractices = true;
        launchAnalyse();
        return new Promise(resolve => setTimeout(resolve, 1000)).then(() => measuresAcquisition.getMeasures());
    });
   
    createReport(resultPath, endpoint.url, endpoint.name, measure)
}