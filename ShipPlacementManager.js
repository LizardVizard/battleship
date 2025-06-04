import { ShipFactory } from "./ShipFactory.js";

export function getRandomCoordinates(boardSize) {
  return {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize),
  };
}

export function getRandomShipPlacement(boardSize) {
  return {
    ...getRandomCoordinates(boardSize),
    horizontal: Math.random() < 0.5,
  };
}

export class ShipPlacementManager {
  constructor(shipSizes, GameController, UIController) {
    this.shipSizes = shipSizes;
    this.game = GameController;
    this.ui = UIController;
    this.horizontal = true;
  }

  placeFleet(board, isComputer, callback) {
    this.onDoneCallback = callback;
    const ships = ShipFactory.createFleet(this.shipSizes);
    switch (isComputer) {
      case true:
        this.placeForComputer(board, ships);
        break;
      case false:
        this.placeForHuman(board, ships);
        break;
    }
  }

  placeForComputer(board, ships) {
    for (const ship of ships) {
      let placed = false;
      while (!placed) {
        const placement = getRandomShipPlacement(board.size);
        placed = board.placeShip(
          placement.x,
          placement.y,
          placement.horizontal,
          ship,
        );
      }
    }
    this.onDoneCallback?.();
  }

  placeForHuman(board, ships) {
    let currentIndex = 0;

    const placeAShip = (x, y) => {
      const currentShip = ships[currentIndex];
      if (board.placeShip(x, y, this.horizontal, currentShip)) {
        currentIndex++;
      }
      this.ui.render(
        this.game.player1,
        this.game.player2,
        this.game.currentPlayer,
        true,
      );
      if (currentIndex === ships.length) {
        this.ui.detachOnBoardClick(this.ui.boardContainer1);
        this.ui.detachOnBoardHover(this.ui.boardContainer1);
        this.onDoneCallback?.();
      }
    };

    this.ui.onCellClick((e, x, y) => {
      e.preventDefault();
      if (e.button === 0) {
        console.log("Placing ship");
        placeAShip(x, y);
      } else if (e.button === 2) {
        this.changeDirection();
        console.log("Changed orientation");
      }
    });

    this.ui.onCellHover((_, x, y) => {
      // FIX: using this.ui.boardContainer1
      // should receive a reference to the element
      // right now if both player were human, all of the changes
      // for the second player would appear on the board of the first one.
      console.log("cb");
      console.log(this);
      this.ui.boardContainer1
        .querySelectorAll(".placement-good, .placement-bad")
        .forEach((cell) => {
          cell.classList.remove("placement-good", "placement-bad");
        });

      const shipSize = ships[currentIndex].size;

      const shipPlacementClass = board.canPlaceShip(
        x,
        y,
        this.horizontal,
        shipSize,
      )
        ? "placement-good"
        : "placement-bad";

      if (this.horizontal) {
        for (let j = y; j < Math.min(y + shipSize, board.size); j++) {
          this.ui.boardContainer1
            .querySelector(`[data-x="${x}"][data-y="${j}"]`)
            .classList.add(shipPlacementClass);
        }
      } else {
        for (let i = x; i < Math.min(x + shipSize, board.size); i++) {
          this.ui.boardContainer1
            .querySelector(`[data-x="${i}"][data-y="${y}"]`)
            .classList.add(shipPlacementClass);
        }
      }
    });

    this.ui.attachOnBoardClick(this.ui.boardContainer1);
    this.ui.attachOnBoardHover(this.ui.boardContainer1);
  }

  changeDirection() {
    this.horizontal = !this.horizontal;
    this.ui.render(
      this.game.player1,
      this.game.player2,
      this.game.currentPlayer,
      true,
    );
  }
}
