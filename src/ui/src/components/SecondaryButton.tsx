import * as React from 'react';
import Button, { ExtendedButtonProps } from './Button/Button';

// @ts-ignore
const SecondaryButton = (props: ExtendedButtonProps) => <Button {...props} btnType="secondary" />;
export type { ExtendedButtonProps };
export default SecondaryButton;
