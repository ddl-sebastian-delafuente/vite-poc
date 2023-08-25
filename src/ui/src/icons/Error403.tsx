import * as React from 'react';

export default (
  {testId, ...props}: Omit<React.SVGProps<SVGSVGElement>, 
  'aria-relevant'> & { key?: React.Key, testId?: string }
): JSX.Element => (
  // @ts-ignore
  <svg width="168" height="168" data-test={testId} {...props} viewBox="0 0 168 168" xmlns="http://www.w3.org/2000/svg">
    <path d="M84 0C37.8 0 0 37.8 0 84s37.8 84 84 84 84-37.8 84-84S130.2 0 84 0zM16.8 84c0-36.96 30.24-67.2 67.2-67.2 15.12 0 29.4 5.04 41.16 14.28l-94.08 94.08C21.84 113.4 16.8 99.12 16.8 84zM84 151.2c-15.12 0-29.4-5.04-41.16-14.28l94.08-94.08C146.16 54.6 151.2 68.88 151.2 84c0 36.96-30.24 67.2-67.2 67.2z" fill="#E0E0E0" fillRule="nonzero"/>
  </svg>
);
