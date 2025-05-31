export class Ship {
  constructor(size) {
    if (size <= 0) throw new Error("Ship size should be greater than 0");
    this.size = size;
    this.hits = [];
    this.hitCount = 0;
  }

  hit(x, y) {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      throw new Error("Invalid coordinates");
    }
    if (this.isSunk()) {
      return false;
    }

    if (!this.hits.some(([hitX, hitY]) => hitX === x && hitY === y)) {
      this.hits.push([x, y]);
    }
  }

  isSunk() {
    return this.hits.length === this.size;
  }
}
