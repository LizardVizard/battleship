import { ShipFactory } from "./ShipFactory";
import { Ship } from "./Ship";

describe("Ship factory", () => {
  describe("ship creation", () => {
    it("should throw if ship size <= 0", () =>
      expect(() => ShipFactory.createShip(0)).toThrow(
        "Ship size should be greater than 0",
      ));
    it("should return class Ship with the given size", () => {
      const ship = ShipFactory.createShip(2);
      expect(ship).toBeInstanceOf(Ship);
      expect(ship.size).toBe(2);
    });
  });
  describe("fleet creation", () => {
    it("should throw if array is not given", () =>
      expect(() => ShipFactory.createFleet(1)).toThrow(
        "Fleet should receive an array of ship sizes",
      ));
    it("should throw if fleet size <= 0", () =>
      expect(() => ShipFactory.createFleet([])).toThrow(
        "Fleet should contain at least one ship",
      ));
    it("should return an array of ships with the corresponding sizes", () => {
      const sizes = [1, 2];
      const fleet = ShipFactory.createFleet(sizes);
      expect(fleet).toBeInstanceOf(Array);
      expect(fleet).toHaveLength(sizes.length);
      expect(fleet[0]).toBeInstanceOf(Ship);
      sizes.forEach((size, i) => expect(fleet[i].size).toBe(size));
      // expect(fleet[0].size).toBe(1);
      // expect(fleet[1]).toBeInstanceOf(Ship);
      // expect(fleet[1].size).toBe(2);
    });
  });
});
