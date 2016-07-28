//  enable runtime transpilation to use ES6/7 in node

/* eslint-disable */
var fs = require('fs');
var path = require('path');

var babelrc = fs.readFileSync(path.resolve(__dirname, '../.babelrc'));
var babelConfig;

try {
  babelConfig = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your babelrc');
  console.error(err);
}

/* eslint-enable */

require('babel-register')(babelConfig);

const config = require('../config');
const debug = require('debug')('app:bin:server');

/**
 * Define isomorphic constants.
 */
global.__DEV__ = config.globals.__DEV__;
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEBUG__ = config.globals.__DEBUG__;
global.__DISABLE_SSR__ = false; // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEBUG_NEW_WINDOW__ = false;

debug('__DEV__', __DEV__);
const port = config.server_port;

const app = require('./../src/server/app');
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const webpackIsomorphicToolsConfig = require('../src/shared/utils/lib/build/webpack-isomorphic-tools.config');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(webpackIsomorphicToolsConfig)
  .development(__DEV__);

const dataProvider = require('./../src/server/models');
const mongoose = dataProvider.utils.mongoose;
const co = require('co');

mongoose.connectAsync(config.server_mongoose_url)
  .then(co.wrap(function *() {
    const cart = yield dataProvider.Cart.getOne();
    if (!cart) {
      yield dataProvider.Cart.addOne({ _id: 'default_cart' });
    }
  }))
  .then(() => {
    global.webpackIsomorphicTools
      .server(config.path_base, () => {
        debug('will start server');
        app.use(require('./../src/server/render'));
        app.listen(port);
        debug(`Server is now running at localhost: ${port}.`);
      });
  })
