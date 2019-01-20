const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const publicPath = '/static/'

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: 'bundle.js',
    publicPath
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: path.resolve(__dirname, '..', 'node_modules'),
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
    })
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