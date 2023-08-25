import * as React from 'react';
import Icon, { IconProps } from './Icon';
import {getUniqueId} from '../utils/common';

class NewUsageIcon extends Icon<{}> {
  uniqueId = 0;
  constructor (props: IconProps) {
    super(props);
    this.uniqueId = getUniqueId();
  }
  public static defaultProps: IconProps = {
    className: '',
    height: 16,
    width: 16,
    viewBox: '0 0 16 16',
    primaryColor: 'currentColor'
  };

  renderContent() {
    const { primaryColor } = this.props;
    return (
      <g>
        <defs>
          <path d="M1.45454398,0 L14.5454398,0 C15.3487997,0 16,0.795935986 16,1.77777597 L16,7.19999988 L16,8.79999985 L16,14.2222398 C16,15.2040797 15.3487997,16 14.5454398,16 L1.45454398,16 C0.651223989,16 0,15.2040797 0,14.2222398 L0,1.77777597 C0,0.795935986 0.651223989,0 1.45454398,0 Z M14.3999998,7.19999988 L14.3999998,1.59999997 L1.59999997,1.59999997 L1.59999997,7.19999988 L4.33136793,7.19999988 L6.1301519,8.99879985 L8.60975985,3.21301595 L11.6,7.19999988 L14.3999998,7.19999988 Z M1.59999997,8.79999985 L3.66863194,8.79999985 L6.66983989,11.8011998 L8.99023985,6.38698389 L10.7999998,8.79999985 L14.3999998,8.79999985 L14.3999998,14.3999998 L1.59999997,14.3999998 L1.59999997,8.79999985 Z" id={`usage-path-${this.uniqueId}`}/>
        </defs>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-51.000000, -25.000000)">
            <g transform="translate(51.000000, 25.000000)">
              <mask id={`usage-mask-${this.uniqueId}`} fill="white">
                <use xlinkHref={`#usage-path-${this.uniqueId}`}/>
              </mask>
              <use fill="#000000" xlinkHref={`#usage-path-${this.uniqueId}`}/>
              <g mask={`url(#usage-mask-${this.uniqueId})`} fill={primaryColor}>
                <g>
                  <rect x="0" y="0" width="16" height="16"/>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    );
  }
}

export default NewUsageIcon;
