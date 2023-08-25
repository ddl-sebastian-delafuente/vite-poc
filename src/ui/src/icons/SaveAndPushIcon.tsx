import * as React from 'react';
import Icon, { IconProps } from './Icon';

class SaveAndPushIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 22,
    width: 16,
    viewBox: '0 0 16 22',
    primaryColor: '#FFFFFF',
    secondaryColor: 'currentColor',
  };

  renderContent() {
    const { primaryColor } = this.props;
    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-57.000000, -415.000000)" fill={primaryColor} fillRule="nonzero">
          <g transform="translate(45.000000, 411.000000)">
            <g transform="translate(8.000000, 3.000000)">
              <path d="M12,4 L12,1 L8,5 L12,9 L12,6 C15.31,6 18,8.69 18,12 C18,13.01 17.75,13.97 17.3,14.8 L18.76,16.26 C19.54,15.03 20,13.57 20,12 C20,7.58 16.42,4 12,4 Z M12,18 C8.69,18 6,15.31 6,12 C6,10.99 6.25,10.03 6.7,9.2 L5.24,7.74 C4.46,8.97 4,10.43 4,12 C4,16.42 7.58,20 12,20 L12,23 L16,19 L12,15 L12,18 Z"/>
            </g>
          </g>
        </g>
      </g>
    );
  }
}

export default SaveAndPushIcon;
