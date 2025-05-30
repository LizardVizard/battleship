import { GameController } from "./GameController.js";
import { Ship } from "./Ship.js";

describe("Game controller", () => {
  let game;
  let ship1;
  let ship2;
  beforeEach(() => {
    game = new GameController(10);
    ship1 = new Ship(2);
    ship2 = new Ship(1);

    game.player2.board.placeShip(0, 0, true, ship1);
    game.player2.board.placeShip(1, 0, true, ship2);
  });
  describe("taking a turn", () => {
    describe("attack is a miss", () => {
      it("should swap players", () => {
        expect(game.currentPlayer).toEqual(game.player1);
        game.takeTurn(2, 0);
        expect(game.currentPlayer).toEqual(game.player2);
      });
      it("should return an object with miss data", () => {
        expect(game.takeTurn(2, 0)).toEqual({ hit: false, isEmpty: true });
        game.switchPlayers();
        expect(game.takeTurn(2, 0)).toEqual({ hit: false, isEmpty: false });
      });
    });
    describe("attack is a hit", () => {
      it("should not swap players", () => {
        expect(game.currentPlayer).toEqual(game.player1);
        game.takeTurn(0, 0);
        expect(game.currentPlayer).toEqual(game.player1);
      });
      it("should return an object with hit data", () => {
        const res = game.takeTurn(0, 0);
        expect(res).toEqual({
          hit: true,
          sunk: false,
          ship: ship1,
        });
        expect(game.takeTurn(0, 1)).toEqual({
          hit: true,
          sunk: true,
          ship: ship1,
        });
      });
      it("should return a winner if all ships are sunk", () => {
        game.takeTurn(0, 0);
        game.takeTurn(0, 1);
        expect(game.takeTurn(1, 0)).toEqual({ winner: game.player1 });
      });
    });
  });
});
