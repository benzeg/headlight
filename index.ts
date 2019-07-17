import * as puppeteer from 'puppeteer';
import * as lighthouse from 'lighthouse';

interface Page {
  url: string;
}

interface Auditor {
  readonly timestamp: string;
  result: Array<object>;
  queue: Array<Page>;
  addToQueue(p: Page): void;
  audit(p: Page): any; 
}

export class Headlight implements Auditor {
  timestamp = new Date().toISOString();
  result = [];
  queue = [];
  addToQueue(p: Page) {
    this.queue.push(p); 
  };
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
  async audit(p: Page) {
    const res = await lighthouse(p.url, { port: 3040 }, this.lighthouseConfig); 
    return res.lhr;
  }
}

