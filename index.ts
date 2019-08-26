import { Historian } from './src/Historian';

const historian = new Historian();

historian.addToQueue({ url: 'benzeg.github.io'});
historian.getReport().then((res)=> {
  console.log(res);
}).catch((e)=> console.error(e));