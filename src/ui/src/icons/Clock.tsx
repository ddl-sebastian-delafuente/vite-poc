import * as React from 'react';
import Icon, { IconProps } from './Icon';

class Clock extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 10,
    width: 10,
    viewBox: '0 0 32 32',
    primaryColor: 'currentColor',
    secondaryColor: '#0B4DB6',
  };

  renderContent() {
    const {
      primaryColor,
      secondaryColor,
    } = this.props;
    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g fillRule="nonzero">
          <path d="M16,28 C22.627417,28 28,22.627417 28,16 C28,9.372583 22.627417,4 16,4 C9.372583,4 4,9.372583 4,16 C4,22.627417 9.372583,28 16,28 Z M16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 Z" fill={primaryColor} />
          <path d="M22.3797356,20.5521293 C23.1793725,21.3141362 23.2098777,22.5800987 22.4478707,23.3797356 C21.6858638,24.1793725 20.4199013,24.2098777 19.6202644,23.4478707 L14.6202644,18.6831648 C14.2241633,18.3057038 14,17.782444 14,17.2352941 L14,9 C14,7.8954305 14.8954305,7 16,7 C17.1045695,7 18,7.8954305 18,9 L18,16.3784989 L22.3797356,20.5521293 Z" fill={secondaryColor} />
        </g>
      </g>
    );
  }
}

export default Clock;
