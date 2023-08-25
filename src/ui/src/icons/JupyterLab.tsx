import * as React from 'react';
import Icon, { IconProps } from './Icon';
import { getUniqueId } from '../utils/common';

class JupyterLab extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 16,
    width: 16,
    viewBox: '0 0 1034.54 1034.53'
  };
  uniqueId: number;

  constructor(props: IconProps) {
    super(props);
    this.uniqueId = getUniqueId();
  }

  renderContent() {
    return (
        <>
        <defs><radialGradient id={`radial-gradient-${this.uniqueId}`} cx="4502.02" cy="7209.75" r="7.44" gradientTransform="translate(-6690.76 5019.88) rotate(-90)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#616161"/><stop offset="0.05" stopColor="#5a5a5a"/><stop offset="0.27" stopColor="#414141"/><stop offset="0.49" stopColor="#2f2f2f"/><stop offset="0.73" stopColor="#242424"/><stop offset="1" stopColor="#212121"/></radialGradient>
        <linearGradient id={`linear-gradient-${this.uniqueId}`} x1="512.17" y1="520" x2="512.17" y2="504" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#bdbdbd"/><stop offset="0.01" stopColor="#bebebe"/><stop offset="0.26" stopColor="#dadada"/><stop offset="0.51" stopColor="#efefef"/><stop offset="0.76" stopColor="#fbfbfb"/><stop offset="1" stopColor="#fff"/></linearGradient>
            </defs>
    <title>icon</title>   
    <g>
        <rect x="42.93" y="41.98" width="951.75" height="951.75" rx="475.88" ry="475.88" style={{fill: `url(#radial-gradient-${this.uniqueId})`}}/>
        <path d="M512,36.12c262.82,0,475.88,213.06,475.88,475.88h0c0,262.82-213.06,475.88-475.88,475.88h0C249.17,987.88,36.12,774.82,36.12,512h0C36.12,249.18,249.17,36.12,512,36.12h0M512,0C229.67,0,0,229.68,0,512s229.68,512,512,512,512-229.68,512-512S794.31,0,512,0Z" transform="translate(6.82 5.86)" style={{fill: `url(#linear-gradient-${this.uniqueId})`}}/>
        <g data-name="Canvas"><g data-name="logo"><g data-name="g"><g data-name="path"><g data-name="path8 fill"><path data-name="path1 fill" d="M484.47,855.59c-175-5.66-325.76-74.63-402.1-172A434.9,434.9,0,0,0,233.29,899.57,430.53,430.53,0,0,0,896.76,710C814.27,802.17,659.45,861.25,484.47,855.59Z" transform="translate(6.82 5.86)" style={{fill: '#f37626'}}/></g></g><g data-name="path"><g data-name="path9 fill"><path data-name="path2 fill" d="M525.07,170.28c175,5.66,325.76,74.63,402.1,172A434.91,434.91,0,0,0,776.26,126.3,430.53,430.53,0,0,0,112.79,315.89C195.28,223.9,350.1,164.62,525.07,170.28Z" transform="translate(6.82 5.86)" style={{fill: '#f37626'}}/></g></g></g></g></g><path d="M510.45,1028.67c-285.23,0-517.27-232-517.27-517.27S225.23-5.86,510.45-5.86s517.27,232,517.27,517.27S795.68,1028.67,510.45,1028.67Zm0-947.84C273,80.84,79.88,274,79.88,511.41S273,942,510.45,942,941,748.82,941,511.41,747.87,80.84,510.45,80.84Z" transform="translate(6.82 5.86)" style={{fill: '#212121'}}/></g>
        <path d="M258,340h66V647.39H258Z" transform="translate(6.82 5.86)" style={{fill: '#efefef'}}/><path d="M498,647.39l-3.9-21.21h-1.3c-13.89,16.88-35.59,26-60.76,26-43,0-68.57-31.17-68.57-64.93,0-55,49.47-81.39,124.55-80.95v-3C488,492,481.91,476,449.36,476c-21.7,0-44.7,7.36-58.59,16l-12.15-42.42c14.75-8.22,43.83-18.61,82.46-18.61,70.74,0,93.31,41.56,93.31,91.34v73.59c0,20.34.87,39.82,3,51.51Zm-7.81-100c-34.72-.43-61.63,7.79-61.63,33.33,0,16.88,11.28,25.11,26,25.11,16.49,0,29.95-10.82,34.29-24.24a47.11,47.11,0,0,0,1.3-11.25Z" transform="translate(6.82 5.86)" style={{fill: '#efefef'}}/><path d="M604.75,647.39c.87-13.85,1.74-39.39,1.74-63.2V340h66V460.82h.87C685.9,442.64,708,431,737.55,431c50.78,0,88.1,42,87.66,106.92,0,76.19-48.6,114.28-97.21,114.28-24.74,0-48.6-9.09-63.8-34.2h-.87l-2.6,29.44Zm67.7-90a48,48,0,0,0,1.3,11.69c4.34,17.75,19.53,31.17,38.63,31.17,28.21,0,45.57-21.65,45.57-59.74,0-32.9-14.75-58.88-45.57-58.88-17.8,0-34.29,13.42-38.63,32.47a54.49,54.49,0,0,0-1.3,12.12Z" transform="translate(6.82 5.86)" style={{fill: '#efefef'}}/>
    </>
    );
  }
}

export default JupyterLab;
