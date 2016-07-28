import Express from 'express';
import favicon from 'serve-favicon';
import path from 'path';
import helmet from 'helmet';
// import csrf from 'csurf';
import _debug from 'debug';
import config from '../../config';
import bodyParser from 'body-parser';
// import webpack from 'webpack';
// import webpackConfig from '../../build/webpack.config';
// fetchr services
import Fetchr from './services';

const debug = _debug('app:server');
const paths = config.utils_paths;
const app = new Express();

// config express app
app.set('state namespace', 'App');
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.disable('x-powered-by');

app.use(favicon(path.join(__dirname, '..', 'statics', 'favicon.ico')));

// app.use(csrf());
// protect your XHR paths from CSRF attacks by adding a middleware in
// front of the fetchr middleware:
app.use('/api', [bodyParser.json(), Fetchr.middleware()]);

if (config.env === 'development') {
  // debug('env', 'development');
  // const compiler = webpack(webpackConfig);

  // // Enable webpack-dev and webpack-hot middleware
  // const {publicPath} = webpackConfig.output;

  // app.use(require('./middlewares/webpack-dev')(compiler, publicPath));
  // app.use(require('./middlewares/webpack-hmr')(compiler));

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  // app.use(Express.static(paths.client('static')));
} else {
  debug(
    'Server is being run outside of live development mode. This starter kit ' +
    'does not provide any production-ready server functionality. To learn ' +
    'more about deployment strategies, check out the "deployment" section ' +
    'in the README.'
  );

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(Express.static(paths.base(config.dir_dist)));
}

export default app;
