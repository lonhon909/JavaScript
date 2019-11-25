const symbol = Symbol('a');

const data = {
  id: 1,
  name: '张三',
  value: 'hello world',
  [symbol]: 'symbol类型'
}

console.log(Object.entries(data)) // [ [ 'id', 1 ], [ 'name', '张三' ], [ 'value', 'hello world' ] ]


const arr = ['a', 'b', 'c'];

console.log(Object.entries(arr))
