import * as React from 'react';

export default (
  { testId, ...props }: Omit<React.SVGProps<SVGSVGElement>, 
  'aria-relevant'> & { key?: React.Key, testId?: string }
): JSX.Element => (
  // @ts-ignore
  <svg width="168" height="168" data-test={testId} {...props} viewBox="0 0 168 168" xmlns="http://www.w3.org/2000/svg">
    <path d="M138 61h-8V46c0-21-17-38-38-38S54 25 54 46v15H46c-8 0-15 7-15 15v77c0 8 7 15 15 15h92c8 0 15-7 15-15V77c0-8-7-15-15-15zm-46 69c-8 0-15-7-15-15s7-15 15-15 15 7 15 15-7 15-15 15zm24-69H68V46c0-13 11-24 24-24 13 0 24 11 24 24v15z" fill="#E0E0E0" fillRule="nonzero"/>
  </svg>
);
