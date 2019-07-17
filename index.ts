import * as puppeteer from 'puppeteer';
import * as lighthouse from 'lighthouse';

interface Link {
  url: string;
}

interface Auditor {
  readonly timestamp: string;
  result: Array<object>;
  queue: Array<Link>;
  audit(l: Link): object; 
}

export class Headlight implements Auditor {
  timestamp = new Date().toISOString();
  result = [];
  queue = [];
  browser: {
    options: object;
    process: any;
  } = {
    options: {
      args: ['--headless', '--remote-debugging-port=3040']
    },
    process: null
  };
  lighthouseConfig: object = {
    extends: 'lighthouse:default',
    settings: {
      output: ['json'],
      onlyAudits: [],
    }
  };
  public Ready: Promise<any>;
  constructor() {
    this.Ready =  (async () => {
      try {
        this.browser.process = await puppeteer.launch(this.browser.options);  
      } catch(e) {
        console.error(e);
      }
      return;
    })();
  }
  async disconnect(): Promise<any> {
    return await this.browser.process.close();
  }
  async run(): Promise<any> {
    return new Promise((resolve, reject) => {
      
    });
  }
  async audit(l: Link) {
    const res = await lighthouse(l.url, { port: 3040 }, this.lighthouseConfig); 
    return res.lhr;
  }
}

interface Page extends Link {
  readonly document: object; 
}

interface Collector {
  history: object;
  queue: Array<Link>;
  collect(p: Page): void; 
}

export class SiteCrawler implements Collector {
  history = new Map(); 
  queue = [];
  constructor(queue: Array<Link>) {
    this.queue = queue;
  }
  collect(p: Page) {
      // to-do 
  }
}
