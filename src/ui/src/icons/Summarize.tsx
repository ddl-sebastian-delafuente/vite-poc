import * as React from 'react';
import Icon, { IconProps } from './Icon';

class Summarize extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    width: 91,
    height: 91,
    viewBox: '0 0 91 91',
    primaryColor: 'currentColor',
    secondaryColor: '#9DADE4',
  };

  renderContent() {
    const {
      primaryColor, secondaryColor
    } = this.props;

    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinejoin="round">
        <g transform="translate(-1002.000000, -438.000000)" fillRule="nonzero" stroke={primaryColor} strokeWidth="3">
          <g transform="translate(287.000000, 218.000000)">
            <g transform="translate(143.000000, 217.000000)">
              <g transform="translate(523.000000, 5.000000)">
                <g transform="translate(51.000000, 0.000000)">
                  <path d="M39.2254601,12 L37.5,12 C16.7944785,12 0,28.7944785 0,49.5 C0,70.2055215 16.7944785,87 37.5,87 C58.2055215,87 75,70.2055215 75,49.5 L75,47.7745399 L39.2254601,47.7745399 L39.2254601,12 Z" />
                  <path d="M49.7205624,0 L48,0 L48,39 L86.9994143,39 L86.9994143,37.2844575 C87.1141184,16.8123167 70.3673111,0 49.7205624,0 Z" fill={secondaryColor} />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    );
  }
}

export default Summarize;
