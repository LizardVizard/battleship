/**
 * @jest-environment jsdom
 */

import { Player } from "./Player.js";
import { Ship } from "./Ship.js";
import { UIController } from "./UIController.js";

describe("UI controller", () => {
  const BOARD_SIZE = 3;
  let ui;
  let player1;
  let player2;

  const boardContainer1 = {
    appendChild: jest.fn(() => {}),
    addEventListener: jest.fn(() => {}),
    removeEventListener: jest.fn(() => {}),
    classList: { add: jest.fn(() => {}), remove: jest.fn(() => {}) },
  };
  const boardContainer2 = {
    appendChild: jest.fn(() => {}),
    addEventListener: jest.fn(() => {}),
    removeEventListener: jest.fn(() => {}),
    classList: { add: jest.fn(() => {}), remove: jest.fn(() => {}) },
  };

  describe("rendering", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      player1 = new Player(BOARD_SIZE, false, "Player");
      player2 = new Player(BOARD_SIZE, true, "Computer");
      ui = new UIController(boardContainer1, boardContainer2);
    });
    it("appends proper count of cells to the container element", () => {
      ui.renderBoard(player1.board, boardContainer1, false, false);
      expect(boardContainer1.appendChild).toHaveBeenCalledTimes(
        BOARD_SIZE * BOARD_SIZE,
      );
    });

    it("changes class depending on current player", () => {
      let isCurrentPlayer = false;
      ui.renderBoard(player1.board, boardContainer1, isCurrentPlayer, false);
      expect(boardContainer1.classList.add).toHaveBeenCalledWith("activated");
      expect(boardContainer1.classList.remove).toHaveBeenCalledWith(
        "deactivated",
      );

      isCurrentPlayer = true;
      ui.renderBoard(player1.board, boardContainer1, isCurrentPlayer, false);
      expect(boardContainer1.classList.add).toHaveBeenCalledWith("deactivated");
      expect(boardContainer1.classList.remove).toHaveBeenCalledWith(
        "activated",
      );
    });

    it("render both boards, with correct current player boolean", () => {
      jest.spyOn(ui, "renderBoard");

      const currentPlayer = player2;

      ui.render(player1, player2, currentPlayer, false);
      expect(ui.renderBoard).toHaveBeenCalledTimes(2);
      expect(ui.renderBoard.mock.calls[0]).toEqual([
        player1.board,
        boardContainer1,
        player1 === currentPlayer,
        false,
      ]);
      expect(ui.renderBoard.mock.calls[1]).toEqual([
        player2.board,
        boardContainer2,
        player2 === currentPlayer,
        false,
      ]);
    });

    it("can show ships", () => {
      const ship = new Ship(1);
      const x = 1;
      const y = 2;
      player1.board.placeShip(x, y, true, ship);

      let cell;
      const container = document.createElement("div");

      let showShips = false;
      ui.renderBoard(player1.board, container, false, showShips);
      cell = container.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      expect(cell.classList.contains("ship")).toBe(showShips);

      showShips = true;
      ui.renderBoard(player1.board, container, false, showShips);
      cell = container.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      expect(cell.classList.contains("ship")).toBe(showShips);
    });

    describe("ship highlight", () => {
      let container;
      let cell;
      beforeEach(() => {
        container = document.createElement("div");
        cell = document.createElement("div");
        cell.dataset.x = 0;
        cell.dataset.y = 0;
        container.appendChild(cell);
        document.body.appendChild(container);
      });

      afterEach(() => {
        document.body.removeChild(container);
      });

      it("highlights bad placement", () => {
        expect(cell.classList.contains("placement-bad")).toBe(false);
        ui.highlightShip(container, 0, 0, true, 1, 1, false);
        expect(cell.classList.contains("placement-bad")).toBe(true);
      });
      it("highlights good placement", () => {
        expect(cell.classList.contains("placement-good")).toBe(false);
        ui.highlightShip(container, 0, 0, true, 1, 1, true);
        expect(cell.classList.contains("placement-good")).toBe(true);
      });
      it("removes highlights", () => {
        ui.highlightShip(container, 0, 0, true, 1, 1, true);
        ui.clearHighlights(container);
        expect(cell.classList.contains("placement-good")).toBe(false);
      });
    });

    describe("event listeners", () => {
      describe("click event listener", () => {
        it("attaches the listener when player is the current player", () => {
          jest.spyOn(ui, "attachOnBoardClick");
          const expectedClickHandler = ui.boundBoardClickHandler;
          const isCurrentPlayer = false;

          ui.renderBoard(
            player1.board,
            boardContainer1,
            isCurrentPlayer,
            false,
          );

          expect(ui.attachOnBoardClick).toHaveBeenCalledWith(boardContainer1);
          expect(boardContainer1.addEventListener).toHaveBeenCalledWith(
            "mousedown",
            expectedClickHandler,
          );
        });
        it("detaches the listener when the player is not the current player", () => {
          jest.spyOn(ui, "detachOnBoardClick");
          const isCurrentPlayer = true;
          const expectedClickHandler = ui.boundBoardClickHandler;

          ui.renderBoard(
            player1.board,
            boardContainer1,
            isCurrentPlayer,
            false,
          );

          expect(ui.detachOnBoardClick).toHaveBeenCalledWith(boardContainer1);
          expect(boardContainer1.removeEventListener).toHaveBeenCalledWith(
            "mousedown",
            expectedClickHandler,
          );
        });
        describe("hover event listener", () => {
          it("attaches and detached the listener", () => {
            jest.spyOn(ui, "attachOnBoardHover");
            jest.spyOn(boardContainer1, "addEventListener");

            const cb = () => {};
            ui.onCellHover(cb);
            const expectedHoverHandler = ui.boundBoardHoverHandler;

            ui.attachOnBoardHover(boardContainer1);

            expect(ui.attachOnBoardHover).toHaveBeenCalledWith(boardContainer1);
            expect(boardContainer1.addEventListener).toHaveBeenCalledWith(
              "mouseover",
              expectedHoverHandler,
            );

            // Reset to untouched state
            ui.cellHoverHandler = undefined;
            ui.detachOnBoardHover(boardContainer1);

            expect(boardContainer1.removeEventListener).toHaveBeenCalledWith(
              "mouseover",
              expectedHoverHandler,
            );
          });
        });
      });
    });
  });

  describe("attaching of callbacks to handlers", () => {
    it("attaches click callback", () => {
      expect(ui.cellClickHandler).toBeUndefined();
      ui.onCellClick("not a function");
      expect(ui.cellClickHandler).toBeUndefined();

      const cb = () => {};
      ui.onCellClick(cb);
      expect(ui.cellClickHandler).toBe(cb);
    });

    it("attaches hover callback", () => {
      expect(ui.cellHoverHandler).toBeUndefined();
      ui.onCellHover("not a function");
      expect(ui.cellHoverHandler).toBeUndefined();

      const cb = () => {};
      ui.onCellHover(cb);
      expect(ui.cellHoverHandler).toBe(cb);
    });
  });

  describe("calling handlers with cell data", () => {
    const fakeCell = { dataset: { x: 1, y: 2 } };
    const fakeEvent = { target: { closest: () => fakeCell } };

    it("calls click handler", () => {
      ui.onCellClick(jest.fn());

      ui.handleBoardClick(fakeEvent);
      expect(ui.cellClickHandler).toHaveBeenCalledWith(fakeEvent, 1, 2);
    });
    it("calls hover handler", () => {
      ui.onCellHover(jest.fn());

      ui.handleBoardHover(fakeEvent);
      expect(ui.cellHoverHandler).toHaveBeenCalledWith(fakeEvent, 1, 2);
    });
    it("doesn't call handlers when cell is not found", () => {
      fakeEvent.target.closest = () => null;

      ui.onCellClick(jest.fn());
      ui.onCellHover(jest.fn());

      ui.handleBoardClick(fakeEvent);
      expect(ui.cellClickHandler).not.toHaveBeenCalled();

      ui.handleBoardHover(fakeEvent);
      expect(ui.cellHoverHandler).not.toHaveBeenCalled();
    });
  });
});
