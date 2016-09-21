import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import DateRangePicker from '../DateRangePicker';
import cc from './style.css';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      msg: '',
      dateMenuDisplay: false,
      loaded: false
    };

    this.toggleDate = this.toggleDate.bind(this);
  }

  toggleDate(ev) {
    if (ev.target.className.split(/ /).indexOf('ctrlToggleDateMenu') !== -1) {
      this.setState({ dateMenuDisplay: !this.state.dateMenuDisplay });
    }
  }

  renderTop() {
    const path = this.props.location.pathname.split('/')[1];
    return (
      <div>
        <div className={cc.top}>
          <span />
          <span>{path === 'chat' ? '聊天室' : '备忘录'}</span>
          {
            path === 'chat' ?
              <span className={cc.person} /> :
              <span
                className={`${cc.date} ctrlToggleDateMenu`}
                onClick={this.toggleDate}
              />
          }
        </div>
        {
          !this.state.dateMenuDisplay ? '' : (
            <DateRangePicker
              stime={this.props.location.query.stime}
              etime={this.props.location.query.etime}
              cancel={this.toggleDate}
            />
          )
        }
      </div>
    );
  }

  renderBottom() {
    const menus = [{
      name: 'chat',
      path: '/chat'
    }, {
      name: 'todos',
      path: '/todos'
    }];
    const pathname = this.props.location.pathname.split('/')[1];
    return (
      <div className={cc.bottom}>
        {
          menus.map((v, i) => (
            <Link
              key={i}
              className={cc.bar}
              to={{ pathname: v.path }}
            >
              <div className={cc[`bg${i + 1}${pathname === v.name ? '_2' : ''}`]} />
              <div className={cc.text}>{v.name}</div>
            </Link>
          ))
        }
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderTop()}
        {
          React.Children.map(this.props.children, v => (
            React.cloneElement(v, {})
          ))
        }
        {this.renderBottom()}
      </div>
    );
  }

}

App.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object
};
