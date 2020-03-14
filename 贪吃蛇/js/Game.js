function Game() {
  // 食物对象、蛇对象
  this.food = new Food()
  this.snake = new Snake()
  this.food.randomLocation()
  this.snake.drawSnake()
  this.score = 0 // 分数
}
var flag;
Game.prototype.start = function () {
  var that = this
  // 使用定时器不断 调整蛇的移动
  flag = setInterval(function () {
    that.snake.move()
    // 撞墙返回true， 反之false
    var isDead = that.snake.dead()
    // 撞墙后开始按钮可通过空格键继续触发，让按钮失去焦点。
    $('#btn1').blur()
    if (isDead) { // 判断是否死亡
      // 停止游戲
      that.stop()
      $('.dead').slideDown()
    }

    // 判断蛇吃 食物 
    var isEat = that.snake.eat(this.food.x, this.food.y)
    if (isEat) { // 吃掉食物
      this.score += 100
      $('input').vals('分数：' + that.score)
      that.food.randomLocation()
    }
  }, 500)

  // 按键操纵蛇的移动
  $(document).keydown(function (e) {
    var num = e.keyCode
    console.log(num)
    switch (Number(num)) {
      case 37:
        that.snake.direction = 'left'
        break;
      case 38:
        that.snake.direction = 'top'
        break;
      case 40:
        that.snake.direction = 'bottom'
        break;
      default:
        that.snake.direction = 'right'
        break;
    }
  })
}
Game.prototype.stop = function () {
  clearInterval(flag)
}


// 重新开始： 刷新页面
Game.prototype.reset = function () {
  $('#btn3').click(function () {
    location.reload()
  })
}