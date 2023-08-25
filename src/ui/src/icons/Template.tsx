import * as React from 'react';
import Icon from './Icon';

class Template extends Icon<{}> {
  static defaultProps = {
    className: '',
    primaryColor: 'currentColor',
    height: 71,
    width: 71,
    viewBox: '0 0 71 71',
  };

  renderContent() {
    return (
      <g>
        <g>
          <rect x="1.5" y="10" width="60" height="60" fill="#C0CBFF" stroke="#6780FF" strokeWidth="2"/>
        </g>
        <g >
          <rect x="9.5" y="1" width="60" height="60" fill="white" stroke="#6780FF" strokeWidth="2"/>
          <line x1="40.5" y1="4.37114e-08" x2="40.5" y2="62" stroke="#6780FF" strokeWidth="2"/>
          <line x1="8.5" y1="43" x2="39.5" y2="43" stroke="#6780FF" strokeWidth="2"/>
          <line x1="39.5" y1="19" x2="70.5" y2="19" stroke="#6780FF" strokeWidth="2"/>
        </g>
      </g>
    );
  }
}

export default Template;
