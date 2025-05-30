import { ShipFactory } from "./ShipFactory";
import { Ship } from "./Ship";

describe("Ship factory", () => {
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
    });
  });
});
