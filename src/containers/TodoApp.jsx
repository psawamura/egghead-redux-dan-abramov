import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addToDo, toggleToDo, showAll, showActive, showCompleted } from '../actions/index';
import FilterLink from '../components/FilterLink';

let nextTodoId = 0;

const mapDispatchToProps =  dispatch => {
  return {
    addToDo,
    toggleToDo,
    showAll,
    showActive,
    showCompleted
  }
}

const mapStateToProps = state => {
  return {
    getVisibleTodos: state.getVisibleTodos,
  }
}

class TodoApp extends Component {
    render() {
        const visibleTodos = this.props.getVisibleTodos(
            this.props.todos,
            this.props.visibilityFilter
        );
        console.log('visible todos', visibleTodos)
        return (
            <div>
                <input ref={node => {
                    this.input = node;
                }}/>
                <button onClick={this.props.addToDo()} >
                Add To Do
                </button>
                <ul>
                    {visibleTodos.map(todo => 
                        <li key={todo.id}
                            onClick={this.props.toggleTodo}
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
                        filter={this.props.showAll}
                    >
                        All
                    </FilterLink>
                    {'  '}
                    <FilterLink
                        filter={this.props.showActive}
                    >
                        Active
                    </FilterLink>
                    {'  '}
                    <FilterLink
                        filter={this.props.showCompleted}
                    >
                        Completed
                    </FilterLink>
                </p>
            </div>
        );
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoApp)