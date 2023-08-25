import * as React from 'react';
import Icon, { IconProps } from './Icon';

class SideNavLoginIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 9,
    width: 9,
    viewBox: '0 0 9 9',
    primaryColor: '#9daee4',
    secondaryColor: '#151f4c',
  };

  renderContent() {
    const {
      fill,
      secondaryColor
    } = this.props;
    return (
        <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g transform="translate(-132 -386) translate(44 19) translate(81 96) translate(7 271.45) translate(0 .15)">
          <circle cx="4.4" cy="4.2" r="4.2" fill={fill} opacity="0.8" />
          <g fill={secondaryColor} fillRule="nonzero">
            <path
              d="M3.717 0a.252.252 0 00-.063.009A.252.252 0 003.591 0h-.252a.252.252 0 100 .504h.126V2.52h-.126a.252.252 0 100 .504h.252a.252.252 0 00.063-.009.252.252 0 00.315-.243V.252A.252.252 0 003.717 0zM1.987.562a.252.252 0 10-.32.39l.378.31H.315a.252.252 0 100 .503h1.701l-.355.317a.253.253 0 10.335.378l.882-.785a.252.252 0 00-.008-.378L1.987.562z"
              transform="translate(2.1 2.8)"
            />
          </g>
        </g>
      </g>
    );
  }
}

export default SideNavLoginIcon;
