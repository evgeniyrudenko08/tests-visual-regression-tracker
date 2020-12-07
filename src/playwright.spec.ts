import { chromium, Browser, Page, BrowserContext } from "playwright";
import {
  PlaywrightVisualRegressionTracker,
  Config,
} from "@visual-regression-tracker/agent-playwright";
jest.setTimeout(300000);

let browserType = chromium;
let browser: Browser;
let context: BrowserContext;
let page: Page;
let vrt: PlaywrightVisualRegressionTracker;

const config: Config = {
  apiKey: "Z3041CGR1BMQSDG1Y7SF6RRMZ4KW",
  apiUrl: "http://localhost:8080/",
  project: "TestCrypto",
  branchName: "master",
  enableSoftAssert: true,
  ciBuildIdL: new Date().getTime().toString(36),
};

describe("Playwright crypto", () => {
  beforeAll(async () => {
    browser = await browserType.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    vrt = new PlaywrightVisualRegressionTracker(browserType, config);
    await vrt.start();
  });

  afterAll(async () => {
    await browser.close();
    await vrt.stop();
  });

  beforeEach(async () => {
    await page.goto("https://coinmarketcap.com/");
  });

  it("Bitcoin page", async () => {
    await page.click(".sc-1teo54s-2.fZIJcI");
    await page.waitForSelector(".highcharts-root");
    await vrt.trackPage(page, "Bitcoin page", {
      diffTollerancePercent: 0,
      screenshotOptions: {
        fullPage: false,
      },
    });
  }, 400000);
});
