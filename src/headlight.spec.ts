import { Headlight } from './Headlight';
import { expect } from 'chai';
import 'mocha';

describe('Headlight', () => {
  const worker = new Headlight();

  after(() => {
    worker.disconnect();
  });

  describe('Ready Function', () => {
    it('has a browser process', async () => {
      await worker.Ready;
      expect(worker.browser.process).to.be.an('object');
    });
  });

  describe('audit Function', () => {
    it('outputs an object', async function() {
      this.timeout(0);
      const link = { url: 'https://benzeg.github.io' }; 
      const output = await worker.audit(link);
      expect(output).to.be.an('object');
      return;
    });
  });

  describe('getHrefs', () => {
    it('outputs an array', async () => {
      const link = { url: 'https://benzeg.github.io' };
      const output = await worker.getHrefs(link);
      expect(output).to.be.an('array');
    });
  });
});