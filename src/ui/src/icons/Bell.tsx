import * as React from 'react';
import Icon, { IconProps } from './Icon';

export interface BellProps extends IconProps {
  className?: string;
  fill?: string;
  height?: number;
  width?: number;
  viewBox?: string;
}

class Bell extends Icon<{}> {
  public static defaultProps: BellProps = {
    className: '',
    height: 10,
    width: 10,
    viewBox: '0 0 32 32',
  };

  renderContent() {
    const {
      fill,
    } = this.props;
    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(2.000000, 0.000000)">
          <path d="M4,18 L4,12 C4,7.15866309 7.44037987,3.12086995 12.0096849,2.19807531 C12.003279,2.13291744 12,2.06684165 12,2 C12,0.8954305 12.8954305,0 14,0 C15.1045695,0 16,0.8954305 16,2 C16,2.06684165 15.996721,2.13291744 15.9903151,2.19807531 C20.5596201,3.12086995 24,7.15866309 24,12 L24,18 C24,19.1045695 24.8954305,20 26,20 L25.5,20 C26.8807119,20 28,21.1192881 28,22.5 C28,23.8807119 26.8807119,25 25.5,25 L2.5,25 C1.11928813,25 1.69088438e-16,23.8807119 0,22.5 C-1.69088438e-16,21.1192881 1.11928813,20 2.5,20 L2,20 C3.1045695,20 4,19.1045695 4,18 Z" fill={fill || '#95BEFF'} />
          <path d="M10,27 L18,27 C18,29.209139 16.209139,31 14,31 C11.790861,31 10,29.209139 10,27 Z" fill={fill || '#0B4DB6'} />
        </g>
      </g>
    );
  }
}

export default Bell;
