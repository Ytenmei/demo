function Game() {
  // 食物对象、蛇对象
  this.food = new Food()
  this.snake = new Snake()
  this.food.randomLocation()
  this.snake.drawSnake()
}
var flag;
Game.prototype.start = function () {
  var that = this
  // 使用定时器不断 调整蛇的移动
  flag = setInterval(function () {
    that.snake.move()
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