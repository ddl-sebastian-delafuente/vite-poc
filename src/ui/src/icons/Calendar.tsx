import * as React from 'react';

import {FunctionalIconProps as IconProps} from '../icons/Icon';

const Calendar = ({ width = 16, height = 16, testId }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} data-test={testId} height={height} viewBox="0 0 16 16">
    <g fill="none" fillRule="evenodd">
      <path fill="#D0D5DD" fillRule="nonzero" d="M15.979 14.298c0 .752-.61 1.362-1.362 1.362H1.362C.61 15.66 0 15.05 0 14.298V2.723c0-.752.61-1.361 1.362-1.361h1.021a.34.34 0 0 1 .34.34v.963A1.401 1.401 0 0 0 3.951 4.08a1.362 1.362 0 0 0 1.496-1.355V1.702a.34.34 0 0 1 .34-.34h4.404a.34.34 0 0 1 .34.34v.963A1.401 1.401 0 0 0 11.76 4.08a1.362 1.362 0 0 0 1.495-1.355V1.702a.34.34 0 0 1 .34-.34h1.022c.752 0 1.362.61 1.362 1.362v11.574zm-1.73-7.49H1.729c-.202 0-.367.153-.367.34v6.81c0 .187.165.34.368.34h12.519c.203 0 .368-.153.368-.34v-6.81c0-.187-.165-.34-.368-.34z" />
      <path fill="#8795AB" d="M4.766.68v2.043a.68.68 0 0 1-1.362 0V.681a.68.68 0 1 1 1.362 0zM11.894 0a.68.68 0 0 1 .68.68v2.043a.68.68 0 0 1-1.361 0V.681a.68.68 0 0 1 .68-.681z" />
    </g>
  </svg>
);

export default Calendar;
