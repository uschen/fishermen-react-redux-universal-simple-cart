/**
 * Client Utils
 */
import React from 'react';
import { Provider } from 'react-redux';
import { ReduxAsyncConnect } from 'penny-redux-async-connect';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import ReactDOM from 'react-dom';
import _debug from 'debug';
const debug = _debug('app:clinet');

/* global debug */

export function createForClient(store, { routes, history }) {
  debug('createForClient');
  const itemFilter = (item) => !item.deferred;
  const handleRender = (props) => (
    <ReduxAsyncConnect {...props} filter={itemFilter} />
  );
  const component = (
    <Router render={handleRender} history={history}>
      {routes}
    </Router>
  );
  const root = (
    <Provider store={store} key='provider'>
      {component}
    </Provider>
  );
  return Promise.resolve({
    root,
  });
}

export function clientRender(clientStore, routes, dest) {
  debug('clientRender');
  const history = syncHistoryWithStore(browserHistory, clientStore);
  return createForClient(clientStore, {
    routes,
    history,
  })
    .then(({ root }) => {
      debug('got root');
      ReactDOM.render(
        root,
        dest
      );
    });
}
