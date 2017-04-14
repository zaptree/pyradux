'use strict';
const webpack = require('webpack'),
  autoprefixer = require('autoprefixer'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');

const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

module.exports = {
  // not sure what env is used for
  env: process.env.NODE_ENV,
  // https://webpack.github.io/docs/code-splitting.html#split-app-and-vendor-code
  entry: {
    app: ['whatwg-fetch', './src/app/index.js', hotMiddlewareScript],
    vendor: ['react', 'react-router', 'react-dom', 'react-redux', 'redux-saga'/*, hotMiddlewareScript*/],
  },
  output: {
    path: __dirname + '/build',
    filename: 'js/bundle.js',
    publicPath: '/'
    // publicPath: 'http://localhost:3000/'
  },
  stats: {
    colors: true,
    reasons: true
  },
  resolve: {
    // We can now require('file') instead of require('file.jsx')
    extensions: ['', '.js', '.jsx', '.less']
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', [
          'css?sourceMap',
          'postcss'
        ].join('!'))
        // loaders: [
        // 	'style',
        // 	'css?sourceMap',
        // 	'postcss-loader'
        // ]
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', [
          'css?sourceMap',
          'less?outputStyle=compressed',
          'postcss'
        ].join('!'))
        // loaders: [
        // 	'style',
        // 	'css?sourceMap',
        // 	'less?sourceMap',
        // 	'postcss-loader'
        // ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          // do not set presets: ['es2015' ...] if you want it to read from .babelrc
          // presets: ['es2015'],
          cacheDirectory: './tmp/babel_cache_directory'
        }
      },
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(svg|woff|woff2)(\?.*)?$/,
        loader: 'url-loader?limit=15000'
      },
      {
        test: /\.(png|jpg|jpeg|gif|ttf|eot|svg|woff|woff2)(\?.*)?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // this extracts the entry.vendor modules to their own js file
    new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.bundle.js'),
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin(),
    // process.env.NODE_ENV is used by react so setting to production will make the bundle smaller
    new webpack.DefinePlugin({
      'process.env.SERVER_ENV': JSON.stringify('development'),
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
    }),
    new webpack.HotModuleReplacementPlugin(),
    // optimizes the IDs for your modules prioritizing more often used ones
    new webpack.optimize.OccurenceOrderPlugin(),

    // This plugin moves all the CSS into a separate stylesheet
    new ExtractTextPlugin('css/app.css', { allChunks: true })
  ],
  postcss: function () {
    return [autoprefixer({
      browsers: ['last 3 versions']
    })];
  },
  devServer: {
    contentBase: './src',
    port: 3000,
    historyApiFallback: true
  },
  // https://webpack.github.io/docs/configuration.html#devtool
  devtool: 'source-map'
};
