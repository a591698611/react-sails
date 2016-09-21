import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import cc from './style.css';

export default class TodoHeader extends Component {

  constructor(props) {
    super(props);
    this.handlerKeyUp = this.handlerKeyUp.bind(this);
  }

  // 绑定键盘回车事件，添加新任务
  handlerKeyUp(ev) {
    if (ev.keyCode === 13) {
      const node = ReactDOM.findDOMNode(this.refs.todoTitle);
      this.props.onTodoAdd(node.value.trim());
      node.value = '';
    }
  }

  render() {
    return (
      <div className={cc.header}>
        <input
          className={cc.input}
          onKeyUp={this.handlerKeyUp}
          ref="todoTitle"
          placeholder="有没有要做的事?"
        />
      </div>
    );
  }
}

TodoHeader.propTypes = {
  onTodoAdd: PropTypes.func.isRequired
};
