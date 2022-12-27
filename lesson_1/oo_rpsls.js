const readline = require('readline-sync');

const RPSGame = {
  validPlayAgainAnswers: ['yes', 'y', 'no', 'n'],
  choices: {
    rock: {
      winningCombos:  ['scissors',  'lizard'],
      validInput:     ['rock',      'r']
    },
    paper: {
      winningCombos:  ['rock',      'spock'],
      validInput:     ['paper',     'p']
    },
    scissors: {
      winningCombos:  ['paper',     'lizard'],
      validInput:     ['scissors',  'sc']
    },
    lizard: {
      winningCombos:  ['paper',     'spock'],
      validInput:     ['lizard',    'l']
    },
    spock: {
      winningCombos:  ['rock',     'scissors'],
      validInput:     ['spock',     'sp']
    }
  },
  human: createHuman(),
  computer: createComputer(),
  winner: '',
  MAX_SCORE: 3,

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to RPSLS!');
    console.log(`First to  ${this.MAX_SCORE} wins.`);
    console.log('Press RETURN to begin.');
    readline.question();
    console.clear();
  },

  displayGoodbyeMessage() {
    console.clear();
    console.log('Thanks for playing RPSLS. Goodbye!');
  },

  determineWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if (humanMove === computerMove) {
      this.winner = 'tie';
    } else if (this.choices[humanMove].winningCombos.includes(computerMove)) {
      this.winner = 'human';
    } else {
      this.winner = 'computer';
    }
  },

  displayWinner() {
    console.log(`\nYou chose: ${this.human.move}`);
    console.log(`The computer chose: ${this.computer.move}\n`);

    if (this.winner === 'human') {
      console.log('You win!');
    } else if (this.winner === 'computer') {
      console.log('Computer wins!');
    } else {
      console.log("It's a tie.");
    }
  },

  updateScore() {
    if (this.winner === 'human') {
      this.human.incrementScore(1);
    } else if (this.winner === 'computer') {
      this.computer.incrementScore(1);
    }
  },

  maxScoreReached() {
    return (this.human.score === this.MAX_SCORE ||
      this.computer.score === this.MAX_SCORE);
  },

  displayScore() {
    let humanScore = this.human.score;
    let computerScore = this.computer.score;
    console.log('');
    console.log('The current score is');
    console.log(`       you: ${humanScore}`);
    console.log(`  computer: ${computerScore}`);
    console.log('');
    if (humanScore === this.MAX_SCORE) {
      console.log('User has won best of five!! Scores will be reset.');
    } else if (computerScore === this.MAX_SCORE) {
      console.log('Computer has won best of five!! Scores will be reset.');
    }
  },

  displayHistory() {
    // TODO: clean up presentation
    // TODO: add round winner

    console.log('\n\n*********** Game History ************\n');
    console.log('Round | Your Choice | Computer Choice');
    console.log('______|_____________|________________');
    this.human.moveHistory.forEach( (elem, idx) => {
      let roundNum = String(idx + 1);
      let leftPad = ' '.repeat(4 - roundNum.length);
      let rightPad = '  ';
      let historyRow = leftPad + roundNum + rightPad + '|';

      let youChoice = elem;
      leftPad = ' '.repeat(7 - (youChoice.length / 2));
      rightPad = ' '.repeat(6 - Math.floor(youChoice.length / 2));
      historyRow += leftPad + youChoice + rightPad + '|';

      let compChoice = this.computer.moveHistory[idx];
      leftPad = ' '.repeat(7 - (compChoice.length / 2));
      historyRow += leftPad + compChoice;
      console.log(historyRow);
    });

    console.log('\n*************************************\n\n');
  },

  resetScores() {
    this.computer.resetScore();
    this.human.resetScore();
  },

  promptToContinue() {
    console.log('Press RETURN to continue.');
    readline.question();
    console.clear();
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question().toLowerCase();
    while (!this.validPlayAgainAnswers.includes(answer)) {
      console.log('Please type (y)es or (n)o.');
      answer = readline.question().toLowerCase();
    }

    return answer[0] === 'y';

  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      this.human.choose();
      this.computer.choose();
      this.determineWinner();
      this.displayWinner();
      this.updateScore();
      this.displayScore();
      if (this.maxScoreReached()) {
        this.resetScores();
        this.displayHistory();
        if (!this.playAgain()) break;
      } else {
        this.promptToContinue();
      }
      console.clear();
    }
    this.displayGoodbyeMessage();
  },
};

function createPlayer() {
  return {
    move: null,
    score: 0,
    moveHistory: [],

    resetScore() {
      this.score = 0;
    },

    incrementScore(increment) {
      this.score += increment;
    }
  };
}

// eslint-disable-next-line max-lines-per-function
function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;

      while (true) {
        console.log(`Please choose from: ${Object.keys(RPSGame.choices).join(', ')}.`);
        choice = this.getLongUserChoice(readline.question());
        if (Object.keys(RPSGame.choices).includes(choice)) break;
        console.log('Sorry, invalid choice.');
      }

      this.move = choice;
      this.moveHistory.push(this.move);
    },

    getLongUserChoice(choice) {
      let longChoice = choice;

      for (let prop in RPSGame.choices) {
        if (RPSGame.choices[prop]['validInput'].includes(choice)) {
          longChoice = prop;
          break;
        }
      }

      return longChoice;
    }
  };

  return Object.assign(playerObject, humanObject);
}

// eslint-disable-next-line max-lines-per-function
function createComputer() {
  let playerObject = createPlayer();
  let moves = Object.keys(RPSGame.choices);
  let computerWeights = ;

  let computerObject = {
    choose() {
      const choices = Object.keys(RPSGame.choices);
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
      this.moveHistory.push(this.move);
    },

    getChoiceWeights() {
      let humanHistory = RPSGame.human.moveHistory;
      let computerHistory = this.moveHistory;
    },

    prioritizeChoice(choice, computerWeights) {
      computerWeights[choice] *= 0.1;
      return this.normalizeWeights(computerWeights);
    },

    normalizeWeights(computerWeights) {
      let denominator = Object.values(computerWeights)
        .reduce( (curr, next) => curr + next, 0);


      Object.keys(computerWeights).forEach( choice => {
        computerWeights[choice] /= denominator;
      });

      return computerWeights;
    }
  };



  return Object.assign(playerObject, computerObject);
}

RPSGame.play();