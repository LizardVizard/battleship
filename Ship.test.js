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
      expect(ship.hits.length).toBe(0);
    });
    it("should not be sunk", () => {
      expect(ship.isSunk()).toBe(false);
    });
  });

  describe("upon a hit", () => {
    beforeEach(() => {
      ship.hit(1, 2);
    });

    it("should throw if no or invalid coordinates were supplied", () => {
      expect(() => ship.hit()).toThrow("Invalid coordinates");
      expect(() => ship.hit("2", 1)).toThrow("Invalid coordinates");
    });
    it("should register a hit", () => {
      expect(ship.hits.length).toBe(1);
    });
    it("should record coordinates of a hit", () => {
      expect(ship.hits).toEqual([[1, 2]]);
    });
    it("should not sink before hit count matches size", () => {
      expect(ship.isSunk()).toBe(false);
    });
    it("should not register hits to the same section", () => {
      ship.hit(1, 2);
      expect(ship.hits).toEqual([[1, 2]]);
      expect(ship.hits.length).toBe(1);
    });
    it("should sink when hit count matches size", () => {
      ship.hit(1, 3);
      expect(ship.hits).toEqual([
        [1, 2],
        [1, 3],
      ]);
      expect(ship.hits.length).toBe(2);
      expect(ship.isSunk()).toBe(true);
    });
  });
});
