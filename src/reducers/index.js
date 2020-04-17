import { visibilityFilter } from './visibilityFilter';
import { todo, todos } from './todo';
import { combineReducers } from 'redux';

 const reducers = combineReducers({
  todo,
  todos,
  visibilityFilter
});

export default reducers;