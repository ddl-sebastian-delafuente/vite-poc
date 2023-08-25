import * as React from 'react';
import Icon, { IconProps } from './Icon';

export interface ComputerScreenProps extends IconProps {
  className?: string;
  fill?: string;
  height?: number;
  width?: number;
  viewBox?: string;
}

class ComputerScreen extends Icon<{}> {
  public static defaultProps: ComputerScreenProps = {
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
        <g transform="translate(0.000000, 1.000000)">
          <path d="M0,3.28571429 C1.18423789e-15,1.47106439 1.49238417,0 3.33333333,0 L28.6666667,0 C30.5076158,0 32,1.47106439 32,3.28571429 L32,19.7142857 C32,21.5289356 30.5076158,23 28.6666667,23 L3.33333333,23 C1.49238417,23 3.55271368e-15,21.5289356 3.55271368e-15,19.7142857 L0,3.28571429 Z M4,18.375 C4,18.720178 4.26862915,19 4.6,19 L27.4,19 C27.7313708,19 28,18.720178 28,18.375 L28,4.625 C28,4.27982203 27.7313708,4 27.4,4 L4.6,4 C4.26862915,4 4,4.27982203 4,4.625 L4,18.375 Z" fill={fill || '#95BEFF'} fillRule="nonzero" />
          <path d="M10.6,30 C10.2686292,30 10,29.6802034 10,29.2857143 C10.0207492,28.901922 10.2776145,28.5961299 10.6,28.5714286 C11.3368,28.4228571 12.094,27.0985714 12.4,25.7142857 C12.484,25.3335714 12.6688,25 13,25 L19,25 C19.3312,25 19.516,25.3335714 19.6,25.7142857 C19.906,27.0985714 20.6632,28.4228571 21.4,28.5714286 C21.7223855,28.5961299 21.9792508,28.901922 22,29.2857143 C22,29.6802034 21.7313708,30 21.4,30 L10.6,30 Z" fill={fill || '#0B4DB6'} />
        </g>
      </g>
    );
  }
}

export default ComputerScreen;
