import * as React from 'react';
import Icon, { generateId, IconProps } from './Icon';

const [id1, , id1UrlRef] = generateId();
const [id2, , id2UrlRef] = generateId();
const [id3, , id3UrlRef] = generateId();

class EmptyExperiments extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 146,
    width: 279,
    viewBox: '0 0 279 146',
    primaryColor: 'currentColor',
  };

  renderContent() {
    return (
      <g fill="none">
        <rect width={this.props.width} height={this.props.height} fill="#E5E5E5"/>
        <g clipPath="url(#clip0_1363_46902)">
          <rect width="1375" height="813" transform="translate(-666 -138)" fill="white"/>
          <mask id={id1} style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="279" height="146">
            <rect x="0.00634766" y="0.5" width="278.987" height="145" fill="white"/>
          </mask>
          <g mask={id1UrlRef}>
            <path d="M-14.6847 147.535H286.153C228.648 147.535 234.505 123.841 218.265 123.841C210.544 123.841 205.752 133.957 196.168 133.957C154.636 133.957 142.124 12.2911 105.65 12.2911C69.1771 12.2911 50.5464 147.535 -14.6847 147.535Z" fill={id2UrlRef}/>
            <path d="M31.9882 152.859H305.322C217.999 152.859 179.662 47.1664 155.94 47.1664C132.218 47.1664 91.2741 152.859 31.9882 152.859Z" fill={id3UrlRef}/>
            <line x1="0.831787" y1="-9.51263" x2="0.83178" y2="146.5" stroke="#E4E4E4"/>
            <line x1="292.167" y1="145.165" x2="2.16699" y2="145.165" stroke="#E4E4E4"/>
          </g>
        </g>
        <defs>
          <linearGradient id={id2} x1="175.136" y1="107.068" x2="-2.70442" y2="151.528" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4568F6"/>
            <stop offset="1" stopColor="#4568F6" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id={id3} x1="256.602" y1="124.639" x2="8.87917" y2="142.836" gradientUnits="userSpaceOnUse">
            <stop offset="0.0520833" stopColor="#BECEFF"/>
            <stop offset="0.708333" stopColor="#BECEFF" stopOpacity="0.37"/>
            <stop offset="1" stopColor="#BECEFF" stopOpacity="0.9"/>
          </linearGradient>
          <clipPath>
            <rect width="1375" height="813" fill="white" transform="translate(-666 -138)"/>
          </clipPath>
        </defs>
      </g>
    );
  }
}

export default EmptyExperiments;
