import * as React from 'react';
import Icon, { IconProps } from './Icon';

export interface LockProps extends IconProps {
  className?: string;
  fill?: string;
  height?: number;
  width?: number;
  viewBox?: string;
}

class Lock extends Icon<{}> {
  public static defaultProps: LockProps = {
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
        <g transform="translate(4.000000, 0.000000)">
          <path d="M10.1224977,22.340006 L8,28 L16,28 L13.8775023,22.340006 C14.5619148,21.7901628 15,20.9462415 15,20 C15,18.3431458 13.6568542,17 12,17 C10.3431458,17 9,18.3431458 9,20 C9,20.9462415 9.43808517,21.7901628 10.1224977,22.340006 Z M4,13 L20,13 C22.209139,13 24,14.790861 24,17 L24,28 C24,30.209139 22.209139,32 20,32 L4,32 C1.790861,32 2.705415e-16,30.209139 0,28 L0,17 C-2.705415e-16,14.790861 1.790861,13 4,13 Z" fill={fill || '#95BEFF'} />
          <path d="M16,8 C16,5.790861 14.209139,4 12,4 C9.790861,4 8,5.790861 8,8 L8,13 L4,13 L4,8 C4,3.581722 7.581722,0 12,0 C16.418278,0 20,3.581722 20,8 L20,13 L16,13 L16,8 Z" fill={fill || '#0B4DB6'} fillRule="nonzero" />
        </g>
      </g>
    );
  }
}

export default Lock;
