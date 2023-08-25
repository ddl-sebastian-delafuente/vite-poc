import * as React from 'react';
import Button, { ExtendedButtonProps } from './Button/Button';

const BaseIconButton = ({ children, ...props }: ExtendedButtonProps) => (
  // @ts-ignore
  <Button {...props} customIcon={!props.icon ? children : undefined} />
);

const IconButton = ({ ...props }: ExtendedButtonProps) => (
  <BaseIconButton {...props} btnType="icon" />
);

export const AntIconButton = ({ ...props }: ExtendedButtonProps) => (
  <BaseIconButton {...props} btnType="ant-icon" />
);

export { ExtendedButtonProps, BaseIconButton };
export default IconButton;
