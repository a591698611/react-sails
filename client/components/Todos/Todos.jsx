import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { ActionCreators } from 'redux-undo';

import {
  addTodo, completeTodo, saveTodo, deleteTodo, allCompleteTodo,
  deleteCompleteTodo, setVisibilityFilter, VisibilityFilters
} from '../../actions/actions';
import TodoHeader from '../TodoHeader';
import TodoFilter from '../TodoFilter';
import TodoMain from '../TodoMain';
import TodoFooter from '../TodoFooter';

function Todos(props) {
  const cssClass = {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    top: '6rem',
    width: '95%',
    color: '#000'
  };
  const { dispatch, visibilityFilter, visibleTodos } = props;
  return (
    <div style={cssClass}>
      <TodoHeader onTodoAdd={text => dispatch(addTodo(text))} />
      <TodoFilter
        filter={visibilityFilter}
        onFilterChange={nextFilter => dispatch(setVisibilityFilter(nextFilter))}
      />
      <TodoMain
        todos={visibleTodos}
        onTodoComplete={index => dispatch(completeTodo(index))}
        onTodoSave={(index, title) => dispatch(saveTodo(index, title))}
        onTodoDelete={index => dispatch(deleteTodo(index))}
      />
      <TodoFooter
        onTodoAllInspect={props.inspectCompleteTodo}
        onTodoAllComplete={completed => dispatch(allCompleteTodo(completed))}
        onTodoAllCompleteDelete={() => dispatch(deleteCompleteTodo())}
        onTodoDoneCount={props.todoDoneCount}
        onTodoCount={props.todoCount}

        onUndo={() => dispatch(ActionCreators.undo())}
        onRedo={() => dispatch(ActionCreators.redo())}
        undoDisabled={props.undoDisabled}
        redoDisabled={props.redoDisabled}
      />
    </div>
  );
}

Todos.propTypes = {
  dispatch: PropTypes.func.isRequired,
  visibleTodos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired,
  visibilityFilter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired,
  inspectCompleteTodo: PropTypes.bool.isRequired,
  todoDoneCount: PropTypes.number.isRequired,
  todoCount: PropTypes.number.isRequired,
  undoDisabled: PropTypes.bool.isRequired,
  redoDisabled: PropTypes.bool.isRequired
};


function selectTodos(todos, filter) {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos;
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(todo => todo.completed);
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
}

/**
 * createSelector 函数来创建可记忆的 selector
 * 它接收一个 input-selectors 数组和一个转换函数作为参数
 * 如果 state tree 的改变会引起 input-selector 值变化，
 * 那么 selector 会调用转换函数，传入 input-selectors 作为参数，并返回结果
 * 如果 input-selectors 的值和前一次的一样，它将会直接返回前一次计算的数据，而不会再调用一次转换函数
 *  */

// visibilityFilterSelector 和 todosSelector 是 input-selector
const visibilityFilterSelector = state => state.visibilityFilter;
const todosSelector = state => state.todos;
export const visibleTodosSelector = createSelector(
  [visibilityFilterSelector, todosSelector],
  (visibilityFilter, todos) => ({
    inspectCompleteTodo: todos.present.every(v => v.completed),
    todoDoneCount: todos.present.filter(v => v.completed).length,
    todoCount: todos.present.length,
    undoDisabled: todos.past.length === 0,
    redoDisabled: todos.future.length === 0,
    visibleTodos: selectTodos(todos.present, visibilityFilter),
    visibilityFilter
  })
);

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(Todos) 中；
module.exports = connect(visibleTodosSelector)(Todos);
