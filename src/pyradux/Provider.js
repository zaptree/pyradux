import React, { Component, Children } from 'react';

class HierarchicalStore{
  constructor(store, parent){
    // todo: use map instead and use store as key for faster removal?
    this.parent = parent;
    if(parent){
      parent.addChild(this);
    }
    this.store = store;
    this.children = [];
    this.dispatch = this.dispatch.bind(this);
    this.getState = this.getState.bind(this);
  }
  addChild(store){
    this.children.concat(store);
  }
  removeChild(store){
    this.children = this.children.filter(item=> item !== store);
  }
  dispatch(action){
    // call dispatch on our redux store but also call dispatch on our children
    // this cascades dispatches down the component tree
    this.store.dispatch(action);
    this.children.forEach(store=>{
      store.dispatch(action);
    });
  }
  subscribe(){
    // todo: implement this, it should return an unsubscribe method
  }
  getState(){
    const localState = this.store.getState();

    if(!this.parent){
      return localState;
    }
    const parentState = this.parent.getState();

    // we only want to create a new object for merged state if there were changes to
    // either parent or local state to avoid pointlessly creating new objects
    if(parentState !== this.parentState || localState !== this.localState){
      this.mergedState = {
        ...parentState,
        ...localState
      }
    }
    this.parentState = parentState;
    this.localState = localState;
    return this.mergedState;
  }
  close(){
    this.children = null;
    if(this.parent){
      this.parent.removeChild(this);
    }
  }
}

export default class Provider extends Component {
  constructor(props, context) {
    super(props, context);

    this.store = new HierarchicalStore(props.store, context && context.store);
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
  store: React.PropTypes.object
};
Provider.childContextTypes = {
  store: React.PropTypes.object,
  createStore: React.PropTypes.func
};
