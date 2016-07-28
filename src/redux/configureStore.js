import rootReducer from './rootReducer';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import fetchrMiddleware from './../shared/utils/lib/redux/middleware/fetchrMiddleware';
import promiseMiddleware from 'redux-promise';

function hmr(store) {
  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }
}

function withDevTools(middlewares) {
  return window.devToolsExtension ? compose(middlewares, window.devToolsExtension()) : middlewares;
}

/**
 * https://github.com/bdefore/universal-redux/blob/master/src/shared/create.js
 *
 * @param {[type]} options.providedMiddlewares [description]
 * @param {[type]} options.history             [description]
 * @param {[type]} options.data                [description]
 * @return {[type]} [description]
 */
export default function configureStore(history, initialState) {
  const useDevtools = __DEV__ && __CLIENT__ && __DEBUG__;
  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(
    fetchrMiddleware(),
    promiseMiddleware,
    routerMiddleware(history)
  );
  if (useDevtools) {
    middleware = withDevTools(middleware);
  }

  const store = createStore(rootReducer, initialState, middleware);
  hmr(store);
  return store;
}
