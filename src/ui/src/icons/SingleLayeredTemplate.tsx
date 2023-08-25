import * as React from 'react';
import Icon from './Icon';

class SingleLayeredTemplate extends Icon<{}> {
  static defaultProps = {
    className: '',
    primaryColor: 'currentColor',
    height: 16,
    width: 15,
    viewBox: '0 0 15 16',
  };

  renderContent() {
    return (
      <g>
        <rect x="1" y="1.41431" width="13.1714" height="13.1714" fill="white" stroke="#9499B1"/>
        <line x1="8.08569" y1="0.914307" x2="8.08569" y2="15.0857" stroke="#9499B1"/>
        <line x1="0.5" y1="10.4714" x2="7.58571" y2="10.4714" stroke="#9499B1"/>
        <line x1="7.58569" y1="4.98572" x2="14.6714" y2="4.98572" stroke="#9499B1"/>
      </g>
    );
  }
}

export default SingleLayeredTemplate;
