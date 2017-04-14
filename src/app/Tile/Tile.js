import React from 'react';
import connectLocal from '../../pyradux/connectLocal';

import Restaurant from './Restaurant';
import Movie from './Movie';

class App extends React.Component{
  changeTitle(value){
    this.props.dispatch({
      type: 'SET_TITLE',
      value
    });
  }
  render(){
    const { username, title } = this.props;
    return (
      <div>
        <h3>This is a tile {username}</h3>
        <div>
          <input type="text" value={title} onChange={e=>this.changeTitle(e.target.value)}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state)=>{
  const { users, tile } = state;
  return {
    username: users.username,
    title: tile.title,
  }
};

export default connectLocal(mapStateToProps)(App);
