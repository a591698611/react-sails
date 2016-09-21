import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from '../../reducers/reducers';

import App from '../App';
import Chat from '../Chat';
import Todos from '../Todos';

const initialState = window.__INITIAL_STATE__;
const store = createStore(todoApp, initialState);

const rootRoute = {
  childRoutes: [{
    path: '/',
    component: App,
    childRoutes: [Chat, Todos]
  }]
};

render((
  <Provider store={store}>
    <Router history={browserHistory} routes={rootRoute} />
  </Provider>
), document.getElementById('body'));
