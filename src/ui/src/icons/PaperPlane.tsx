import * as React from 'react';
import Icon, { IconProps } from './Icon';

class PaperPLane extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 32,
    width: 32,
    viewBox: '0 0 512 512',
    primaryColor: 'currentColor',
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;
    return (
      <g>
        <polygon points="96,249.6 202,296.3 416,96  " fill={primaryColor} />
        <polygon points="416,96 217.9,311.7 269.8,416  " fill={primaryColor} />
      </g>
    );
  }
}

export default PaperPLane;
