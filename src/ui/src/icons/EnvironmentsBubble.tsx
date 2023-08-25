import * as React from 'react';
import Icon, { IconProps } from './Icon';

class EnvironmentsBubble extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    fill: 'currentColor',
    height: 15,
    width: 15,
    primaryColor: '#E9EDF5',
    viewBox: '0 0 31 32',
  };
  renderContent() {
    const {
      primaryColor,
    } = this.props;
    return (
      <g fill="none" fillRule="evenodd">
        <circle cx="16" cy="16" r="15" fill="#FFF" stroke={primaryColor} strokeWidth="2" />
        <path fill="#D0D5DD" d="M15.084 13.9c.233.105.383.34.383.601v7.041a.672.672 0 0 1-.054.265.634.634 0 0 1-.844.337l-6.187-1.778A.658.658 0 0 1 8 19.764v-7.04c0-.092.018-.182.054-.265a.634.634 0 0 1 .844-.337l6.186 1.778zm1.217-6.012l7.026 2.066a.533.533 0 0 1 0 1.024l-7.026 2.066a1.067 1.067 0 0 1-.602 0l-7.026-2.066a.533.533 0 0 1 0-1.024l7.026-2.066c.197-.058.405-.058.602 0z" />
        <path fill="#8795AB" d="M16.916 13.841a.658.658 0 0 0-.383.601v7.042c0 .09.019.18.054.264.143.332.52.483.844.337l6.187-1.778a.658.658 0 0 0 .382-.601v-7.042a.672.672 0 0 0-.054-.264.634.634 0 0 0-.844-.337l-6.186 1.778z" />
      </g>
    );
  }
}

export default EnvironmentsBubble;
