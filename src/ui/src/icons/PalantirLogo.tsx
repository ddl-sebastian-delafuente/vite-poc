import * as React from 'react';
import Icon, { IconProps } from './Icon';

class PalantirLogo extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    width: 17,
    height: 20,
    viewBox: '0 0 17 20',
    fill: 'currentColor',
  };
  renderContent() {
    return (
      <g>
        <path d="M 7.832 0 C 3.71 0 0.33 3.431 0.33 7.615 C 0.33 11.799 3.71 15.23 7.832 15.23 C 11.954 15.23 15.334 11.8 15.334 7.615 C 15.334 3.431 11.954 0 7.832 0 Z M 7.832 12.887 C 4.946 12.887 2.638 10.544 2.638 7.615 C 2.638 4.686 4.946 2.343 7.832 2.343 C 10.717 2.343 13.026 4.686 13.026 7.615 C 12.943 10.544 10.635 12.887 7.832 12.887 Z M 14.509 14.561 L 7.832 17.489 L 1.154 14.561 L 0 16.653 L 7.832 20 L 15.664 16.653 L 14.509 14.561 Z"/>
      </g>
    );
  }
}

export default PalantirLogo;
