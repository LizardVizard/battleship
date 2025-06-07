import {
  getRandomCoordinates,
  getRandomShipPlacement,
  ShipPlacementManager,
} from "./ShipPlacementManager.js";
import { ShipFactory } from "./ShipFactory.js";

describe("Ship placement manager", () => {
  let spm;
  let fakeUI;
  let fakeGameController;
  let fakeBoard;
  let fakePlayer;
  let fakeShips;
  let fakeCallback;
  const SHIP_SIZES = [1, 2];
  const BOARD_SIZE = 3;

  beforeEach(() => {
    fakeCallback = jest.fn(() => null);
    fakeUI = {
      render: jest.fn(() => {}),
      onCellClick: jest.fn(() => {}),
      onCellHover: jest.fn(() => {}),
      highlightShip: jest.fn(() => {}),
      attachOnBoardClick: jest.fn(() => {}),
      attachOnBoardHover: jest.fn(() => {}),
      detachOnBoardClick: jest.fn(() => {}),
      detachOnBoardHover: jest.fn(() => {}),
    };
    fakeBoard = {
      placeShip: jest.fn(() => true),
      canPlaceShip: jest.fn(() => true),
      size: 3,
    };
    fakePlayer = { board: fakeBoard };
    fakeGameController = {
      player1: fakePlayer,
      player2: null,
      currentPlayer: null,
    };
    fakeShips = [{ size: 1 }, { size: 2 }];

    spm = new ShipPlacementManager(SHIP_SIZES, fakeGameController, fakeUI);
  });

  describe("placing a fleet", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(ShipFactory, "createFleet").mockReturnValue(fakeShips);
      jest.spyOn(spm, "placeForComputer");
      jest.spyOn(spm, "placeForHuman");
    });
    it("calls place for computer", () => {
      expect(spm.placeForComputer).toHaveBeenCalledTimes(0);
      expect(spm.placeForHuman).toHaveBeenCalledTimes(0);
      expect(ShipFactory.createFleet).toHaveBeenCalledTimes(0);
      spm.placeFleet(fakeBoard, null, true, null);
      expect(spm.placeForComputer).toHaveBeenCalledTimes(1);
      expect(spm.placeForHuman).toHaveBeenCalledTimes(0);
      expect(ShipFactory.createFleet).toHaveBeenCalledTimes(1);
    });
    it("calls place for human", () => {
      expect(spm.placeForComputer).toHaveBeenCalledTimes(0);
      expect(spm.placeForHuman).toHaveBeenCalledTimes(0);
      expect(ShipFactory.createFleet).toHaveBeenCalledTimes(0);
      spm.placeFleet(fakeBoard, null, false, null);
      expect(spm.placeForComputer).toHaveBeenCalledTimes(0);
      expect(spm.placeForHuman).toHaveBeenCalledTimes(1);
      expect(ShipFactory.createFleet).toHaveBeenCalledTimes(1);
    });
    describe("attaching a callback", () => {
      test("for computer", () => {
        spm.placeFleet(fakeBoard, null, true, fakeCallback);
        expect(spm.onDoneCallback).toBe(fakeCallback);
        expect(fakeCallback).toHaveBeenCalledTimes(1);
      });
      test("for human", () => {
        spm.placeFleet(fakeBoard, null, false, fakeCallback);
        expect(spm.onDoneCallback).toBe(fakeCallback);
        expect(fakeCallback).not.toHaveBeenCalled();
      });
    });
  });
  describe("placing for computer", () => {
    it("places ships", () => {
      spm.placeForComputer(fakeBoard, null, fakeShips);
      expect(fakeBoard.placeShip).toHaveBeenCalledTimes(2);
    });
  });
  describe("placing for human", () => {
    const boardContainer = "fakeBoardContainer";
    it("attaches click and hover listeners to the board", () => {
      spm.placeFleet(fakeBoard, boardContainer, false, null);
      expect(fakeUI.onCellClick).toHaveBeenCalledTimes(1);
      expect(fakeUI.onCellHover).toHaveBeenCalledTimes(1);
      expect(fakeUI.attachOnBoardClick).toHaveBeenCalledWith(boardContainer);
      expect(fakeUI.attachOnBoardHover).toHaveBeenCalledWith(boardContainer);
    });
    describe("placeShipAt calling Board.placeShip", () => {
      test("successful placement", () => {
        expect(spm.placeShipAt(fakeBoard, 0, 0, fakeShips[0])).toBe(1);
        expect(fakeBoard.placeShip).toHaveBeenCalledTimes(1);
        expect(fakeBoard.placeShip).toHaveBeenCalledWith(
          0,
          0,
          true,
          fakeShips[0],
        );
      });
      test("unsuccessful placement", () => {
        fakeBoard.placeShip.mockReturnValue(false);
        expect(spm.placeShipAt(fakeBoard, 0, 0, fakeShips[0])).toBe(0);
        expect(fakeBoard.placeShip).toHaveBeenCalledTimes(1);
      });
    });
    describe("callbacks", () => {
      describe("click callback", () => {
        let clickHandler;
        beforeEach(() => {
          // Capture the callback
          fakeUI.onCellClick.mockImplementation(
            (callback) => (clickHandler = callback),
          );
          spm.placeForHuman(fakeBoard, null, fakeShips);
        });

        it("calls placeAShipAt with x,y on left click", () => {
          jest.spyOn(spm, "placeShipAt");

          expect(spm.placeShipAt).toHaveBeenCalledTimes(0);
          clickHandler({ preventDefault: () => {}, button: 0 }, 0, 1);
          expect(spm.placeShipAt).toHaveBeenCalledTimes(1);
          expect(spm.placeShipAt).toHaveBeenCalledWith(
            fakeBoard,
            0,
            1,
            fakeShips[0],
          );
        });
        it("changes direction on right click", () => {
          jest.spyOn(spm, "changeDirection");

          expect(spm.changeDirection).toHaveBeenCalledTimes(0);
          clickHandler({ preventDefault: () => {}, button: 2 }, 0, 0);
          expect(spm.changeDirection).toHaveBeenCalledTimes(1);
        });
      });
      describe("hover callback", () => {
        let clickHandler;
        let hoverHandler;
        const boardContainer = "fakeBoardContainer";
        beforeEach(() => {
          // Capture the callback
          fakeUI.onCellHover.mockImplementation(
            (callback) => (hoverHandler = callback),
          );
          fakeUI.onCellClick.mockImplementation(
            (callback) => (clickHandler = callback),
          );
          spm.placeForHuman(fakeBoard, boardContainer, fakeShips);
        });

        it("should check if can place ship on Board", () => {
          hoverHandler(null, 0, 1);
          expect(fakeBoard.canPlaceShip).toHaveBeenCalledTimes(1);
          expect(fakeBoard.canPlaceShip).toHaveBeenCalledWith(
            0,
            1,
            true,
            fakeShips[0].size,
          );
        });
        it("should highlight a valid ship", () => {
          hoverHandler(null, 0, 1);
          expect(fakeUI.highlightShip).toHaveBeenCalledTimes(1);
          expect(fakeUI.highlightShip).toHaveBeenCalledWith(
            boardContainer,
            0,
            1,
            true,
            fakeShips[0].size,
            BOARD_SIZE,
            true,
          );
        });
        it("should highlight an invalid ship", () => {
          // Mock invalid placement
          fakeBoard.canPlaceShip.mockReturnValue(false);
          hoverHandler(null, 0, 1);
          expect(fakeUI.highlightShip).toHaveBeenCalledTimes(1);
          expect(fakeUI.highlightShip).toHaveBeenCalledWith(
            boardContainer,
            0,
            1,
            true,
            fakeShips[0].size,
            BOARD_SIZE,
            false,
          );
        });
        it("uses next ship on successful placement", () => {
          clickHandler({ preventDefault: () => {}, button: 0 }, 0, 0);
          hoverHandler(null, 1, 1);
          expect(fakeUI.highlightShip).toHaveBeenCalledTimes(1);
          expect(fakeUI.highlightShip).toHaveBeenCalledWith(
            boardContainer,
            1,
            1,
            true,
            fakeShips[1].size,
            BOARD_SIZE,
            true,
          );
        });
      });
    });
    describe("placing ships", () => {
      let clickHandler;
      const boardContainer = "fakeBoardContainer";
      beforeEach(() => {
        // Capture the callback
        fakeUI.onCellClick.mockImplementation(
          (callback) => (clickHandler = callback),
        );

        spm.placeFleet(fakeBoard, boardContainer, false, fakeCallback);
      });

      it("uses the same ship after failed placement", () => {
        jest.spyOn(spm, "placeShipAt");

        // Mock failed placement
        fakeBoard.placeShip.mockReturnValue(false);

        clickHandler({ preventDefault: () => {}, button: 0 }, 0, 0);
        expect(spm.placeShipAt).toHaveBeenCalledWith(
          fakeBoard,
          0,
          0,
          fakeShips[0],
        );
        clickHandler({ preventDefault: () => {}, button: 0 }, 1, 0);
        expect(spm.placeShipAt).toHaveBeenCalledWith(
          fakeBoard,
          1,
          0,
          fakeShips[0],
        );
      });

      it("uses next ship after successful placement", () => {
        jest.spyOn(spm, "placeShipAt");

        clickHandler({ preventDefault: () => {}, button: 0 }, 0, 0);
        expect(spm.placeShipAt).toHaveBeenCalledWith(
          fakeBoard,
          0,
          0,
          fakeShips[0],
        );
        clickHandler({ preventDefault: () => {}, button: 0 }, 1, 0);
        expect(spm.placeShipAt).toHaveBeenCalledWith(
          fakeBoard,
          1,
          0,
          fakeShips[1],
        );
      });
      describe("all ships placed", () => {
        it("should call the callback", () => {
          expect(fakeCallback).toHaveBeenCalledTimes(0);
          clickHandler({ preventDefault: () => {}, button: 0 }, 0, 0);
          expect(fakeCallback).toHaveBeenCalledTimes(0);
          clickHandler({ preventDefault: () => {}, button: 0 }, 1, 0);
          expect(fakeCallback).toHaveBeenCalledTimes(1);
        });

        it("should detach event listeners", () => {
          expect(fakeUI.detachOnBoardClick).toHaveBeenCalledTimes(0);
          expect(fakeUI.detachOnBoardHover).toHaveBeenCalledTimes(0);
          clickHandler({ preventDefault: () => {}, button: 0 }, 0, 0);
          expect(fakeUI.detachOnBoardClick).toHaveBeenCalledTimes(0);
          expect(fakeUI.detachOnBoardHover).toHaveBeenCalledTimes(0);
          clickHandler({ preventDefault: () => {}, button: 0 }, 1, 0);
          expect(fakeUI.detachOnBoardClick).toHaveBeenCalledTimes(1);
          expect(fakeUI.detachOnBoardHover).toHaveBeenCalledTimes(1);
          expect(fakeUI.detachOnBoardClick).toHaveBeenCalledWith(
            boardContainer,
          );
          expect(fakeUI.detachOnBoardHover).toHaveBeenCalledWith(
            boardContainer,
          );
        });
      });
    });
  });
  describe("generating random placement", () => {
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
    spm.changeDirection();
    expect(spm.horizontal).toBe(true);
  });
});
