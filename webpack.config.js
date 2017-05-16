const webpack = require('webpack')
const path = require('path')

module.exports = {
  context: path.join(__dirname, './_js'),
  entry: './main.js',
  output: {
    path: path.join(__dirname, './js'),
    filename: 'main.js',
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: 'babel-loader',
        query: {
          presets: ['es2015'],
        }
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      sourceMap: false
    })
  ]
}