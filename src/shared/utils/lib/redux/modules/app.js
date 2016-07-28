// import Promise from 'bluebird';
import _debug from 'debug';
import { createAction, handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { BEGIN_GLOBAL_LOAD, END_GLOBAL_LOAD } from 'penny-redux-async-connect/lib/asyncConnect';

const debug = _debug('app:redux:modules:app');

// ------------------------------------
// Constants
// ------------------------------------
export const SET_SIDEBAR_ITEMS = 'APP_SET_SIDEBAR_ITEMS';
export const TOGGLE_SIDEBAR_ACTIVE = 'APP_TOGGLE_SIDEBAR_ACTIVE';

// ------------------------------------
// Actions
// ------------------------------------
export const setSidebarItems = createAction(SET_SIDEBAR_ITEMS);
export const toggleSidebarActive = createAction(TOGGLE_SIDEBAR_ACTIVE, () => null);

export const actions = {
  setSidebarItems,
  toggleSidebarActive,
};

// ------------------------------------
// Reducer
// ------------------------------------

const globalLoadingStateReducer = handleActions({
  [BEGIN_GLOBAL_LOAD]: () => ({
    loading: true,
  }),
  [END_GLOBAL_LOAD]: () => ({
    loading: false,
  }),
}, { loading: false });


export default combineReducers({
  globalLoadingState: globalLoadingStateReducer,
});

export function isGlobalLoading(state) {
  return state.globalLoadingState.loading;
}
