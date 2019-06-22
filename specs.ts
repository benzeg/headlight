import * as chromeLauncher from 'chrome-launcher';
import * as lighthouse from 'lighthouse';

interface Page {
  url: string;
}

interface Auditor {
  readonly timestamp: string;
  pages: Array<object>;
  queue: Array<Page>;
  addToQueue(p: Page): void;
}

class Lighthouse implements Auditor {
  timestamp: string;
  pages: [];
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
      chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(result => {
        this.browser = result; 
      }).catch(reject);
    });
  }
  async disconnect(): Promise<any> {
    return await this.browser.kill();
  }
}
