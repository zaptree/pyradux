
const initialState = {
  title: 'set title',
  items: []
};
export default (state = initialState, action)=>{
  switch(action.type){
    case 'SET_TITLE':{
      return {
        ...state,
        title: action.value
      }
    }
  }
  return state;
};
