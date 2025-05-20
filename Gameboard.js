export const EMPTY = 0;
export const MISS = -1;

export class Gameboard {
  constructor(size) {
    this.size = size;
    this.cells = Array.from({ length: size }, () => Array(size).fill(EMPTY));
    this.shipCount = 0;
    this.sunkShipCount = 0;
  }

  isOutOfBounds(x, y) {
    return x >= this.size || y >= this.size || x < 0 || y < 0;
  }

  canPlaceShip(x, y, horizontal, shipSize) {
    if (this.isOutOfBounds(x, y)) return false;

    // Does it intersect with other ships
    if (horizontal) {
      if (y > this.size - shipSize) return false;
      for (let j = y; j < y + shipSize; j++) {
        if (this.cells[x][j] !== EMPTY && this.cells[x][j] !== MISS)
          return false;
      }
    } else {
      if (x > this.size - shipSize) return false;
      for (let i = x; i < x + shipSize; i++) {
        if (this.cells[i][y] !== EMPTY && this.cells[i][y] !== MISS)
          return false;
      }
    }
    return true;
  }

  placeShip(x, y, horizontal, ship) {
    const shipSize = ship.size;
    if (this.canPlaceShip(x, y, horizontal, shipSize)) {
      // WARNING: setting board cells to ship references
      // A better solution would be to use ids for ships
      // and keep track of them in GameController
      // Ship is simple enough that I'm not going to bother
      //
      if (horizontal) {
        for (let j = y; j < y + shipSize; j++) {
          this.cells[x][j] = ship;
        }
      } else {
        for (let i = x; i < x + shipSize; i++) {
          this.cells[i][y] = ship;
        }
      }
      this.shipCount++;

      return true;
    }
    return false;
  }

  receiveAttack(x, y) {
    // NOTE: use this in GameController for input validation
    // if (!Number.isInteger(x) || !Number.isInteger(y))
    // throw new Error("Invalid coordinates");
    //
    if (this.isOutOfBounds(x, y)) return false;
    switch (this.cells[x][y]) {
      case MISS:
        return false;
      case EMPTY:
        this.cells[x][y] = MISS;
        return true;
      default:
        if (!this.cells[x][y].isSunk()) {
          this.cells[x][y].hit();
          if (this.cells[x][y].isSunk()) this.sunkShipCount++;
        }

        return true;
    }
  }

  allShipsSunk() {
    return this.shipCount - this.sunkShipCount === 0;
  }
}
