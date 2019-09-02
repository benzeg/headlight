import { Headlight } from './src/Headlight';
import { Historian } from './src/Historian';
import { expect } from 'chai';
import 'mocha';

describe('Headlight', function() {
  const worker = new Headlight();

  after(function() {
    worker.disconnect();
  });

  describe('Ready Function', function() {
    it('has a browser process', async function() {
      await worker.Ready;
      expect(worker.browser.process).to.be.an('object');
    });
  });

  describe('audit Function', function() {
    this.timeout(0);

    it('outputs an object', async function() {
      const link = { url: 'https://benzeg.github.io' }; 
      const output = await worker.audit(link);
      expect(output).to.be.an('object');
    });
  });

  describe('getHrefs', function() {
    this.timeout(0);

    it('outputs an array', async function() {
      const link = { url: 'https://benzeg.github.io' };
      const output = await worker.getHrefs(link);
      expect(output).to.be.an('array');
    });
  });
});