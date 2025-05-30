import { Ship } from "./Ship.js";

export class ShipFactory {
  static createFleet(sizes) {
    if (!Array.isArray(sizes))
      throw new Error("Fleet should receive an array of ship sizes");
    if (sizes.length <= 0)
      throw new Error("Fleet should contain at least one ship");

    return sizes.map((size) => new Ship(size));
  }
}
