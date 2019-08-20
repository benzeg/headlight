import * as puppeteer from 'puppeteer';
import * as lighthouse from 'lighthouse';

interface Link {
  readonly url: string;
}

export class Page implements Link {
  url = '';
  hrefs = [];
  constructor(u: string) {
    this.url = u;
  }
  addHref(h) {

  }
} 

interface Auditor {
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
  async audit(l: Link) {
    const res = await lighthouse(l.url, { port: 3040 }, this.lighthouseConfig); 
    return res.lhr;
  }
  async getHrefs(l: Link) {
    const page = await this.browser.process.newPage();
    await page.goto('https://example.com');
    const hrefs = page.$$('a');
  }
}

interface Collector {
  history: object;
  queue: Array<Link>;
  busy: Boolean;
  worker: Auditor;
};

export class Historian implements Collector {
  history = new Map(); 
  queue = [];
  busy = false;
  worker = new Headlight(); 
  constructor(queue: Array<Link>) {
    this.queue = queue;
  }
  addToQueue(l: Link) {
    this.queue.push(l);
    if(!this.busy) {
      this.dequeue();
    }
  }
  dequeue() {
    const l = this.queue.pop();      
  }
  async accessibilityScan(l: Link) {
    await this.worker.Ready;
    const report = this.worker.audit(l);
  }
  async getNodes(l: Link) {
    await this.worker.Ready;
    const hrefs = this.worker.getHrefs(l);
  }
}