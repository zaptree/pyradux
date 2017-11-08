import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

class HierarchicalStore{
  isHierarchical = true;
  constructor(store, parent, storeContext){
    this.storeContext = storeContext;
    // todo: use map instead and use store as key for faster removal?
    this.parent = parent;
    if(parent){
      parent.addChild(this);
    }
    this.store = store;
    this.children = [];
    this.listeners = [];
    this.eventListeners = {};
    this.dispatch = this.dispatch.bind(this);
    this.getState = this.getState.bind(this);
    this.unsubscribe = this.store.subscribe(()=>{
      // improve performance by not running anything if state did not change
      if(this.store.getState() !== this.localState){
        this.setState();
        this.trigger();
      }
    });
    // initialize the state
    this.setState();
  }
  addChild(store){
    this.children = this.children.concat(store);
  }
  trigger(){
    this.listeners.forEach(listener=> {
      listener();
    });
    this.children.forEach(childState=> childState.trigger());
  }
  removeChild(store){
    if(this.children){
      this.children = this.children.filter(item=> item !== store);
    }
  }
  getFullState(){
    // TODO: implement getting the state including all children getFullState methods and merging
  }
  triggerEventListeners(eventName, data){
    if(this.eventListeners[eventName]){
      this.eventListeners[eventName].callbacks.forEach(callback=>callback(data));
    }
  }
  onEvent(eventName, callback){
    if(!this.eventListeners[eventName]){
      this.eventListeners[eventName] = {
        callbacks: [],
      };
    }
    this.eventListeners[eventName].callbacks.push(callback);
  }

  /**
   * method to dispatch actions
   * @param {object} action - action
   */
  dispatch(action){
    // if some async action is calling dispatch but the Hierarchical store is closed
    if(this.closed){
      return;
    }
    // if the global flag was passed into the action that means we want the root store to dispatch
    if(action.$global && this.parent){
      return this.parent.dispatch(action);
    }
    const storeContext = action.$storeContext;
    // storeContext allows parent components to dispatch more targeted actions
    if(!storeContext || storeContext===this.storeContext){
      this.store.dispatch(action);
    }
    let childAction = action;
    if(this.children.length){
      childAction = {
        ...action,
        $dispatchFromParent: true,
      };
      if(action.$global){
        childAction.$global = undefined;
      }
    }
    this.children.forEach(childStore=>{

      childStore.dispatch(childAction);
    });
    if(!action.$dispatchFromParent){
      this.triggerEventListeners('rootDispatch', action);
    }
  }
  subscribe(listener){
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }

    this.listeners = this.listeners.concat(listener);

    return ()=> {
      if(this.listeners){
        this.listeners = this.listeners.filter(item=> item !== listener);
      }
    };
  }
  setState(){
    // console.info('--------------------SET STATE WAS RUN----------------------------');
    const localState = this.store.getState();

    if(!this.parent){
      this.state = localState;
    }else{
      const parentState = this.parent.getState();

      // we only want to create a new object for merged state if there were changes to
      // either parent or local state to avoid pointlessly creating new objects
      // Now that we stop subscribe from firing setState if there was no change in state
      // this check probably pointless
      if(parentState !== this.parentState || localState !== this.localState){
        // console.info('--------------------MERGING STATE----------------------------');
        this.state = {
          ...parentState,
          ...localState
        }
      }
      this.parentState = parentState;
    }
    this.localState = localState;
    // we need to update the state of children
    this.children.forEach(childStore=>{
      childStore.setState();
    });

  }
  getState(){
    return this.state;
  }
  close(){
    this.closed = true;
    this.children = null;
    this.listeners = null;
    this.eventListeners = null;
    this.unsubscribe();
    if(this.parent){
      this.parent.removeChild(this);
    }
  }
}

function createHierarchicalStore(store, parent, storeContext){
  return new HierarchicalStore(store, parent, storeContext);
}

export default createHierarchicalStore;
