import * as React from 'react';
import Icon, { IconProps } from './Icon';

class InputIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    fill: 'currentColor',
    height: 15,
    width: 15,
    viewBox: '0 0 20 15',
    primaryColor: 'currentColor',
    secondaryColor: 'currentColor',
  };

  renderContent() {
    const {
      fill,
      primaryColor,
    } = this.props;

    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-1002.000000, -494.000000)" stroke={primaryColor}>
          <g transform="translate(964.000000, 205.000000)">
            <g transform="translate(19.000000, 102.000000)">
              <g transform="translate(19.000000, 169.000000)">
                <g transform="translate(0.000000, 14.000000)">
                  <g transform="translate(0.000000, 5.000000)">
                    <path
                      d="M2.69504686,10.6445249 L6.45197236,14.056277 C6.4869578,14.0872679 6.5341624,14.1053036 6.5894536,14.1053036 C6.64534232,14.1053036 6.6938551,14.0868944 6.72314399,14.0603169 L10.4846601,10.6445249 L6.73239696,10.6445249 L6.73239696,2.86768195 C6.73239696,2.82706383 6.68165564,2.78073151 6.5894536,2.78073151 C6.49296035,2.78073151 6.43580847,2.83172043 6.43580847,2.86768195 L6.43580847,10.6445249 L2.69504686,10.6445249 Z"
                      strokeWidth="0.979775761"
                      fill={primaryColor || fill}
                      transform="translate(6.586957, 8.443018) rotate(-90.000000) translate(-6.586957, -8.443018)"
                    />
                    <polyline strokeWidth="1.34999996" strokeLinejoin="round" fillRule="nonzero" points="3.07692308 2.94736842 3.07692308 0 19.0769231 0 19.0769231 16 3.07692308 16 3.07692308 13.3114403"></polyline>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    );
  }
}

export default InputIcon;
