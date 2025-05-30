import { Player } from "./Player.js";

export class GameController {
  constructor(boardSize, againstAComputer = true) {
    this.boardSize = boardSize;

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

  isCurrentPlayer(player) {
    return player === this.currentPlayer;
  }

  takeTurn(x, y) {
    const result = this.otherPlayer.board.receiveAttack(x, y);

    if (this.otherPlayer.board.allShipsSunk()) {
      return { winner: this.currentPlayer };
    }

    if (!result.hit) {
      this.switchPlayers();
    }

    return result;
  }
}
