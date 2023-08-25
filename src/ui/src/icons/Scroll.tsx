import * as React from 'react';
import Icon, { IconProps } from './Icon';

export interface ScrollProps extends IconProps {
  className?: string;
  fill?: string;
  height?: number;
  width?: number;
  viewBox?: string;
}

class Scroll extends Icon<{}> {
  public static defaultProps: ScrollProps = {
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
        <path d="M26,3 C26,1.34314575 27.3431458,0 29,0 C30.6568542,0 32,1.34314575 32,3 L32,10 L26,10 L26,3 Z" fill={fill || '#0B4DB6'} />
        <path d="M0,29 L0,22 L6,22 L6,29 C6,30.6568542 4.65685425,32 3,32 C1.34314575,32 0,30.6568542 0,29 Z" fill={fill || '#0B4DB6'} />
        <path d="M10,0 L26,0 L26,28 C26,30.209139 24.209139,32 22,32 L6,32 L6,4 C6,1.790861 7.790861,4.05812251e-16 10,0 Z" fill={fill || '#95BEFF'} />
        <path d="M11.5,8 L20.5,8 C21.3284271,8 22,8.67157288 22,9.5 C22,10.3284271 21.3284271,11 20.5,11 L11.5,11 C10.6715729,11 10,10.3284271 10,9.5 C10,8.67157288 10.6715729,8 11.5,8 Z M11.5,14 L20.5,14 C21.3284271,14 22,14.6715729 22,15.5 C22,16.3284271 21.3284271,17 20.5,17 L11.5,17 C10.6715729,17 10,16.3284271 10,15.5 C10,14.6715729 10.6715729,14 11.5,14 Z M11.5,20 L20.5,20 C21.3284271,20 22,20.6715729 22,21.5 C22,22.3284271 21.3284271,23 20.5,23 L11.5,23 C10.6715729,23 10,22.3284271 10,21.5 C10,20.6715729 10.6715729,20 11.5,20 Z" fill={fill || '#0B4DB6'} />
        <path d="M29,0 C27.3431458,0 26,1.34314575 26,3 L26,0 L29,0 Z" fill={fill || '#95BEFF'} />
        <path d="M3,32 C4.65685425,32 6,30.6568542 6,29 L6,32 L3,32 Z" fill={fill || '#95BEFF'} />
      </g>
    );
  }
}

export default Scroll;
