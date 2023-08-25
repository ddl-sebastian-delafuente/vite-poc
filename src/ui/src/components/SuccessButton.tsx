import * as React from 'react';
import Button, { ExtendedButtonProps } from './Button/Button';

// @ts-ignore
const SuccessButton = (props: ExtendedButtonProps) => <Button {...props} btnType="primary" />;
export type { ExtendedButtonProps };
export default SuccessButton;
