import { Ship } from "./Ship";
import { Gameboard, EMPTY, MISS } from "./Gameboard";

describe("Gameboard", () => {
  let ship1;
  let ship2;
  let board;

  beforeEach(() => {
    ship1 = new Ship(3);
    ship2 = new Ship(2);
    board = new Gameboard(10);
  });
  describe("ship placement", () => {
    it("should keep track of new ships", () => {
      expect(board.placeShip(0, 7, true, ship1)).toBe(true);
      expect(board.shipCount).toBe(1);
      expect(board.placeShip(1, 7, true, ship2)).toBe(true);
      expect(board.shipCount).toBe(2);
    });
    it("should create a ship within board bounds", () => {
      expect(board.placeShip(0, 9, true, ship1)).toBe(false);
      expect(board.board[0][9]).toBe(0);
      expect(board.shipCount).toBe(0);
      expect(board.placeShip(0, 7, true, ship1)).toBe(true);
      expect(board.board[0][9]).toBe(ship1);
      expect(board.shipCount).toBe(1);
    });
    it("should not create a ship if it intersects with another ship", () => {
      expect(board.placeShip(0, 6, false, ship1)).toBe(true);
      expect(board.placeShip(1, 6, false, ship2)).toBe(false);
      expect(board.board[1][6]).toBe(ship1);
      expect(board.placeShip(0, 5, false, ship2)).toBe(true);
      expect(board.board[0][5]).toBe(ship2);
    });
  });
  describe("receive attack", () => {
    it("should ignore a hit out of bounds", () => {
      let result = board.receiveAttack(10, 0);
      expect(result).toBe(false);
    });

    it("should register a miss", () => {
      expect(board.board[0][0]).toBe(EMPTY);
      let result = board.receiveAttack(0, 0);
      expect(result).toBe(true);
      expect(board.board[0][0]).toBe(MISS);
    });

    it("should register a hit", () => {
      board.placeShip(0, 0, true, ship1);
      let result = board.receiveAttack(0, 0);
      expect(result).toBe(true);
      expect(board.board[0][0]).toBe(ship1);
    });
  });
  describe("keep track of sunken ships", () => {
    it("register when all ships are sunk", () => {
      board.placeShip(0, 0, true, ship2);
      expect(board.allShipsSunk()).toBe(false);
      board.receiveAttack(0, 0);
      expect(board.allShipsSunk()).toBe(false);
      board.receiveAttack(0, 1);
      expect(board.allShipsSunk()).toBe(true);
    });
    it("hits on sunken ships don't increase sunk ship count", () => {
      board.placeShip(0, 0, true, ship2);
      board.receiveAttack(0, 0);
      board.receiveAttack(0, 1);
      expect(board.allShipsSunk()).toBe(true);
      expect(board.sunkShipCount).toBe(1);
      board.receiveAttack(0, 1);
      expect(board.sunkShipCount).toBe(1);
    });
  });
});
