import * as React from 'react';
import Icon, { generateId } from './Icon';

const [id, _, idUrlRef] = generateId();

/* The BitBucket Mark "mark-gradient-neutral" from https://atlassian.design/resources/logo-library */
class BitBucketLogoMark extends Icon<{}> {
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
        <path d="M4.77046 5C4.2909 5 3.93123 5.43959 4.01115 5.87919L7.24813 25.7008C7.32806 26.2203 7.76769 26.58 8.2872 26.58H23.9526C24.3123 26.58 24.632 26.3002 24.7119 25.9406L27.9888 5.91915C28.0688 5.43959 27.7091 5.03997 27.2295 5.03997L4.77046 5ZM18.5177 19.3067H13.5223L12.2035 12.2333H19.7565L18.5177 19.3067Z" fill="#7A869A"/>
        <path d="M26.9099 12.2333H19.7165L18.5177 19.3067H13.5223L7.64771 26.3002C7.64771 26.3002 7.92747 26.54 8.3271 26.54H23.9926C24.3522 26.54 24.6719 26.2602 24.7519 25.9006L26.9099 12.2333Z" fill={idUrlRef}/>
        <defs>
          <linearGradient id={id} x1="28.5953" y1="14.2265" x2="16.6748" y2="23.5316" gradientUnits="userSpaceOnUse">
            <stop offset="0.176" stopColor="#344563"/>
            <stop offset="1" stopColor="#7A869A"/>
          </linearGradient>
        </defs>
      </g>
    );
  }
}

export default BitBucketLogoMark;
