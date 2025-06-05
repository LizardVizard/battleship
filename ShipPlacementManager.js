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

  placeFleet(board, boardContainer, isComputer, callback) {
    this.ui.render(
      this.game.player1,
      this.game.player2,
      this.game.currentPlayer,
    );
    this.onDoneCallback = callback;
    const ships = ShipFactory.createFleet(this.shipSizes);
    switch (isComputer) {
      case true:
        this.placeForComputer(board, boardContainer, ships);
        break;
      case false:
        this.placeForHuman(board, boardContainer, ships);
        break;
    }
  }

  placeForComputer(board, _boardContainer, ships) {
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

  placeForHuman(board, boardContainer, ships) {
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
        this.ui.detachOnBoardClick(boardContainer);
        this.ui.detachOnBoardHover(boardContainer);
        this.onDoneCallback?.();
      }
    };

    this.ui.onCellClick((e, x, y) => {
      e.preventDefault();
      if (e.button === 0) {
        placeAShip(x, y);
      } else if (e.button === 2) {
        this.changeDirection();
      }
    });

    this.ui.onCellHover((_, x, y) => {
      const shipSize = ships[currentIndex].size;

      const isValid = board.canPlaceShip(x, y, this.horizontal, shipSize);

      this.ui.highlightShip(
        boardContainer,
        x,
        y,
        this.horizontal,
        shipSize,
        board.size,
        isValid,
      );
    });

    this.ui.attachOnBoardClick(boardContainer);
    this.ui.attachOnBoardHover(boardContainer);
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
