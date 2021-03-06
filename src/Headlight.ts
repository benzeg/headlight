import * as puppeteer from 'puppeteer';
// @ts-ignore
import * as lighthouse from 'lighthouse';
import { Link } from './Page';

export interface Auditor {
  readonly timestamp: string;
  audit(l: Link): object; 
}

export class Headlight implements Auditor {
  timestamp = new Date().toISOString();
  browser: {
    options: object;
    process: any;
  } = {
    options: {
      args: ['--headless', `--remote-debugging-port=${process.env.PORT_NUM}`]
    },
    process: null
  };
  lighthouseConfig: object = {
    extends: 'lighthouse:default',
    settings: {
      output: ['json'],
      onlyCategories: ['accessibility'],
      onlyAudits: [],
    }
  };
  public Ready: Promise<any>;
  constructor() {
    this.Ready =  (async () => this.browser.process = await puppeteer.launch(this.browser.options))();
  }
  async disconnect() {
    return await this.browser.process.close();
  }
  async audit(l: Link) {
    await this.Ready;
    const res = await lighthouse(l.url, { port: process.env.PORT_NUM }, this.lighthouseConfig); 
    return res.lhr.audits;
  }
  async getHrefs(l: Link) {
    const page = await this.browser.process.newPage();
    await page.goto(l.url);
    const hrefs = await page.$$eval('a', (hrefs:any) => hrefs.map((a:any) => {
      return a.href
    }));
    return hrefs;
  }
}