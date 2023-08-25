import * as React from 'react';

const CreateEnvironmentIcon = (
  {testId, ...props}: Omit<React.SVGProps<SVGSVGElement>, 'aria-relevant'> & { key?: React.Key, testId?: string }
): JSX.Element => (
  // @ts-ignore
  <svg width={32} height={32} {...props} viewBox="0 0 32 32" data-test={testId}>
    <g fill="none" fillRule="evenodd">
      <rect fill="#F0F6FF" width="31.418" height="31.418" rx="5.4"/>
      <path d="M8 12.117v7.574c0 .2.096.389.259.506l.13.094a2 2 0 0 0 .27.165l6.738 3.4a1.312 1.312 0 0 0 1.204-.003l6.785-3.499a2 2 0 0 0 .29-.181l.093-.071a.58.58 0 0 0 .231-.464v-7.5a.42.42 0 0 0-.02-.128l-.002-.007a.249.249 0 0 0-.058-.097.33.33 0 0 0-.09-.067l-7.604-3.786a.508.508 0 0 0-.453 0L8.225 11.75a.951.951 0 0 0-.125.073.191.191 0 0 0-.077.113l-.003.012a.724.724 0 0 0-.02.169zm2.547 2.106L15.46 16.8v5.88L9.041 19.34v-5.881l1.506.765zm5.954 2.535l6.418-3.3v5.839L16.5 22.639v-5.88zM16 9.088l6.56 3.175-6.56 3.26-4.577-2.287-1.984-.973L16 9.087z" fill="#4568F6" fillRule="nonzero" opacity=".8"/>
    </g>
  </svg>
);

export default CreateEnvironmentIcon;
