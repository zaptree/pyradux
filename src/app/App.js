import React from 'react';
import connectLocal from '../pyradux/connectLocal';

import Tile from './Tile';

class App extends React.Component{
  render(){
    const { username } = this.props;
    return (
      <div>
        <h1>Hello {username}</h1>
        <div className="content">
          <Tile type="restaurant"/>
        </div>
        <div className="sidebar">
          <Tile type="restaurant"/>
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

export default connectLocal(mapStateToProps)(App);
