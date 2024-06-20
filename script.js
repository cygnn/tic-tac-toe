function Gameboard(){
  const board = [];
  for(let i = 0; i < 9; i++){
    board.push(Cell());
  }
  const checkforWin = () => {
    let stop = false;
    let count = 0;
  
    // CHECK FOR ROWS
    for (let i = 0; i < 3; i++) {
      let j = i * 3;
      if (board[j].getValue() === board[j+1].getValue() && board[j].getValue() === board[j+2].getValue() && board[j].getValue() !== "") {
        if (board[j].getValue() === "x") {
          console.log("Player 1 Wins!");
          return("Player 1")
          stop = true;
        } else if (board[j].getValue() === "o") {
          console.log("Player 2 Wins!");
          return("Player 2")
          stop = true;
        }
      }
      
    }
  
    // CHECK FOR COLUMNS
    for (let z = 0; z < 3; z++) {
      if (board[z].getValue() === board[z+3].getValue() && board[z].getValue() === board[z+6].getValue() && board[z].getValue() !== "") {
        if (board[z].getValue() === "x") {
          console.log("Player 1 Wins!");
          return("Player 1")
          stop = true;
        } else if (board[z].getValue() === "o") {
          console.log("Player 2 Wins!");
          return("Player 2")
          stop = true;
        }
      }
      
    }
  
    // CHECK FOR DIAGONALS
    let x = 8;
    if (board[x].getValue() === board[x-4].getValue() && board[x-4].getValue() === board[x-8].getValue() && board[x].getValue() !== "") {
      if (board[x].getValue() === "x") {
        console.log("Player 1 Wins!");
        return("Player 1")
        stop = true;
      } else if (board[x].getValue() === "o") {
        console.log("Player 2 Wins!");
        return("Player 2")
        stop = true;
      }
    }
    
    x = 6;
    if (board[x].getValue() === board[x-4].getValue() && board[x-4].getValue() === board[x-2].getValue() && board[x].getValue() !== "") {
      if (board[x].getValue() === "x") {
        console.log("Player 1 Wins!");
        return("Player 1")
        stop = true;
      } else if (board[x].getValue() === "o") {
        console.log("Player 2 Wins!");
        return("Player 2")
        stop = true;
      }
    }
  
    // CHECK FOR DRAW
    for(let c = 0; c < 9; c++){
      if(board[c].getValue() !== ""){
        count++
        console.log(count)
      }
    }
    if (!stop && count === 9) {
      console.log("It's a draw!");
      stop = true;
      return("Draw")
    }
    return "Play"
  }
  const getBoard = () => board;
  console.log(board);

  const placeValue = (cellNum, value) => {
    if(board[cellNum].getValue() === ""){
      board[cellNum].addToken(value);
      return true;
    }
    console.log("Invalid Move")
    return false;
  }
  const printBoard = () => {
    console.log(board.map((cell) => cell.getValue()));
  }
  return {getBoard, printBoard, placeValue, checkforWin};
}

function Cell() {
    let value = "";
  
    const addToken = (player) => {
      value = player;
    };
  
    const getValue = () => value;
  
    return {
      addToken,
      getValue,
    };
}

  function Gamecontroller(playerOneName = "Player One", playerTwoName = "Player Two"){
    let outcome = false;
    const board = Gameboard();
    const players = [
      {
        name: "Player 1",
        value: "x"
      },
      {
        name: "Player 2",
        value: "o"
      }
    ];
    const setPlayerName = (player1Name, player2Name) =>{
      players[0].name = player1Name;
      players[1].name = player2Name;
    }

    let activePlayer = players[0];
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;
    const resetGame = () =>{
      Gamecontroller();
    }
    const printNewRound = () =>{
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`)
    };

    function playRound(cellNum){
      console.log(`${getActivePlayer().name} placed in cell number ${cellNum}`);
      if(board.placeValue(cellNum, getActivePlayer().value) === true){
        outcome = board.checkforWin();
        console.log(outcome);
        if(outcome === "Play"){
          switchPlayerTurn();
          printNewRound();
        }
      }
    }
    printNewRound();
    return{
      playRound,
      getActivePlayer,
      getBoard: board.getBoard,
      checkforWin: board.checkforWin,
      resetGame,
      setPlayerName
    };
  }

  function ScreenController(){
    const modalcontainer = document.querySelector(".modalcontainer");
    const playAgainBtn = document.querySelector(".playAgain");
    const noBtn = document.querySelector(".no");
    const playerContainer = document.querySelector(".player-name-container");
    const startBtn = document.querySelector(".start")
    const player1Name = document.querySelector("#player1");
    const player2Name = document.querySelector("#player2");
    const turn = document.querySelector(".turn")
    
    const game = Gamecontroller();
    const boardDiv = document.querySelector(".game");

    startBtn.addEventListener('click', () => {
      game.setPlayerName(player1Name.value, player2Name.value)
      playerContainer.classList.remove("show");
      showBoard();
    })

    playAgainBtn.addEventListener('click', () => {
      game.resetGame();
      ScreenController();
      modalcontainer.classList.remove("show");
    })

    noBtn.addEventListener('click', () => {
      modalcontainer.classList.remove("show");
      boardDiv.setAttribute("style", "pointer-events: none")
    })

    function showBoard() {
      boardDiv.textContent = "";
      const board = game.getBoard();

      const getActivePlayer = game.getActivePlayer();
      turn.textContent = `${getActivePlayer.name}'s turn`;
    
      for (let i = 0; i < board.length; i++) {
        const cellBtn = document.createElement("button");
        cellBtn.classList.add('cell');
        cellBtn.dataset.index = i;
        cellBtn.textContent = board[i].getValue(); // Retrieve the current cell value
        if (cellBtn.textContent === ""){
          cellBtn.classList.add('empty')
        }
        else if(cellBtn.textContent.toLowerCase() === "x"){
          cellBtn.classList.add('x')
        }
        else if(cellBtn.textContent.toLowerCase() === 'o'){
          cellBtn.classList.add('o')
        }
        cellBtn.addEventListener('click', (e) => {
          game.playRound(e.target.dataset.index);
          showBoard(); // Refresh the board after each click
          console.log(game.checkforWin())
          if(game.checkforWin() === "Player 1"){
            const winner = document.querySelector('.winner')
            winner.textContent = player1Name.value + " wins the game";
            console.log(player1Name.value);
            modalcontainer.classList.add("show");
          }
          else if (game.checkforWin() === "Player 2"){
            const winner = document.querySelector('.winner')
            winner.textContent = player2Name.value + " wins the game";
            console.log(player1Name.value);
            modalcontainer.classList.add("show");
          }
          else if (game.checkforWin() === "Draw"){
            const winner = document.querySelector('.winner')
            winner.textContent = "DRAW";
            console.log(player1Name.value);
            
            modalcontainer.classList.add("show");
          }
        });
        boardDiv.appendChild(cellBtn);
      }
    }
    
    showBoard();
  }

  ScreenController();