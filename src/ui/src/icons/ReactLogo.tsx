import * as React from 'react';
import Icon, { IconProps } from './Icon';

class ReactLogo extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    width: 32,
    height: 32,
    viewBox: '-11.5 -10.23174 23 20.46348',
  };

  renderContent() {
    return (
      <g>
        <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
        <g stroke="#61dafb" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2"/>
          <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
          <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
        </g>
      </g>
    );
  }
}

export default ReactLogo;
