import * as React from 'react';
import Button, { ExtendedButtonProps } from './Button/Button';

export type Props = ExtendedButtonProps;

const DangerButton = (props: Props) => (
  // @ts-ignore
  <Button btnType="secondary" {...props} isDanger={true} />
);
export default DangerButton;
