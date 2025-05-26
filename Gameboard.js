export const EMPTY = 0;
export const MISS = -1;

export class Gameboard {
  constructor(size) {
    this.size = size;
    this.cells = Array.from({ length: size }, () => Array(size).fill(EMPTY));
    this.shipCount = 0;
    this.shipEntries = [null];
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
    if (!this.canPlaceShip(x, y, horizontal, shipSize)) return false;

    this.shipCount++;
    let coordinates = [];
    // for (let delta = 0; delta < shipSize; delta++) {
    //   const row = horizontal ? x : x + delta;
    //   const col = horizontal ? y + delta : y;
    //
    //   this.cells[row][col] = this.shipCount
    //   coordinates.push(row, col)
    // }
    if (horizontal) {
      for (let col = y; col < y + shipSize; col++) {
        this.cells[x][col] = this.shipCount;
        coordinates.push([x, col]);
      }
    } else {
      for (let row = x; row < x + shipSize; row++) {
        this.cells[row][y] = this.shipCount;
        coordinates.push([row, y]);
      }
    }

    const shipEntry = { id: this.shipCount, coordinates, ship };
    this.shipEntries.push(shipEntry);

    return true;
  }

  receiveAttack(x, y) {
    if (this.isOutOfBounds(x, y)) return false;
    switch (this.cells[x][y]) {
      case MISS:
        return { hit: false, isEmpty: false };
      case EMPTY:
        this.cells[x][y] = MISS;
        return { hit: false, isEmpty: true };
      default:
        const ship = this.shipEntries[this.cells[x][y]].ship;

        if (!ship.isSunk()) {
          ship.hit(x, y);
          if (ship.isSunk()) {
            // this.attackAdjacent(x, y);
            this.sunkShipCount++;
          }
        }

        return { hit: true, sunk: ship.isSunk(), ship };
    }
  }

  attackAdjacent(x, y) {
    const neighborsDelta = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    const visited = Array.from({ length: this.size }, () =>
      Array(this.size).fill(false),
    );

    const traverse = (x, y) => {
      visited[x][y] = true;
      for (const [deltaX, deltaY] of neighborsDelta) {
        const newX = x + deltaX;
        const newY = y + deltaY;

        if (this.isOutOfBounds(newX, newY) || visited[newX][newY]) continue;
        switch (this.cells[newX][newY]) {
          case MISS:
            break;
          case EMPTY:
            // this.receiveAttack(newX, newY);
            this.cells[newX][newY] = MISS;
            break;
          default:
            traverse(newX, newY);
            break;
        }
      }
    };
    traverse(x, y);
  }

  allShipsSunk() {
    return this.shipCount - this.sunkShipCount === 0;
  }
}
