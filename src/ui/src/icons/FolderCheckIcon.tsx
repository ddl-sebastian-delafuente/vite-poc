import * as React from 'react';
import Icon, { IconProps } from './Icon';

class FolderCheckIcon extends Icon<{}> {
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
      <g fill={primaryColor}>
        <path
          d="M9.5,0h-9.5v24h24v-20h-11.5l-3,-4Zm12.5,22h-20v-20h6.5l3,4h10.5v16Z"
        />
        <path
          d="M1.414,4l-1.414,1.414l3.414,3.414l7.414,-7.414l-1.414,-1.414l-6,6Z"
          transform="translate(6.586, 9.586)"
        />
      </g>
    );
  }
}

export default FolderCheckIcon;
