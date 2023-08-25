import * as React from 'react';
import Icon, { IconProps } from './Icon';

class Upload extends Icon<{}> {
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
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path d="M0,2 L0,2 C1.3527075e-16,3.1045695 0.8954305,4 2,4 L30,4 C31.1045695,4 32,3.1045695 32,2 L32,2 C32,0.8954305 31.1045695,-2.02906125e-16 30,0 L2,0 C0.8954305,2.02906125e-16 -1.3527075e-16,0.8954305 0,2 Z" fill={secondaryColor} fillRule="nonzero" />
        <path d="M4.82842712,22 L10,22 L10,30 C10,31.1045695 10.8954305,32 12,32 L20,32 C21.1045695,32 22,31.1045695 22,30 L22,22 L27.1715729,22 C28.2761424,22 29.1715729,21.1045695 29.1715729,20 C29.1715729,19.469567 28.9608592,18.9608592 28.5857864,18.5857864 L18.8284271,8.82842712 C17.26633,7.26632996 14.73367,7.26632996 13.1715729,8.82842712 L3.41421356,18.5857864 C2.63316498,19.366835 2.63316498,20.633165 3.41421356,21.4142136 C3.78928632,21.7892863 4.29799415,22 4.82842712,22 Z" fill={primaryColor} />
      </g>
    );
  }
}

export default Upload;
