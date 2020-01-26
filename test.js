const hl = require('./Headlight.js')
const Headlight = hl.Headlight;
const getSitemap = require('./sitemap.js').getSitemap;

async function run() {
  const worker = new Headlight();
  await worker.Ready;
  const sitemap = await getSitemap();
  const matches = await work(sitemap);
  console.log(matches)
  worker.disconnect();

  async function work(links) {
    let matches = [];
    let count = 0;
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      console.log('${count} of ${links.length}, collecting hrefs from page: ', link);
      const hrefs = await getHrefs(link);
      const arr = checkHrefs(hrefs);
      matches = matches.concat(arr);
      if (matches.length) {
        break;
      }
      count++;
    }
    return matches;
  }
  
  async function getHrefs(url) {
    const output = await worker.getHrefs({ url });
    return output;
  }
  
  function checkHrefs(hrefs) {
    const re = /\{.*\}/;
    const matches = hrefs.filter((d)=>re.test(d));
    return matches;
  }
}

run();