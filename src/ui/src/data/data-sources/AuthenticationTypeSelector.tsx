import * as React from 'react';
import { themeHelper } from '../../styled';
import { makeTestId } from '../../utils/common';
import { 
  AuthenticationType,
  AuthenticationTypeRadioOptions,
} from './CommonData';
import Radio, { RadioChangeEvent, ItemsWithRadioProps } from '@domino/ui/dist/components/Radio';
/**
 * Note there is a issue with styled component versions of Radio/Radio.Group
 * This causes issues in testing were onChange events not working this 
 * makes it difficult to test radio buttons programmaticly
 */
const RadioGroupStyles: React.CSSProperties = {
  flexDirection: 'row',
};

const RadioStyles: React.CSSProperties = {
  marginBottom: 0,
  marginTop: `${themeHelper('margin.medium')}`,
};

export interface AuthenticationTypeSelectorProps {
  authTypes: AuthenticationType[];
  onChange: (evt: RadioChangeEvent) => void;
  testIdPrefix?: string;
  value?: string,
}

export const AuthenticationTypeSelector = ({
  authTypes,
  onChange,
  testIdPrefix,
  value
}: AuthenticationTypeSelectorProps) => {
  return (
    <Radio
      onChange={onChange}
      dataTest={makeTestId('authentication-type-selector', testIdPrefix)}
      value={value}
      style={RadioGroupStyles}
      items={authTypes.map((authTypeOption) => {
        const { label } = AuthenticationTypeRadioOptions[authTypeOption];
        return {
          key: authTypeOption,
          style: RadioStyles,
          value: authTypeOption,
          'data-test': makeTestId(`authentication-type-option-${authTypeOption}`, testIdPrefix),
          label: label
        } as ItemsWithRadioProps<string | number>
      })}
    />
  )
}
