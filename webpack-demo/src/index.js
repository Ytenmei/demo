import '@babel/polyfill'
import foo from './foo'
import 'bootstrap/dist/css/bootstrap.css'
import './style/demo.less'
import './style/index.css'
foo()

const todo = ['吃饭', '睡觉']

todo.forEach(item => {
  console.log(item)
})