// FIXME: this is probably pointless, I just need to add subscribe and
// FIXME: unsubscribe to the hierarchical store and then just use connect
// FIXME: from react-redux

import React, { Component } from 'react';

export default function connectLocal(mapStateToProps, mapDispatchToProps) {
  return (WrappedComponent)=>{
    class connectLocalComponent extends Component {
      constructor(props, context){
        super(props, context);
        this.setState(props);
      }
      setState(props){
        const state = this.context.store.getState();
        this._props = mapStateToProps(state, props);
      }
      componentWillReceiveProps(nextProps){
        this.setState(nextProps);
      }
      shouldComponentUpdate(){
        // todo: connect has some optimizations we will want to make sure to copy
        return true;
      }
      render() {
        return <WrappedComponent {...this._props} />;
      }
    }
    connectLocalComponent.contextTypes = {
      store: React.PropTypes.object
    };
    return connectLocalComponent
  };

}
