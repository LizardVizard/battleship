import { GameController } from "./GameController.js";
describe("Game controller", () => {
  let game;
  beforeEach(() => {
    game = new GameController(3);
  });
  it("should swap players", () => {
    expect(game.currentPlayer).toBe(game.player1);
    game.switchPlayers();
    expect(game.currentPlayer).toBe(game.player2);
  });
});
