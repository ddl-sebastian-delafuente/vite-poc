// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import * as React from 'react';

import useStore from '@domino/ui/dist/globalStore/useStore';
import { getAppName, replaceWithWhiteLabelling } from '@domino/ui/dist/utils/whiteLabelUtil';

import LabelAndValue, { LabelAndValueProps } from '../../LabelAndValue';
import { BLOCKED_PASSWORD } from '../../../data/data-sources/DataSourceAuthenticationShared';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { FieldStyle, LayoutFieldMutable } from '../DynamicField.types';
import { getFormItemProps, getLabelAndValueProps } from '../DynamicField.utils';
import { FormItem } from './CommonComponents';

export const PasswordField = ({
  editable,
  fieldStyle,
  fullWidthInput,
  testIdPrefix,
  onChange,
  width,
  ...props
}: LayoutFieldFactoryProps) => {
  const { whiteLabelSettings } = useStore();
  const field = props.field as LayoutFieldMutable;
  const [inputValue, setInputValue] = React.useState<string>('');
  
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (field.path && onChange ) {
      onChange(field.path, value);
    }
  }, [field.path, onChange, setInputValue]);
  
  const labelProps = getLabelAndValueProps(field, testIdPrefix, width, fullWidthInput);
  const inputElement = (
    <Input.Password 
      autoComplete="secret-credentials"
      data-test={`${labelProps.testId}-input`}
      disabled={field.disabled}
      onChange={handleChange} 
      value={inputValue} 
    />
  );

  if (fieldStyle === FieldStyle.FormItem) {
    return <FormItem {...getFormItemProps(field, width)}>{inputElement}</FormItem>
  }

  const label = (labelProps.label ?? '') as string;

  return (
    <LabelAndValue
      {...labelProps as LabelAndValueProps}
      label={replaceWithWhiteLabelling(getAppName(whiteLabelSettings))(label)}
      value={!editable ? BLOCKED_PASSWORD : inputElement}
    />
  );
}
