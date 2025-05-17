export class Ship {
  constructor(size) {
    this.size = size;
    this.hitCount = 0;
  }

  hit() {
    this.hitCount++;
  }

  isSunk() {
    return this.hitCount >= this.size;
  }
}
