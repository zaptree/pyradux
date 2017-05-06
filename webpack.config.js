'use strict';
const webpack = require('webpack');

module.exports = {
  // not sure what env is used for
  env: process.env.NODE_ENV,
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index.js',
    library: 'Pyradux',
    libraryTarget: 'umd'
  },
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'prop-types': {
      root: 'PropTypes',
      commonjs2: 'prop-types',
      commonjs: 'prop-types',
      amd: 'prop-types'
    }
  },
  stats: {
    colors: true,
    reasons: true
  },
  resolve: {
    // We can now require('file') instead of require('file.jsx')
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin(),
    // process.env.NODE_ENV is used by react so setting to production will make the bundle smaller
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
    }),
    // optimizes the IDs for your modules prioritizing more often used ones
    new webpack.optimize.OccurenceOrderPlugin(),
    // not sure what the dedupe plugin is for
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  // https://webpack.github.io/docs/configuration.html#devtool
  devtool: 'source-map'
};
