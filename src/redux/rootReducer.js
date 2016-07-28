import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'penny-redux-async-connect';
import app from './modules/app';
import fetchr from './modules/fetchr';
import products from './modules/products';
import cart from './modules/cart';

export default combineReducers({
  fetchr,
  reduxAsyncConnect,
  app,
  products,
  cart,
  routing: router,
});
