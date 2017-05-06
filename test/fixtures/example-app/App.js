import React from 'react';
import {connect} from 'react-redux';

import Tile from './Tile';

class App extends React.Component{
  changeChildState(storeContext){
    this.props.dispatch({
      type: 'SET_TITLE',
      value: ''
    }, {storeContext})
  }
  render(){
    const { username } = this.props;
    return (
      <div>
        <h1>Hello {username}</h1>
        <p>
          <button onClick={()=>{this.changeChildState('tileOne')}}>Change specific Child State (Clears value)</button>
        </p>
        <p>
          <button onClick={()=>{this.changeChildState()}}>Change Child State (Clears values)</button>
        </p>
        <p>
          Note that clicking above button will not cause mapStateToProps to fire on <strong>App.js</strong> since it's
          state did not change. The two <strong>Tile.js</strong> instances though will trigger mapStateToProps since their state changed.
          The same thing applies when typing on the text boxes only the mapState to props for the specific tile instance will fire since only it's own
          state changes
        </p>
        <div className="content">
          <Tile type="restaurant" storeContext="tileOne"/>
        </div>
        <div className="sidebar">
          <Tile type="restaurant" storeContext="tileTwo"/>
        </div>
        <div className="sidebar">
          <Tile type="synced" storeContext="tileTwo"/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{

  return {
    username: state.users.username
  }
};

export default connect(mapStateToProps)(App);
