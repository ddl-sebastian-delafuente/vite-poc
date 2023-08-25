import * as React from 'react';
import { ExtendedButtonProps, BaseIconButton } from './IconButton';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IconButton = ({ children, ...props }: ExtendedButtonProps) => (
  <BaseIconButton {...props} btnType="icon-small" />
);

export default IconButton;
