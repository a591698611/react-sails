import React, { PropTypes, Component } from 'react';
import cc from './style.css';

export default class TodoFilter extends Component {

  renderFilter(filter, name) {
    if (filter === this.props.filter) {
      return (
        <span className={cc.nav}>{name}</span>
      );
    }

    return (
      <a href="#"
        className={cc.navActive}
        onClick={e => {
          e.preventDefault();
          this.props.onFilterChange(filter);
        }}
      >
        {name}
      </a>
    );
  }

  render() {
    return (
      <ul className={cc.filter}>
        <li>
          {this.renderFilter('SHOW_ALL', '所有')}
        </li>
        <li>
          {this.renderFilter('SHOW_COMPLETED', '完成')}
        </li>
        <li>
          {this.renderFilter('SHOW_ACTIVE', '未完成')}
        </li>
      </ul>
    );
  }
}

TodoFilter.propTypes = {
  filter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired,
  onFilterChange: PropTypes.func.isRequired
};
