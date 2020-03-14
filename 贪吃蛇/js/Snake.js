function Snake() {
  // 定义方向
  this.direction = 'right' // left、right、top、bottom
  // 蛇头、蛇身
  this.body = [
    { x: 3, y: 0, className: 'snake-head' },
    { x: 2, y: 0, className: 'snake-body' },
    { x: 1, y: 0, className: 'snake-body' }
  ]
}
// 蛇身
Snake.prototype.drawSnake = function () {
  for (var i = 0; i < this.body.length; i++) {
    var body = this.body[i]
    $('<div></div>')
      .css({
        left: body.x * 20,
        top: body.y * 20
      })
      .addClass(body.className)
      .appendTo('.map')
  }
}

Snake.prototype.move = function () {
  var moveBody = this.body
  // 倒序循环，移动时让后一个蛇节的位置等于前一个蛇节的位置
  for (var i = moveBody.length - 1; i > 0; i--) {
    moveBody[i].x = moveBody[i - 1].x
    moveBody[i].y = moveBody[i - 1].y
  }
  // 取出蛇头
  var head = moveBody[0]
  // 判断方向
  switch (this.direction) {
    case 'left':
      head.x -= 1
      break;
    case 'top':
      head.y -= 1
      break;
    case 'bottom':
      head.y += 1
      break;
    default:
      head.x += 1
  }
  $('.snake-head,.snake-body').remove()
  this.drawSnake()
}

// 定义方法→ 撞墙死
Snake.prototype.dead = function () {
  // 1. 获取蛇头数据
  var head = this.body[0]
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= $('.map').width() / 20 ||
    head.y >= $('.map').height() / 20
  ) {
    return true
  } else {
    return false
  }
}


/*
  蛇吃食物
 思路： 通过eat 方法接收传过来的食物的x,y的方法。
 取出蛇头，用来判断蛇头是否等于食物的位置 
*/
Snake.prototype.eat = function(x, y) {
  var head = this.body[0]
  if (head.x * 20 == x && head.y * 20 == y) {
    return true
  } else {
    return false
  }
}