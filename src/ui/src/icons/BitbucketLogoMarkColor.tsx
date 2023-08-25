import * as React from 'react';
import Icon, {generateId} from './Icon';

const [id, _, idUrlRef] = generateId();

/* The BitBucket Mark "mark-gradient-neutral" from https://atlassian.design/resources/logo-library */
class BitBucketLogoMarkColor extends Icon<{}> {
  static defaultProps = {
    className: 'gitlogo',
    fill: 'currentColor',
    height: 16,
    width: 16,
    viewBox: '0 0 32 32'
  };

  renderContent() {
    return (
      <g>
        <path d="M4.77044 5C4.29089 5 3.93123 5.43959 4.01115 5.87918L7.24814 25.7007C7.32806 26.2203 7.76766 26.5799 8.28717 26.5799H23.9526C24.3123 26.5799 24.632 26.3002 24.7119 25.9405L27.9888 5.91915C28.0688 5.43959 27.7091 5.03997 27.2296 5.03997L4.77044 5ZM18.5177 19.3067H13.5223L12.2035 12.2333H19.7565L18.5177 19.3067Z" fill="#2684FF"/>
        <path d="M26.9098 12.2333H19.7165L18.5176 19.3067H13.5222L7.64771 26.3002C7.64771 26.3002 7.92744 26.54 8.32707 26.54H23.9925C24.3522 26.54 24.6719 26.2602 24.7518 25.9005L26.9098 12.2333Z" fill={idUrlRef}/>
        <defs>
          <linearGradient id={id} x1="28.5925" y1="14.2265" x2="16.672" y2="23.5316" gradientUnits="userSpaceOnUse">
          <stop offset="0.176" stopColor="#0052CC"/>
          <stop offset="1" stopColor="#2684FF"/>
        </linearGradient>
        </defs>
      </g>
    );
  }
}

export default BitBucketLogoMarkColor;
