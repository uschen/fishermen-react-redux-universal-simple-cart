'use strict';
/* eslint key-spacing:0 spaced-comment:0 */
const _debug = require('debug');
const path = require('path');
const yargs = require('yargs');
const argv = yargs.argv;

const debug = _debug('app:config:_base');
const config = {
  env: process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base: path.resolve(__dirname, '../'),
  dir_src: 'src',
  dir_client: 'src/client',
  dir_dist: 'dist',
  dir_server: 'src/server',
  dir_test: 'tests',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host: 'localhost',
  server_port: process.env.PORT || 3000,
  server_mongoose_url: process.env.MONGODB_URI || 'mongodb://127.0.0.1',

  // ----------------------------------
  // Webpack Dev Server Configuration
  // ----------------------------------
  webpack_dev_server_host: 'localhost',
  webpack_dev_server_port: 3001,
  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_css_modules: true,
  compiler_devtool: 'inline-source-map',
  compiler_hash_type: 'hash',
  compiler_fail_on_warning: false,
  compiler_quiet: false,
  compiler_public_path: '/static/',
  compiler_stats: {
    chunks: false,
    chunkModules: false,
    colors: true,
  },
  compiler_vendor: [
    'bluebird',
    'classnames',
    'debug',
    'react',
    'react-redux',
    'react-router',
    'redux',
    'redux-actions',
    'redux-promise',
    'penny-redux-async-connect',
    'react-router-redux',
    'react-helmet',
    // 'lodash',
    'fetchr',
    'normalize.css',
  ],

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_enabled: !argv.watch,
  coverage_reporters: [
    {
      type: 'text-summary',
    },
    {
      type: 'html',
      dir: 'coverage',
    },
  ],
};

/************************************************
-------------------------------------------------
All Internal Configuration Below
Edit at Your Own Risk
-------------------------------------------------
************************************************/

// ------------------------------------
// Environment
// ------------------------------------
config.globals = {
  'process.env': {
    'NODE_ENV': JSON.stringify(config.env),
  },
  'NODE_ENV': config.env,
  '__DEV__': config.env === 'development',
  '__PROD__': config.env === 'production',
  '__TEST__': config.env === 'test',
  '__DEBUG__': config.env === 'development' && !argv.no_debug,
  '__CLIENT__': true,
  '__DEBUG_NEW_WINDOW__': !!argv.nw,
  '__BASENAME__': JSON.stringify(process.env.BASENAME || ''),
  '__LOGGER__': false,
  'DEBUG': 'app:*',
};

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json');

config.compiler_vendor = config.compiler_vendor
  .filter((dep) => {
    if (pkg.dependencies[dep]) return true;

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
` +
      'Consider removing it from vendor_dependencies in ~/config/index.js'
    );
  });

// ------------------------------------
// Utilities
// ------------------------------------
config.utils_paths = (() => {
  const resolve = path.resolve;

  var base = function base() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return resolve.apply(resolve, [config.path_base].concat(args));
  };

  return {
    base: base,
    src: base.bind(null, config.dir_src),
    client: base.bind(null, config.dir_client),
    dist: base.bind(null, config.dir_dist),
  };
})();

module.exports = config;
