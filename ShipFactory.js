import { Ship } from "./Ship";

export class ShipFactory {
  static createShip(size) {
    if (size <= 0) throw new Error("Ship size should be greater than 0");
    return new Ship(size);
  }

  static createFleet(sizes) {
    if (!Array.isArray(sizes))
      throw new Error("Fleet should receive an array of ship sizes");
    if (sizes.length <= 0)
      throw new Error("Fleet should contain at least one ship");

    return sizes.map((size) => new Ship(size));
  }
}
