import * as React from 'react';
import Icon, { IconProps } from './Icon';

class FilterColumnsIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 22,
    width: 25,
    viewBox: '0 0 25 15',
    primaryColor: 'currentColor',
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;

    return (
      <g strokeWidth="0" fill={primaryColor} stroke={primaryColor} fillRule="evenodd">
        <path d="M8.51190476,14.6666667 L14.4047619,14.6666667 L14.4047619,4.66666667 L8.51190476,4.66666667 L8.51190476,14.6666667 Z M1.30952381,14.6666667 L7.20238095,14.6666667 L7.20238095,4.66666667 L1.30952381,4.66666667 L1.30952381,14.6666667 Z M1.43999988,16 C0.644709905,16 6.1432832e-15,15.3552901 7.10542736e-15,14.5600001 L7.10542736e-15,3.33333333 L7.10542736e-15,1.43999988 C7.00803243e-15,0.644709905 0.644709905,1.46092398e-16 1.43999988,0 L14.2742858,2.22044605e-16 C15.0695758,7.59522073e-17 15.7142857,0.644709905 15.7142857,1.43999988 L15.7142857,14.5600001 C15.7142857,15.3552901 15.0695758,16 14.2742858,16 L1.43999988,16 Z M17.5358947,12 L24.6069625,12 L21.0714286,15.5998163 L17.5358947,12 Z"></path>
      </g>
    );
  }
}

export default FilterColumnsIcon;
