import { Player } from "./Player";
import { Gameboard } from "./Gameboard";

describe("Player", () => {
  const boardSize = 10;
  let player;
  beforeEach(() => {
    player = new Player(boardSize);
  });

  test("board creation", () => {
    expect(player.board).toBeInstanceOf(Gameboard);
    expect(player.board.cells.length).toBe(boardSize);
  });
});
