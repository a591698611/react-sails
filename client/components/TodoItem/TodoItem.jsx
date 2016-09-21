import React, { PropTypes, Component } from 'react';
import cc from './style.css';

export default class TodoItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };

    [
      'saveTitle',
      'deleteTitle',
      'handlerKeyUp',
      'editTitle',
      'stopEditing'
    ].forEach(v => (this[v] = this[v].bind(this)));
  }

  saveTitle(ev) {
    if (this.state.editing) {
      const title = ev.target.value.trim();
      if (title.length && title !== this.props.text) {
        this.stopEditing(title);
      }
    }
  }

  deleteTitle() {
    this.props.onDelete();
  }

  handlerKeyUp(ev) {
    if (ev.keyCode === 13) {
      this.saveTitle(ev);
    } else if (ev.keyCode === 27) {
      this.setState({ editing: false });
    }
  }

  editTitle() {
    this.setState({ editing: true });
  }

  stopEditing(title) {
    this.setState({ editing: false });
    this.props.onSave(title);
  }

  renderCompleted(completed) {
    return (
      <div className={cc.cell}>
        <button
          className={cc.btn}
          onClick={this.props.onClick}
        >
          <svg
            className={!completed ? cc.icon : cc.iconActive}
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>
          </svg>
        </button>
      </div>
    );
  }

  renderTitle(editing, text, completed) {
    return (
      <div className={cc.cell}>
        {
          !editing ?
            <div
              className={completed ? cc.title : ''}
              onClick={this.props.onClick}
            >
              <span style={{ color: completed ? 'gray' : '#000' }}>{text}</span>
            </div>
            :
            <input
              autoComplete="off"
              autoFocus
              className={cc.input}
              defaultValue={text}
              maxLength="64"
              onBlur={this.saveTitle}
              onKeyUp={this.handlerKeyUp}
              type="text"
            />
        }
      </div>
    );
  }

  renderOth(editing) {
    return (
      <div className={cc.cell}>
        <button
          className={editing ? cc.btn : cc.btnHide}
          onClick={this.stopEditing}
        >
          <svg className={cc.icon} width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59
     6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            >
            </path>
            <path d="M0 0h24v24H0z" fill="none"></path>
          </svg>
        </button>
        <button
          className={!editing ? cc.btn : cc.btnHide}
          onClick={this.editTitle}
        >
          <svg className={cc.icon} width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02
     0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            >
            </path>
          </svg>
        </button>
        <button
          className={!editing ? cc.btn : cc.btnHide}
          onClick={this.props.onDelete}
        >
          <svg className={cc.icon} width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            >
            </path>
          </svg>
        </button>
      </div>
    );
  }

  render() {
    const { editing } = this.state;
    const { text, completed } = this.props;

    return (
      <div className={cc.item}>
        {this.renderCompleted(completed)}
        {this.renderTitle(editing, text, completed)}
        {this.renderOth(editing)}
      </div>
    );
  }
}

TodoItem.propTypes = {
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
