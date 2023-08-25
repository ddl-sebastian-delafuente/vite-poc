import * as React from 'react';
import Icon, { IconProps } from './Icon';

export interface HardwareBubbleProps extends IconProps {
  className?: string;
  primaryColor?: string;
  height?: number;
  width?: number;
  viewBox?: string;
}

class HardwareBubble extends Icon<{}> {
  public static defaultProps: HardwareBubbleProps = {
    className: '',
    height: 15,
    width: 15,
    viewBox: '350 -1800 3600 150',
    primaryColor: 'currentColor'
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;
    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" width={this.props.width} height={this.props.height}>
        <path transform="rotate(180) scale(-2,2)" d="M1312 512v160h160v-160h-160zM1838 805q18 -47 18 -85v-183v-73q0 -86 -61 -147t-147 -61h-1280q-86 0 -147 61t-61 147v256q0 38 17 83q186 521 236 608q92 157 259 157h672q163 0 258 -155q23 -38 112 -273.5t124 -334.5zM1696 464v256q0 10 -4 18v1q-12 29 -44 29 h-1180q11 28 61 160h1094q-136 367 -158 401q-28 47 -55.5 63t-65.5 16h-672q-39 0 -66.5 -16t-53.5 -61q-10 -17 -94.5 -233.5t-125.5 -330.5q-12 -32 -12 -78v-225q0 -20 14 -34t34 -14h1280q20 0 34 14t14 34z" fill={primaryColor || '#D0D5DD'} />
      </g>
    );
  }
}

export default HardwareBubble;
