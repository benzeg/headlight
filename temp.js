function checkHrefs(hrefs) {
  const re = /\{.*\}/;
  const matches = hrefs.filter((d)=>re.test(d));
  return matches;
}

const tests = ['https://wwww.madison-reed.com/{"alt_text":"hair color"}', 'ok'];
console.log(checkHrefs(tests));