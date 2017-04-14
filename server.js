'use strict';

const path = require('path');

const express = require('express'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  webpackDevMiddleware = require("webpack-dev-middleware"),
  webpack = require("webpack");

const	webpackConfig = require('./webpack.config.development'),
  pkg = require('./package.json');

const app = express(),
  compiler = webpack(webpackConfig);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(webpackDevMiddleware(compiler, {
  noInfo: false, // display no info to console (only warnings and errors)
  quiet: false, // display nothing to the console
  lazy: false, // switch into lazy mode, that means no watching, but recompilation on every request
  // watch options (only lazy: false)
  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  },
  publicPath: webpackConfig.output.publicPath, // public path to bind the middleware to, use the same as in webpack
  headers: { "X-Webpack-Dev-Server": "true" }, // custom headers
  stats: {
    colors: true // options for formating the statistics
  }

}));
app.use(require("webpack-hot-middleware")(compiler));

app.use(express.static('./src'));

app.use('/api/*', function (req, res) {
  setTimeout(()=>{
    const path = req.params[0];

    if(path === 'list' && !req.headers['auth-token']){
      res.statusCode = 401;
      return res.json({
        errors: [
          {
            message: 'You are not authorized'
          }
        ]
      });
    }
    if(path === 'login'){
      if(req.body.password === 'password1234' && req.body.username==='test@redux-boilerplate.com'){
        return res.json({
          errors: null,
          result: {
            success: true,
            token: 'sadkfjas9d8fasdklfjaskdfjasdlkfjasdf',
            username: 'Test Tester',
            email: req.body.username
          }
        })
      }
      res.statusCode = 401;
      return res.json({
        errors: [
          {
            message: 'Login Failed'
          }
        ],
        result: {
          success: false
        }
      })
    }
    const mockData = require('./mock-api-response');
    res.json({
      errors: null,
      result: mockData[req.originalUrl]
    });
  }, 300);


});

app.get('*', function (req, res, next) {
  var filename = path.join(compiler.outputPath, 'index.html');
  compiler.outputFileSystem.readFile(filename, function(err, result){
    if (err) {
      return next(err);
    }
    res.set('content-type','text/html');
    res.send(result);
    res.end();
  });
});

app.listen(3000, function () {
  console.log(pkg.name + ' listening on port 3000!');
});
