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
        this.ui.render(
          this.game.player1,
          this.game.player2,
          this.game.currentPlayer,
          true,
        );
      }
      if (currentIndex === ships.length) {
        this.onDoneCallback?.();
      }
    };

    this.ui.onCellClick((e, x, y) => {
      e.preventDefault();
      if (e.button === 0) {
        console.log("Placing ship");
        placeAShip(x, y);
        // this.ui.render(
        //   gameController.player1,
        //   gameController.player2,
        //   gameController.currentPlayer,
        // );
      } else if (e.button === 2) {
        // horizontal = !horizontal;
        this.changeDirection();
        console.log("Changed orientation");
      }
    });
  }

  changeDirection() {
    this.horizontal = !this.horizontal;
  }
}
