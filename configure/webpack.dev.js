/* 模块 */
const path = require('path');
const { merge } = require('webpack-merge');


/* 通用配置 */
const common = require('./webpack.common.js');


/* 开发配置 */
const dev = {
  mode: "development",
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8888,
    open: true,
    proxy: {
      '/mall': {
        target: 'http://mallh5-test.yufu.cn/',
        changeOrigin: true
      },
      '/Login': {
        target: 'http://mallh5-test.yufu.cn/',
        changeOrigin: true
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
        ]
      },
    ]
  }
}

module.exports = merge(common, dev)