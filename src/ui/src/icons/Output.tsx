import * as React from 'react';
import Icon, { IconProps } from './Icon';

class OutputIcon extends Icon<{}> {
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
        <g transform="translate(-1158.000000, -494.000000)" stroke={primaryColor}>
          <g transform="translate(964.000000, 205.000000)">
            <g transform="translate(19.000000, 102.000000)">
              <g transform="translate(19.000000, 169.000000)">
                <g transform="translate(0.000000, 14.000000)">
                  <g transform="translate(166.000000, 13.000000) scale(-1, 1) translate(-166.000000, -13.000000) translate(157.000000, 5.000000)">
                    <polyline
                      strokeWidth="1.34999996"
                      strokeLinejoin="round"
                      fillRule="nonzero"
                      points="1.81818182 2.94736842 1.81818182 0 17.8181818 0 17.8181818 16 1.81818182 16 1.81818182 13.3114403"
                    />
                    <path
                      d="M2.95591643,10.5838815 L6.71284192,13.9956336 C6.74782736,14.0266245 6.79503197,14.0446602 6.85032317,14.0446602 C6.90621188,14.0446602 6.95472466,14.0262511 6.98401356,13.9996736 L10.7455297,10.5838815 L6.99326653,10.5838815 L6.99326653,2.80703859 C6.99326653,2.76642047 6.9425252,2.72008815 6.85032317,2.72008815 C6.75382992,2.72008815 6.69667804,2.77107708 6.69667804,2.80703859 L6.69667804,10.5838815 L2.95591643,10.5838815 Z"
                      strokeWidth="0.979775761"
                      fill={primaryColor || fill}
                      transform="translate(6.847826, 8.382374) scale(-1, 1) rotate(-90.000000) translate(-6.847826, -8.382374)"
                    />
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

export default OutputIcon;
