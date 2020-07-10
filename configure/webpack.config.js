require('dotenv').config()
const webpack = require('webpack')
const path = require('path');
const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const srcDir = path.resolve(process.cwd(), 'src/pages');
const arrayHtml = glob.sync(srcDir + '/*.html')
const htmlPluginArray = []

const entries = function () {
  var jsDir = path.resolve(srcDir, 'js')
  var entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
  var map = {};
  for (var i = 0; i < entryFiles.length; i++) {
    var filePath = entryFiles[i];
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    map[filename] = filePath;
  }
  return map;
}

arrayHtml.forEach(function (filePath) {
  var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
  htmlPluginArray.push(new HtmlWebpackPlugin({
    filename: './' + filename + '.html',
    template: `html-withimg-loader!./src/pages/${filename}.html`,
    chunks: [filename]
  }))
})
module.exports = {
  entry: entries(),
  mode: "development",
  output: {
    path: path.join(__dirname, "dist"),
    filename: 'js/[name].[hash:8].bundle.js',
    chunkFilename: '[name]_[chunkhash].min.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 公共路径
              // 默认情况下，使用的是webpackOptions.output中publicPath
              publicPath: '../',
              //开发环境配置热更新
            },
          },
          'css-loader',
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: "[name].[hash:5].[ext]",
              limit: 1024, // size <= 1kib
              outputPath: "img",
              // publicPath: "../img/",
              esModule: false
            }
          },
        ],
      },
      {
        test: /\.(woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=8192'
      }
    ],

  },
  plugins: [
    ...htmlPluginArray,
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css',
    })
  ],
  optimization: {
    splitChunks: {
      // chunks: 'async',
      // minSize: 30,
      // maxSize: 0,
      // minChunks: 1,
      // maxAsyncRequests: 5,
      // maxInitialRequests: 3,
      // automaticNameDelimiter: '~',
      cacheGroups: {
        common: {
          name: "common_ChunksFor",
          chunks: "initial",        //入口处开始提取代码
          minSize: 0,               //代码最小多大，进行抽离
          minChunks: 2,
        }
        // vendor: {
        //   test: /[\\/]node_modules[\\/]/,
        //   priority: -10,
        //   filename: 'vendors.js'
        // },
        // default: {   //所有代码分割快都符合默认值，此时判断priority优先级
        //   minChunks: 2,
        //   priority: -20,
        //   reuseExistingChunk: true   // 允许在模块完全匹配时重用现有的块，而不是创建新的块。
        // },
      }
    }
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8888,
    open: true
  }
}
