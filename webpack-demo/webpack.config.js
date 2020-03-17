/**
 * webpack 配置文件
 * webpack 打包会自动使用 webpack.config.js 作为其配置文件
 * 将webpack 配置规则写到一个对象中直接导出
 * 注意： 该文件不会被打包，它是工具的配置文件
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  /**
   * 打包入口
   */
  entry: './src/index.js',
  plugins: [
    /**
     * 打包之前清除 dist 目录
     */
    new CleanWebpackPlugin(),
    /**
     * 使用 html-webpack-plugin 打包 html 文件
     * 且自动引入打包的结果 JS 文件
     */
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        removeComments: true, // 删除注释
        collapseWhitespace: true// 去除回车换行空格
      }
    }),
  ],
  /**
   * 打包出口
   * path： 需要输出一个绝对路径。基于node运行。使用path模块
   */
  output: {
    path: path.resolve(__dirname, './dist'), // 打包的结果的存储目录(必须是绝对路径)
    filename: 'main.js' // 打包的结果文件名
  },

  /**
   * mode 打包模式：如果没有指定，默认使用 production 模式打包
   * development // 开发模式打包，打包速度快，不会优化打包结果
   * production  // 生产模式打包，打包速度慢，会优化打包结果
   */
  mode: 'development',
  /**
   * 配置 Source Map 源代码地图导航
   * cheap-module-eval-source-map 将源码映射生成到结果文件中
   */
  devtool: 'cheap-module-eval-source-map',
  /**
   * webpack-dev-server 配置项
   * 工具会启动一个 web服务，并自动打包构建，它会将contentBase 设置为 WEB 服务的根目录
   * webpack-dev-server 为了提高打包效率，将打包的结果存储在内容中
   * 生产发布（上线） 打包直接 npm run build 生成物理文件
   */
  devServer: {
    contentBase: './dist',
    open: false, // 打包构建后是否自动打开浏览器
    port: 8080, // 默认端口号
    hot: true,
  },
  /**
   * 模块路径打包规则配置
   */
  resolve: {
    /**
     *  配置可以省略的文件模块后缀名
     */
    extensions: ['.wasm', '.mjs', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),  // 为路径配置别名
    }
  },
  module: {
    /**
     * 对不同的资源配置使用不同的 loader 加载器
     */
    rules: [
      /**
       * 当匹配到以.css 结尾的文件资源的时候 use使用 css 和 style loader 处理
       * 首先使用 css-loader 将 css 转为 js 模块，模块存储的就是css 文件字符串
       * 然后使用 style-loader 生成一段代码： 在运行期间，生成 style 节点，插入页面
       * 的head中
       */
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      /**
       * 当匹配到 /\.(png|jpg|gif)$/ 结尾的文件使用 use 使用file-loader 加载处理
       */
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
      /**
       * 当匹配到以下正则结尾的资源的时候 use使用 file-loader处理
       */
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',  // 3. 生成 style 节点插入 DOM
          'css-loader',   // 2. 将css转为 js 模块
          'less-loader'  // 1. 将less 转为 css ，less-loader 依赖了less
        ]
      },
      /**
       * 当匹配到以下正则 的时候使用babel-loader 将JS 中的 ES6 转为 ES5
       */
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/, // 排除第三方包
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],  // 转换规则
            cacheDirectory: true // 配置 babel 打包结果缓存， 默认会将转换结果缓存到node_modules/.cache中
          }
        }
      }
    ]
  }
}