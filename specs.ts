import * as chromeLauncher from 'chrome-launcher';
import * as lighthouse from 'lighthouse';
import { expect } from 'chai';
import 'mocha';

interface Page {
  url: string;
}

interface Auditor {
  readonly timestamp: string;
  result: Array<object>;
  queue: Array<Page>;
  addToQueue(p: Page): void;
}

class Headlight implements Auditor {
  timestamp: string;
  result: Array<object> = [];
  queue: Array<Page> = [];
  addToQueue(p: Page) {
    this.queue.push(p); 
  };
  browser: {
    options: object;
    process: any;
  } = {
    options: {
      port: 3040,
      chromeFlags: ['--headless', '--disable-gpu']
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
    this.timestamp = new Date().toISOString();
    this.Ready = new Promise((resolve, reject) => {
      chromeLauncher.launch(this.browser.options).then(result => {
        this.browser.process = result; 
        resolve(this.browser.process);
      }).catch(reject);
    });
  }
  async disconnect(): Promise<any> {
    return await this.browser.process.kill();
  }
  async run(): Promise<any> {
    return new Promise((resolve, reject) => {
      
    });
  }
  async audit(p: Page) {
    const res = await lighthouse(p.url, this.browser.options, this.lighthouseConfig); 
    return res.lhr;
  }
}

/******
 * TEST
 ******/

describe('Headlight', () => {
  describe('Ready Function', () => {
    let worker = new Headlight();
    it('has a browser process', () => {
      return worker.Ready.then(()=>{
        expect(worker.browser.process.port).to.equal(3040);
      });
    });
  });
  describe('audit Function', () => {
    let worker = new Headlight();
    it('outputs an object', () => {
      const page = { url: 'https://www.madison-reed.com' }; 
      worker.audit(page).then((output) => {
        expect(output).to.be.an('object');
      });
    });
  });
});

