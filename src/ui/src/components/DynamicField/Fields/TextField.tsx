// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import * as React from 'react';

import LabelAndValue, { LabelAndValueProps } from '../../LabelAndValue';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { FieldStyle, LayoutFieldMutable } from '../DynamicField.types';
import {
  getFormItemProps,
  getLabelAndValueProps,
  getValue,
  useAntFormSync,
} from '../DynamicField.utils';
import { FormItem } from './CommonComponents';

export const TextField = ({
  editable,
  fullWidthInput,
  fieldStyle,
  testIdPrefix,
  onChange,
  value,
  width,
  ...props
}: LayoutFieldFactoryProps) => {
  const field = props.field as LayoutFieldMutable;
  const formItemProps = getFormItemProps(field, width);
  const defaultValue = field.defaultValue || '';
  const isValueUndefined = typeof value === 'undefined';
  const [inputValue, setInputValue] = React.useState<string>(!isValueUndefined ? value : defaultValue);

  useAntFormSync({
    field,
    name: formItemProps.name,
    onChange,
    value,
  });

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (field.path && onChange) {
      onChange(field.path, value);
    }
  }, [field.path, onChange, setInputValue]);

  const labelProps = getLabelAndValueProps(field, testIdPrefix, width, fullWidthInput);

  const inputElementProps = {
    'data-test': `${labelProps.testId}-textinput`,
    disabled: field.disabled,
    onChange: handleChange,
    placeholder: field.placeholder,
  }

  if (fieldStyle === FieldStyle.FormItem) {
    return (
      <FormItem
        {...formItemProps}
        initialValue={value}
      ><Input {...inputElementProps} /></FormItem>
    );
  }

  return (
    <LabelAndValue
      {...labelProps as LabelAndValueProps}
      value={!editable ? getValue(value) : <Input {...inputElementProps} value={inputValue} />}
    />
  );
}
