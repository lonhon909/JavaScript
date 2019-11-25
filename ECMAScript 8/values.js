/* 
  Object.values() 作用：只返回自己的键值对中属性的值，它返回的数组顺序，也跟Object.entries()保持一致
*/

Object.values({ one: 1, two: 2 })            //[1, 2]
Object.values({ 3: 'a', 4: 'b', 1: 'c' })    //['c', 'a', 'b']