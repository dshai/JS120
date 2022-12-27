function createProduct(id, name, stock, price) {
  return {
    id,
    name,
    stock,
    price,

    setPrice(newPrice) {
      if (newPrice < 0) console.log('Invalid Price!');
      else this.price = newPrice;
    },

    describe() {
      console.log(`=> Name: ${this.name}`);
      console.log(`=> ID: ${this.id}`);
      console.log(`=> Price: ${this.price}`);
      console.log(`=> Stock: ${this.stock}`);
    }
  }
}

let scissors = createProduct(0, 'Scissors', 8, 10);
let cordlessDrill = createProduct(1, 'CordlessDrill', 15, 45);

// function updatePrice(tool, price) {
//   if (price < 0) console.log('Sorry, invalid price.  Price cannot be negative');
//   else tool.price = price;
// }

// updatePrice(scissors, -100);
// console.log(scissors);

// function describeProduct(tool) {
//   console.log(`=> Name: ${tool.name}`);
//   console.log(`=> ID: ${tool.id}`);
//   console.log(`=> Price: ${tool.price}`);
//   console.log(`=> Stock: ${tool.stock}`);
// }

scissors.describe();

console.log(createProduct.prototype);