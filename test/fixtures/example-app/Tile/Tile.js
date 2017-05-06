import React from 'react';
import {connect} from 'react-redux';

import Restaurant from './Restaurant';
import Movie from './Movie';

class App extends React.Component{
  changeUserName(){
    const { username } = this.props;
    const action = {
      type: 'SET_USERNAME',
      value: username === 'bob' ? 'nick': 'bob'
    };
    this.props.dispatch(action, {global: true})
  }
  changeTitle(value){
    const { type } = this.props;

    // If you set the global option to true on the dispatch it will make it so that
    // all instances of Tile
    this.props.dispatch({
      type: 'SET_TITLE',
      value
    }, {global: type === 'synced'});
  }
  render(){
    const { username, title, type } = this.props;
    return (
      <div>
        <h3>This is a tile {username}</h3>
        <p>
          <button onClick={()=>{this.changeUserName()}}>Change Parent State</button>
        </p>
        <p>
          {type==='synced' && 'changes here will cause all inputs to change'}
        </p>
        <div>
          <input type="text" value={title} onChange={e=>this.changeTitle(e.target.value)}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps)=>{
  const { users, tile } = state;
  return {
    type: ownProps.type,
    username: users.username,
    title: tile.title,
  }
};

export default connect(mapStateToProps)(App);
