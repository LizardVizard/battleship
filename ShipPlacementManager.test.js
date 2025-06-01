import {
  getRandomCoordinates,
  getRandomShipPlacement,
  ShipPlacementManager,
} from "./ShipPlacementManager.js";
import { Player } from "./Player.js";

describe("Ship placement manager", () => {
  let spm;
  let player;
  const SHIP_SIZES = [1];
  const BOARD_SIZE = 3;

  beforeEach(() => {
    spm = new ShipPlacementManager(SHIP_SIZES);
  });

  describe("placing ships for player", () => {
    beforeEach(() => {
      player = new Player(BOARD_SIZE, false);
    });
    it.todo("should place ships on given coordinates", () => {
      spm.placeFleet(player.board, false, () => {});
    });
  });
  describe("placing ships for computer", () => {
    beforeEach(() => {
      player = new Player(BOARD_SIZE, true);
    });
    it.todo("should place ships randomly", () => {
      spm.placeFleet(player.board, true, () => {});
    });
  });
  describe("assigning and invoking given callback", () => {});
  describe("generate random placement", () => {
    it("should generate random coordinates on the board", () => {
      const coords = getRandomCoordinates(BOARD_SIZE);
      expect(coords.x).toBeLessThan(BOARD_SIZE);
      expect(coords.x).toBeGreaterThanOrEqual(0);
      expect(coords.y).toBeLessThan(BOARD_SIZE);
      expect(coords.y).toBeGreaterThanOrEqual(0);
    });
    it("should generate random direction together with coordinates", () => {
      const placement = getRandomShipPlacement(BOARD_SIZE);
      expect(placement.horizontal).toBeDefined();
      expect(typeof placement.horizontal).toBe("boolean");
    });
  });
  it("should change ship orientation", () => {
    expect(spm.horizontal).toBe(true);
    spm.changeDirection();
    expect(spm.horizontal).toBe(false);
  });
});
