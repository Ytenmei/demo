/* 负责解析模板内容 */
class Compile {
  /* 
    参数1： 模板。
    参数2： vue 实例
  */
  constructor(el, vm) {
    /* el： new Vue 传递的选择器 */
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    /* vm： new 的 vue 实例 */
    this.vm = vm
    if (this.el) {
      /* 1. 把 el 中 所有的 子节点都放入到内存中， fragment */
      let fragment = this.node2fragment(this.el)
      /* 2. 在 内存中编译fragment */
      this.compile(fragment)
      /* 3. 把fragment 一次性添加到 视图页面中 */
      this.el.appendChild(fragment)
    }
  }
  /*  核心方法 */
  node2fragment(node) {
    let fragment = document.createDocumentFragment()
    /* 把 el 中所有的子节点挨个添加到文档碎片中 */
    let childNodes = node.childNodes
    this.toArray(childNodes).forEach(node => {
      fragment.appendChild(node)
    })
    return fragment
  }
  /**
   *  编译文档碎片
   * @param {*} fragment 
   */
  compile(fragment) {
    let childNodes = fragment.childNodes
    this.toArray(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        /* 如果是元素， 需要解析指令 */
        this.compileElement(node)
      }
      if (this.isTextNode(node)) {
        /* 如果是文本节点， 需要解析插值表达式 */
        this.compileText(node)
      }
      /* 如果当前节点还有子节点， 需要递归的解析 */
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }
  /* 解析html 标签 */
  compileElement(node) {
    /* 1. 获取当前节点下所有的属性 */
    let attributes = node.attributes
    this.toArray(attributes).forEach(attr => {
      /* 2. 解析 Vue 的指令（b-开头的属性） */
      let attrName = attr.name /* 获取属性的name */
      if (this.isDirective(attrName)) {
        let type = attrName.slice(2)
        let expr = attr.value /* 获取属性的value */
        /* v-on 指令 */
        if (this.isEventDirective(type)) {
          CompileUtil['eventHandler'](node, this.vm, type, expr)
        } else {
          CompileUtil[type] && CompileUtil[type](node, this.vm, expr)
        }
      }
    })
  }
  /* 解析 文本节点 */
  compileText(node) {
    CompileUtil.mustache(node, this.vm)
  }
  /* 工具方法 */
  toArray(likeArray) {
    /** 返回一个数组 */
    return [].slice.call(likeArray)
  }
  isElementNode(node) {
    /* nodeType： 接的类型 1：元素节点 3：文本节点 */
    return node.nodeType === 1
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  isEventDirective(attrName) {
    return attrName.split(':')[0] === 'on'
  }
}



let CompileUtil = {
  /* 处理 v-text 指令 */
  text(node, vm, expr) {
    node.textContent = this.getVMValue(vm, expr)
    /* 通过watcher 对象， 监听 expr 的数据变化，一旦变化了，就执行回调。 */
    new Watcher(vm, expr, (newValue) => {
      node.textContent = newValue
    })
  },
  html(node, vm, expr) {
    node.innerHTML = this.getVMValue(vm, expr)
    new Watcher(vm, expr, (newValue) => {
      node.innerHTML = newValue
    })
  },
  model(node, vm, expr) {
    let _this = this
    node.value = this.getVMValue(vm, expr)
    /* 实现双向数据绑定，给node注册input 事件 */
    node.addEventListener('input', function () {
      _this.setVMValue(vm, expr, this.value)
    })
    new Watcher(vm, expr, (newValue) => {
      node.value = newValue
    })
  },
  eventHandler(node, vm, type, expr) {
    let eventType = type.split(':')[1]
    let fn = vm.$methods && vm.$methods[expr]
    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm))
    }
  },
  /* 获取vm 中的数据 */
  getVMValue(vm, expr) {
    let data = vm.$data
    expr.split('.').forEach(key => {
      data = data[key]
    })
    return data
  },
  mustache(node, vm) {
    let txt = node.textContent
    let reg = /\{\{(.+)\}\}/
    if (reg.test(txt)) {
      let expr = RegExp.$1.trim()
      node.textContent = txt.replace(reg, CompileUtil.getVMValue(vm, expr))
      new Watcher(vm, expr, (newValue) => {
        node.textContent = txt.replace(reg, newValue)
      })
    }
  },
  setVMValue(vm, expr, value) {
    let data = vm.$data
    let arr = expr.split('.')
    arr.forEach((item, index) => {
      if (index < arr.length - 1) {
        data = data[item]
      } else {
        data[item] = value
      }
    })
  }
}