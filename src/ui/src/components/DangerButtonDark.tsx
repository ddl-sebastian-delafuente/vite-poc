import * as React from 'react';
import DangerButton from './DangerButton';
import { ExtendedButtonProps } from './Button/Button';

const DangerButtonDark = (props: ExtendedButtonProps) => (
  <DangerButton {...props} btnType="primary" />
);
export default DangerButtonDark;
