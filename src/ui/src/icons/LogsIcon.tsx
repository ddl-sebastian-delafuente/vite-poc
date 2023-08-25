import * as React from 'react';
import Icon, { IconProps } from './Icon';

class LogsIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 16,
    width: 16,
    viewBox: '0 0 16 16',
    primaryColor: 'currentColor'
  };

  renderContent() {
    const { primaryColor } = this.props;
    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <polygon points="0 0 15 0 15 15 0 15"/>
        <path d="M13.7272727,2 L2.27272727,2 C1.57272727,2 1,2.55 1,3.22222222 L1,11.7777778 C1,12.45 1.57272727,13 2.27272727,13 L13.7272727,13 C14.4272727,13 15,12.45 15,11.7777778 L15,3.22222222 C15,2.55 14.4272727,2 13.7272727,2 Z M8,6.88888889 L2.27272727,6.88888889 L2.27272727,5.66666667 L8,5.66666667 L8,6.88888889 Z M8,4.44444444 L2.27272727,4.44444444 L2.27272727,3.22222222 L8,3.22222222 L8,4.44444444 Z" fill={primaryColor} fillRule="nonzero"/>
      </g>
    );
  }
}

export default LogsIcon;
