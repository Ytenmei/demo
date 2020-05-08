/* 
  observe 用于给 data 中所有的数据添加 getter 和 setter
  方便我们在获取或者设置 data 中吃菊的时候，实现我们的逻辑。
 */
class Observer {
  constructor(data) {
    this.data = data
    this.walk(data)
  }
  /* 核心方法 */
  /* 遍历 data 中所有的数据，都添加上 getter 和 setter 方法 */
  walk(data) {
    if (!data || typeof data != 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      /* 给 data 对象的 key 设置 getter 和 setter */
      this.defineReactive(data, key, data[key])
      /* 如果 data[key] 是一个复杂的类型，递归的walk  */
      this.walk(data[key])
    })
  }
  /* data 中的 每一个数据都应该维护一个 dep 对象 */
  defineReactive(data, key, value) {
    let _this = this
    let dep = new Dep()
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get () {
        /* 如果 Dep.target 中有 watcher对象 应该存储到订阅者数组中 */
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set (newValue) {
        if (value === newValue) return
        value = newValue
        _this.walk(newValue)
        /*  通知订阅者，发布通知 */
        dep.notify()
      }
    })
  }
}