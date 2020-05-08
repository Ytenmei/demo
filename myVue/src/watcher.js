/* 
  watcher 模块负责把 compile 模块与 observe 模块关联起来
*/
class Watcher {
  /* 
    vm：点前的 vue 实例
    expr： data 中数据的名字
    一旦数据发生了改变，需要调用 cb
  */
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb
    /* thi表示新创建的对象 */
    Dep.target = this
    /* 需要把 expr 的旧值存储起来 */
    this.oldValue = this.getVMValue(vm, expr)
    /* 清空 Dep.target */
    Dep.target = null
  }
  /* 对外暴露的一个方法， 这个方法用于更新页面 */
  upData() {
    /* 对比 expr 是否发生了改变，如果发生了改变，需要调用 cb */
    let oldValue = this.oldValue
    let newValue = this.getVMValue(this.vm, this.expr)
    if (oldValue != newValue) {
      this.cb(newValue, oldValue)
    }
  }
  getVMValue(vm, expr) {
    let data = vm.$data
    expr.split('.').forEach(key => {
      data = data[key]
    })
    return data
  }
}

/* dep对象用于管理所有的订阅者和通知这些订阅者 */
class Dep {
  constructor() {
    /* 用于管理订阅者 */
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  /* 通知 */
  notify() {
    /* 遍历所有的订阅者，调用watcher的 upData 方法 */
    this.subs.forEach(sub => {
      sub.upData()
    })
  }
}