import { EMPTY, MISS } from "./Gameboard.js";

export class UIController {
  constructor(board1, board2) {
    this.cells = [];

    this.boardContainer1 = board1;
    this.boardContainer2 = board2;
  }

  renderBoard(board, boardContainer, isCurrentPlayer, showShips = false) {
    boardContainer.innerHTML = "";
    const boardSize = board.size;
    this.cells = [];

    // TODO: classList.toggle()
    if (!isCurrentPlayer) {
      boardContainer.classList.add("activated");
      boardContainer.classList.remove("deactivated");
      // boardContainer.classList.replace("deactivated", "activated");
    } else {
      // boardContainer.classList.replace("activated", "deactivated");
      boardContainer.classList.remove("activated");
      boardContainer.classList.add("deactivated");
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

        if (!isCurrentPlayer) this.attachOnClickToCell(cell);
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

  attachOnClickToCell(cell) {
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);
    cell.addEventListener("mousedown", (e) => {
      if (this.cellClickHandler) this.cellClickHandler(e, x, y);
    });
  }

  onCellClick(callback) {
    this.cellClickHandler = callback;
  }

  // TODO: Maybe add ship placement visualisation
  attachOnHoverToCell(cell) {
    cell.addEventListener("hover", (e) => {
      if (this.cellHoverHandler) this.cellHoverHandler(e, cell);
    });
  }

  onCellHover(callback) {
    this.cellHoverHandler = callback;
  }
}
