const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const path = require('path')

module.exports = (env, options) => {
  return {
    mode: options.mode == 'development' ? 'development' : 'production',
    entry: './src/main.js',
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'docs')
    },

    devtool: options.mode == 'development' ? 'eval' : false,

    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.scss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),

      new HtmlWebpackPlugin({
        template: __dirname + '/src/index.html',
        inject: 'head',
        scriptLoading: 'blocking'
      }),

      new CopyPlugin({
        patterns: [{ from: './src/assets', to: 'assets' }]
      })
    ],
    devServer: {
      port: 3310,
      client: {
        overlay: true
      },
      hot: true
    }
  }
}
