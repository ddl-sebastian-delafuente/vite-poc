import * as React from 'react';
import Icon, { IconProps } from './Icon';

class Lightning extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 10,
    width: 10,
    viewBox: '0 0 32 32',
    fill: 'currentColor',
    primaryColor: 'currentColor',
  };

  renderContent() {
    const {
      fill,
      primaryColor,
    } = this.props;

    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path d="M18.4632024,12.8388132 L23.2833363,15.6217187 C23.5000233,15.7468231 23.6913115,15.9114762 23.8472714,16.1071313 C24.5357707,16.9708688 24.393712,18.2292054 23.5299745,18.9177047 L8.40068297,30.97751 C8.06340184,31.2463623 7.59174406,31.2686619 7.23060188,31.0328305 C6.76818044,30.7308622 6.63810746,30.1112019 6.94007576,29.6487805 L13.6767777,19.3324807 L8.87830477,16.562081 C8.65387398,16.4325059 8.4567646,16.2605485 8.29793886,16.0557723 C7.62098022,15.1829603 7.77975073,13.9266229 8.65256273,13.2496643 L23.3405545,1.85756273 C23.6781407,1.59572868 24.1447799,1.57727616 24.5019873,1.81163569 C24.9637581,2.11459801 25.0924978,2.7345367 24.7895355,3.1963075 L18.4632024,12.8388132 Z" fill={primaryColor || fill} />
      </g>
    );
  }
}

export default Lightning;
