let GameBoard = (function (){
    let board = ["","","","","","","","",""];
    const getBoard = () => board;
    const newBoard = () => {
        clearBoard();
        displayController.displayNewBoard();
    }
    const clearBoard = () => {
        board = ["","","","","","","","",""]
        const myNode = document.querySelector(".game-board");
        while (myNode.firstChild) {
          myNode.removeChild(myNode.lastChild);
        }
    }

    const updateBoard = () => {
        for (let i = 0; i < board.length; i++)
        {
            board[i] = document.querySelector(`div[data-index = "${i}"]`).textContent;
        }
    };
    return {getBoard, newBoard, updateBoard};
})();

const Player = (symbol,id_number) => {
    const id = id_number;
    const marker = symbol;
    let name;
    let score = 0;
    const getId = () => id;
    const getMarker = () => marker;
    const getName = () => {
        updateName();
        return name;
    }
    const updateName = () => {
        name = document.querySelector(`#${id}-name`).value      
    }
    const roundWin = () => {
        score += 1;
        displayController.updateScoreDiv(id,score);
    };
    const resetScore = () => {
        score = 0;
        displayController.updateScoreDiv(id,score);
    };
    return {getMarker, roundWin, resetScore,getId,getName,updateName}
};

const displayController = (function () {
    const addHover = (e) => {
        const tile = e.currentTarget;
        tile.classList.add("hover");
    };
    const updateScoreDiv = (id,score) => {
        const scoreDiv = document.querySelector(`#${id}-score`)
        scoreDiv.textContent = "Score: " + score;        
    }
    const resetLogs = () => {
        const logs = document.querySelector(".result-logs");
        while (logs.firstChild) {
            logs.removeChild(logs.lastChild);
        };
    }
    const displayNewBoard = () => {
        const web_board = document.querySelector(".game-board");
        const gameBoard = GameBoard.getBoard();
        for (let i = 0; i < gameBoard.length; i++)
        {
            const div = document.createElement("div");
            div.textContent = gameBoard[i];
            div.classList.add("board-tile");
            div.setAttribute("data-index", i);
            web_board.appendChild(div);
        }
    }
    const announceWinner = (winner) => {
        const results = document.querySelector(".result-logs");
        const div = document.createElement("div");
        const board_tiles = document.querySelectorAll(".board-tile");
        board_tiles.forEach(tile => tile.removeEventListener("click", gameController.playerMove));
        if (winner === "none") {
            div.textContent = "Tie Game";
            results.appendChild(div);
            return;
        }
        const name = winner.getName();
        if (!name)
        {
            div.textContent = `${winner.getId().toUpperCase()} is the winner`;
        }
        else {
            div.textContent = `${name} is the winner.`;
        }
        results.appendChild(div);
    } 

    const createEventListeners = () => {
        const start = document.querySelector(".start");
        start.addEventListener("click", gameController.startGame);
        
        const reset = document.querySelector(".reset");
        reset.addEventListener("click", gameController.resetGame);
        
        const p1 = document.querySelector("#p1-name");
        p1.addEventListener("keyup", function (e) {
            if (e.keyCode === 13)
            {
                this.blur();
            }
        });
        const p2 = document.querySelector("#p2-name");
        p2.addEventListener("keyup", function (e) {
            if (e.keyCode === 13)
            {
                this.blur();
            }
        });
    }
    return {displayNewBoard,addHover,resetLogs,announceWinner,updateScoreDiv,createEventListeners}   
})();

const gameController = (function () {
    const player1 = Player("X","p1");
    const player2 = Player("O","p2");
    let winner;
    let p1_turn;
    let p2_turn;
    const startGame = () => {
        GameBoard.newBoard();
        p1_turn = true;
        p2_turn = false;
        winner = undefined;
        game();
    };   

    const game = () => {
        const board_tiles = document.querySelectorAll(".board-tile");
        board_tiles.forEach(tile => {

            tile.addEventListener("mouseover", displayController.addHover);
            tile.addEventListener("mouseout", () => {
                tile.classList.remove("hover")
            });
            tile.addEventListener("click", playerMove, {once: true});
        });
    
    };
    const playerMove = (e) => {
        const tile = e.currentTarget;
        tile.removeEventListener("mouseover", displayController.addHover);
        if (p1_turn === true)
        {
            tile.textContent = player1.getMarker();
            p1_turn = false;
            p2_turn = true;
        }
        else
        {
            tile.textContent = player2.getMarker();
            p2_turn = false;
            p1_turn = true;
        }
        GameBoard.updateBoard();
        if (checkGameOver() == true)
        {
            console.log(winner);
            if (winner === player1.getMarker())
            {
                winner = player1;
                winner.roundWin();
            }
            else if (winner === player2.getMarker())
            {
                winner = player2;
                winner.roundWin();         
            }
            else {
                winner = "none";
            }
            console.log(winner);
            displayController.announceWinner(winner)

        }
    }
    const checkGameOver = () => {
        const board = GameBoard.getBoard();
        for (let i = 0; i < 3; i++)
        {
            if ((board[i] === board[i+3]) && (board[i] === board[i+6]) && board[i] !== '')
            {
                winner = board[i];
                return true;
            }
        };

        for (let i = 0; i <=6 ; i+=3)
        {
            if ((board[i] === board[i+1]) && (board[i] === board[i+2]) && board[i] !== '')
            {
                winner = board[i];
                return true;
            }
        }
        
        if ((board[0] === board[4] && board[0] === board[8] && board[0] !== ''))
        {
            winner = board[0];
            return true;
        }
        if ((board[2] === board[4] && board[2] === board[6] && board[2] !==''))
        {
            winner = board[2];
            return true;
        }

        if (board.includes("")) {
            return false;
        }
        else {
            winner = "none"
            return true;
        }
    };
    const resetGame = () => {
        player1.resetScore();
        player2.resetScore();
        displayController.resetLogs();
        startGame();
    };
    return {startGame,resetGame,playerMove}
})();

displayController.createEventListeners();
gameController.startGame();





