import { Headlight } from './Headlight';
import { Link } from './Page';

const worker = new Headlight();

process.on('message', (l: Link) => {
  console.log('in headlight process', l);
  worker.audit(l).then((res) => {
    process.send(res);
  }).catch((e) => console.error(e));
});

process.on('exit', () => {
  worker.disconnect();
  console.log('headlight disconnected');
  process.exit();
});