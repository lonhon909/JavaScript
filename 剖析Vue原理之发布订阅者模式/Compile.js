
function toArray(classArray) {
  return [].slice.call(classArray);
}

function node2fragment(node) {
  let fragment = document.createDocumentFragment();
  // 把el中所有的子节点挨个添加到文档片段中
  let childNodes = node.childNodes;
  // 由于childNodes是一个类数组,所以我们要把它转化成为一个数组,以使用forEach方法
  toArray(childNodes).forEach((VNode) => {
    // 把所有的字节点添加到fragment中
    fragment.appendChild(VNode);
  })
  return fragment;
}

const CompileUtils = {
  getVMData(vm, expr) {
    let data = vm.$data;
    expr.split('.').forEach(key => {
      data = data[key]
    })
    return data
  },
  setVMData(vm, expr, value) {
    let data = vm.$data
    let arr = expr.split('.')
    arr.forEach((key, index) => {
      if(index < arr.length - 1) {
        data = data[key]
      } else {
        data[key] = value
      }
    })
  },
  // 解析插值表达式
  mustache(node, vm) {
    let txt = node.textContent
    let reg = /\{\{(.+)\}\}/
    if (reg.test(txt)) {
      let expr = RegExp.$1;
      node.textContent = txt.replace(reg, this.getVMData(vm, expr))
      new Watcher(vm, expr, newValue => {
        node.textContent = txt.replace(reg, newValue)
      })
    }
  },
  // 解析v-text
  text(node, vm, expr) {
    node.textContent = this.getVMData(vm, expr)
    new Watcher(vm, expr, newValue => {
      node.textContent = newValue
    })
  },
  // 解析v-html
  html(node, vm, expr) {
    node.innerHTML = this.getVMData(vm, expr)
    new Watcher(vm, expr, newValue => {
      node.innerHTML = newValue
    })
  },
  // 解析v-model
  model(node, vm, expr) {
    let that = this
    node.value = this.getVMData(vm, expr);
    node.addEventListener('input', function () {
      // 下面这个写法不能深度改变数据
      // vm.$data[expr] = this.value
      that.setVMData(vm, expr, this.value)
    })
    new Watcher(vm, expr, newValue => {
      node.value = newValue
    })
  },
  // 解析v-on
  on(node, vm, expr, eventType) {
    // 处理methods里面的函数fn不存在的逻辑
    // 即使没有写fn,也不会影响项目继续运行
    let fn = vm.$methods && vm.$methods[expr];
    
    try {
      node.addEventListener(eventType, fn.bind(vm))
    } catch (error) {
      console.error('抛出这个异常表示你methods里面没有写方法\n', error)
    }
  }
}

class Compile {
  constructor(el, vm) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    this.vm = vm;
    if (this.el) {
      // 为了避免直接在DOM中解析指令和差值表达式所引起的回流与重绘,我们开辟一个Fragment在内存中进行解析
      const fragment = node2fragment(this.el);
      this.compile(fragment);
      this.el.appendChild(fragment);
    }
  }
  compile(fragment) {
    let childNodes = fragment.childNodes;
    toArray(childNodes).forEach((node) => {
      // 如果是元素节点,则解析指令
      if (this.isElementNode(node)) {
        this.compileElementNode(node);
      }
      // 如果是文本节点,则解析差值表达式
      if (this.isTextNode(node)) {
        this.compileTextNode(node);
      }
      // 递归解析
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    })
  }
  // 解析元素节点
  compileElementNode(node) {
    const attributes = toArray(node.attributes);
    const arr = ['v-on', 'v-html', 'v-text', 'v-model'];
    attributes.forEach((attr) => {
      arr.forEach((pertten) => {
        let reg = new RegExp(pertten);
        if (reg.test(attr.name)) {
          let str = pertten.slice(2);
          if (pertten === 'v-on') {
            /v-on:(\w+)/.test(attr.name);
            let expr = RegExp.$1;
            CompileUtils[str](node, this.vm, node.getAttribute(attr.name), expr);
          } else {
            CompileUtils[str](node, this.vm, node.getAttribute(attr.name));
          }
        }
      })
    })
  }
  // 解析文本节点
  compileTextNode(node) {
    while(/\{\{(.+)\}\}/.test(node.textContent)) {
      CompileUtils.mustache(node, this.vm);
    }
  }
  // 元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
  // 文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }
  // 属性节点
  isPropertyNode(node) {
    return node.nodeType === 2;
  }
}