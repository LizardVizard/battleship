import { Player } from "./Player.js";
import { Gameboard } from "./Gameboard.js";
import { ShipFactory } from "./ShipFactory.js";
import { Ship } from "./Ship.js";

export class GameController {
  constructor(boardSize, againstAComputer = true) {
    this.player1 = new Player(boardSize, false, "Player");
    this.player2 = new Player(boardSize, againstAComputer, "Computer");

    this.currentPlayer = this.player1;
    this.otherPlayer = this.player2;
  }

  switchPlayers() {
    [this.currentPlayer, this.otherPlayer] = [
      this.otherPlayer,
      this.currentPlayer,
    ];
  }

  takeTurn(x, y) {
    this.otherPlayer.board.receiveAttack(x, y);

    if (this.otherPlayer.board.allShipsSunk()) {
      return { winner: this.currentPlayer };
    }

    this.switchPlayers();
  }
}
// // TODO:
// // Use webpack for server to avoid CORS error
// //
//
// const boardSize = 10;
//
// // const playerBoard = new Gameboard(boardSize);
// let player1 = new Player(boardSize, false, "Player");
// let player2 = new Player(boardSize, true, "Computer");
//
// let currentPlayer = player1;
// let otherPlayer = player2;
//
// // let currentPlayer = player
//
// // const shipSizes = [5, 4, 3, 3, 2];
// const shipSizes = [2];
//
// let coordinates = 0;
// for (const ship of ShipFactory.createFleet(shipSizes)) {
//   currentPlayer.board.placeShip(coordinates++, 0, true, ship);
// }
// // for (const ship of ShipFactory.createFleet(shipSizes)) {
// const ship = new Ship(1);
// otherPlayer.board.placeShip(0, 0, true, ship);
// // }
// // for (let row of player.board.cells) {
// //   console.log(row);
// // }
// // player.board.receiveAttack(4, 0);
// // player.board.receiveAttack(4, 1);
// // player.board.receiveAttack(4, 2);
// // for (let row of player.board.cells) {
// //   console.log(row);
// // }
//
// function switchPlayers() {
//   [currentPlayer, otherPlayer] = [otherPlayer, currentPlayer];
// }
//
// function takeTurn(x, y) {
//   // const [x, y] = [1, 2];
//
//   otherPlayer.board.receiveAttack(x, y);
//   // More Scalable Alternative: Strategy Pattern
//
//   if (otherPlayer.board.allShipsSunk()) {
//     // console.log("Winner:", currentPlayer.name);
//     return { winner: currentPlayer };
//   }
//
//   switchPlayers();
// }
// while (true) {
//   // takeTurn()
//   //
//   let x, y;
//
//   if (currentPlayer.isComputer) {
//     // TODO: write more logic for AI
//     // - queue of adjacent cells after a hit
//     [x, y] = [
//       Math.floor(Math.random() * boardSize),
//       Math.floor(Math.random() * boardSize),
//     ];
//   } else {
//     // TODO: change prompt into a input or click event listener
//     [x, y] = prompt().split(",");
//   }
//   // console.log(x, y);
//
//   console.log("CURRENT:");
//
//   for (let row of currentPlayer.board.cells) {
//     console.log(row);
//   }
//   console.log("NEXT:");
//
//   for (let row of otherPlayer.board.cells) {
//     console.log(row);
//   }
//
//   otherPlayer.board.receiveAttack(x, y);
//
//   if (otherPlayer.board.allShipsSunk()) {
//     console.log("Winner:", currentPlayer.name);
//     break;
//   }
//
//   switchPlayers();
// }
