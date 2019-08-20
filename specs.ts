import { Headlight } from './index';
import { expect } from 'chai';
import 'mocha';

describe('Headlight', function() {
  describe('Ready Function', function() {
    let worker = new Headlight();
    it('has a browser process', async function() {
      await worker.Ready;
      expect(worker.browser.process).to.be.an('object');
    });
  });

  describe('audit Function', function() {
    this.timeout(0);
    let worker = new Headlight();
    it('outputs an object', async function() {
      const link = { url: 'https://www.madison-reed.com' }; 
      const output = await worker.audit(link);
      expect(output).to.be.an('object');
    });
  });
});

describe('Historian', function() {
  describe('queue', function() {
    test('addToQueue', function() {
      
    });

    test('dequeue', function() {

    });
  });

  describe('link collector', function() {
    test('get links', () => {

    })
  });
});