import * as React from 'react';
import Icon, { IconProps } from './Icon';

class ProjectsIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    fill: 'currentColor',
    height: 15,
    width: 15,
    viewBox: '0 0 16 16',
    primaryColor: 'currentColor',
    secondaryColor: 'currentColor',
  };
  renderContent() {
    const {
      fill,
      primaryColor,
      secondaryColor,
    } = this.props;

    return (
      <g>
        <path d="M2,0 L14,0 C15.1045695,-2.02906125e-16 16,0.8954305 16,2 L16,14 C16,15.1045695 15.1045695,16 14,16 L2,16 C0.8954305,16 1.3527075e-16,15.1045695 0,14 L0,2 C-1.3527075e-16,0.8954305 0.8954305,2.02906125e-16 2,0 Z M10,2 C9.44771525,2 9,2.44771525 9,3 C9,3.55228475 9.44771525,4 10,4 L13,4 C13.5522847,4 14,3.55228475 14,3 C14,2.44771525 13.5522847,2 13,2 L10,2 Z M10,6 C9.44771525,6 9,6.44771525 9,7 C9,7.55228475 9.44771525,8 10,8 L13,8 C13.5522847,8 14,7.55228475 14,7 C14,6.44771525 13.5522847,6 13,6 L10,6 Z M3,10 C2.44771525,10 2,10.4477153 2,11 L2,13 C2,13.5522847 2.44771525,14 3,14 L13,14 C13.5522847,14 14,13.5522847 14,13 L14,11 C14,10.4477153 13.5522847,10 13,10 L3,10 Z" fill={primaryColor || fill} />
        <rect fill={secondaryColor} x="2" y="2" width="6" height="6" rx="1"/>
      </g>
    );
  }
}

export default ProjectsIcon;
