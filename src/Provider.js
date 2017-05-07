import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

export default class Provider extends Component {
  constructor(props, context) {
    super(props, context);

    // this.store = new HierarchicalStore(props.store, context && context.store, props.storeContext);
    this.store = props.store;
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
