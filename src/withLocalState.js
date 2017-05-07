import React, { Component } from 'react';
import Provider from './Provider';
import PropTypes from 'prop-types';
import createHierarchicalStore from './HierarchicalStore';
import createApplyMiddleware from './createApplyMiddleware'

export default function withLocalState({createStore, ...options}, WrappedComponent) {
  class WithLocalStateComponent extends Component {
    constructor(props, context){
      super(props, context);
      this.createStore = createStore || context.createStore;
      if(!this.createStore){
        throw new Error('No createStore method available to create local store');
      }
      if(!options.reducer){
        throw new Error('withLocalState expects the reducer property to be set');
      }

      this.store = this.createStore({
        ...options,
        applyMiddleware: createApplyMiddleware(context && context.store, props.storeContext)
      });

      // if createStore does not use the applyMiddleware passed in the we create the hierarchical store here
      if(!this.store.isHierarchical){
        this.store = createHierarchicalStore(this.store, context && context.store, props.storeContext);
      }


      // this.store = this.createStore(options);

    }
    render() {
      return (
        <Provider store={this.store} createStore={this.createStore} storeContext={this.props.storeContext}>
          <WrappedComponent {...this.props} />
        </Provider>
      );
    }
  }
  WithLocalStateComponent.contextTypes = {
    store: PropTypes.object,
    createStore: PropTypes.func
  };
  return WithLocalStateComponent
}
