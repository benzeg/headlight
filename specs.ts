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
  }
  browser: any;
  browserOpts: {
    port: number;
    chromeFlags: Array<string>;
  } = {
    port: 3040,
    chromeFlags: ['--headless', '--disable-gpu']
  }
  lighthouseConfig: object = {
    extends: 'lighthouse:default',
    settings: {
      output: ['json'],
      onlyAudits: [],
    }
  }
  public Ready: Promise<any>;
  constructor() {
    this.timestamp = new Date().toISOString();
    this.Ready = new Promise((resolve, reject) => {
      chromeLauncher.launch(this.browserOpts).then(result => {
        this.browser = result; 
        resolve(this.browser);
      }).catch(reject);
    });
  }
  async disconnect(): Promise<any> {
    return await this.browser.kill();
  }
}

/*
opts.port = chrome.port;
return lighthouse(url, opts, config).then(results => {
  // use results.lhr for the JS-consumeable output
  // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
  // use results.report for the HTML/JSON/CSV output as a string
  // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
  return chrome.kill().then(() => results.report)
});
 */


/******
 * TEST
 ******/

describe('Headlight', () => {
  describe('Ready Function', () => {
    let worker = new Headlight();
    it('has a browser process', () => {
      return worker.Ready.then(()=>{
        expect(worker.browser.port).to.equal(3040);
      });
    });
  });
});

