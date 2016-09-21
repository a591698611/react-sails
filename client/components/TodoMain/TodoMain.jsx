import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import TodoItem from '../TodoItem';

function TodoMain(props) {
  return (
    <div style={{ marginTop: '3rem' }}>
      <ReactCSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {props.todos.map((v, i) =>
          <TodoItem key={i}
            {...v}
            onClick={() => props.onTodoComplete(i)}
            onSave={title => props.onTodoSave(i, title)}
            onDelete={() => props.onTodoDelete(i)}
          />
        )}
      </ReactCSSTransitionGroup>
    </div>
  );
}

TodoMain.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired,
  onTodoComplete: PropTypes.func.isRequired,
  onTodoSave: PropTypes.func.isRequired,
  onTodoDelete: PropTypes.func.isRequired
};

export default TodoMain;
