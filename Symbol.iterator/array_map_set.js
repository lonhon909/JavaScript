const arr = [1, 2, 'a', 'b'];

const iterator = arr[Symbol.iterator]()
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())

const map = new Map();
map.set('a', 'a')
map.set('b', 'b')
map.set('c', 'c')
map.set('d', 'd')

const mapIterator = map[Symbol.iterator]();
console.log(mapIterator.next())
console.log(mapIterator.next())
console.log(mapIterator.next())
console.log(mapIterator.next())
console.log(mapIterator.next())