let readline = require("readline-sync");

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "O";

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }
}

class Board {
  constructor() {
    this.reset();
  }

  reset() {
    this.squares = {};
    for (let counter = 1; counter <= 9; ++counter) {
      this.squares[String(counter)] = new Square();
    }
  }

  display() {
    console.log("");
    console.log("     |     |");
    console.log(`  ${this.squares["1"]}  |  ${this.squares["2"]}  |  ${this.squares["3"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["4"]}  |  ${this.squares["5"]}  |  ${this.squares["6"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["7"]}  |  ${this.squares["8"]}  |  ${this.squares["9"]}`);
    console.log("     |     |");
    console.log("");
  }

  displayWithClear() {
    console.clear();
    console.log("");
    this.display();
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  isUnusedSquare(key) {
    return this.squares[key].isUnused();
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
    this.score = 0;
  }

  getMarker() {
    return this.marker;
  }

  getScore() {
    return this.score;
  }

  incrementScore() {
    this.score += 1;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTGame {
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
    this.firstPlayer = this.human;
  }

  static POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
  ];

  static MAX_WINS = 3;

  static ALLOWED_RESPONSES = ['yes', 'y', 'no', 'n'];

  static joinOr(inArray, delimeter = ',', conjunction = 'or') {
    delimeter = delimeter.trim().concat(' ');
    conjunction = conjunction.trim().concat(' ');

    switch (inArray.length) {
      case 0:
        return '';
      case 1:
        return String(inArray);
      case 2:
        return inArray.join(' ' + conjunction);
      default:
        return inArray.slice(0,-1).join(delimeter)
          .concat(delimeter, conjunction, inArray.slice(-1));
    }
  }

  updateScores() {
    if (this.isWinner(this.human)) this.human.incrementScore();
    else if (this.isWinner(this.computer)) this.computer.incrementScore();
  }

  displayScores() {
    console.log(`The current score is human: ${this.human.score}, computer: ${this.computer.score}`);
  }

  playRound() {
    this.board.reset();
    this.board.displayWithClear();
    let currentPlayer = this.firstPlayer;

    while (true) {
      this.playerMoves(currentPlayer);
      if (this.gameOver()) break;

      this.board.displayWithClear();
      currentPlayer = this.alternatePlayer(currentPlayer);
    }

    this.board.displayWithClear();
    this.displayResults();
  }

  playMatch() {
    while (true) {
      this.playRound();
      this.updateScores();
      this.displayScores();
      if (this.matchOver()) break;
      if (this.shouldQuit()) break;
      this.firstPlayer = this.alternatePlayer(this.firstPlayer);
    }

    if (this.matchOver()) {
      this.displayMatchWinner();
    }
  }

  play() {
    this.displayWelcomeMessage();
    this.playMatch();
    this.displayGoodbyeMessage();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to Tic Tac Toe!');
    console.log(`First player to win ${TTTGame.MAX_WINS} wins the match.`);
    console.log("");
    readline.question('Press RETURN/ENTER to continue.');
  }

  displayGoodbyeMessage() {
    console.log('Thanks for playing Tic Tac Toe! Goodbye!');
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
    } else if (this.isWinner(this.computer)) {
      console.log("I won! I won! Take that, human!");
    } else {
      console.log("A tie game. How boring.");
    }
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${TTTGame.joinOr(validChoices)}): `;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  playerMoves(player) {
    if (player === this.human) {
      this.humanMoves();
    } else {
      this.computerMoves();
    }
  }

  alternatePlayer(currentPlayer) {
    if (currentPlayer === this.human) return this.computer;
    else return this.human;
  }

  defensiveComputerMove() {
    return this.findCriticalSquare(this.human);
  }

  offensiveComputerMove() {
    return this.findCriticalSquare(this.computer);
  }

  findCriticalSquare(player) {
    for (let index = 0; index < TTTGame.POSSIBLE_WINNING_ROWS.length; ++index) {
      let row = TTTGame.POSSIBLE_WINNING_ROWS[index];
      let key = this.criticalSquare(row, player);
      if (key) return key;
    }

    return null;
  }

  criticalSquare(row, player) {
    if (this.board.countMarkersFor(player, row) === 2) {
      let index = row.findIndex(key => this.board.isUnusedSquare(key));
      if (index >= 0) return row[index];
    }

    return null;
  }

  computerMoves() {
    let choice = this.offensiveComputerMove();

    if (!choice) {
      choice = this.defensiveComputerMove();
    }

    if (!choice) {
      choice = this.pickCenterSquare();
    }

    if (!choice) {
      choice = this.pickRandomSquare();
    }

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  pickCenterSquare() {
    if (this.board.isUnusedSquare("5")) return "5";
    return null;
  }

  pickRandomSquare() {
    let validChoices = this.board.unusedSquares();
    let choice;

    do {
      choice = Math.floor((9 * Math.random()) + 1).toString();
    } while (!validChoices.includes(choice));

    return choice;
  }

  matchOver() {
    return this.isMatchWinner(this.human) || this.isMatchWinner(this.computer);
  }

  isMatchWinner(player) {
    return player.getScore() >= TTTGame.MAX_WINS;
  }

  displayMatchWinner() {
    let matchWinner = this.isMatchWinner(this.human) ? 'Human' : 'Computer'
    console.log(`${matchWinner} wins the match!`);
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  shouldQuit() {
    console.log('Play again? (yes/no)');
    let answer = readline.question().toLowerCase();

    while (!TTTGame.ALLOWED_RESPONSES.includes(answer)) {
      console.log("Please type 'yes' or 'no'");
      answer = readline.question().toLowerCase();
    }

    return answer[0] === 'n';
  }
}

let game = new TTTGame();
game.play();