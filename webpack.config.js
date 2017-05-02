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
        loaders: [
          'babel-loader?comments=false'
        ]
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development') }
    })
  ],
  devServer: {
    contentBase: './_js',
    hot: true
  }
}