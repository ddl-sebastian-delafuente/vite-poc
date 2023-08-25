import * as React from 'react';
import Checkbox, { CheckboxChangeEvent } from '../../Checkbox/Checkbox';

import useStore from '@domino/ui/dist/globalStore/useStore';
import { getAppName, replaceWithWhiteLabelling } from '@domino/ui/dist/utils/whiteLabelUtil';

import LabelAndValue, { LabelAndValueProps } from '../../LabelAndValue';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { FieldStyle, LayoutFieldCheckbox} from '../DynamicField.types';
import { getLabelAndValueProps } from '../DynamicField.utils';

export const CheckboxField = ({
  editable,
  fieldStyle,
  fullWidthInput,
  testIdPrefix,
  onChange,
  value,
  width,
  ...props
}: LayoutFieldFactoryProps) => {
  const { whiteLabelSettings } = useStore();
  const getFixedWhiteLabel = replaceWithWhiteLabelling(getAppName(whiteLabelSettings));
  const field = props.field as LayoutFieldCheckbox;
  const labelProps = getLabelAndValueProps(field, testIdPrefix, width, fullWidthInput);
  const [inputValue, setInputValue] = React.useState<boolean>(value);

  const handleChange = React.useCallback((e: CheckboxChangeEvent) => {
    const value = e.target.checked;
    if (typeof value === 'undefined') {
      return;
    }

    setInputValue(value);

    if (field.path && onChange ) {
      onChange(field.path, value);
    }
  }, [field.path, onChange, setInputValue]);

  React.useEffect(() => {
    if (typeof inputValue === 'undefined' && typeof field.defaultValue !== 'undefined') {
      setInputValue(field.defaultValue as boolean);
      if (field.path && onChange) {
        onChange(field.path, field.defaultValue);
      }
    }
  }, [inputValue, field.defaultValue, field.path, onChange]);

  const isTrue = React.useMemo(() => {
    if (typeof inputValue === 'string') {
      return (inputValue as string).toLowerCase() === 'true';
    }

    return inputValue;
  }, [inputValue]);

  const inputElement = (
    <Checkbox
      checked={inputValue}
      disabled={field.disabled}
      onChange={handleChange}
    >{getFixedWhiteLabel(field.label)}</Checkbox>
  );

  if (fieldStyle === FieldStyle.FormItem) {
    return inputElement;
  }
  
  const readOnlyValue = isTrue ? 'true' : 'false';
  const label = (labelProps.label ?? '') as string;

  return (
    <LabelAndValue
      {...labelProps as LabelAndValueProps}
      label={getFixedWhiteLabel(label)}
      value={!editable ? readOnlyValue : inputElement}
    />
  )
}
