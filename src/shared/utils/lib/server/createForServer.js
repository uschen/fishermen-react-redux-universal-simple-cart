import React from 'react';
import { Provider } from 'react-redux';
import { ReduxAsyncConnect, loadOnServer } from 'penny-redux-async-connect';

export function createForServer(store, renderProps) {
  return loadOnServer({
    ...renderProps,
    store,
  })
    .then(() => {
      const root = (
        <Provider store={store} key='provider'>
          <ReduxAsyncConnect {...renderProps} />
        </Provider>
      );
      // debug('createForServer', 'got root', 'store', store.getState());
      return {
        root,
      };
    });
}
