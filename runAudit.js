const util = require('util');
const path = require('path');
const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const opts = {
  chromeFlags: ['--headless', '--disable-gpu']
};

const config = {
   extends: 'lighthouse:default',
  settings: {
    output: ['json'],
    onlyAudits: [
      'duplicate-id'
    ],
  },
};

function launchChromeAndRunLighthouse(url) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results.report)
    });
  });
}

// Usage:
launchChromeAndRunLighthouse('https://www.madison-reed.com/gray-hair').then(results => {
  // Use results!
  fs.writeFileSync(path.join(__dirname, 'test.json'), results);
});
