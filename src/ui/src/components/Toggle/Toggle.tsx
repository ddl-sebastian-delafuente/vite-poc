import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Switch, SwitchProps as ToggleProps } from 'antd';

const Toggle = (props: ToggleProps) => {
  return <Switch {...props}/>;
};

export { ToggleProps };
export default Toggle;
