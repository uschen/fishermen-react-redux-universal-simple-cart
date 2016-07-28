'use strict';
const webpack = require('webpack');
const cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsConfig = require('./webpack-isomorphic-tools.config.js');
// const StatsPlugin = require('stats-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const debug = require('debug')('app:webpack:config');

function webpackConfigCreator(config) {
  const paths = config.utils_paths;
  const _config$globals = config.globals;
  const __DEV__ = _config$globals.__DEV__;
  const __PROD__ = _config$globals.__PROD__;
  const __TEST__ = _config$globals.__TEST__;
  const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(
    webpackIsomorphicToolsConfig
  );
  debug('base', paths.dist());
  debug('context', config.path_base);

  const webpackConfig = {
    context: paths.base(),
    name: 'client',
    target: 'web',
    devtool: config.compiler_devtool,
    resolve: {
      root: [paths.base()],
      extensions: ['', '.js', '.jsx', '.scss'],
      modulesDirectories: [
        'node_modules',
        'src',
      ],
    },
    module: {},
    stats: {
      assets: false,
      colors: true,
      version: true,
      hash: true,
      timings: true,
      chunks: true,
      chunkModules: false,
      children: false,
      modules: false,
      cached: false,
      chunkOrigins: false,
    },
    progress: !__PROD__,
    debug: !__PROD__,
  };

  const APP_ENTRY_PATH = './src/client/index.js';
  webpackConfig.entry = {
    vendor: config.compiler_vendor,
    app: __DEV__
      ? [
        `webpack-hot-middleware/client?path=http://${config.webpack_dev_server_host}:${config.webpack_dev_server_port}/__webpack_hmr`,
        APP_ENTRY_PATH,
      ]
      : [APP_ENTRY_PATH],
  };

  // ------------------------------------
  // Bundle Output
  // ------------------------------------
  webpackConfig.output = {
    filename: `[name].[${config.compiler_hash_type}].js`,
    chunkFilename: '[name]-[chunkhash].js',
    path: paths.dist(),
    publicPath: config.compiler_public_path,
  };

  // ------------------------------------
  // Plugins
  // ------------------------------------
  webpackConfig.plugins = [];
  if (__PROD__) {
    webpackConfig.plugins.push(
      new CleanPlugin([config.dir_dist], {
        root: paths.base(),
      })
    );
  }
  debug(JSON.stringify(config.globals, null, 2));
  const definedVars = {
    __CLIENT__: config.globals.__CLIENT__,
    __DEV__: config.globals.__DEV__,
    __PROD__: config.globals.__PROD__,
    __DEBUG__: config.globals.__DEBUG__,
  };
  if (__PROD__) {
    definedVars['process.env.NODE_ENV'] = JSON.stringify(config.env);
  }
  webpackConfig.plugins.push(new webpack.DefinePlugin(definedVars));

  if (__DEV__) {
    debug('Enable plugins for live development (HMR, NoErrors).');
    webpackConfig.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    webpackConfig.plugins.push(new webpack.NoErrorsPlugin());
  } else if (__PROD__) {
    debug('Apply UglifyJS plugin.');
    webpackConfig.plugins.push(
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused: true,
          dead_code: true,
          warnings: false,
        },
      })
    );
  }

  webpackConfig.plugins.push(new webpack.IgnorePlugin(/webpack-stats\.json$/));
  webpackConfig.plugins.push(new webpack.IgnorePlugin(
    /\.\/(timers|any|race|call_get|filter|generators|map|nodeify|promisify|props|reduce|settle|some|progress|cancel)\.js/,
    /node_modules\/bluebird\/js\/main/
  ));
  webpackConfig.plugins.push(new webpack.IgnorePlugin(/es6\-promise/));
  // webpackConfig.plugins.push(new webpack.IgnorePlugin(/unicode/));

  // Don't split bundles during testing, since we only want import one bundle
  if (!__TEST__) {
    webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
    }));
    // webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    //   names: ['slug'],
    // }));
  }
  // ------------------------------------
  // Loaders
  // ------------------------------------
  // JavaScript / JSON
  webpackConfig.module.loaders = [{
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: {
      cacheDirectory: false,
      plugins: [
        'transform-runtime',
      ],
      presets: __DEV__
        ? ['es2015', 'react', 'stage-0']
        : ['es2015', 'react', 'stage-0'],
      env: {
        production: {
          plugins: [
            'transform-react-remove-prop-types',
            'transform-react-constant-elements',
          ],
        },
        development: {
          plugins: [
            'typecheck',
            'add-module-exports',
            'transform-react-display-name',
            ['react-transform', {
              transforms: [{
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module'],
              }, {
                transform: 'react-transform-catch-errors',
                imports: ['react', 'redbox-react'],
              }],
            }],
          ],
        },
      },
    },
  }, {
    test: /\.json$/,
    loader: 'json',
  }];

  // ------------------------------------
  // Style Loaders
  // ------------------------------------
  // We use cssnano with the postcss loader, so we tell
  // css-loader not to duplicate minimization.
  const BASE_CSS_LOADER = 'css?sourceMap&-minimize';

  // Add any packge names here whose styles need to be treated as CSS modules.
  // These paths will be combined into a single regex.
  const PATHS_TO_TREAT_AS_CSS_MODULES = [
    'react-toolbox',
  ];
  // If config has CSS modules enabled, treat this project's styles as CSS modules.
  if (config.compiler_css_modules) {
    PATHS_TO_TREAT_AS_CSS_MODULES.push(
      paths.src().replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&')
    );
  }

  const isUsingCSSModules = !!PATHS_TO_TREAT_AS_CSS_MODULES.length;
  const cssModulesRegex = new RegExp(`(${PATHS_TO_TREAT_AS_CSS_MODULES.join('|')})`);
  // Loaders for styles that need to be treated as CSS modules.
  if (isUsingCSSModules) {
    const cssModulesLoader = [
      BASE_CSS_LOADER,
      'modules',
      'importLoaders=1',
      'localIdentName=[name]__[local]___[hash:base64:5]',
    ].join('&');

    webpackConfig.module.loaders.push({
      test: /\.scss$/,
      include: cssModulesRegex,
      exclude: /vendors/,
      loaders: [
        'style',
        cssModulesLoader,
        'postcss',
        'sass?sourceMap',
        'toolbox',
      ],
    });

    webpackConfig.module.loaders.push({
      test: /\.css$/,
      include: cssModulesRegex,
      exclude: /vendors/,
      loaders: [
        'style',
        cssModulesLoader,
        'postcss',
        // 'toolbox',
      ],
    });
  }

  // Loaders for files that should not be treated as CSS modules.
  const excludeCSSModules = isUsingCSSModules ? cssModulesRegex : false;
  webpackConfig.module.loaders.push({
    test: /\.scss$/,
    exclude: excludeCSSModules,
    loaders: [
      'style',
      BASE_CSS_LOADER,
      'postcss',
      'sass?sourceMap',
      // 'toolbox',
    ],
  });

  webpackConfig.module.loaders.push({
    test: /\.less$/,
    exclude: excludeCSSModules,
    loaders: [
      'style',
      BASE_CSS_LOADER,
      'postcss',
      'less?sourceMap',
      // 'toolbox',
    ],
  });

  webpackConfig.module.loaders.push({
    test: /\.css$/,
    exclude: excludeCSSModules,
    loaders: [
      'style',
      BASE_CSS_LOADER,
      'postcss',
      // 'toolbox',
    ],
  });

  webpackConfig.module.loaders.push({
    test: /\.scss$/,
    include: /vendors/,
    loaders: [
      'style',
      BASE_CSS_LOADER,
      'postcss',
      'sass?sourceMap',
      // 'toolbox',
    ],
  });
  webpackConfig.module.loaders.push({
    test: /\.css$/,
    include: /vendors/,
    loaders: [
      'style',
      BASE_CSS_LOADER,
      'postcss',
      // 'toolbox',
    ],
  });

  // ------------------------------------
  // Style Configuration
  // ------------------------------------
  webpackConfig.sassLoader = {
    // includePaths: [paths.src('styles'), paths.base('node_modules/react-toolbox')],
  };

  webpackConfig.postcss = [
    cssnano({
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions'],
      },
      discardComments: {
        removeAll: true,
      },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
      sourcemap: true,
    }),
  ];

  // File loaders
  /* eslint-disable */
  webpackConfig.module.loaders.push(
    {
      test: /\.woff(\?.*)?$/,
      loader: 'url?prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff'
    },
    {
      test: /\.woff2(\?.*)?$/,
      loader: 'url?prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff2'
    },
    {
      test: /\.ttf(\?.*)?$/,
      loader: 'url?prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream'
    },
    {
      test: /\.eot(\?.*)?$/,
      loader: 'file?prefix=fonts/&name=fonts/[name].[ext]'
    },
    {
      test: /\.svg(\?.*)?$/,
      loader: 'url?prefix=fonts/&name=[name].[ext]&limit=10000&mimetype=image/svg+xml'
    },
    {
      test: webpackIsomorphicToolsPlugin.regular_expression('images'),
      loader: 'url-loader?limit=10240'
    }
  );

  webpackConfig.toolbox = {
    theme: paths.base('src/styles/toolbox-theme.scss')
  }
  /* eslint-enable */

  // ------------------------------------
  // Finalize Configuration
  // ------------------------------------
  // when we don't know the public path (we know it only when HMR is enabled [in development]) we
  // need to use the extractTextPlugin to fix this issue:
  // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
  if (!__DEV__) {
    debug('Apply ExtractTextPlugin to CSS loaders.');
    webpackConfig.module.loaders
      .filter((loader) => (
        loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0])
      )))
      .forEach((loader) => {
        function to$Array(arr) {
          return Array.isArray(arr) ? arr : Array.from(arr);
        }
        const loader$loaders = to$Array(loader.loaders);
        const first = loader$loaders[0];
        const rest = loader$loaders.slice(1);
        loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
        delete loader.loaders;
      });

    webpackConfig.plugins.push(
      new ExtractTextPlugin('[name].[contenthash].css', {
        allChunks: true,
      })
    );
  }

  if (__DEV__ || __TEST__) {
    // webpackConfig.plugins.push(new webpack.IgnorePlugin(/webpack-stats\.json$/));
    webpackConfig.plugins.push(webpackIsomorphicToolsPlugin.development());
  } else {
    webpackConfig.plugins.push(webpackIsomorphicToolsPlugin);
  }

  debug('config', webpackConfig.module.loaders);
  return webpackConfig;
}

module.exports = webpackConfigCreator;
