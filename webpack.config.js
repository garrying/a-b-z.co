const path = require('path');

module.exports = {
  context: path.join(__dirname, './_js'),
  entry: './main.js',
  output: {
    path: path.join(__dirname, './js'),
    filename: 'main.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: 'babel-loader',
        query: {
          presets: ['env'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
