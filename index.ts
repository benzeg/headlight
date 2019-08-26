import { Historian } from './src/Historian';

const historian = new Historian();

historian.addToQueue({ url: 'https://benzeg.github.io'});
historian.getReport().then((res)=> {
  console.log('result', res);
}).catch((e)=> console.error('error', e));