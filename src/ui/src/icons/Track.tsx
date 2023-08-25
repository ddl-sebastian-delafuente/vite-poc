import * as React from 'react';
import Icon, { IconProps } from './Icon';

class Track extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    width: 93,
    height: 78,
    viewBox: '0 0 93 78',
    primaryColor: 'currentColor',
    secondaryColor: '#9DADE4',
  };

  renderContent() {
    const {
      primaryColor, secondaryColor
    } = this.props;

    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-716.000000, -444.000000)" stroke={primaryColor} strokeWidth="3">
          <g transform="translate(287.000000, 218.000000)">
            <g transform="translate(143.000000, 217.000000)">
              <g transform="translate(238.000000, 11.000000)">
                <g>
                  <g transform="translate(50.000000, 0.000000)">
                    <polyline strokeLinecap="round" strokeLinejoin="round" points="0 0 0 74 89 74" />
                    <polyline strokeLinecap="round" strokeLinejoin="round" points="4 69.6728516 22.0695369 36.2587891 41.9616574 57.3427734 60.9315178 24.48 82 14.0371094" />
                    <circle fill={secondaryColor} cx="23" cy="37" r="6" />
                    <circle fill={secondaryColor} cx="61" cy="25" r="6" />
                    <circle fill={secondaryColor}cx="82" cy="14" r="6" />
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

export default Track;
