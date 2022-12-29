const readline = require('readline-sync');

class Card {
  constructor(suit, value, weight) {
    this.suit = suit;
    this.value = value;
    this.weight = weight;
    this.hidden = false;
  }

  static suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
  static values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A"
  ];

  getWeight() {
    return this.weight;
  }

  getValue() {
    return this.value;
  }

  getSuit() {
    return this.suit;
  }

  hide() {
    this.hidden = true;
  }

  isHidden() {
    return this.hidden;
  }

  reveal() {
    this.hidden = false;
  }

  toString() {
    if (this.isHidden()) return '[ ? | Face Down ]';
    return `[ ${this.getValue()} | ${this.getSuit()} ]`;
  }

}

class Deck {
  constructor() {
    this.cards = [];

    Card.suits.forEach(suit => {
      Card.values.forEach(value => {
        let weight;

        if (/[JQK]/g.test(value)) weight = 10;
        else if (value === 'A') weight = 11;
        else weight = Number(value);

        let card = new Card(suit, value, weight);

        this.cards.push(card);
      });
    });
  }

  static MIN_CARDS = 13

  deal() {
    return this.cards.pop();
  }

  dealFaceDown() {
    let card = this.cards.pop();
    card.hide();
    return card;
  }

  getCards() {
    return this.cards;
  }

  shuffle() {
    for (let idx = this.cards.length - 1; idx > 0; idx--) {
      let randIdx = Math.floor(Math.random() * (idx + 1));
      [this.cards[idx], this.cards[randIdx]] =
      [this.cards[randIdx], this.cards[idx]];
    }
  }

  getCardsLeft() {
    return this.cards.length;
  }
}

class Participant {
  constructor() {
    this.hand = [];
  }

  showHand(hand) {
    let string = "";
    hand.forEach(card => {
      string += `${card}\n`;
    });
    return string.slice(0, string.length - 1) + `\n\n=> (Score: ${this.score()})\n`;
  }

  revealHand() {
    this.hand.forEach(card => card.reveal());
  }

  hit(dealMethod) {
    this.hand.push(dealMethod);
  }

  stay() {
    return true;
  }

  isBusted() {
    return this.score() > TwentyOneGame.MAX_SCORE;
  }

  score() {
    let cards = this.hand;
    let score = cards.reduce((sum, card) => {
      return !card.isHidden() ? sum + card.getWeight() : sum + 0;
    }, 0);

    cards.filter(card => card.getValue() === 'A' && !card.isHidden())
      .forEach(() => {
        if (score > TwentyOneGame.MAX_SCORE) {
          score -= 10;
        }
      });
    return score;
  }

  getHand() {
    return this.hand;
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

  static TARGET_SCORE = 17;
}

class TwentyOneGame {
  constructor() {
    this.player = new Player();
    this.dealer = new Dealer();
    this.deck = new Deck();
  }

  static MAX_SCORE = 21;

  startRound() {
    this.replaceLowDeck();
    this.resetRound();
    this.dealCards();
    this.showCards();
    this.playerTurn();
    this.dealerTurn();
    this.displayResult();
  }

  start() {
    //SPIKE
    this.displayWelcomeMessage();
    this.deck.shuffle();

    while (true) {
      this.startRound();
      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  }

  displayWelcomeMessage() {
    console.clear();
    this.prompt('Welcome to the game of Twenty-One!\n');
    console.log('-- Rules --');
    console.log('1. This game is a 1 v 1 against the dealer.\n');
    console.log('2. The aim is to get a higher score than the dealer whie not going over 21 (busting).\n');
    console.log(
      '3. Note: Face cards (J --> K) worth 10 points. Ace worth 11 or 1.\n'
    );
    console.log('-- End --\n\n');

    this.prompt('Press any key to begin');
    readline.question();

  }

  dealCards() {
    const playerHand = this.player.getHand();
    const dealerHand = this.dealer.getHand();

    for (let cnt = 0; cnt < 4; cnt++) {
      if (cnt % 2 === 0) playerHand.push(this.deck.deal());
      else if (cnt === 3) dealerHand.push(this.deck.dealFaceDown());
      else dealerHand.push(this.deck.deal());
    }
  }

  showCards() {
    const playerHand = this.player.getHand();
    const dealerHand = this.dealer.getHand();

    console.log('');
    this.prompt(`Your cards:\n\n${this.player.showHand(playerHand)} \n`);
    this.prompt(`Dealer's cards:\n\n${this.dealer.showHand(dealerHand)} \n`);
    console.log('');

  }

  showFinalCards() {
    console.clear();
    this.dealer.revealHand();
    this.showCards();
  }

  playerTurn() {
    let choice;

    while (!this.player.isBusted()) {
      choice = readline.question('Do you want to (h)it, or (s)tay? ');
      if (['h', 'H', 'hit'].includes(choice)) this.player.hit(this.deck.deal());
      if (['s', 'S', 'stay'].includes(choice)) break;

      console.clear();
      this.showCards();
    }
  }

  dealerContinue() {
    readline.question('Press Return to continue...');
  }

  dealerTurn() {
    while (
      this.dealer.score() < Dealer.TARGET_SCORE &&
      (!this.player.isBusted())
    ) {
      this.dealerContinue();
      this.dealer.hit(this.deck.deal());

      console.clear();
      this.showFinalCards();
    }
  }

  playAgain() {
    let choice;

    while (true) {
      choice = readline.question('Do you want to play another game? (y or n) ');
      console.log('');
      if (['n', 'no', 'y', 'yes'].includes(choice)) break;
    }
    return ['y', 'yes'].includes(choice);
  }

  winner() {
    if (this.player.isBusted()) return this.dealer;
    if (this.dealer.isBusted()) return this.player;

    if (this.player.score() > this.dealer.score()) return this.player;
    if (this.player.score() < this.dealer.score()) return this.dealer;

    return null;
  }

  resetRound() {
    console.clear();
    this.player.hand = [];
    this.dealer.hand = [];
  }

  replaceLowDeck() {
    let cardsLeft = this.deck.getCardsLeft();

    if (cardsLeft < Deck.MIN_CARDS) {
      this.deck = new Deck();
    }
  }

  displayResult() {
    this.showFinalCards();
    console.log('\n');

    let playerScore = this.player.score();
    let dealerScore = this.dealer.score();

    console.log('');
    this.prompt(`Your score is ${playerScore}`);
    this.prompt(`The Dealer's Score is ${dealerScore}\n`);

    if (this.player.isBusted()) this.prompt('Whoops! You busted!\n');
    if (this.dealer.isBusted()) this.prompt('The dealer busted!!');

    if (this.winner() === this.player) this.prompt('You won!!!\n');
    if (this.winner() === this.dealer) this.prompt('The Dealer won. You lose...');
    if (this.winner() === null) this.prompt(`Wow, it's a tie!`);
  }

  displayGoodbyeMessage() {
    this.prompt('Thank you for playing the game Twenty One!');
  }

  prompt(string) {
    console.log('=> ' + string);
  }
}

let game = new TwentyOneGame();
game.start();