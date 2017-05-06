import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import App from './App';
import reducer from './reducer';

import withLocalState from '../pyradux/withLocalState';

import { combineReducers } from 'redux';
function initializeStore({reducer, stateKey}){
  if(stateKey){
    reducer = combineReducers({
      [stateKey]: reducer
    })
  }
  return createStore(
    reducer
  )
}

const AppComponent = withLocalState({createStore: initializeStore, reducer}, App);
render(
  <AppComponent />,
  document.getElementById('root')
);


