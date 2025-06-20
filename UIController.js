import { EMPTY, MISS } from "./Gameboard.js";

export class UIController {
  constructor(boardContainer1, boardContainer2) {
    this.cells = [];

    this.boardContainer1 = boardContainer1;
    this.boardContainer2 = boardContainer2;

    this.boundBoardClickHandler = this.handleBoardClick.bind(this);
    this.boundBoardHoverHandler = this.handleBoardHover.bind(this);
  }

  renderBoard(board, boardContainer, isCurrentPlayer, showShips = false) {
    boardContainer.innerHTML = "";
    const boardSize = board.size;
    this.cells = [];

    // NOTE: Current player is attacking not current player
    // TODO: classList.toggle()
    if (!isCurrentPlayer) {
      boardContainer.classList.add("activated");
      boardContainer.classList.remove("deactivated");
      this.attachOnBoardClick(boardContainer);
      // boardContainer.classList.replace("deactivated", "activated");
    } else {
      // boardContainer.classList.replace("activated", "deactivated");
      boardContainer.classList.remove("activated");
      boardContainer.classList.add("deactivated");
      this.detachOnBoardClick(boardContainer);
    }

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = i;
        cell.dataset.y = j;

        const boardCellValue = board.cells[i][j];
        switch (boardCellValue) {
          case EMPTY:
            break;
          case MISS:
            cell.classList.add("miss");
            cell.innerText = "•";
            break;
          default:
            const ship = board.shipEntries[boardCellValue].ship;

            if (ship.hits.some(([hitX, hitY]) => hitX === i && hitY === j)) {
              if (ship.isSunk()) cell.classList.add("hit");
              cell.innerText = "❌";
            }
            if (!isCurrentPlayer && showShips) cell.classList.add("ship");
            break;
        }

        boardContainer.appendChild(cell);
      }
    }
  }

  render(player1, player2, currentPlayer, showShips = false) {
    this.renderBoard(
      player1.board,
      this.boardContainer1,
      player1 === currentPlayer,
      showShips,
    );
    this.renderBoard(
      player2.board,
      this.boardContainer2,
      player2 === currentPlayer,
      showShips,
    );
  }

  clearHighlights(boardContainer) {
    boardContainer
      .querySelectorAll(".placement-good, .placement-bad")
      .forEach((cell) => {
        cell.classList.remove("placement-good", "placement-bad");
      });
  }

  highlightShip(
    boardContainer,
    x,
    y,
    isHorizontal,
    shipSize,
    boardSize,
    isValid,
  ) {
    this.clearHighlights(boardContainer);

    const placementClass = isValid ? "placement-good" : "placement-bad";
    let limit;

    if (isHorizontal) {
      limit = Math.min(y + shipSize, boardSize);
      for (let j = y; j < limit; j++) {
        boardContainer
          .querySelector(`[data-x="${x}"][data-y="${j}"]`)
          .classList.add(placementClass);
      }
    } else {
      limit = Math.min(x + shipSize, boardSize);
      for (let i = x; i < limit; i++) {
        boardContainer
          .querySelector(`[data-x="${i}"][data-y="${y}"]`)
          .classList.add(placementClass);
      }
    }
  }

  // attachOnClickToCell(cell) {
  //   const x = Number(cell.dataset.x);
  //   const y = Number(cell.dataset.y);
  //   cell.addEventListener("mousedown", (e) => {
  //     if (this.cellClickHandler) this.cellClickHandler(e, x, y);
  //   });
  // }

  attachOnBoardHover(board) {
    board.addEventListener("mouseover", this.boundBoardHoverHandler);
  }

  detachOnBoardHover(board) {
    board.removeEventListener("mouseover", this.boundBoardHoverHandler);
  }

  attachOnBoardClick(board) {
    board.addEventListener("mousedown", this.boundBoardClickHandler);
  }

  detachOnBoardClick(board) {
    board.removeEventListener("mousedown", this.boundBoardClickHandler);
  }

  handleBoardClick(e) {
    const cell = e.target.closest(".cell");
    if (!cell) return;
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);
    if (this.cellClickHandler) this.cellClickHandler(e, x, y);
  }

  handleBoardHover(e) {
    const cell = e.target.closest(".cell");
    if (!cell) return;
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);
    if (this.cellHoverHandler) this.cellHoverHandler(e, x, y);
  }

  // Register a callback for mouse click
  // Callback will receive (event, cell.dataset.x, cell.dataset.y)
  onCellClick(callback) {
    if (typeof callback !== "function") return;
    this.cellClickHandler = callback;
  }

  // Register a callback for mouse hover
  // Callback will receive (event, cell.dataset.x, cell.dataset.y)
  onCellHover(callback) {
    if (typeof callback !== "function") return;
    this.cellHoverHandler = callback;
  }
}
