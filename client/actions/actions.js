// action 类型
export const ADD_TODO = 'ADD_TODO'; // 添加任务
export const COMPLETE_TODO = 'COMPLETE_TODO'; // 设置任务完成与未完成
export const SAVE_TODO = 'SAVE_TODO'; // 保存修改的任务标题
export const DELETE_TODO = 'DELETE_TODO'; // 删除任务
export const ALL_COMPLETE_TODO = 'ALL_COMPLETE_TODO'; // 设置所有的任务完成与未完成
export const DELETE_COMPLETE_TODO = 'DELETE_COMPLETE_TODO'; // 删除所有已完成的任务
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'; // 查看完成或未完成的任务
export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
};

// action 创建函数
export function addTodo(text) {
  return { type: ADD_TODO, text };
}
export function completeTodo(index) {
  return { type: COMPLETE_TODO, index };
}
export function saveTodo(index, title) {
  return { type: SAVE_TODO, index, title };
}
export function deleteTodo(index) {
  return { type: DELETE_TODO, index };
}
export function allCompleteTodo(completed) {
  return { type: ALL_COMPLETE_TODO, completed };
}
export function deleteCompleteTodo() {
  return { type: DELETE_COMPLETE_TODO };
}
export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter };
}
