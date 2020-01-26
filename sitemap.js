const _ = require('lodash');
const axios = require('axios');
async function createInstance() {
  const instance = axios.create({
    baseURL: 'https://tophat.madison-reed.com',
    withCredentials: true
  });
  instance.defaults.headers.common.Cookie = '1qzgTW5z3jbjkxlGAJZ5WueGUb2phkfPw3cdEml8dMRLYjiianKWb9BRZXjaTkQ8=1; tophat.sid=s%3AfNXixnDCl26VxJ2YW08hidJ5q0yvGRvP.O9VNX0qQ8%2FKJ9UNhx9c8JvgXH77Hj6uqyBuyCR%2FTvEQ';
  const postHeader = {
    'Content-Type': 'application/json;charset=utf-8',
    'Cache-Control': 'no-cache',
    'Accept-Language': 'en-Us,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept': 'application/json, text/plain, */*'
  };
  _.merge(instance.defaults.headers.post, postHeader);
  return instance;
}

async function getSitemap() {
  const instance = await createInstance();
  const sitemap = (await instance.get('/rest/sitemap/getAll')).data.map((d)=>`https://www.madison-reed.com/${d.url}`);
  return sitemap;
};

module.exports = {
  getSitemap
};