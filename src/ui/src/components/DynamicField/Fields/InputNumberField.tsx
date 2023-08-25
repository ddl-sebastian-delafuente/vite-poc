import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import {  InputNumber } from 'antd';
import LabelAndValue, { LabelAndValueProps } from '../../LabelAndValue';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { FieldStyle, LayoutFieldInputNumber }  from '../DynamicField.types';
import { 
  getFormItemProps,
  getLabelAndValueProps,
  useAntFormSync,
} from '../DynamicField.utils';
import { FormItem } from './CommonComponents';


export const InputNumberField = ({
  editable,
  fieldStyle,
  fullWidthInput,
  testIdPrefix,
  onChange,
  value,
  width,
  ...props
}: LayoutFieldFactoryProps) => {
  const field = props.field as LayoutFieldInputNumber;
  const [inputValue, setInputValue] = React.useState<string | number>(value);
  const formItemProps = getFormItemProps(field, width);

  useAntFormSync({
    field,
    name: formItemProps.name,
    onChange,
    value,
  });

  
  const handleChange = React.useCallback((e: number | string) => {
    const value = e;
    setInputValue(value);

    if (field.path && onChange ) {
      onChange(field.path, value);
    }
  }, [field.path, onChange, setInputValue]);
  
  const labelProps = getLabelAndValueProps(field, testIdPrefix, width, fullWidthInput);
  const inputElement = (
    <InputNumber
      data-test={`${labelProps.testId}-input`}
      disabled={field.disabled}
      onChange={handleChange} 
      defaultValue={inputValue}
      min={field.min}
      max={field.max}
    />
  );

  if (fieldStyle === FieldStyle.FormItem) {
    return <FormItem {...formItemProps}>{inputElement}</FormItem>;
  }

  const label = (labelProps.label ?? '') as string;

  return (
    <LabelAndValue
      {...labelProps as LabelAndValueProps}
      label={label}
      value={!editable ? value : inputElement}
    />
  );
}
