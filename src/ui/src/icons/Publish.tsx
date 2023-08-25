import * as React from 'react';
import Icon, { IconProps } from './Icon';

class Publish extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 16,
    width: 16,
    viewBox: '0 0 16 16',
    primaryColor: 'currentColor',
    secondaryColor: 'currentColor',
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;
    return (
      <g stroke="none" strokeWidth="1" fill={primaryColor} fillRule="evenodd">
        <g transform="translate(-105.000000, -454.000000)">
            <g transform="translate(105.000000, 454.000000)">
                <path d="M4.25,4.5 L4.25,2.1 C4.25,1.216344 4.966344,0.5 5.85,0.5 L10.65,0.5 C11.53368,0.5 12.25,1.216344 12.25,2.1 L12.25,4.5 L12.25,7.7 L16.25,7.7 L8.25,14.56776 L0.25,7.7 L4.25,7.7 L4.25,4.5 Z M10.65,2.1 L10.65,4.5 L10.65,7.7 L10.65,9.3 L11.68736,9.3 L8.25,12.4604 L4.812608,9.3 L5.85,9.3 L5.85,7.7 L5.85,4.5 L5.85,2.1 L10.65,2.1 Z M13.85,16.5 C14.73368,16.5 15.45,15.78368 15.45,14.9 L1.05,14.9 C1.05,15.78368 1.766344,16.5 2.65,16.5 L13.85,16.5 Z" transform="translate(8.250000, 8.500000) scale(1, -1) translate(-8.250000, -8.500000) "></path>
            </g>
        </g>
    </g>
    );
  }
}

export default Publish;
