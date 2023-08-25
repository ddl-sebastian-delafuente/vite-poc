import { kebabCase } from 'lodash';
import * as React from 'react';
import styled from 'styled-components';
import { isEmpty } from 'ramda';
// @TODO refactor
import { StyledRadioContent } from '../../../data/data-sources/CommonStyles';
import { themeHelper } from '../../../styled';
import LabelAndValue, { LabelAndValueProps } from '../../LabelAndValue';
import Radio, { RadioChangeEvent } from '../../Radio';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { 
  FieldStyle, 
  LayoutFieldRadio, 
  Option, 
  Orientation,
} from '../DynamicField.types';
import { 
  serializeBools,
  getFormItemProps,
  getLabelAndValueProps, 
  useRemoteFieldOptions,
  useAntFormSync,
} from '../DynamicField.utils';
import { FormItem } from './CommonComponents';

const StyledRadioContentLayout = styled(StyledRadioContent)`
  height: 100%;
`;
const Label = styled.div`
  font-weight: ${themeHelper('fontWeights.normal')};
  height: 100%;
`

const SubLabel = styled.div`
  font-weight: ${themeHelper('fontWeights.normal')};
  height: 100%;
`

export const RadioField = ({
  editable,
  fieldStyle,
  fullWidthInput,
  isAdminPage,
  isAdminUser,
  onChange,
  testIdPrefix,
  value,
  width,
  ...props
}: LayoutFieldFactoryProps) => {
  const field = props.field as LayoutFieldRadio;
  const [inputValue, setInputValue] = React.useState<Option | string | boolean>(value);
  const labelProps = getLabelAndValueProps(field, testIdPrefix, width, fullWidthInput);
  const [options] = useRemoteFieldOptions(field, { isAdminPage, isAdminUser });
  const formItemProps = getFormItemProps(field, width);

  useAntFormSync({
    field,
    name: formItemProps.name,
    onChange,
    value,
  });

  const handleChange = React.useCallback((e: RadioChangeEvent) => {
    const value = e.target.value;
    setInputValue(value);

    if (field.path && onChange ) {
      onChange(field.path, value);
    }
  }, [field.path, onChange, setInputValue]);

  const radioStyles = React.useMemo(() => {
    if (!field.orientation || field.orientation === Orientation.horizontal) {
      return {};
    }

    return {
      display: 'flex',
      marginBottom: '25px',
    }
  }, [field.orientation]);
  
  const sharedTestId = `${labelProps.testId}-radio-group`;

  const selectedValue = React.useMemo(() => {
    const inputType = typeof inputValue;
    if (['string', 'boolean'].indexOf(inputType) !== -1) {
      return inputValue;
    }

    return (inputValue as Option)?.value;
  }, [inputValue]);

  const inputElement = (
    <Radio
      dataTest={sharedTestId}
      onChange={handleChange}
      defaultValue={selectedValue}
      direction='horizontal'
      optionType={field.optionType}
      items={
        options.map((option) => {
          return {
            key: serializeBools(option.value),
            value: option.value,
            disabled: option.disabled,
            style: radioStyles,
            'data-test': `${sharedTestId}-option-${kebabCase(serializeBools(option.value))}`,
            label: <StyledRadioContentLayout>
              {!isEmpty(option.label) && <Label aria-label={option.label} aria-checked={option.value === selectedValue}>{option.label}</Label>}
              {option.subLabel && (
                <SubLabel>{option.subLabel}</SubLabel>
              )}
            </StyledRadioContentLayout>,
            disabledReason: option.disabledReason
          }
        }
        )
      }
    />
  );

  if (fieldStyle === FieldStyle.FormItem) {
    return <FormItem {...formItemProps}>{inputElement}</FormItem>;
  }

  return (
    <LabelAndValue
      {...labelProps as LabelAndValueProps}
      value={!editable ? value : inputElement}
    />
  );
}
