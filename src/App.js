import React, { Component } from 'react';
import { createStore } from 'redux';
import reducers from './reducers/index';
import TodoApp from './containers/TodoApp';

const store = createStore(reducers);
console.log('---- current state -----', store.getState())

export class App extends Component {
  render() {
    return (
      <div className="App">
        <TodoApp
          {...store.getState()}
        />
      </div>
    );
  }
}
