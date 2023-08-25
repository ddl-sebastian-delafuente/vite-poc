import * as React from 'react';
import Icon, { IconProps } from './Icon';

class FolderQuestionIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 10,
    width: 10,
    viewBox: '0 0 24 24',
    primaryColor: 'currentColor'
  };

  renderContent() {
    const {
      primaryColor
    } = this.props;

    return (
      <g xmlns="http://www.w3.org/2000/svg" fill={primaryColor}>
        <path d="M9.5,0h-9.5v24h24v-20h-11.5l-3,-4Zm12.5,22h-20v-20h6.5l3,4h10.5v16Z" />
        <path d="M0.4,2.521l-0.4,0.916l1.832,0.801l0.4,-0.916c0.284,-0.65 1.064,-1.322 1.876,-1.322c1.065,0 2,0.935 2,2c0,1.065 -0.935,2 -2,2h-1v3h2v-1.132c1.703,-0.458 3,-2.044 3,-3.868c0,-2.168 -1.832,-4 -4,-4c-1.511,0 -3.07,1.061 -3.708,2.521Z" transform="translate(7.892, 8)" />
        <path d="M1.80474,0.390524c0.390524,0.390524 0.390524,1.02369 0,1.41421c-0.390524,0.390524 -1.02369,0.390524 -1.41421,0c-0.390524,-0.390524 -0.390524,-1.02369 0,-1.41421c0.390524,-0.390524 1.02369,-0.390524 1.41421,0" transform="translate(10.9024, 17.9024)" />
      </g>
    );
  }
}

export default FolderQuestionIcon;
