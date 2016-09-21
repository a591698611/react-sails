import React, { PropTypes, Component } from 'react';
import cc from './style.css';

export default class TodoFooter extends Component {

  todoComplete() {
    this.props.onTodoAllComplete(this.refs.completed.checked);
  }

  renderDo() {
    const { onUndo, onRedo, undoDisabled, redoDisabled } = this.props;
    return (
      <div className={cc.do}>
        <button
          onClick={onUndo}
          disabled={undoDisabled}
          style={{ backgroundColor: undoDisabled ? '#999' : '#333' }}
        >
          撤销
        </button>
        <button
          onClick={onRedo}
          disabled={redoDisabled}
          style={{ backgroundColor: redoDisabled ? '#999' : '#333' }}
        >
          重做
        </button>
      </div>
    );
  }

  renderOth() {
    return (
      <div className={cc.oth}>
        <input
          type="checkbox"
          className={cc.checkbox}
          ref="completed"
          checked={this.props.onTodoAllInspect}
          onChange={() => this.todoComplete()}
        />
        <span className={cc.num}>
          已完成({this.props.onTodoDoneCount}) / 总数({this.props.onTodoCount})
        </span>
        <span onClick={this.props.onTodoAllCompleteDelete}>清除已完成</span>
      </div>
    );
  }

  render() {
    return (
      <div className={cc.footer}>
        {this.renderDo()}
        {this.renderOth()}
      </div>
    );
  }
}

TodoFooter.propTypes = {
  onTodoAllInspect: PropTypes.bool.isRequired,
  onTodoAllComplete: PropTypes.func.isRequired,
  onTodoAllCompleteDelete: PropTypes.func.isRequired,
  onTodoDoneCount: PropTypes.number.isRequired,
  onTodoCount: PropTypes.number.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  undoDisabled: PropTypes.bool.isRequired,
  redoDisabled: PropTypes.bool.isRequired
};
