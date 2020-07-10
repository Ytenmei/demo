require('dotenv').config()
const { merge } = require('webpack-merge');

/* 通用配置 */
const common = require('./webpack.common.js');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");


const prd = {
  mode: 'production',
  devtool: 'inline-source-map',
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
              sourceMap: true,
            },
          },
          'css-loader',
        ]
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css',
    }),
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
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

        // default: {   //所有代码分割快都符合默认值，此时判断priority优先级
        //   minChunks: 2,
        //   priority: -20,
        //   reuseExistingChunk: true   // 允许在模块完全匹配时重用现有的块，而不是创建新的块。
        // },
      }
    },
    minimizer: [new UglifyJsPlugin()]
  }
}

module.exports = merge(common, prd)