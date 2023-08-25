import * as React from 'react';
import Icon, { IconProps } from './Icon';

class Eye extends Icon<{}> {
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
      <g fill="none" fillRule="evenodd">
        <path fill={primaryColor} d="M16 28c-5.891 0-11.224-4-16-12C4.776 8 10.109 4 16 4s11.224 4 16 12c-4.776 8-10.109 12-16 12zm0-4a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
        <circle cx="16" cy="16" r="4" fill={secondaryColor}/>
      </g>
    );
  }
}

export default Eye;
