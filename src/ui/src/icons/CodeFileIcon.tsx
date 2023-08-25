import * as React from 'react';

import {FunctionalIconProps as IconProps} from '../icons/Icon';

const CodeFileIcon = ({ width = 20, height = 20, testId }: IconProps) => (
  <svg viewBox="0 0 24 24" width={width} height={height} data-test={testId} xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <rect fillOpacity=".1" fill="#6CAAFF" width="24" height="24" rx="4"/>
      <g fill="#1890FF" fillRule="nonzero">
        <path d="M13.46 8.008a.756.756 0 0 0-.487.09.546.546 0 0 0-.27.352l-1.693 7.907c-.064.297.172.58.527.634.355.054.695-.143.759-.44l1.693-7.907a.476.476 0 0 0-.106-.41.676.676 0 0 0-.422-.226zM16.302 10.212c-.161-.156-.42-.235-.677-.206-.258.028-.476.159-.573.343-.096.184-.056.393.105.549L17.338 13l-2.181 2.102c-.25.24-.196.588.12.778.315.19.772.148 1.021-.091l2.545-2.446a.454.454 0 0 0 0-.687l-2.541-2.445zM9.72 10.12a.896.896 0 0 0-.535-.116.805.805 0 0 0-.485.207l-2.543 2.445a.454.454 0 0 0 0 .687L8.7 15.788c.248.241.706.283 1.022.093.316-.19.37-.538.122-.779L7.664 13l2.18-2.102a.464.464 0 0 0 .15-.409.54.54 0 0 0-.274-.369z"/>
      </g>
    </g>
  </svg>
);

export default CodeFileIcon;
