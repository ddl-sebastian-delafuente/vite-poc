import * as React from 'react';
import Icon, { IconProps } from './Icon';

class GoogleDocLogo extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    width: 32,
    height: 32,
    viewBox: '0 0 1818.2 2500',
  };

  renderContent() {
    return (
      <g>
        <path fill="#4285F4" d="M1136.4,0H170.4C79.6,0,0,79.5,0,170.5v2159.1c0,90.9,79.5,170.5,170.5,170.5h1477.3   c90.9,0,170.5-79.5,170.5-170.5V681.8l-397.7-284.1L1136.4,0z"/>
        <path fill="#F1F1F1" d="M454.5,1818.2h909.1v-113.6H454.6L454.5,1818.2L454.5,1818.2z M454.5,2045.5h681.8v-113.6H454.5V2045.5z    M454.5,1250v113.6h909.1V1250H454.5z M454.5,1590.9h909.1v-113.6H454.6L454.5,1590.9L454.5,1590.9z"/>
        <path fill="#A1C2FA" d="M1136.4,0v511.4c0,90.9,79.5,170.4,170.4,170.4h511.4L1136.4,0z"/>
      </g>
    );
  }
}

export default GoogleDocLogo;
