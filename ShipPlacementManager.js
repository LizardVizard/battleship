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

    // TODO: Write a callbackhandler for the ui
    // The reason to have it in a callback is to be able to remove it later
    const cb = (e) => {
      this.ui.boardContainer1
        .querySelectorAll(".placement-good, .placement-bad")
        .forEach((cell) => {
          cell.classList.remove("placement-good", "placement-bad");
        });
      const cell = e.target.closest(".cell");

      if (!cell) return;
      const x = Number(cell.dataset.x);
      const y = Number(cell.dataset.y);

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
    };

    this.ui.boardContainer1.addEventListener("mouseover", cb);

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
        this.ui.boardContainer1.removeEventListener("mouseover", cb);
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
