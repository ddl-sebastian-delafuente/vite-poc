import * as R from 'ramda';
import React from 'react';
import Button from '../../../components/Button/Button';
import { success, error, warning } from '../../../components/toastr';

type ToastType = 'success' | 'error' | 'pending';

interface ToastrWrapperProps {
  type: ToastType;
  text: string;
  duration: number;
}

const ToastrWrapper = (props: ToastrWrapperProps) => {
  const { type, text, duration } = props;
  return R.cond([
    [R.equals('error'), () => <Button onClick={() => error(text, '', duration)}>Click to invoke a error message</Button>],
    [R.equals('warning'), () => <Button onClick={() => warning(text, '', duration)}>Click to invoke a warning message</Button>],
    [R.T, () => <Button onClick={() => success(text, '', undefined, duration)}>Click to invoke a successful message</Button>]
  ])(type === 'pending' ? 'warning' : type);
};

export default ToastrWrapper;
