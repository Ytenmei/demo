/* 模块 */
const webpack = require('webpack')
const path = require('path');
const glob = require('glob')


const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const mapObject = {};
const htmlPluginArray = []
SRC_DIR = path.resolve(process.cwd(), 'src')
JS_DIR = path.resolve(SRC_DIR, 'pages/js')
ARRAY_HTML = glob.sync(SRC_DIR + '/pages' + '/*.html') /* html 模板 */
ENTRY_FILES = glob.sync(JS_DIR + '/*.{js,jsx}') /* js 模板 */
COMMON_JS_DIR = path.resolve(SRC_DIR, 'common/js')
COMMON_JS_PUBLIC = glob.sync(COMMON_JS_DIR + '/*.{js,jsx}')


/* 入口函数 */
const entries = function () {
  const FILE_ENTRIES = ENTRY_FILES.concat(COMMON_JS_PUBLIC)

  for (let i = 0; i < FILE_ENTRIES.length; i++) {
    let filePath = FILE_ENTRIES[i];
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    mapObject[filename] = filePath;
  }
  return mapObject;
}


/* html 模板 */
ARRAY_HTML.forEach(function (filePath) {
  let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
  htmlPluginArray.push(new HtmlWebpackPlugin({
    filename: `./${filename}.html`,
    template: `html-withimg-loader!./src/pages/${filename}.html`,
    chunks: ['public', filename],
    chunksSortMode: 'manual'
  }))
})


module.exports = {
  entry: entries(),
  output: {
    path: path.join(__dirname, "dist"),
    filename: 'js/[name].[hash:8].bundle.js',
    chunkFilename: '[name]_[chunkhash].min.js'
  },
  module: {
    rules: [
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
        test: /\.less$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            },
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true,
            }
          }
        ]
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
    })
  ]
}