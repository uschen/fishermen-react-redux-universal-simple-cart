/**
 * Client entry point
 * @type {String}
 */
require('babel-runtime/core-js/promise').default = require('bluebird');
// enable debug (for right now)
localStorage.debug = 'app:*';
import React from 'react';
import { browserHistory } from 'react-router';
import getRoutes from './../routes';
import configureStore from '../redux/configureStore';
import { clientRender } from './../shared/utils/lib/client/utils';

const initialState = window.__INITIAL_STATE__;
const store = configureStore(browserHistory, initialState);
const destEle = document.getElementById('content');
const routes = getRoutes(store);

// TODO: check __DEV__ var
clientRender(store, routes, destEle);
