import * as React from 'react';
import Icon, { IconProps } from './Icon';

class Logs extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    fill: 'currentColor',
    height: 20,
    width: 16,
    viewBox: '0 0 16 20',
    primaryColor: 'currentColor'
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;
    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-9.000000, -230.000000)">
          <g transform="translate(9.000000, 228.000000)">
            <polygon points="0 0 20 0 20 20 0 20" />
            <path fill={primaryColor} fillRule="nonzero" d="M17.5,2.5 L2.5,2.5 C1.58333333,2.5 0.833333333,3.25 0.833333333,4.16666667 L0.833333333,15.8333333 C0.833333333,16.75 1.58333333,17.5 2.5,17.5 L17.5,17.5 C18.4166667,17.5 19.1666667,16.75 19.1666667,15.8333333 L19.1666667,4.16666667 C19.1666667,3.25 18.4166667,2.5 17.5,2.5 Z M10,9.16666667 L2.5,9.16666667 L2.5,7.5 L10,7.5 L10,9.16666667 Z M10,5.83333333 L2.5,5.83333333 L2.5,4.16666667 L10,4.16666667 L10,5.83333333 Z" />
          </g>
        </g>
      </g>
    );
  }
}

export default Logs;
