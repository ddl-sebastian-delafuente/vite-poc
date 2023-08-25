// eslint-disable-next-line no-restricted-imports
import { CopyOutlined } from '@ant-design/icons';
// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import * as React from 'react';
import styled from 'styled-components';

import useStore from '@domino/ui/dist/globalStore/useStore';
import { getAppName, replaceWithWhiteLabelling } from '@domino/ui/dist/utils/whiteLabelUtil';

import { copyToClipboardWithSuccess } from '../../../utils/copyToClipboard';
import LabelAndValue, { LabelAndValueProps } from '../../LabelAndValue';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { FieldStyle, LayoutFieldTextArea }  from '../DynamicField.types';
import { 
  getFormItemProps,
  getLabelAndValueProps, 
  getValue as getValueExternal,
  useAntFormSync,
} from '../DynamicField.utils';
import { FormItem } from './CommonComponents';

const StyledCopyOutlined = styled(CopyOutlined)`
  cursor: pointer;
  font-size: 16px;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 10;
`;

const TextareaWrapper = styled.div`
  position: relative;
`

export const TextAreaField = ({
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
  const field = props.field as LayoutFieldTextArea;
  const [inputValue, setInputValue] = React.useState<string>(value);
  const formItemProps = getFormItemProps(field, width);

  const { canCopy } = field;

  useAntFormSync({
    field,
    name: formItemProps.name,
    onChange,
    value,
  });

  const handleCopy = React.useCallback(() => {
    copyToClipboardWithSuccess(getValueExternal(value), {
      element: 'textarea',
      excludeUri: true
    })(`${field.label} copied`);
  }, [field.label, value])

  const getValue = React.useCallback((value: string) => {
    const resolvedValue = getValueExternal(value);

    if (!canCopy) {
      return resolvedValue;
    }

    return (
      <TextareaWrapper>
        <StyledCopyOutlined onClick={handleCopy}/>
        <Input.TextArea
          rows={field.height || 10}
          value={resolvedValue}
        />
      </TextareaWrapper>
    )
  }, [ canCopy, field.height, handleCopy ])
  
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (field.path && onChange ) {
      onChange(field.path, value);
    }
  }, [field.path, onChange, setInputValue]);
  
  const labelProps = getLabelAndValueProps(field, testIdPrefix, width, fullWidthInput);
  const inputElement = (
    <Input.TextArea
      data-test={`${labelProps.testId}-input`}
      disabled={field.disabled}
      onChange={handleChange} 
      placeholder={field.placeholder}
      rows={field.height || 10}
      value={inputValue} 
    />
  );

  if (fieldStyle === FieldStyle.FormItem) {
    return <FormItem {...formItemProps}>{inputElement}</FormItem>;
  }

  const label = (labelProps.label ?? '') as string;

  return (
    <LabelAndValue
      {...labelProps as LabelAndValueProps}
      label={replaceWithWhiteLabelling(getAppName(whiteLabelSettings))(label)}
      value={!editable ? getValue(value) : inputElement}
    />
  );
}
