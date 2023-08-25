import * as React from 'react';
import Icon, { IconProps } from './Icon';

export interface PulseProps extends IconProps {
  className?: string;
  primaryColor?: string;
  height?: number;
  width?: number;
  viewBox?: string;
}

class Pulse extends Icon<{}> {
  public static defaultProps: PulseProps = {
    className: '',
    height: 24,
    width: 24,
    viewBox: '0 0 24 24',
    primaryColor: 'currentColor',
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;
    return (
      <g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill={primaryColor}
          d="M3.81818 2H20.1818C21.186 2 22 2.99492 22 4.22222V11V13V19.7778C22 21.0051 21.186 22 20.1818
          22H3.81818C2.81403 22 2 21.0051 2 19.7778V4.22222C2 2.99492 2.81403 2 3.81818 2ZM20 11V4H4V11H7.41421L9.66269
          13.2485L12.7622 6.01627L16.5 11H20ZM4 13H6.58579L10.3373 16.7515L13.2378 9.98373L15.5 13H20V20H4V13Z"
        />
      </g>
    );
  }
}

export default Pulse;
