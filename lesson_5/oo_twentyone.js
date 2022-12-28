const readline = require('readline-sync');

class Card {
  constructor(rank, suit, points) {
    this.rank = rank;
    this.suit = suit;
    this.points = points;
    this.hidden = false;
  }

  toString() {
    if (this.hidden) return '[?]';
    else return '[' + this.rank + ']';
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
    this.cards = [];
    Deck.SUITS.forEach(suit => {
      Deck.RANKS.forEach(rank => {
        let card = new Card(rank, suit, Number(rank.replace('A','11').replace(/[JQK]/g,'10')));
        this.cards.push(card);
      });
    });
  }

  deal(numCards) {
    return this.cards.splice(0, numCards);
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

  hit() {
    // STUB
  }

  resetHand() {
    this.hand = [];
  }
}

class Player extends Participant {
  constructor() {
    super();
  }
}

class Dealer extends Participant {
  constructor() {
    super();
  }

  hide() {
    //STUB
  }

  reveal() {
    this.hand.forEach(card => {
      card.hidden = false;
    });
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
      console.clear();
      this.resetParticipants();
      this.dealCards();
      this.showCards();
      this.showScores();
      this.playerTurn();
      this.dealerTurn();
      this.declareWinner(this.determineWinner());

      if (this.shouldQuit()) break;
    }

    this.displayGoodbyeMessage();
  }

  resetParticipants() {
    this.player.resetHand();
    this.dealer.resetHand();
  }
  dealCards() {
    this.player.hand = this.player.hand.concat(this.deck.deal(2));
    this.dealer.hand = this.dealer.hand.concat(this.deck.deal(2));
    this.dealer.hand.forEach((card, idx) => {
      if (idx > 0) card.hide();
    });
  }

  showCards() {
    let playerHand = this.player.hand.map(card => card.toString()).join('');
    let dealerHand = this.dealer.hand.map(card => card.toString()).join('');

    console.log('');
    console.log('Player hand: ' + playerHand);
    console.log('Dealer hand: ' + dealerHand);
    console.log('');
  }

  showScores() {
    let playerScore = this.player.score();
    let dealerScore = this.dealer.score();

    console.log('');
    console.log('Player score: ' + playerScore);
    console.log('Dealer score: ' + dealerScore);
    console.log('');
  }

  playerTurn() {
    while (!this.player.isBusted()) {
      let response = this.getPlayerChoice();

      if (response[0] === 's') break;
      this.player.hand.push(...this.deck.deal(1));
      console.clear();
      this.showCards();
      this.showScores();
    }

    if (this.player.isBusted()) {
      console.clear();
      this.showCards();
      this.showScores();
      console.log('Sorry, player busted.');
    } else {
      console.log('You chose to stay!');
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
    readline.question('Press RETURN/ENTER to proceed to dealer turn.');
    this.dealer.reveal();
    while (this.dealer.score() < 17) {
      this.dealer.hand.push(...this.deck.deal(1));
    }

    console.clear();
    this.showCards();
    this.showScores();

    if (this.dealer.isBusted()) {
      console.log('Dealer busted.');
    }
  }

  determineWinner() {
    let winner;
    if (this.player.isBusted()) winner = 'Dealer';
    else if (this.dealer.isBusted()) winner = 'Player';
    else if (this.player.score() > this.dealer.score()) {
      winner = 'Player';
    } else {
      winner = 'Dealer';
    }

    return winner;
  }

  declareWinner(winner) {
    console.log(`${winner} has won the game!`);
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
    console.log('Welcome to Twenty-One');
    readline.question('Press RETURN/ENTER to begin playing');
    console.clear();
  }

  displayGoodbyeMessage() {
    console.log('Thanks for playing!');
  }

}

let game = new TwentyOneGame();
game.start();