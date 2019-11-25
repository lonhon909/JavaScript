// 栈 --- 后进先出（LIFO）

// 1、调用栈
// 2、浏览器的后退按钮
// 3、编辑器的撤销操作的原理就是靠一个栈来进行维护的

// class Stack {
//   constructor() {
//     this.stack = []
//   }
//   push(value) {
//     this.stack.push(value)
//   }
//   pop() {
//     return this.stack.pop()
//   }
// }


class Stack {
  constructor() {
    this._storage = {};
    this._length = 0; // 这是栈的大小
  }

  push(value) {
    this._length++;
    this._storage[this._length] = value;
  }
  pop() {
    if (this._length) {
      const lastVal = this._storage[this._length]
      delete this._storage[this._length]
      this._length--;
      return lastVal
    }
  }
  peek() {
    const lastVal = this._storage[this._length]
    return lastVal
  }
}
