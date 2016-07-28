import { createAction, handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import _remove from 'lodash/fp/remove';
import _find from 'lodash/fp/find';

// ------------------------------------
// Constants
// ------------------------------------
export const CART_FETCH = 'CART_FETCH';
export const CART_UPDATE = 'CART_UPDATE';
export const CART_ADD_PRODUCT = 'CART_ADD_PRODUCT';
export const CART_REMOVE_PRODUCT = 'CART_REMOVE_PRODUCT';

// ------------------------------------
// Actions
// ------------------------------------
export const fetch = createAction(CART_FETCH, (value) => value, (params) => {
  return {
    fetchr: {
      service: 'cart',
      method: 'read',
      params,
    },
  };
});

export const update = createAction(CART_UPDATE, (value) => value, (body) => {
  return {
    fetchr: {
      service: 'cart',
      method: 'update',
      body,
    },
  };
});

export const addProduct = createAction(CART_ADD_PRODUCT);
export const removeProduct = createAction(CART_REMOVE_PRODUCT);

export const actions = {
  fetch,
  update,
  addProduct,
  removeProduct,
};

// ------------------------------------
// Reducer
// ------------------------------------
const defaultCartReducer = handleActions({
  [CART_FETCH]: (state, { payload, error }) => {
    if (error) {
      return state;
    }
    return payload.data[0];
  },
  [CART_UPDATE]: (state, { payload, error }) => {
    if (error) {
      return state;
    }
    return payload.data[0];
  },
  [CART_ADD_PRODUCT]: (state, { payload, error }) => {
    if (error) {
      return state;
    }
    return {
      ...state,
      ...{
        products: [
          ...state.products, ...[payload],
        ],
      },
    };
  },
  [CART_REMOVE_PRODUCT]: (state, { payload, error }) => {
    if (error) {
      return state;
    }
    return {
      ...state,
      ...{
        products: _remove({ id: payload.id })(state.products),
      },
    };
  },
}, {
  products: [],
});

export default combineReducers({
  defaultCart: defaultCartReducer,
});

export function getCart(state) {
  return state.defaultCart;
}

export function isProductInCart(state, product) {
  return !!_find({ id: product.id })(state.defaultCart.products);
}
