import { Ship } from "./Ship";

describe("Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(2);
  });

  describe("initialization", () => {
    it("should throw when the size is less than 1", () => {
      expect(() => {
        const tempShip = new Ship(-1);
      }).toThrow("Ship size should be greater than 0");
    });
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
      ship.hit(1, 2);
    });

    it("should throw if no or invalid coordinates were supplied", () => {
      expect(() => ship.hit()).toThrow("Invalid coordinates");
      expect(() => ship.hit("2", 1)).toThrow("Invalid coordinates");
    });
    it("should register a hit", () => {
      expect(ship.hitCount).toBe(1);
    });
    it("should record coordintaes of a hit", () => {
      expect(ship.hits).toEqual([[1, 2]]);
    });
    it("should not sink before hit count matches size", () => {
      expect(ship.isSunk()).toBe(false);
    });
  });
  describe("after hit count matches size", () => {
    beforeEach(() => {
      ship.hit(1, 2);
      ship.hit(1, 3);
    });

    it("should register hits", () => {
      expect(ship.hitCount).toBe(2);
    });
    it("should sink when hit count matches size", () => {
      expect(ship.isSunk()).toBe(true);
    });
  });
});
