function Food() {
  // 属性，横向，纵向位置
  this.x = 0
  this.y = 0
  this.$div = $('<div><div>').addClass('food').appendTo('.map')
}
// 食物随机方法
Food.prototype.randomLocation = function () {
  // 1. 计算横向最大的格子数
  var maxXNum = $('.map').width() / 20
  var maxYNum = $('.map').height() / 20

  // 2. 计算纵向最大的格子数
  // 3. 横向随机出一个格子数 * 20
  this.x = parseInt(Math.random() * maxXNum) * 20
  // 3. 纵向随机出一个格子数 * 20 
  this.y = parseInt(Math.random() * maxYNum) * 20
  this.$div.css({
    left: this.x,
    top: this.y
  })
}