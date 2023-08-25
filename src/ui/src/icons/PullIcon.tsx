import * as React from 'react';
import Icon, { IconProps } from './Icon';

class PullIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 14,
    width: 15,
    viewBox: '0 0 15 14',
    primaryColor: '#4568F6',
    secondaryColor: 'currentColor',
  };

  renderContent() {
    const { primaryColor } = this.props;
    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-57.000000, -456.000000)" fill={primaryColor} fillRule="nonzero">
          <g transform="translate(45.000000, 449.000000)">
            <g transform="translate(12.000000, 7.000000)">
              <path d="M11.5,6 L7.5,10 L3.5,6 L6,6 L6,0 L9,0 L9,6 L11.5,6 Z M7.5,10 L0,10 L0,14 L15,14 L15,10 L7.5,10 Z M14,12 L12,12 L12,11 L14,11 L14,12 Z"/>
            </g>
          </g>
        </g>
      </g>
    );
  }
}

export default PullIcon;
