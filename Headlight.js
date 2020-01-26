const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');

class Headlight {
  timestamp = new Date().toISOString();
  browser = {
    options: {
      args: ['--headless', `--remote-debugging-port=3001`]
    },
    process: null
  };
  lighthouseConfig= {
    extends: 'lighthouse:default',
    settings: {
      output: ['json'],
      onlyCategories: ['accessibility'],
      onlyAudits: [],
    }
  };
  constructor() {
    this.Ready =  (async () => this.browser.process = await puppeteer.launch(this.browser.options))();
  }
  async disconnect() {
    return await this.browser.process.close();
  }
  async audit(l) {
    await this.Ready;
    const res = await lighthouse(l.url, { port: 3001}, this.lighthouseConfig); 
    return res.lhr.audits;
  }
  async getHrefs(l) {
    if (!this.page) {
      this.page = await this.browser.process.newPage();
    }

    await this.page.goto(l.url);
    const hrefs = await this.page.$$eval('a', (hrefs) => hrefs.map((a) => {
      return a.href
    }));
    return hrefs;
  }
}

module.exports = { Headlight };