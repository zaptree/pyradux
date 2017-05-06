import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

class HierarchicalStore{
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
    this.children = this.children.filter(item=> item !== store);
  }

  /**
   * method to dispatch actions
   * @param {object} action - action
   * @param {object} [options] - extra options
   * @param {boolean} [options.global] - flag for making dispatch global
   */
  dispatch(action, options){
    // if the global flag was passed into the action that means we want the root store to dispatch
    if(options && options.global && this.parent){
      return this.parent.dispatch(action, options);
    }
    const storeContext = options && options.storeContext;
    // storeContext allows parent components to dispatch more targeted actions
    if(!storeContext || storeContext===this.storeContext){
      this.store.dispatch(action);
    }
    this.children.forEach(childStore=>{
      // we don't want to pass down the global option since it will just cause an infinite loop
      let options;
      if(storeContext){
        options = {
          storeContext
        };
      }
      childStore.dispatch(action, options);
    });
  }
  subscribe(listener){
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }

    this.listeners = this.listeners.concat(listener);

    return ()=> {
      this.listeners = this.listeners.filter(item=> item !== listener);
    };
  }
  setState(){
    console.info('--------------------SET STATE WAS RUN----------------------------');
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
        console.info('--------------------MERGING STATE----------------------------');
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
    this.children = null;
    this.listeners = null;
    this.unsubscribe();
    if(this.parent){
      this.parent.removeChild(this);
    }
  }
}

export default class Provider extends Component {
  constructor(props, context) {
    super(props, context);

    this.store = new HierarchicalStore(props.store, context && context.store, props.storeContext);
    this.createStore = this.props.createStore;

  }
  componentWillUnmount(){
    this.store.close();
  }
  getChildContext() {
    return {
      store: this.store,
      createStore: this.createStore
    }
  }

  render() {
    return Children.only(this.props.children)
  }
}
Provider.contextTypes = {
  store: PropTypes.object
};
Provider.childContextTypes = {
  store: PropTypes.object,
  createStore: PropTypes.func
};
