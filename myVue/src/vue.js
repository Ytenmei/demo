class Vue {
  constructor(options = {}) {
    /* 给Vue  增加属性 */
    this.$el = options.el
    this.$data = options.data
    this.$methods = options.methods
    /* 监视 data 中的数据 */
    new Observer(this.$data)
    /* 把 data 中的所有数据代理到 vm 上 */
    this.proxy(this.$data)
    /* 把 methods 中所有数据代理到 vm 上 */
    this.proxy(this.$methods)
    /* 如果指定了el 参数， 对el 进行解析 */
    if (this.$el) {
      /* compile 负责解析模板的内容
      需要： 模板和数据
      */

      let c = new Compile(this.$el, this)
    }
  }
  proxy(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (data[key] == newValue) return
          data[key] = newValue
        }
      })
    })
  }
}