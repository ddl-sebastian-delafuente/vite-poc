import * as React from 'react';
import { capitalize } from 'lodash';
import Radio, { RadioGroupProps, RadioSpec, RadioChangeEvent } from '../Radio';

const getRadioOption = (key: string, text: string): RadioSpec =>
  ({ key, value: key, label: `Choice ${capitalize(text)}` });

export type ExcludedRadioProps<T> = Pick<RadioGroupProps<T>, 'disabled' | 'disabledReason'>;
export type RadioWrapperProps<T = number> = ExcludedRadioProps<T>;
export const RadioWrapper: React.FC<RadioWrapperProps> = props => {
  const [value, setValue] = React.useState(1);
  return (
    <Radio
      {...props}
      value={value}
      direction="horizontal"
      onChange={(e: RadioChangeEvent) => setValue(e.target.value)}
      items={[getRadioOption('1', 'one'), getRadioOption('2', 'two')]}
      disabledReason={props.disabled ? props.disabledReason : undefined}
    />
  );
}

export default RadioWrapper;
