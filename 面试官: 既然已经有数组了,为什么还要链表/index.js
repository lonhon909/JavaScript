// 初始化节点
class Node {
  constructor(key) {
    this.next = null;
    this.key = key;
  }
}

// 单向链表
class List {
  constructor() {
    // 单向链表的头节点，初始化为null
    this.head = null;
    // 单向链表的长度
    this.length = 0;
  }

  // 添加元素到链表尾部
  append(element) {
    const node = new Node(element);
    let current;
    // 判断是否有头节点
    if (this.head === null) {
      this.head = node;
    } else {
      current = this.head;
      // 循环拿到最后一个节点
      while(current.next) {
        current = current.next;
      }
      // 最后一个节点的next指向新添加的元素
      current.next = node;
    }
    this.length++;
  }

  /**
   * 向单向链表中某个位置插入元素
   * 
   * @param {*} index 插入的位置
   * @param {*} element 插入链表的节点
   */
  insert(index, element) {
    const node = new Node(element);
    let current = this.head;
    let previous;
    // 验证边界
    if (index < 0 || index > this.length) {
      return false;
    }
    // 在链表头部插入
    if (index === 0) {
      node.next = current;
      this.head = node;
    } else {
      while(index--) {
        previous = current;
        current = current.next;
      }
      // 在前一个节点和当前节点中间插入
      previous.next = node;
      node.next = current;
    }
    this.length++;
    return true;
  }

  /**
   * 寻找某个元素在单向链表中的位置
   * @param {*} element 
   */
  indexOf(element) {
    let index = 0;
    let current = this.head;

    while(current) {
      if (current.key === element) {
        return index;
      }
      current = current.next;
      index += 1;
    }
    return -1;
  }

  /**
   * 移除单向链表中某个位置的元素
   * @param {*} index 
   */
  removeAt(index) {
    let current = this.head;
    let i = 0;
    let previous;

    // 边界
    if (index < 0 || index > this.length) {
      return null;
    }

    if (index === 0) {
      // 如果删除第一个节点，只需将头节点指向链表下一个节点
      this.head = this.head.next;
    } else {
      while(i++ < index) {
        previous = current;
        current = current.next;
      }
      previous.next = current.next
    }
    this.length--;
    // 返回删除的项
    return current.key;
  }

  /**
   * 移除给定的元素
   * @param {*} element 
   */
  remove(element) {
    return this.removeAt(this.indexOf(element));
  }

  /**
   * 获取单向链表的头部
   */
  getHead() {
    return this.head.key
  }

  /**
   * 检查单向链表是否为空
   */
  isEmpty() {
    return this.length === 0;
  }

  /**
   * 返回单向链表长度
   */
  size() {
    return this.length;
  }

  /**
   * 将链表所有内容以字符串输出
   */
  toString() {
    let str = '';
    let current = this.head;
    while(current) {
      str += current.key;
      current = current.next;
    }
    return str;
  }
}


const list = new List();
list.append(1)
list.append(10)
list.append(10)
list.append(10)
list.append(10)
list.append(10)
list.append(10)
console.log(list.getHead())
console.log(list.toString())
console.log(list.size())
console.log(list.isEmpty())
console.log(list.remove(10))
console.log(list.removeAt(3))
console.log(list.indexOf(100))
console.log(list.insert(2, 'aaa'))