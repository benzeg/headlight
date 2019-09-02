export interface Average {
  size: number;
  value: number;
}
export class TimeLord implements Average {
  size =  0;
  value = 0;

  push (val: number) {
    this.size++;
    this.value = (this.value + val) / this.size;
  }

}