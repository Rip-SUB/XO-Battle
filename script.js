document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const status = document.getElementById("status");
    const restartBtn = document.getElementById("restart");
    const themeToggle = document.getElementById("themeToggle");
    const aiToggle = document.getElementById("aiToggle");
    const winSound = document.getElementById("winSound");
    const clickSound = document.getElementById("clickSound");

    let cells = Array.from(document.getElementsByClassName("cell"));
    let currentPlayer = "X";
    let boardState = Array(9).fill(null);
    let gameActive = true;
    let vsAI = false;

    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                pattern.forEach(index => cells[index].classList.add("win"));
                status.textContent = `Player ${currentPlayer} Wins! 🎉`;
                winSound.play();
                gameActive = false;
                return true;
            }
        }
        if (!boardState.includes(null)) {
            status.textContent = "It's a Draw! 🤝";
            gameActive = false;
            return true;
        }
        return false;
    }

    function handleClick(e) {
        const index = e.target.dataset.index;
        if (!gameActive || boardState[index]) return;
        boardState[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        clickSound.play();
        if (checkWin()) return;
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        status.textContent = `Player ${currentPlayer}'s turn`;
        if (vsAI && currentPlayer === "O") setTimeout(aiMove, 500);
    }

    function aiMove() {
        let bestMove = minimax(boardState, "O").index;
        boardState[bestMove] = "O";
        cells[bestMove].textContent = "O";
        clickSound.play();
        if (checkWin()) return;
        currentPlayer = "X";
        status.textContent = "Player X's turn";
    }

    function minimax(newBoard, player) {
        let emptyCells = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        if (checkWinner(newBoard, "X")) return { score: -10 };
        if (checkWinner(newBoard, "O")) return { score: 10 };
        if (emptyCells.length === 0) return { score: 0 };
        
        let moves = [];
        for (let i of emptyCells) {
            let move = {};
            move.index = i;
            newBoard[i] = player;
            let result = minimax(newBoard, player === "O" ? "X" : "O");
            move.score = result.score;
            newBoard[i] = null;
            moves.push(move);
        }
        
        let bestMove;
        if (player === "O") {
            let bestScore = -Infinity;
            for (let move of moves) {
                if (move.score > bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let move of moves) {
                if (move.score < bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
            }
        }
        return bestMove;
    }

    function checkWinner(board, player) {
        return [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ].some(pattern => pattern.every(index => board[index] === player));
    }

    function restartGame() {
        boardState.fill(null);
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("win");
        });
        currentPlayer = "X";
        gameActive = true;
        status.textContent = "Player X's turn";
    }

    function toggleTheme() {
        document.body.classList.toggle("dark-mode");
        document.body.classList.toggle("neon-mode");
    }

    function toggleAI() {
        vsAI = !vsAI;
        aiToggle.textContent = vsAI ? "🎭 Play vs Player" : "🤖 Play vs AI";
        restartGame();
    }

    cells.forEach(cell => cell.addEventListener("click", handleClick));
    restartBtn.addEventListener("click", restartGame);
    themeToggle.addEventListener("click", toggleTheme);
    aiToggle.addEventListener("click", toggleAI);
});
