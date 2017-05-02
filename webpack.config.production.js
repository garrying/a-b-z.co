const assign = require('lodash/assign')
const webpack = require('webpack')
const config = require('./webpack.config')

module.exports = assign({}, config, {
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production') }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
})