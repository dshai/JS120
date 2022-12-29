const readline = require('readline-sync');

class Card {
  constructor(rank, suit, points) {
    this.rank = rank;
    this.suit = suit;
    this.points = points;
    this.hidden = false;
  }

  toString() {
    if (this.hidden) return '[??]';
    else return '[' + this.rank + '/' + this.suit + ']';
  }

  hide() {
    this.hidden = true;
  }

  unHide() {
    this.hidden = false;
  }
}

class Deck {
  static RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  static SUITS = ['H','S','C','D'];
  constructor() {
    this.refill();
    this.shuffle();
  }

  deal(numCards) {
    return this.cards.splice(0, numCards);
  }

  refill() {
    this.cards = [];
    Deck.SUITS.forEach(suit => {
      Deck.RANKS.forEach(rank => {
        let score = Number(rank.replace('A','11').replace(/[JQK]/g,'10'));
        let card = new Card(rank, suit, score);
        this.cards.push(card);
      });
    });
  }

  shuffle() {
    for (let index = this.cards.length - 1; index > 0; index -= 1) {
      let randIdx = Math.floor(Math.random() * (index + 1));
      [this.cards[index], this.cards[randIdx]]
        = [this.cards[randIdx], this.cards[index]];
    }
  }
}

class Participant {
  static BUST_VAL = 21;
  constructor() {
    this.resetHand();
    this.money = 5;
  }

  score() {
    let points;
    if (this.hand.some(card => card.hidden)) points = '(hidden)';
    else points = this.hand.reduce((prev, card) => prev + card.points, 0);

    this.hand.filter(card => (card.rank === 'A')).forEach(_ => {
      if (points > Participant.BUST_VAL) points -= 10;
    });

    return points;
  }

  isBusted() {
    return this.score() > Participant.BUST_VAL;
  }

  addCards(cards) {
    this.hand.push(...cards);
  }

  resetHand() {
    this.hand = [];
  }


}

class Player extends Participant {
  constructor() {
    super();
    this.money = 5;
  }

  addMoney() {
    this.money += 1;
  }

  removeMoney() {
    this.money -= 1;
  }

  showMoney() {
    console.log(`You have $${this.money}.`);
  }

  hasMoney() {
    return this.money > 0;
  }
}

class Dealer extends Participant {
  constructor() {
    super();
  }

  addCards(cards, hidden = false) {
    if (hidden) cards.forEach(card => card.hide());
    super.addCards(cards);
  }

  reveal() {
    this.hand.forEach(card => card.unHide());
  }
}

class TwentyOneGame {
  static ALLOWED_RESPONSES = ['hit', 'h', 'stay', 's'];
  static ALLOWED_QUIT_RESPONSES = ['yes', 'y', 'no', 'n'];
  constructor() {
    this.deck = new Deck();
    this.deck.shuffle();
    this.player = new Player();
    this.dealer = new Dealer();
  }

  start() {
    this.displayWelcomeMessage();

    while (true) {
      this.reset();
      this.dealCards();

      this.playerTurn();
      if (!this.player.isBusted()) this.dealerTurn();

      let winner = this.determineWinner();
      this.settleMoney(winner);
      this.declareWinner(winner);

      if (!this.player.hasMoney()) {
        console.log('Sorry, you are out of money.');
        readline.question('Press RETURN to be escorted out of the casino.');
        break;
      }
      if (this.shouldQuit()) break;
    }

    this.displayGoodbyeMessage();
  }

  reset() {
    this.player.resetHand();
    this.dealer.resetHand();
    this.deck.refill();
    this.deck.shuffle();
  }

  dealCards() {
    this.player.addCards(this.deck.deal(2));
    this.dealer.addCards(this.deck.deal(1));
    this.dealer.addCards(this.deck.deal(1), true);
  }

  showCards() {
    let playerHand = this.player.hand.join('');
    let dealerHand = this.dealer.hand.join('');

    console.log('Player hand: ' + playerHand);
    console.log('Dealer hand: ' + dealerHand);
    console.log('');
  }

  showScores() {
    let playerScore = this.player.score();
    let dealerScore = this.dealer.score();

    console.log('Player score: ' + playerScore);
    console.log('Dealer score: ' + dealerScore);
    console.log('');
  }

  showBoard() {
    console.clear();
    this.showCards();
    this.showScores();
    this.player.showMoney();
    console.log('');
  }

  playerTurn() {
    while (!this.player.isBusted()) {
      this.showBoard();
      let response = this.getPlayerChoice();

      if (response[0] === 's') break;
      this.player.addCards(this.deck.deal(1));
    }

    this.showBoard();

    if (this.player.isBusted()) {
      console.log('Sorry, player busted.\n');
    } else {
      console.log('You chose to stay!\n');
    }
  }

  getPlayerChoice() {
    console.log('Do you want to (h)it or (s)tay');
    let response = readline.question().trim().toLowerCase();

    while (!TwentyOneGame.ALLOWED_RESPONSES.includes(response)) {
      console.log("Please type 'hit' or 'stay'.");
      response = readline.question().trim().toLowerCase();
    }

    return response;
  }

  dealerTurn() {
    readline.question('Press RETURN to reveal dealer card.');
    this.dealer.reveal();

    while (this.dealer.score() < 17) {
      this.showBoard();

      console.log('Dealer will hit.\n');
      readline.question('Press RETURN to continue.');
      this.dealer.addCards(this.deck.deal(1));
    }

    this.showBoard();
    if (this.dealer.isBusted()) console.log('Dealer busted.');
  }

  determineWinner() {
    let winner;
    if (this.player.isBusted()) winner = 'Dealer';
    else if (this.dealer.isBusted()) winner = 'Player';
    else if (this.player.score() > this.dealer.score()) winner = 'Player';
    else if (this.dealer.score() > this.player.score()) winner = 'Dealer';
    else winner = 'Tie';

    return winner;
  }

  settleMoney(winner) {
    if (winner === 'Player') this.player.addMoney();
    else if (winner === 'Dealer') this.player.removeMoney();
  }

  declareWinner(winner) {
    this.showBoard();
    if (winner === 'Tie') console.log('Its a tie!\n');
    else console.log(`${winner} has won the game!\n`);
  }

  shouldQuit() {
    console.log('Play again? (yes/no)');
    let answer = readline.question().toLowerCase();

    while (!TwentyOneGame.ALLOWED_QUIT_RESPONSES.includes(answer)) {
      console.log("Please type 'yes' or 'no'");
      answer = readline.question().toLowerCase();
    }

    return answer[0] === 'n';
  }

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to Twenty-One!\n');
    readline.question('Press RETURN to begin playing');
  }

  displayGoodbyeMessage() {
    console.clear();
    console.log('Thanks for playing!');
  }
}

let game = new TwentyOneGame();
game.start();