function objectsEqual(obj1, obj2) {
  let biggerObj =
    Object.keys(obj1).length > Object.keys(obj2).length ? obj1 : obj2;

  return Object.keys(biggerObj).every(key => {
    let keyPresent = (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key));
    let valueSame = (obj1[key] === obj2[key]);
    return keyPresent && valueSame;
  });
}


console.log(objectsEqual({a: 'foo'}, {a: 'foo'}));                      // true
console.log(objectsEqual({a: 'foo', b: 'bar'}, {a: 'foo'}));            // false
console.log(objectsEqual({}, {}));                                      // true
console.log(objectsEqual({a: 'foo', b: undefined}, {a: 'foo', c: 1}));  // false