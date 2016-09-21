import React, { Component, PropTypes } from 'react';
import instadate from 'instadate';
import padStart from 'lodash/padStart';
import inRange from 'lodash/inRange';
import assign from 'lodash/assign';

import cc from './style.css';

const dayLabels = ['日', '一', '二', '三', '四', '五', '六'];
const dayIndexes = [0, 1, 2, 3, 4, 5, 6];

const rangeLabels = ['今天', '昨天', '近7天', '近30天'];
const ranges = [[0], [-1, -1], [-6], [0, -29]];

function formatDate(date) {
  return [
    date.getUTCFullYear(),
    padStart(`${date.getUTCMonth() + 1}`, 2, '0'),
    padStart(date.getUTCDate(), 2, '0')
  ].join('-');
}

function toQueryStr(a, b) {
  return `${formatDate(a)}~${formatDate(b || a)}`;
}

export default class DateRangePicker extends Component {
  constructor(props) {
    super(props);

    const a = new Date(this.props.stime || new Date());
    a.setUTCHours(0, 0, 0, 0);
    if (!this.props.stime) a.setUTCHours(24 * -6);
    const b = new Date(this.props.etime || new Date());
    b.setUTCHours(0, 0, 0, 0);

    this.state = {
      startDate: a,
      endDate: b,

      pickedYear: a.getUTCFullYear(),
      pickedMonth: b.getUTCMonth()
    };

    [
      'getRangeClassName',
      'handleMonthChange',
      'pickDate',
      'handleRange',
      'handleDone'
    ].forEach(v => (this[v] = this[v].bind(this)));
  }

  getRangeClassName(label) {
    const today = new Date();
    const range = ranges[rangeLabels.indexOf(label)];

    if (!Array.isArray(range)) return '';

    const str = toQueryStr(
      range[0] ? instadate.addDays(today, range[0] || 0) : today,
      range[1] ? instadate.addDays(today, range[1] || 0) : today
    );

    const eq = toQueryStr(this.state.startDate, this.state.endDate) === str;

    return eq ? cc.range : '';
  }

  getPickedDate(i) {
    return new Date(Date.UTC(
      this.state.pickedYear,
      this.state.pickedMonth,
      i
    ));
  }

  pickDate(i) {
    const date = this.getPickedDate(i);

    if (instadate.isDayAfter(date, new Date())) return;

    const b = this.isPickEndDate;
    this.setState({
      startDate: b ? instadate.min(date, this.state.startDate) : date,
      endDate: b ? instadate.max(date, this.state.startDate) : null
    });

    this.isPickEndDate = !this.isPickEndDate;
  }

  handleMonthChange(value) {
    let val = this.state.pickedMonth + value;
    let year = this.state.pickedYear;

    if (val < 0) {
      val = 11;
      year--;
    } else if (val > 11) {
      val = 0;
      year++;
    }

    this.setState({
      pickedMonth: val,
      pickedYear: year
    });
  }

  handleDone(ev) {
    const loc = this.context.location;

    this.props.cancel(ev);

    this.context.router.push({
      pathname: loc.pathname,
      query: assign({}, loc.query, {
        stime: formatDate(this.state.startDate),
        etime: formatDate(this.state.endDate)
      })
    });
  }

  handleRange(label) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const range = ranges[rangeLabels.indexOf(label)];

    if (!Array.isArray(range)) return;

    this.setState({
      startDate: range[0] ? instadate.addDays(today, range[0] || 0) : today,
      endDate: range[1] ? instadate.addDays(today, range[1] || 0) : today
    });
  }

  renderRanges() {
    return (
      <div className={cc.ranges}>
        {rangeLabels.map((v) => (
          <div
            key={v}
            className={this.getRangeClassName(v)}
            onClick={() => this.handleRange(v)}
          >
            {v}
          </div>
        ))}
      </div>
    );
  }

  renderMonthPicker() {
    return (
      <div className={cc.headline}>
        <div
          className={cc.prevMonth}
          onClick={() => this.handleMonthChange(-1)}
        />
        {`${this.state.pickedYear}年${parseInt(this.state.pickedMonth, 10) + 1}月`}
        <div
          className={cc.nextMonth}
          onClick={() => this.handleMonthChange(1)}
        />
      </div>
    );
  }

  renderWeekDays() {
    return (
      <div>
        {dayLabels.map(v => <div key={v} className={cc.dateCell}>{v}</div>)}
      </div>
    );
  }

  renderCalendar() {
    const dateA = instadate.firstDateInMonth(
      new Date(Date.UTC(this.state.pickedYear, this.state.pickedMonth))
    );
    const dateB = instadate.lastDateInMonth(dateA);
    const dayCount = instadate.differenceInDays(dateA, dateB) + 1;
    const paddingA = dayIndexes.indexOf(dateA.getUTCDay());


    const getCellClassName = (i) => {
      const pickedDate = this.getPickedDate(i);

      if ((pickedDate.getUTCMonth() !== this.state.pickedMonth) &&
        (pickedDate.getMonth() !== new Date().getMonth())) {
        return cc.dateCell;
      }

      const pickedDatetime = pickedDate.getTime();

      const edgeTimes = [
        this.state.startDate.getTime(),
        this.state.endDate ? this.state.endDate.getTime() : null
      ];
      if (edgeTimes.indexOf(pickedDatetime) !== -1) return cc.dateCellEdge;

      if (pickedDatetime > Date.now()) return cc.dateCellOutSet;
      if (!this.state.endDate) return cc.dateCell;

      const on = inRange(
        pickedDatetime,
        this.state.startDate.getTime(),
        instadate.addDays(this.state.endDate, 1).getTime()
      );

      return on ? cc.dateCellInRange : cc.dateCell;
    };

    let dateCells = [];
    for (let i = -paddingA + 1; i <= dayCount; i++) {
      dateCells.push(
        <div
          key={i}
          className={getCellClassName(i)}
          onClick={() => this.pickDate(i)}
        >
          {i > 0 ? i : ' '}
        </div>
      );
    }

    return (
      <div className={cc.calendar}>
        {dateCells}
        <div style={{ clear: 'both' }} />
      </div>
    );
  }

  renderDates() {
    return (
      <div className={cc.headline}>
        <span>
          开始：{formatDate(this.state.startDate)}
        </span>
        <span>
          结束：{this.state.endDate ? formatDate(this.state.endDate) : '请选择'}
        </span>
      </div>
    );
  }

  render() {
    return (
      <div className={cc.mask}>
        <div className={cc.root}>
          <div className={cc.header}>
            <div
              className={`${cc.cancel} ctrlToggleDateMenu`}
              onClick={this.props.cancel}
            />
            选择日期
            <div
              className={`${cc.done} ctrlToggleDateMenu`}
              onClick={this.handleDone}
            />
          </div>
          {this.renderRanges()}
          {this.renderDates.bind(this)()}
          {this.renderMonthPicker()}
          {this.renderWeekDays()}
          {this.renderCalendar()}
        </div>
      </div>
    );
  }
}

DateRangePicker.propTypes = {
  stime: PropTypes.string,
  etime: PropTypes.string,
  cancel: PropTypes.func
};

DateRangePicker.contextTypes = {
  router: React.PropTypes.object,
  location: React.PropTypes.object
};
