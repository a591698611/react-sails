import React, { Component } from 'react';
import LocalDb from 'localDb';
import cc from './style.css';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.db = new LocalDb('React_Chat');
    this.state = {
      portrait: '',
      msg: '',
      message: this.db.get('chat') || [],
    };

    [
      'message',
      'send',
      'handlerKeyUp'
    ].forEach(v => (this[v] = this[v].bind(this)));
  }

  componentDidMount() {
    $.getJSON('/user/getInfo', r => {
      this.setState({
        portrait: r.head,
      });
    });
  }

  message(ev) {
    this.setState({
      msg: ev.target.value
    });
  }

  send() {
    const sendMessage = this.state.msg;
    const portrait = this.state.portrait;
    if (sendMessage.trim() === '') return;
    io.socket.get('/sockets/msg', { message: sendMessage, head: portrait });
    this.setState({
      msg: ''
    });
    this.refs.chating.value = '';
  }

  handlerKeyUp(ev) {
    if (ev.keyCode === 13) this.send();
  }

  renderAvatar(head, isMe = false) {
    return (
      <span
        className={!isMe ? cc.avatar : cc.avatar1}
        style={{
          background: `url(../images/${head}.jpg) no-repeat`,
          backgroundSize: 'contain'
        }}
      />
    );
  }

  renderText(text, isMe = false) {
    return (
      <span className={!isMe ? cc.msg : cc.msg1}>
        <span className={!isMe ? cc.triangle : cc.triangle1} />
        <div className={cc.text}>{text}</div>
      </span>
    );
  }

  render() {
    io.socket.on('message', msg => {
      this.setState({
        message: msg.message
      });
      this.db.set('chat', msg.message);
    });
    const msg = this.state.message;
    return (
      <div className={cc.root}>
        <div style={{ paddingBottom: '12rem' }}>
          {
            !msg.length ?
              <div className={cc.none}>暂时没有人聊天</div>
              :
              msg.map((v, i) => (
                v.head !== this.state.portrait ?
                  <div className={cc.single} key={i}>
                    {this.renderAvatar(v.head)}
                    {this.renderText(v.msg)}
                  </div>
                  :
                  <div className={cc.single1} key={i}>
                    {this.renderText(v.msg, true)}
                    {this.renderAvatar(v.head, true)}
                  </div>
              ))
          }
        </div>
        <div className={cc.bottom}>
          <input
            type="text"
            ref="chating"
            className={cc.input}
            onChange={this.message}
            onKeyUp={this.handlerKeyUp}
          />
          <input type="button" defaultValue="发送" className={cc.send} onClick={this.send} />
        </div>
      </div>
    );
  }

}

module.exports = Chat;
