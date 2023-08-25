import * as React from 'react';
import Icon, { IconProps } from './Icon';

export interface HamburgerMenuProps extends IconProps {
  className?: string;
  fill?: string;
  height?: number;
  width?: number;
  viewBox?: string;
}

class HamburgerMenu extends Icon<{}> {
  public static defaultProps: HamburgerMenuProps = {
    className: '',
    fill: 'currentColor',
    height: 10,
    width: 10,
    viewBox: '0 0 24 24',
  };

  renderContent() {
    const {
      fill,
    } = this.props;

    return (
      <path fill={fill} d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
    );
  }

}

export default HamburgerMenu;
