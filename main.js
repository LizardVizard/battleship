// TODO:
// - make pop ups in boards to explain what's going on
// - create a shpis placement class
// - shomehow visualise placed ships and maybe hint as to how it looks like

import { GameController } from "./GameController.js";
import { UIController } from "./UIController.js";
import {
  getRandomCoordinates,
  getRandomShipPlacement,
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
// TODO: simplify render
// const uiController = new UIController(gameController, board1Element, board2Element);

// SHIP PLACEMENT AND GAME START
const spm = new ShipPlacementManager(
  FLEET_SHIP_SIZES,
  gameController,
  uiController,
);

spm.placeFleet(gameController.player2.board, true, () => {
  gameController.switchPlayers();
  uiController.render(
    gameController.player1,
    gameController.player2,
    gameController.currentPlayer,
  );
  spm.placeFleet(gameController.player1.board, false, () => {
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
        // uiController.showWinner(result.winner)
      }

      while (gameController.currentPlayer.isComputer) {
        const { x, y } = getRandomCoordinates(BOARD_SIZE);
        gameController.takeTurn(x, y);
        uiController.render(
          gameController.player1,
          gameController.player2,
          gameController.currentPlayer,
        );
        if (result.winner) {
          alert(result.winner.name);
        }
      }
    });
  });
});

// .ui.render(
//   gameController.player1,
//   gameController.player2,
//   gameController.currentPlayer,
// );
// function getRandomCoordinates() {
//   return {
//     x: Math.floor(Math.random() * BOARD_SIZE),
//     y: Math.floor(Math.random() * BOARD_SIZE),
//   };
// }
//
// function getRandomShipPlacement() {
//   return { ...getRandomCoordinates(), horizontal: Math.random() < 0.5 };
// }

// while (player2Ships.length) {
//   let placed = false;
//
//   const ship = player2Ships.shift();
//
//   while (!placed) {
//     const { x, y, horizontal } = getRandomShipPlacement();
//     if (
//       gameController.player2.board.canPlaceShip(x, y, horizontal, ship.size)
//     ) {
//       gameController.player2.board.placeShip(x, y, horizontal, ship);
//       placed = true;
//     }
//   }
// }
//
// gameController.switchPlayers();
//
// function placeAShip(x, y) {
//   if (
//     gameController.otherPlayer.board.canPlaceShip(
//       x,
//       y,
//       horizontal,
//       player1Ships[0].size,
//     )
//   ) {
//     const currentShip = player1Ships.shift();
//
//     gameController.otherPlayer.board.placeShip(x, y, horizontal, currentShip);
//
//     uiController.render(
//       gameController.player1,
//       gameController.player2,
//       gameController.currentPlayer,
//       true,
//     );
//
//     if (player1Ships.length === 0) {
//       gameController.switchPlayers();
//
//       uiController.render(
//         gameController.player1,
//         gameController.player2,
//         gameController.currentPlayer,
//       );
//
//       uiController.onCellClick((_, x, y) => {
//         const result = gameController.takeTurn(x, y);
//
//         uiController.render(
//           gameController.player1,
//           gameController.player2,
//           gameController.currentPlayer,
//         );
//
//         if (result.winner) {
//           alert(result.winner.name);
//           // uiController.showWinner(result.winner)
//         }
//
//         while (gameController.currentPlayer.isComputer) {
//           const { x, y } = getRandomCoordinates();
//           gameController.takeTurn(x, y);
//           uiController.render(
//             gameController.player1,
//             gameController.player2,
//             gameController.currentPlayer,
//           );
//           if (result.winner) {
//             alert(result.winner.name);
//           }
//         }
//       });
//     }
//   }
// }

// uiController.onCellClick((e, x, y) => {
//   e.preventDefault();
//   if (e.button === 0) {
//     console.log(placeAShip(x, y));
//     console.log("Placing ship");
//   } else if (e.button === 2) {
//     horizontal = !horizontal;
//     console.log("Changed orientation");
//   }
// });
// uiController.render(
//   gameController.player1,
//   gameController.player2,
//   gameController.currentPlayer,
//   true,
// );
