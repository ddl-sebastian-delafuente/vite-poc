import * as React from 'react';

import {FunctionalIconProps as IconProps} from '../icons/Icon';

const ImageFileIcon = ({ width = 20, height = 20, testId }: IconProps) => (
  <svg viewBox="0 0 24 24" width={width} height={height} data-test={testId} xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <rect fillOpacity=".1" fill="#6CAAFF" width="24" height="24" rx="4"/>
      <path fill="#1890FF" fillRule="nonzero" d="M12.822 14.192L9.605 10 5 16h13l-3.283-4.277z"/>
      <circle fill="#1890FF" fillRule="nonzero" cx="15" cy="8" r="2"/>
    </g>
  </svg>
);

export default ImageFileIcon;
