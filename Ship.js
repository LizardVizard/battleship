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
    this.hits.push([x, y]);
    this.hitCount++;
  }

  isSunk() {
    return this.hitCount >= this.size;
  }
}
