import Headlight from './index';
import { expect } from 'chai';
import 'mocha';

describe('Headlight', function() {
  describe('Ready Function', function() {
    let worker = new Headlight();
    it('has a browser process', async function() {
      await worker.Ready;
      expect(worker.browser.process.port).to.equal(3040);
    });
  });
  describe('audit Function', function() {
    this.timeout(6000); // worker's audit process takes a long time
    let worker = new Headlight();
    it('outputs an object', async function() {
      const page = { url: 'https://www.madison-reed.com' }; 
      const output = await worker.audit(page);
      expect(output).to.be.a('object');
    });
  });
});

