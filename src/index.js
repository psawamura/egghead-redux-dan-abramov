import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import expect from 'expect';
import deepFreeze from 'deep-freeze';

// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

import { createStore, combineReducers } from 'redux';

/// createStore from scratch        
// const createStore = (reducer) => {
//     let state;
//     let listeners = [];

//     const getState = () => state;
//     const dispatch = (action) => {
//         state = reducer(state, action);
//         listeners.forEach(listener => listener());
//     };
//     const subscribe = (listener) => {
//         listeners.push(listener)
//         return () => {
//             listeners = listeners.filter(l => l !== listener);
//         };
//     };

//     dispatch({});

//     return {getState, dispatch, subscribe};
// };

// function counter(state = 0, action) {
//     switch (action.type){
//         case 'INCREMENT':
//             return state + 1;
//         case 'DECREMENT':
//             return state - 1;
//         default:
//             return state;
//     }
// }

// /// Testing 
// // expect(
// //     counter(0, {type: 'INCREMENT'})
// // ).toEqual(1);

// // expect(
// //     counter(1, {type: 'INCREMENT'})
// // ).toEqual(2);

// // expect(
// //     counter(2, {type: 'DECREMENT'})
// // ).toEqual(1);

// // expect(
// //     counter(1, {type: 'DECREMENT'})
// // ).toEqual(0);

// // expect(
// //     counter(1, {type: 'SOMETHING_ELSE'})
// // ).toEqual(1);

// // console.log('Tests passed!');


// const store = createStore(counter);

// const Counter = ({ 
//     value,
//     onIncrement,
//     onDecrement
// }) => (
//     <div>
//         <h1>{value}</h1>
//         <button onClick={onIncrement}>+</button>
//         <button onClick={onDecrement}>-</button>
//     </div>
// );

// const addCounter = (list) => {
//     return [...list, 0];
// }

// const removeCounter = (list, index) => {
//     return [...list.slice(0, index),
//         ...list.slice(index + 1)
//     ];
// };


// const testAddCounter = () => {
//     const listBefore = [];
//     const listAfter = [0];
//     deepFreeze(listBefore);
//     expect(addCounter(listBefore)).toEqual(listAfter);
// }

// const testRemoveCounter = () => {
//     const listBefore = [0, 10, 20];
//     const listAfter = [0, 20];
//     deepFreeze(listBefore);
//     expect(removeCounter(listBefore,1)).toEqual(listAfter);
// }

// const incrementCounter = (list, index) => {
//     return [
//         ...list.slice(0,index),
//         list[index]+1,
//         ...list.slice(index+1)
//     ]
// };

// const testIncrementCounter = () => {
//     const listBefore = [0, 10, 20];
//     const listAfter = [0, 11, 20];
//     deepFreeze(listBefore)
//     expect(incrementCounter(listBefore,1).toEqual(listAfter));
// }

// testAddCounter();
// testRemoveCounter();
// console.log('All tests passed')

// ############  TESTS ################# //

const testAddToDo = () => {
    const stateBefore = [];
    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        }
    ];
    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux'
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

const testToggleTodo = () => {
    const stateBefore = [
        {
            id: 0,
            text: 'Blah',
            completed: false
        }
    ];

    const stateAfter = [
        {
            id: 0,
            text: 'Blah',
            completed: true
        }
    ];

    const action = {
        type: 'TOGGLE_TODO',
        id: 0
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

// ############ TO DO LIST ################## //

const todo = (state, action) => {
    switch (action.type) {  
        case 'ADD_TODO':
            return {
                    id: action.id,
                    text: action.text,
                    completed: false
            };
            
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }
            return {
                ...state,
                completed: !state.completed
            }
        default:
            return state;
    }
}

const todos = (state = [], action) => {
    switch (action.type) {  
        case 'ADD_TODO':
            return [
                ...state, 
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};

const visibilityFilter = (
    state = 'SHOW_ALL',
    action
) => {
    switch (action.type) {
        case 'SET_VISIIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
}

const todoApp = combineReducers({
    todos,
    visibilityFilter
});

// const todoApp = (state = {}, action) => {
//     return {
//         todos: todos(
//             state.todos,
//             action
//         ),
//         visibilityFilter: visibilityFilter(
//             state.visibilityFilter,
//             action
//         )
//     };
// };

testAddToDo();  
testToggleTodo();
console.log('ALL TESTS PASSED')

const store = createStore(todoApp);

const FilterLink = ({
    filter,
    children
}) => {
    return (
        <a href='#'
           onClick= {e => {
               e.preventDefault();
               store.dispatch({
                   type:'SET_VISIBILITY_FILTER',
                   filter
               });
               console.log('filter', filter)
               console.log(store.getState())
           }}
        >
        {children}
        </a>
    );
};

const getVisibleTodos = (
    todos,
    filter
) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(
                t => t.completed
            );
        case 'SHOW_ACTIVE':
            return todos.filter(
                t => !t.completed
            );
    }
}

let nextTodoId = 0;

class TodoApp extends Component {
    render() {
        const visibleTodos = getVisibleTodos(
            this.props.todos,
            this.props.visibilityFilter
        );
        console.log('visible todos', visibleTodos)
        return (
            <div>
                <input ref={node => {
                    this.input = node;
                }}/>
                <button onClick={() => {
                    store.dispatch({
                        type: 'ADD_TODO',
                        text: this.input.value,
                        id: nextTodoId++
                    });
                    this.input.value = '';
                }}>
                Add To Do
                </button>
                <ul>
                    {visibleTodos.map(todo => 
                        <li key={todo.id}
                            onClick={() => {
                                store.dispatch({
                                    type: 'TOGGLE_TODO',
                                    id: todo.id
                                });
                            }}
                            style={{
                                textDecoration:
                                    todo.completed ? 
                                        'line-through' :
                                        'none'
                            }}>
                            {todo.text}
                        </li>
                    )}
                </ul>
                <p>
                    Show:
                    {'  '}
                    <FilterLink
                        filter='SHOW_ALL'
                    >
                        All
                    </FilterLink>
                    {'  '}
                    <FilterLink
                        filter='SHOW_ACTIVE'
                    >
                        Active
                    </FilterLink>
                    {'  '}
                    <FilterLink
                        filter='SHOW_COMPLETED'
                    >
                        Completed
                    </FilterLink>
                </p>
            </div>
        );
    }
}

const render = () => {
    ReactDOM.render(
        <TodoApp 
            {...store.getState()}
        />,
        document.getElementById('root')
    );
};

store.subscribe(render);
render();
