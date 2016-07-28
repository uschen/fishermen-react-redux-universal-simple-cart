'use strict';
const Express = require('express');
const webpack = require('webpack');
const config = require('../config');
// const debug = require('debug')('app:bin:server');
const webpackConfig = require('./../build/webpack.config');
// webpackConfig.output.publicPath = 'http://' + config.webpack_dev_server_host + ':' + config.webpack_dev_server_port + '/dist/'
const compiler = webpack(webpackConfig);
// const host = config.webpack_dev_server_host;
const port = config.webpack_dev_server_port;
const serverOptions = {
  contentBase: `http://${config.webpack_dev_server_host}:${config.webpack_dev_server_port}`,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  reload: true,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: { colors: true },
};

const app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
