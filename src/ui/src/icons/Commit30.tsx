import * as React from 'react';
import Icon, { IconProps } from './Icon';

export interface CommitProps extends IconProps {
  className?: string;
  fill?: string;
  height?: number;
  width?: number;
  viewBox?: string;
}

class Commit extends Icon<{}> {
  public static defaultProps: CommitProps = {
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
        <g transform="translate(8.000000, 0.000000)">
            <path d="M6,0 L10,0 L10,10 L6,10 L6,0 Z M6,22 L10,22 L10,32 L6,32 L6,22 Z" fill={fill || '#95BEFF'} />
            <path d="M4,6 L12,6 C14.209139,6 16,7.790861 16,10 L16,22 C16,24.209139 14.209139,26 12,26 L4,26 C1.790861,26 0,24.209139 0,22 L0,10 C0,7.790861 1.790861,6 4,6 Z M6,10 C4.8954305,10 4,10.8954305 4,12 L4,20 C4,21.1045695 4.8954305,22 6,22 L10,22 C11.1045695,22 12,21.1045695 12,20 L12,12 C12,10.8954305 11.1045695,10 10,10 L6,10 Z" fill={fill || '#0B4DB6'} fillRule="nonzero" />
        </g>
      </g>
    );
  }
}

export default Commit;
