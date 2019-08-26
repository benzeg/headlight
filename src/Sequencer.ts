export interface Counter {
  count: number;
  step(): number;
}

export class Sequencer implements Counter {
  limit: number;
  count = null;
  constructor(l:number) {
    this.limit = l;
  }
  step() {
    if (this.count === null) {
      this.count = 0;
    } else {
      const next = this.count + 1;
      if (next === this.limit) {
        this.count = 0;
      } else {
        this.count = next;
      }
    }

    return this.count;
  }
}
