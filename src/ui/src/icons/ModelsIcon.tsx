import * as React from 'react';
import Icon, { IconProps } from './Icon';

class ModelsIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 15,
    width: 15,
    viewBox: '0 0 500 500',
    primaryColor: 'currentColor',
    secondaryColor: '#FFFFFF',
    transform: 'rotate(90)',
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;

    return (
      <g>
        <path stroke={primaryColor} strokeWidth="30" d="M370.2,468.9c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3V50.1l73.6,73.6c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6    c4.8-4.8,4.8-12.5,0-17.3l-94.5-94.5c-4.6-4.6-12.7-4.6-17.3,0l-94.5,94.5c-4.8,4.8-4.8,12.5,0,17.3c4.8,4.8,12.5,4.8,17.3,0    l73.6-73.6v418.8H370.2z"/>
        <path stroke={primaryColor} strokeWidth="30" d="M209.9,365.7c-4.8-4.8-12.5-4.8-17.3,0L119,439.3V20.5c0-6.8-5.5-12.3-12.3-12.3s-12.3,5.5-12.3,12.3v418.8l-73.5-73.6    c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l94.5,94.5c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6L210,383    C214.6,378.3,214.6,370.5,209.9,365.7z"/>
      </g>
    );
  }
}

export default ModelsIcon;