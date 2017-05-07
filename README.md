# pyradux
Hierarchical Redux store for React


## Todo
- add react stuff as peer-dependencies

## About
Pyradax is a small library that allows for creating redux stores that are tied to a component similar to local state. This means a new redux store for each instance of a component using pyradux will be created.

Components using Pyradux will also inherit state from ancestor stores and be able to listen to dispatched actions from ancestor stores. A global dispatch option is also available that will allow for dispatching to all stores in the store hierarchy.
 
Some benefits are:
- You get the ability to create multiple instances of the same component that has it's own state without having to resort to patterns such as namespacing your state
- It allows for making more encapsulated components where you can have a folder that contains everything the component needs to just drag and drop somewhere else.
- no need to ever use local state anymore
- you can get performance gains on large applications since local dispatches won't cause every single mapStateToProps to fire but only down the tree from the location of the localized store in the hierarchy

## Usage

All there is to using Pyradux is using the withLocalState higher order component to wrap your components you want to have a store. This includes your root component.

If for example you only wrapped your root component using withLocalState your application would function like a regular redux application meaning you can easily add pyradux to existing applications and use nested stores only for needed features.

### providing a store to a component using withLocalState

adding a store to a component is as simple as using the **withLocalState** higher order component. The two options needed are
- *createStore*: which is a factory method for creating a store (you can add your middleware and so on here and then use redux's createStore). This is really only needed on the root component and then any other descendant components that use withLocalState will inherit this method. *Please read the section further down about state merging and tips on setting up your createStore factory method*
- *reducer*: the rootReducer for the store

Example of using withLocalState on root component:
```javascript
import { withLocalState } from 'pyradux';
import RootComponent from './Root.js'
import rootReducer from './reducers';

const withLocalStateOptions = {

  // Factory method that gets called everytime a new store needs to be created by pyradux.
  // Any properties passed in from withLocalStateOptions will be passed through
  // createStore is only mandatory for the root component
  createStore: ({ reducer })=> createStore(reducer),

  // the reducer to be used to create the store. This property should always be set even on children stores
  reducer: rootReducer
}
const RootComponentWithLocalStore = withLocalState(withLocalStateOptions, RootComponent);
```

Example of using withLocalState on descendant component:
```javascript
import { withLocalState } from 'pyradux';
import reducerForDescendants from './reducers';

// ...

const withLocalStateOptions = {
  reducer: reducerForDescendants
}

export default withLocalState(withLocalStateOptions, ChildComponent);

```

### Accessing state from a component

To get your state into  your component you will just use the default connect higher order component provided by react-redux.

Any component that is a descendant to the component that has withLocalState will be able to access that state.

The main difference though is that state passed into mapStateToProps is actually a merging of all the states of the ancestors.

So assuming **GrandChildComponent** is a descendant of **ChildComponent** which is a descendant of **RootComponent**, since RootComponent and ChildComponent have their own store in the following example the mapStateToProps method will have the state object be a merging of the RootComponent state and the ChildComponent state.
 

```javascript
import {connect} from 'react-redux';

const GrandChildComponent = (props)=>{
  // ...
}

const mapStateToProps = (state, ownProps)=>{
  // state is not just the state from the closest ancestor that used withLocalState
  // it is actually a merging of all the states of the ancestors
  return {
    // ...
  }
};

export default connect(mapStateToProps)(GrandChildComponent);

```

Example of component that uses withLocalState and connect:
```javascript
import {connect} from 'react-redux';

const ChildComponent = (props)=>{
  // ...
}

const mapStateToProps = (state, ownProps)=>{
  // state is not just the state from the closest ancestor that used withLocalState
  // it is actually a merging of all the states of the ancestors
  return {
    // ...
  }
};

const withLocalStateOptions = {
  reducer: reducerForDescendants
}

export default withLocalState(withLocalStateOptions, connect(mapStateToProps)(ChildComponent));
```

#### More on state merging and tips on setting up you createStore method 

Assuming we have the following simple application structure:
```
/src
  /ChildComponent
    /GrandChildComponent
      GrandChildComponent.js
    Child.actions.js
    Child.reducer.js
    Child.component.js
  Root.actions.js
  Root.reducer.js
  Root.component.js
  index.js
```

Similar to our previous examples the Root and the Child components are using withLocalState and the GrandChildComponent is just a component that uses connect.

Our reducers in the example look like the following:

Root.reducer.js
```javascript
const initialState = {
  applicationTitle: 'My Pyradux App'
};
export default (state = initialState, action)=>{
  switch(action.type){
    // ...
  }
  return state;
};

```

Child.reducer.js
```javascript
const initialState = {
  childTitle: 'An Instance of a Child'
};
export default (state = initialState, action)=>{
  switch(action.type){
    // ...
  }
  return state;
};

```

When the **GrandChildComponent** get's the state in mapStateToProps since the states of it's ancestors get merged it will look something like this:

```javascript
mergedState = {
  applicationTitle: 'My Pyradux App',
  childTitle: 'An Instance of a Child'
}
```

This might be fine for smaller applications but for larger applications you will not want the properties from each state mixed like that and will want something along the lines of:
```javascript
mergedState = {
  root: {
    applicationTitle: 'My Pyradux App'
  },
  child: {
    childTitle: 'An Instance of a Child'
  }
  
}
```

Achieving this is simple by following the following pattern in the root component when declaring the createStore factory method:

```javascript
// ...
import reducer from './reducer';
import { combineReducers } from 'redux';
import { withLocalState } from 'pyradux';
import RootComponent from './Root.component';

const withLocalStateOptions = {
  createStore: ({ reducer, stateKey })=> {
      if(stateKey){
        reducer = combineReducers({
          [stateKey]: reducer
        })
      }
      return createStore(
        reducer
      )
  },
  reducer: reducer,
  stateKey: 'root'
}
const RootComponentWithLocalStore = withLocalState(withLocalStateOptions, RootComponent);

```

We added the ability to pass in a stateKey option that will achieve what we wanted. So for example the ChildComponent withLocalState options would look like:

```javascript
const withLocalStateOptions = {
  reducer: reducer,
  stateKey: 'child'
}
```

### Using dispatch

The default behavior of dispatch is to dispatch actions to the closest store i.e. for GrandChildComponent in our examples that would be the store of the ChildComponent instance it belongs to **AND** that action will also be dispatched to any child instances of that store.

So for let's assume that on our page we have our Root component instance, **two** instances of the Child component (let's call them Child1 and Child2) and one instance of the GrandChild component for each of the Child component instances (let's call the GrandChild1 and GrandChild2).

In the scenario we described we would end up having 3 stores, one for the Root component and 2 for each of the Child components.
 
If a dispatch is made from Child1 or GrandChild1 the action will only go through the store of the Child1. 

If a dispatch is made from the Root component all 3 stores because the Child1 and Child2 stores are descendants of Root.

There are times you will want to be able to make a dispatch from Child or GrandChild that are global and can to to all stores. To do that you will need to pass in the global option:

```javascript
dispatch({
  type: 'MY_ACTION_TYPE',
  payload: {}
}, {global: true})

// or the alterante syntax is 
dispatch({
  $global: true,
  type: 'MY_ACTION_TYPE',
  payload: {}
});
```


### Using Reselect
When using reselect if you plan on having multiple instances of a component that uses withLocalState mounted at the same time in your application you will want to follow the following pattern to make sure you get the best caching performance:

https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components


