import * as React from 'react';
import Icon, { IconProps } from './Icon';

class RedshiftLogo extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    width: 22,
    height: 22,
    viewBox: '0 0 44 44',
    fill: 'none',
  };
  renderContent() {
    return (
      <g>
        <path d="M20 33.749L36.8 37.7454V6.30664L20 10.303V33.749Z" fill="#205B97"/>
        <path d="M36.8002 6.30664L40.0002 7.90518V36.1468L36.8002 37.7454V6.30664ZM20.0002 33.749L3.2002 37.7454V6.30664L20.0002 10.303V33.749Z" fill="#5193CE"/>
        <path d="M3.2 6.30664L0 7.90518V36.1468L3.2 37.7454V6.30664Z" fill="#205B97"/>
        <path d="M24.2677 44.1379L30.6677 40.9409V3.19707L24.2677 0L22.311 20.9591L24.2677 44.1379Z" fill="#5193CE"/>
        <path d="M15.7325 44.1379L9.33252 40.9409V3.19707L15.7325 0L17.6892 20.9591L15.7325 44.1379Z" fill="#205B97"/>
        <path d="M15.7324 0H24.3541V44.0489H15.7324V0Z" fill="#2E73B7"/>
      </g>
    );
  }
}

export default RedshiftLogo;
