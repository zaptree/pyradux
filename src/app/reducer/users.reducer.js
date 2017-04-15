
const initialState = {
  username: 'nick'
};
export default (state = initialState, action)=>{

  switch(action.type){
    case 'SET_USERNAME':{
      return {
        ...state,
        username: action.value
      }
    }
  }
  return state;
};
