import React from 'react';
import createHistory from 'react-router/lib/createMemoryHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import { match } from 'react-router';
import { getGlobalLoadingState } from 'penny-redux-async-connect';
import { renderToString } from 'react-dom/server';
import PrettyError from 'pretty-error';
import getTools from './tools';
import { createForServer } from './createForServer';
import getStatusFromRoutes from '../helpers/getStatusFromRoutes';
import Html from '../../../components/lib/Html/Html';

import _debug from 'debug';
const debug = _debug('app:server:render');

const tools = getTools();
const pretty = new PrettyError();

export default function renderCreator(configureStore, getRoutes, env, fetchrActions) {
  return function handleRender(req, res) {
    if (env === 'development') {
      // debug('handleRender', 'env === development', 'refresh');
      // refresh webpack isomophic tool
      tools.refresh();
    }
    // fetchr config
    const fetchrConfig = {
      xhrPath: '/api',
      xhrTimeout: 4000,
      context: {
        // _csrf: req.csrfToken() // Make sure all XHR requests have the CSRF token
      },
      req,
    };

    const memoryHistory = createHistory(req.originalUrl);
    const store = configureStore(memoryHistory);
    const history = syncHistoryWithStore(memoryHistory, store);
    store.dispatch(fetchrActions.set(fetchrConfig));
    debug('location', req.originalUrl);
    const routes = getRoutes(store);
    const location = req.originalUrl;
    match({
      history,
      location,
      routes,
    }, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (error) {
        console.error('ROUTER ERROR:', pretty.render(error));
        res.status(500);
      } else if (renderProps) {
        // rootComponent
        // debug('got renderProps', renderProps);
        createForServer(store, renderProps)
          .then(({ root }) => {
            store.dispatch(fetchrActions.clearReq());
            // debug('got root', 'state', store.getState());
            const status = getStatusFromRoutes(renderProps.routes);
            if (status) {
              res.status(status);
            }
            const globalLoadingState = getGlobalLoadingState(store.getState().reduxAsyncConnect);
            const reduxAsyncError = globalLoadingState.error;
            if (reduxAsyncError) {
              const errorCode = reduxAsyncError.code ||
                reduxAsyncError.statusCode ||
                reduxAsyncError.status ||
                500;
              res.status(errorCode);
            }
            debug('renderToString');
            res.send('<!doctype html>\n' +
              renderToString(
                <Html assets={tools.assets()} component={root} store={store} />
              )
            );
            // debug('sent to client', store.getState());
          });
      } else {
        res.status(404).send('Not found');
      }
    });
  };
}
