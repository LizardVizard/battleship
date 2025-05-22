import { Gameboard } from "./Gameboard.js";

export class Player {
  constructor(boardSize, isComputer, name = "Player") {
    this.board = new Gameboard(boardSize);
    this.isComputer = isComputer;
    this.name = name;
  }
}
