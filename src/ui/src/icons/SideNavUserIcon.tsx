import * as React from 'react';
import Icon, { IconProps } from './Icon';

export interface SideNavUserIconProps extends IconProps {
    ownerInitials?: string;
}

class SideNavUserIcon extends Icon<SideNavUserIconProps> {
  public static defaultProps: SideNavUserIconProps = {
    className: '',
    height: 15,
    width: 15,
    viewBox: '0 0 9 9',
    primaryColor: '#9daee4',
    secondaryColor: '#151f4c'
  };

  renderContent() {
    const {
      secondaryColor,
      ownerInitials,
      fill
    } = this.props;
    return (
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="0.800000012">
            <g transform="translate(-132.000000, -386.000000)" fill={fill}>
                <g transform="translate(44.000000, 19.000000)">
                    <g transform="translate(81.000000, 96.000000)">
                        <g>
                            <g>
                                <g transform="translate(7.000000, 271.449997)">
                                    <g transform="translate(0.000000, 0.149998)">
                                        <circle cx="4.4" cy="4.2" r="4.19999993"/>
                                        <text x="48%" y="62%" textAnchor="middle" fill={secondaryColor} fontSize="4px" fontFamily="Arial">{ownerInitials}</text>
                                    </g>
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

export default SideNavUserIcon;
