import * as React from 'react';
import Icon, { IconProps } from './Icon';

class UsageIcon extends Icon<{}> {
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
        <g transform="translate(-107.000000, -131.000000)">
          <g transform="translate(103.000000, 127.000000)">
            <path d="M5,9.2 L8,9.2 L8,19 L5,19 L5,9.2 Z M10.6,5 L13.4,5 L13.4,19 L10.6,19 L10.6,5 Z M16.2,13 L19,13 L19,19 L16.2,19 L16.2,13 Z" fill={primaryColor} fillRule="nonzero"/>
            <polygon points="0 0 24 0 24 24 0 24"/>
          </g>
        </g>
      </g>
    );
  }
}

export default UsageIcon;
