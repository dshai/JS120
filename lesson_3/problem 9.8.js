// function User(first, last) {
//   this.first = first;
//   this.last = last;
//   this.name = this.first + ' ' + this.last;
//   return {
//     name: this.name,
//   };
// }
function User(first, last) {
  if (!(this instanceof User)) {
    return new User(first, last);
  }

  this.name = first + ' ' + last;
}

let name = 'Jane Doe';
let user1 = new User('John', 'Doe');
let user2 = User('John', 'Doe');

console.log(user1 instanceof User);
console.log(user2 instanceof User);

console.log(name);         // => Jane Doe
console.log(user1.name);   // => John Doe
console.log(user2.name);   // => John Doe