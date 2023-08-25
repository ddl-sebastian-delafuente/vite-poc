import * as React from 'react';
import Icon, { IconProps } from './Icon';

 class ModelAPIs extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 36,
    width: 36,
    viewBox: '0 0 36 36',
    primaryColor: 'currentColor'
  };

   renderContent() {
    const {
      primaryColor,
    } = this.props;
    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <path fill={primaryColor} fillRule="nonzero" d="M26.5037534,12.6147694 L6.68000004,12.6147694 L6.68000004,9.25476937 L26.8557848,9.25476937 L22.5434004,4.82215389 L24.3200004,3 L31.8800006,10.7538463 L24.3200004,18.5076927 L22.5434004,16.6855388 L26.5037534,12.6147694 Z M10.3762472,27.7347698 L14.3366002,31.8055391 L12.5600002,33.627693 L5,25.8738467 L12.5600002,18.1200003 L14.3366002,19.9421542 L10.0242158,24.3747697 L30.2000006,24.3747697 L30.2000006,27.7347698 L10.3762472,27.7347698 Z"></path>
      </g>
    );
  }
}

 export default ModelAPIs;
