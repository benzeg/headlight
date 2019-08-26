import { Headlight } from './Headlight';
import { Link } from './Page';

const worker = new Headlight();

process.on('message', (l: Link) => {
  return worker.audit(l);
});

process.on('exit', () => {
  worker.disconnect();
  console.log('headlight disconnected');
});