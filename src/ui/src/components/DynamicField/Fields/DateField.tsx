// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import moment from 'moment';
import * as React from 'react';

import useStore from '@domino/ui/dist/globalStore/useStore';
import { getAppName, replaceWithWhiteLabelling } from '@domino/ui/dist/utils/whiteLabelUtil';

import LabelAndValue, { LabelAndValueProps } from '../../LabelAndValue';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { FieldStyle, LayoutFieldMutable } from '../DynamicField.types';
import { 
  getFormItemProps,
  getLabelAndValueProps, 
  useAntFormSync,
} from '../DynamicField.utils';
import { FormItem } from './CommonComponents';

export const DateField = ({
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
  const { whiteLabelSettings } = useStore();
  const getFixedWhiteLabel = replaceWithWhiteLabelling(getAppName(whiteLabelSettings));

  useAntFormSync({
    field,
    name: formItemProps.name,
    onChange,
    value,
  });

  const getValue = React.useCallback((value: moment.MomentInput) => {
    return moment(value).format('MMM D, YYYY');
  }, [])

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (field.path && onChange ) {
      onChange(field.path, value);
    }
  }, [field.path, onChange, setInputValue]);

  const labelProps = getLabelAndValueProps(field, testIdPrefix, width, fullWidthInput);

  const inputElementProps = {
    'data-test': `${labelProps.testId}-textinput`,
    disabled: field.disabled,
    onChange: handleChange,
    placeholder: getFixedWhiteLabel(field.placeholder ?? ''),
  }

  if (fieldStyle === FieldStyle.FormItem) {
    return (
      <FormItem 
        {...formItemProps}
        initialValue={value}
      ><Input { ...inputElementProps }/></FormItem>
    );
  }

  const label = (labelProps.label ?? '') as string;

  return (
    <LabelAndValue
      {...labelProps as LabelAndValueProps}
      label={getFixedWhiteLabel(label)}
      value={!editable ? getValue(value) : <Input { ...inputElementProps } value={inputValue}/>}
    />
  );
}
