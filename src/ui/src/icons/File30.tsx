import * as React from 'react';
import Icon, { IconProps } from './Icon';

class File extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 10,
    width: 10,
    viewBox: '0 0 32 32',
    primaryColor: 'currentColor',
    secondaryColor: '#0B4DB6',
  };

  renderContent() {
    const {
      primaryColor,
      secondaryColor,
    } = this.props;

    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(4.000000, 0.000000)">
          <path d="M12,2 L12,10 C12,11.1045695 12.8954305,12 14,12 L22,12 C23.1045695,12 24,12.8954305 24,14 L24,30 C24,31.1045695 23.1045695,32 22,32 L2,32 C0.8954305,32 0,31.1045695 0,30 L0,2 C0,0.8954305 0.8954305,2.02906125e-16 2,0 L10,0 C11.1045695,-2.02906125e-16 12,0.8954305 12,2 Z" fill={primaryColor} />
          <path d="M16.5606602,0.560660172 L23.4393398,7.43933983 C24.0251263,8.02512627 24.0251263,8.97487373 23.4393398,9.56066017 C23.1580353,9.84196474 22.7765044,10 22.3786797,10 L16,10 C14.8954305,10 14,9.1045695 14,8 L14,1.62132034 C14,0.792893219 14.6715729,0.121320344 15.5,0.121320344 C15.8978247,0.121320344 16.2793556,0.279355604 16.5606602,0.560660172 Z" fill={secondaryColor} />
        </g>
      </g>
    );
  }
}

export default File;
