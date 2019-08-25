import * as puppeteer from 'puppeteer';
import * as lighthouse from 'lighthouse';

interface Link {
  readonly url: string;
}

export class Page implements Link {
  url = '';
  audits = [];
  hrefs = [];
  constructor(url: string) {
    this.url = url;
  }
  addHref(href: string) {
    //requires utils 
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
      onlyCategories: ['accessibility'],
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
  async disconnect() {
    return await this.browser.process.close();
  }
  async audit(l: Link) {
    const res = await lighthouse(l.url, { port: 3040 }, this.lighthouseConfig); 
    return res.lhr.audits;
  }
  async getHrefs(l: Link) {
    const page = await this.browser.process.newPage();
    await page.goto(l.url);
    const hrefs = page.$$('a');
    return hrefs;
  }
}

interface Collector {
  history: object;
  queue: Array<Link>;
  busy: Boolean;
  worker: Auditor | Array<any>;
};

export class Historian implements Collector {
  history = new Map(); 
  queue = [];
  busy = false;
  worker = [];
  numCPUs = require('os').cpus().length;
  dispatcher = new Sequencer(this.numCPUs);
 
  constructor(queue?: Array<Link>) {
    this.queue = queue;
  }

  addToQueue(l: Link) {
    this.queue.push(l);
    if (!this.busy) {
      this.dequeue();
    }
  }

  async dequeue() {
    this.busy = true;
    const jobs = [];
    let i = 0;

    while (i < this.numCPUs && this.queue.length) {
      const pid = this.dispatcher.step();
      i++;
    }

    if (this.queue.length > 0) {
      this.dequeue();
    } else {
      this.busy = false;
    }
  }

}

interface Counter {
  count: number;
  step(): number;
}

export class Sequencer implements Counter {
  limit: number;
  count = null;
  constructor(l:number) {
    this.limit = l;
  }
  step() {
    if (this.count === null) {
      this.count = 0;
    } else {
      const next = this.count + 1;
      if (next === this.limit) {
        this.count = 0;
      } else {
        this.count = next;
      }
    }

    return this.count;
  }
}
