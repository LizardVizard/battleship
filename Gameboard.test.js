import { Ship } from "./Ship";
import { Gameboard, EMPTY, MISS } from "./Gameboard";

describe("Gameboard", () => {
  let ship1;
  let ship2;
  let ship3;
  let board;

  beforeEach(() => {
    ship1 = new Ship(3);
    ship2 = new Ship(2);
    ship3 = new Ship(1);
    board = new Gameboard(10);
  });
  describe("ship placement", () => {
    describe("keeping track of new ships", () => {
      it("should count number of ships", () => {
        expect(board.shipCount).toBe(0);
        expect(board.placeShip(0, 7, true, ship1)).toBe(true);
        expect(board.shipCount).toBe(1);
        expect(board.placeShip(1, 7, true, ship2)).toBe(true);
        expect(board.shipCount).toBe(2);
      });
      it("should keep track of ships' ids", () => {
        const expectedShip1Id = 1;
        const expectedShip2Id = 2;

        expect(board.placeShip(0, 7, true, ship1)).toBe(true);
        expect(board.cells[0][7]).toBe(expectedShip1Id);

        expect(board.placeShip(1, 7, true, ship2)).toBe(true);
        expect(board.cells[1][7]).toBe(expectedShip2Id);
      });
      it("should keep track of ships' coordinates", () => {
        const expectedShip1Id = 1;
        const expectedShip2Id = 2;

        expect(board.placeShip(0, 7, true, ship1)).toBe(true);
        expect(board.shipEntries[expectedShip1Id].coordinates).toEqual([
          [0, 7],
          [0, 8],
          [0, 9],
        ]);

        expect(board.placeShip(1, 7, true, ship2)).toBe(true);
        expect(board.cells[1][7]).toBe(expectedShip2Id);
        expect(board.shipEntries[expectedShip2Id].coordinates).toEqual([
          [1, 7],
          [1, 8],
        ]);
      });
      it("should not place a ship where one exists", () => {
        expect(board.placeShip(0, 7, true, ship1)).toBe(true);
        expect(board.placeShip(0, 8, true, ship2)).toBe(false);
      });
    });
    it("should not create a ship out of board bounds", () => {
      expect(board.placeShip(0, 9, true, ship1)).toBe(false);
      expect(board.cells[0][9]).toBe(0);
      expect(board.placeShip(0, 7, true, ship2)).toBe(true);
      expect(board.cells[0][8]).toBe(1);
    });
    it("should not create a ship if it intersects with another ship", () => {
      expect(board.placeShip(0, 6, false, ship1)).toBe(true);
      expect(board.placeShip(1, 6, false, ship2)).toBe(false);
      expect(board.cells[1][6]).toBe(1);
    });
  });
  describe("receive attack", () => {
    it("should ignore a hit out of bounds", () => {
      expect(board.receiveAttack(10, 0)).toBe(false);
    });

    it("should register a miss", () => {
      expect(board.cells[0][0]).toBe(EMPTY);
      expect(board.receiveAttack(0, 0)).toEqual({ hit: false, isEmpty: true });
      expect(board.cells[0][0]).toBe(MISS);
      expect(board.receiveAttack(0, 0)).toEqual({ hit: false, isEmpty: false });
    });

    it("should register a hit", () => {
      board.placeShip(0, 0, true, ship1);
      expect(board.receiveAttack(0, 0)).toEqual({
        hit: true,
        sunk: false,
        ship: ship1,
      });
      expect(board.cells[0][0]).toBe(1);
    });
    it("should register a sunken ship", () => {
      board.placeShip(0, 0, true, ship2);
      expect(board.receiveAttack(0, 0)).toEqual({
        hit: true,
        sunk: false,
        ship: ship2,
      });
      expect(board.receiveAttack(0, 1)).toEqual({
        hit: true,
        sunk: true,
        ship: ship2,
      });
    });

    // it("should attack adjacent cells after sinking a ship", () => {
    //   board.placeShip(0, 0, false, ship3);
    //   board.receiveAttack(0, 0);
    //   expect(board.cells[0][1]).toBe(MISS);
    //   expect(board.cells[1][1]).toBe(MISS);
    //   expect(board.cells[1][0]).toBe(MISS);
    // });
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
      expect(board.sunkShipCount).toBe(0);
      board.receiveAttack(0, 1);
      expect(board.sunkShipCount).toBe(1);
      board.receiveAttack(0, 1);
      expect(board.sunkShipCount).toBe(1);
    });
  });
});
