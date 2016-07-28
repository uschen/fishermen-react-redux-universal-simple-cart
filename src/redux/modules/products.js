import { createAction, handleActions } from 'redux-actions';
import { combineReducers } from 'redux';

// ------------------------------------
// Constants
// ------------------------------------
export const PRODUCTS_FETCH = 'PRODUCTS_FETCH';


// ------------------------------------
// Actions
// ------------------------------------
export const fetch = createAction(PRODUCTS_FETCH, (value) => value, (params) => {
  return {
    fetchr: {
      service: 'products',
      method: 'read',
      params,
    },
  };
});

export const actions = {
  fetch,
};

// ------------------------------------
// Reducer
// ------------------------------------
const byIdReducer = handleActions({
  [PRODUCTS_FETCH]: (state, { payload, error }) => {
    if (error) {
      return state;
    }
    return {
      ...state,
      ...payload.data.reduce((obj, product) => {
        obj[product.id] = product;
        return obj;
      }, {}),
    };
  },
}, {});

const visibleIdsReducer = handleActions({
  [PRODUCTS_FETCH]: (state, { payload, error }) => {
    if (error) {
      return state;
    }
    return payload.data.map((product) => product.id);
  },
}, []);

export default combineReducers({
  byId: byIdReducer,
  visibleIds: visibleIdsReducer,
});

export function getProductById(state, id) {
  const res = state.byId[id];
  return res;
}

export function getVisibleProducts(state) {
  return state.visibleIds.sort().map((id) => getProductById(state, id));
}
