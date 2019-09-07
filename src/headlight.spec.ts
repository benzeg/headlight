import { Headlight } from './Headlight';
import { expect } from 'chai';
import 'mocha';

describe('Headlight', function() {
  const worker = new Headlight();

  after(function() {
    worker.disconnect();
  });

  describe('Ready Function', function() {
    it('has a browser process', function(done) {
      worker.Ready.then(()=> {
        expect(worker.browser.process).to.be.an('object');
        done();
      });
    });
  });

  describe('audit Function', function() {
    it('outputs an object', function(done) {
      const link = { url: 'https://benzeg.github.io' }; 
      worker.audit(link).then((output) => {
        expect(output).to.be.an('object');
      }).finally(()=> done());
    });
  });

  describe('getHrefs', function() {
    it('outputs an array', function(done) {
      const link = { url: 'https://benzeg.github.io' };
      worker.getHrefs(link).then((output) => {
        expect(output).to.be.an('array');
        done();
      });
    });
  });
});