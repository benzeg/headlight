import { Link } from './Page';
import { Auditor } from './Headlight';
import { Sequencer } from './Sequencer';
import { fork } from 'child_process';
import { join } from 'path';

export interface Collector {
  history: object;
  queue: Array<Link>;
  busy: Boolean;
  worker: Auditor | Array<any>;
};

export class Historian implements Collector {
  history = {}; 
  queue: Array<Link>;
  busy = false;
  worker = [];
  numCPUs = require('os').cpus().length;
  dispatcher = new Sequencer(this.numCPUs);
  timeout = null;
 
  constructor(queue?: Array<Link>) {
    this.queue = queue || [];
  }

  addToQueue(l: Link) {
    this.queue.push(l);
    if (!this.busy) {
      this.dequeue();
    }
  }

  dequeue() {
    this.busy = true;

    let i = 0;
    while (i < this.numCPUs && !!this.queue.length) {
      const pid = this.dispatcher.step();
      if (!this.worker[pid]) {
        this.worker[pid] = fork(join(__dirname, './HeadlightProcess.js'), [], { env: { PORT_NUM: 3000 + pid }});
      }
      const link = this.queue.pop();
      this.worker[pid].send(link);
      this.worker[pid].on('message', (audit) => {
        console.log('**********', audit);
        this.history[link.url] = audit;
      });
      i++;
    }

    if (!!this.queue.length && !this.timeout) {
      this.timeout = setTimeout(this.dequeue, 2000);
    } else if (!this.queue.length) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.busy = false;
    }
  }
}
