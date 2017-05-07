import { compose } from 'redux';
import createHierarchicalStore from './HierarchicalStore';

export default function createApplyMiddleware(parentStore, storeContext){

  /**
   * This is pretty much a copy of the redux middleware just augmenting the store to be a hierarchical store
   *
   * @param {...Function} middlewares The middleware chain to be applied.
   * @returns {Function} A store enhancer applying the middleware.
   */
  return function applyMiddleware(...middlewares) {
    return (createStore) => (reducer, preloadedState, enhancer) => {
      const _store = createStore(reducer, preloadedState, enhancer);
      const store = createHierarchicalStore(_store, parentStore, storeContext);
      let dispatch = store.dispatch;

      const middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action)
      };
      const chain = middlewares.map(middleware => middleware(middlewareAPI));
      dispatch = compose(...chain)(store.dispatch);
      // store.dispatch = dispatch;
      return {
        ...store,
        dispatch
      }
    }
  };
}
