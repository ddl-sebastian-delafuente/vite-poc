import * as React from 'react';

import {FunctionalIconProps as IconProps} from '../icons/Icon';

const TextFileIcon = ({ width = 20, height = 20, testId }: IconProps) => (
  <svg viewBox="0 0 24 24" width={width} height={height} data-test={testId} xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <rect fillOpacity=".1" fill="#6CAAFF" width="24" height="24" rx="4"/>
      <path d="M16 8.678v1.393a.665.665 0 0 1-.652.679.665.665 0 0 1-.651-.679v-.715h-2.045v5.288h.303c.36 0 .651.303.651.678a.665.665 0 0 1-.651.678h-1.91a.665.665 0 0 1-.651-.678c0-.375.291-.678.651-.678h.303V9.356H9.303v.715a.684.684 0 0 1-.326.588.63.63 0 0 1-.651 0A.684.684 0 0 1 8 10.07V8.678C8 8.304 8.292 8 8.652 8h6.696c.36 0 .652.304.652.678z" fill="#1890FF" fillRule="nonzero"/>
    </g>
  </svg>
);

export default TextFileIcon;
