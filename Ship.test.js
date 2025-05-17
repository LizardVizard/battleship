// import { Ship } from "Ship.js";
import { Ship } from "./Ship";

describe("Ship", () => {
  // const ship = new Ship(1);
  let ship;

  beforeEach(() => {
    ship = new Ship(2);
  });

  describe("initialization", () => {
    it("should have defined size", () => {
      expect(ship.size).toBe(2);
    });
    it("should have no hits", () => {
      expect(ship.hitCount).toBe(0);
    });
    it("should not be sunk", () => {
      expect(ship.isSunk()).toBe(false);
    });
  });

  describe("after one hit", () => {
    beforeEach(() => {
      ship.hit();
    });

    it("should register a hit", () => {
      expect(ship.hitCount).toBe(1);
    });
    it("should not sink before hit count matches size", () => {
      expect(ship.isSunk()).toBe(false);
    });
  });
  describe("after hit count matches size", () => {
    beforeEach(() => {
      ship.hit();
      ship.hit();
    });

    it("should register hits", () => {
      expect(ship.hitCount).toBe(2);
    });
    it("should sink when hit count matches size", () => {
      expect(ship.isSunk()).toBe(true);
    });
  });
});
