import React from 'react';
import { Route, IndexRoute } from 'react-router';
// const debug = require('debug')('app:routes');
// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import App from './../containers/App/App';
import Home from './../containers/Home/Home';
import NotFound from './../containers/NotFound/NotFound';
import Products from './../containers/Products/Products';
import Product from './../containers/Products/Product';
import Cart from './../containers/Cart/Cart';

const RootRoutes = () => (
  /**
   * Please keep routes in alphabetical order
   */
  <Route name='Home' path='/' component={App}>
    <IndexRoute displayName='Home' component={Home} />
    <Route path='products' >
      <IndexRoute displayName='Products' component={Products} />
      <Route displayName='Product' path=':id' component={Product} />
    </Route>
    <Route path='cart' displayName='Cart' component={Cart} />
    <Route path='/404' component={NotFound} />
    <Route path='*' component={NotFound} />
  </Route>
);

RootRoutes.displayName = 'Root Routes';

export default RootRoutes;
