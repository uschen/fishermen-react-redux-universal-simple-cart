// import _debug from 'debug';
import { createAction, handleActions } from 'redux-actions';

const initialState = {
  xhrPath: '/api',
  xhrTimeout: 4000,
  context: {
    _csrf: null,
  },
};

export const FETCHR_SET = 'FETCHR_CONFIG_SET';
export const FETCHR_CLEAR_REQ = 'FETCHR_CLEAR_REQ';

export const set = createAction(FETCHR_SET);
export const clearReq = createAction(FETCHR_CLEAR_REQ);

export const actions = {
  set,
  clearReq,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FETCHR_SET]: (state, { payload }) => payload,
  [FETCHR_CLEAR_REQ]: (state, { payload, error }) => {
    if (error) {
      return state;
    }
    const newState = Object.assign({}, state);
    delete newState.req;
    return newState;
  },
}, initialState);
