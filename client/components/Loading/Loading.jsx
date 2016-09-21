import React, { Component } from 'react';

export default class Loading extends Component {

  render() {
    const cssClass = {
      position: 'absolute',
      display: 'flex',
      width: '100%',
      height: '100%',
      background: '#3a4050',
      opacity: '.8',
      fontSize: '1.5rem',
      color: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '99'
    };
    return <div style={cssClass}>加载中...</div>;
  }

}
