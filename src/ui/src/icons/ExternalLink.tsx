import * as React from 'react';
import Icon, { IconProps } from './Icon';

class ExternalLink extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    fill: 'currentColor',
    height: 13,
    width: 13,
    viewBox: '0 0 13 13',
    primaryColor: 'currentColor',
    secondaryColor: 'currentColor',
  };

  renderContent() {
    const { primaryColor } = this.props;
    return (
      <g>
        <defs>
          <path
            d="M9.5477849,0.291000009 C4.27844628,0.291000009 0,4.46248513 0,9.60009028 C0,14.7449704 4.27844628,18.9164556 9.5477849,18.9164556 C14.8245851,18.9164556 19.1030313,14.7449704 19.1030313,9.60009028 C19.1030313,4.46248513 14.8245851,0.291000009 9.5477849,0.291000009 Z M9.5477849,17.7510005 C4.94252322,17.7510005 1.1953385,14.0960404 1.1953385,9.60009028 C1.1953385,5.10996015 4.94252322,1.45645504 9.5477849,1.45645504 C14.1590158,1.45645504 17.9076928,5.10996015 17.9076928,9.60009028 C17.9076928,14.0960404 14.1590158,17.7510005 9.5477849,17.7510005 Z M11.9384619,6.11100018 L7.16456944,6.11100018 C6.50496942,6.11100018 5.96923095,6.6333452 5.96923095,7.27645521 L5.96923095,11.9310004 C5.96923095,12.5726554 6.50496942,13.0964554 7.16456944,13.0964554 L11.9384619,13.0964554 C12.5965696,13.0964554 13.1338004,12.5726554 13.1338004,11.9310004 L13.1338004,7.27645521 C13.1338004,6.6333452 12.5965696,6.11100018 11.9384619,6.11100018 Z"
          />
        </defs>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-317.000000, -411.000000)" fill={primaryColor} fillRule="nonzero">
            <g transform="translate(317.000000, 411.000000)">
              <path d="M11.9166667,8.66666667 L13,8.66666667 L13,11.9166667 C13,12.5125 12.5125,13 11.9166667,13 L1.08333333,13 C0.4875,13 0,12.5125 0,11.9166667 L0,1.08333333 C0,0.4875 0.4875,0 1.08333333,0 L4.33333333,0 L4.33333333,1.08333333 L1.08333333,1.08333333 L1.08333333,11.9166667 L11.9166667,11.9166667 L11.9166667,8.66666667 Z M6.5,0 L8.9375,2.4375 L5.41666667,5.95833333 L7.04166667,7.58333333 L10.5625,4.0625 L13,6.5 L13,0 L6.5,0 Z"/>
            </g>
          </g>
        </g>
      </g>
    );
  }
}

export default ExternalLink;
