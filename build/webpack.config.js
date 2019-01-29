const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const publicPath = '/static/'

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].js',
    publicPath
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: [
          path.resolve(__dirname, '..', 'node_modules')
        ],
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '..')
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true
    }),
    new CopyWebpackPlugin([path.resolve(__dirname, '../src/worker/controller.js')])
  ],
  devtool: 'source-map',
  devServer: {
    port: 8080,
    historyApiFallback: {
      verbose: true,
      rewrites: [
        { from: /.*/, to: `${publicPath}index.html` },
      ],
    }
  }
}