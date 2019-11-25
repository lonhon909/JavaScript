`
  数组方法 includes -- Array.prototype.includes(value : any) : boolean
`
// 如果某个数组中包含 value 这个元素，则返回true，否则为false
['a', 'b', 'c'].includes('a'); // true
['a', 'b', 'c'].includes('d'); // false

// includes 方法与 indexOf 相似 – 以下两个表达式几乎是等效的
const arr = [1, 2, NaN];
const x = 1;
arr.includes(x)
arr.indexOf(x) >= 0

// 主要的区别在于 includes() 可以查找 NaN，而 indexOf() 不能：
arr.includes(NaN); // true
arr.indexOf(NaN); // -1