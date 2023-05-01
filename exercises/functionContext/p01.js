let person = {
  firstName: 'Rick ',
  lastName: 'Sanchez',
  //fullName: this.firstName + this.lastName,
  fullName() {console.log(this.firstName + this.lastName)}
};

//console.log(person.fullName);
person.fullName();