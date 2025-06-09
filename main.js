// TODO:
// - make pop ups in boards to explain what's going on
// - finish tests
// - AI:
//    - stack/queue of next hits
//    - if it's empty make a random hit
//    - if it's not empty - pop and attack, if a hit, add adjacent cells

import { GameController } from "./GameController.js";
import { UIController } from "./UIController.js";
import {
  getRandomCoordinates,
  ShipPlacementManager,
} from "./ShipPlacementManager.js";

const BOARD_SIZE = 10;
// const FLEET_SHIP_SIZES = [2, 3];
const FLEET_SHIP_SIZES = [5, 4, 3, 3, 2];

const board1Element = document.getElementById("board1");
const board2Element = document.getElementById("board2");

board1Element.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  return false;
});
board2Element.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  return false;
});
// INITIALIZATION

const gameController = new GameController(BOARD_SIZE);
const uiController = new UIController(board1Element, board2Element);

// SHIP PLACEMENT AND GAME START
const spm = new ShipPlacementManager(
  FLEET_SHIP_SIZES,
  gameController,
  uiController,
);

spm.placeFleet(
  gameController.player2.board,
  uiController.boardContainer2,
  gameController.player2.isComputer,
  () => {
    gameController.switchPlayers();
    uiController.render(
      gameController.player1,
      gameController.player2,
      gameController.currentPlayer,
    );
    spm.placeFleet(
      gameController.player1.board,
      uiController.boardContainer1,
      gameController.player1.isComputer,
      () => {
        gameController.switchPlayers();
        uiController.render(
          gameController.player1,
          gameController.player2,
          gameController.currentPlayer,
        );
        uiController.onCellClick((_, x, y) => {
          const result = gameController.takeTurn(x, y);

          uiController.render(
            gameController.player1,
            gameController.player2,
            gameController.currentPlayer,
          );

          if (result.winner) {
            alert(result.winner.name);
            uiController.onCellClick(() => {});
            // uiController.showWinner(result.winner)
          }

          while (gameController.currentPlayer.isComputer) {
            const { x, y } = getRandomCoordinates(BOARD_SIZE);
            const result = gameController.takeTurn(x, y);
            uiController.render(
              gameController.player1,
              gameController.player2,
              gameController.currentPlayer,
            );
            if (result.winner) {
              alert(result.winner.name);
              uiController.onCellClick(() => {});
              // uiController.showWinner(result.winner)
              break;
            }
          }
        });
      },
    );
  },
);
