/**
 * fetchrMiddleware.js
 *
 * redux middleware that checks `action.meta.fetchr` and generate fetchr request
 * (promise) as `action.payload` that will be handled by the next middleware (redux-promise)
 */
import Promise from 'bluebird';
import Fetchr from 'fetchr';
import _debug from 'debug';
const debug = _debug('app:redux:middlewares:fetchr');

export default function fetchrMiddleware() {
  debug('fetchrMiddleware');
  // signature of middleware:
  // store => next => action => ...
  return ({ dispatch, getState }) => {
    return (next) => (action) => {
      const { type, payload, error, meta } = action;
      debug('start', 'err', error && error.name, type, meta);
      if (!meta || !meta.fetchr || error) {
        // debug(type, 'no meta or meta.fetchr');
        return next(action);
      }
      if (meta.fetchr.loaded) {
        // debug('meta.fetchr.loaded', type);
        return next(action);
      }
      // debug(type, meta);
      const fetchr = meta.fetchr;
      const { service, method, params, body, config } = fetchr;
      const fetchrConfig = getState().fetchr;
      // debug(type, 'got fetchrConfig');
      const fetchrInstance = new Fetchr(fetchrConfig);
      // debug(type, 'got fetchrInstance');
      const fetchrService = fetchrInstance[method](service);
      // debug(type, 'got fetchrService');
      const createFetchrPromise = () => (
        new Promise((resolve, reject) => {
          fetchrService
            .params(params || {})
            .body(body || {})
            .clientConfig(config || { timeout: 10000 })
            .end((err, res) => {
              if (err) {
                return reject(err);
              }
              return resolve(res);
            });
        })
      );
      return createFetchrPromise()
        .then((res) => {
          // debug('resolve', type, params);
          const newPayload = Object.assign(
            {},
            { data: res.data },
            { req: { service, method, params, body, config } }
          );
          next({
            ...action,
            payload: newPayload,
            meta: Object.assign(
              {},
              meta,
              { fetchr: Object.assign({}, meta.fetchr, { loaded: true }) }),
          });
          return newPayload.data;
        })
        .catch((err) => {
          debug('reject', type, err);
          const newError = new Error(err.message);
          if (err.meta &&
            err.meta.error) {
            const errBody = err.meta.error;
            newError.name = errBody.name;
            newError.message = errBody.message;
            newError.code = errBody.code;
            newError.errors = errBody.errors;
          }
          next({ ...action, error: true, payload: newError });
          return Promise.reject(newError);
        });
    };
  };
}
