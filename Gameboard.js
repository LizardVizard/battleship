export const EMPTY = 0;
export const MISS = -1;

export class Gameboard {
  constructor(size) {
    this.size = size;
    this.board = Array.from({ length: size }, () => Array(size).fill(EMPTY));
    this.shipCount = 0;
    this.sunkShipCount = 0;
  }

  placeShip(x, y, horizontal, ship) {
    const shipSize = ship.size;
    // if (x >= this.size || y >= this.size || x < 0 || y < 0) return false;

    if (horizontal) {
      if (y > this.size - shipSize) return false;
      for (let j = y; j < y + shipSize; j++) {
        if (this.board[x][j] !== EMPTY && this.board[x][j] !== MISS)
          return false;
      }
    } else {
      if (x > this.size - shipSize) return false;
      for (let i = x; i < x + shipSize; i++) {
        if (this.board[i][y] !== EMPTY && this.board[i][y] !== MISS)
          return false;
      }
    }

    // WARNING: setting board cells to ship references
    // A better solution would be to use ids for ships
    // and keep track of them in GameController
    // Ship is simple enough that I'm not going to bother
    //
    if (horizontal) {
      for (let j = y; j < y + shipSize; j++) {
        this.board[x][j] = ship;
      }
    } else {
      for (let i = x; i < x + shipSize; i++) {
        this.board[i][y] = ship;
      }
    }
    this.shipCount++;

    return true;
  }

  receiveAttack(x, y) {
    // FIXME: use this in GameController for validation
    // if (x >= this.size || y >= this.size || x < 0 || y < 0) return false;
    // if (!Number.isInteger(x) || !Number.isInteger(y))
    // throw new Error("Invalid coordinates");
    //
    switch (this.board[x][y]) {
      case MISS:
        return false;
      case EMPTY:
        this.board[x][y] = MISS;
        return true;
      default:
        if (!this.board[x][y].isSunk()) {
          this.board[x][y].hit();
          if (this.board[x][y].isSunk()) this.sunkShipCount++;
        }

        return true;
    }
  }

  allShipsSunk() {
    return this.shipCount - this.sunkShipCount === 0;
  }
}
