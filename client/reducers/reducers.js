import { combineReducers } from 'redux';
import undoable, { distinctState } from 'redux-undo';
import {
  ADD_TODO, COMPLETE_TODO, SAVE_TODO, DELETE_TODO, ALL_COMPLETE_TODO,
  DELETE_COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters
} from '../actions/actions';
const { SHOW_ALL } = VisibilityFilters;

// 查看完成或未完成
export function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
}

function addTodo(state, action) {
  return [
    ...state,
    {
      text: action.text,
      completed: false
    }
  ];
}
function completeTodo(state, action) {
  return [
    ...state.slice(0, action.index),
    { ...state[action.index], completed: !state[action.index].completed },
    ...state.slice(action.index + 1)
  ];
}
function saveTodo(state, action) {
  return [
    ...state.slice(0, action.index),
    { ...state[action.index], text: action.title },
    ...state.slice(action.index + 1)
  ];
}
function deleteTodo(state, action) {
  return [
    ...state.slice(0, action.index),
    ...state.slice(action.index + 1)
  ];
}
function allCompleteTodo(state, action) {
  const data = state.map(v => {
    const vv = { ...v };
    vv.completed = action.completed;
    return vv;
  });
  return [...data];
}
function deleteCompleteTodo(state) {
  const data = state.filter(v => !v.completed);
  return [...data];
}

const initialState = [
  { text: '任务A', completed: false },
  { text: '任务B', completed: true },
  { text: '任务C', completed: true }
];
export function todos(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return addTodo(state, action);
    case COMPLETE_TODO:
      return completeTodo(state, action);
    case SAVE_TODO:
      return saveTodo(state, action);
    case DELETE_TODO:
      return deleteTodo(state, action);
    case ALL_COMPLETE_TODO:
      return allCompleteTodo(state, action);
    case DELETE_COMPLETE_TODO:
      return deleteCompleteTodo(state);
    default:
      return state;
  }
}

const todoApp = combineReducers({
  visibilityFilter,
  todos: undoable(todos, { filter: distinctState() })
});

export default todoApp;
