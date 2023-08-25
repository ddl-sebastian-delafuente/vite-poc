import { kebabCase } from 'lodash';
import * as React from 'react';
import styled from 'styled-components';
import Select from '@domino/ui/dist/components/Select';
import { grey70 } from '../../../styled/colors';
import LabelAndValue, { LabelAndValueProps } from '../../LabelAndValue';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { FieldStyle, LayoutFieldSelect, Option } from '../DynamicField.types';
import { 
  serializeBools,
  getFormItemProps,
  getFieldIcon,
  getLabelAndValueProps,
  useAntFormSync,
  useRemoteFieldOptions,
} from '../DynamicField.utils';
import { FormItem } from './CommonComponents';

const StyledSelect = styled(Select)`
  width: 100%;
`;
const StyledIconWrapper = styled.span`
  padding-right: 0.333em;
`;
const SublabelWrapper = styled.span`
  color: ${grey70};
  font-style: italic;
  padding-left: 0.333em;
`;
export const MultiSelectField = ({
  editable,
  fieldStyle,
  fullWidthInput,
  isAdminPage,
  isAdminUser,
  onChange,
  testIdPrefix,
  userId,
  value,
  width,
  ...props
}: LayoutFieldFactoryProps) => {
  const field = props.field as LayoutFieldSelect;

  const labelProps = getLabelAndValueProps(field, testIdPrefix, width, fullWidthInput);
  const [options] = useRemoteFieldOptions(field, { isAdminPage, isAdminUser, userId });
  
  useAntFormSync({
    field,
    name: field.path,
    onChange,
    value,
  });
  
  const handleChange = React.useCallback((e: string[]) => {

    if (field.path && onChange ) {
      onChange(field.path, e);
    }
  }, [field.path, onChange]);

  const getOptionLabel = React.useCallback((option: Option) => {
    const label = option.subLabel ? (
      <>{option.label}<SublabelWrapper>{option.subLabel}</SublabelWrapper></>
    ) : option.label;

    if (field.hasIcon) {
      const Icon = getFieldIcon(field.path, option.value);
      return (
        <>
          <StyledIconWrapper><Icon width="12" height="12"/></StyledIconWrapper>
          {label}
        </>
      )
    }
    return label;
  }, [field]);

  const displayValue = React.useMemo(() => {
    if (!field.hasIcon) {
      return value;
    }
    const option = options.find(o => o.value === value);
    if (!option) {
      return value;
    }
    const Icon = getFieldIcon(field.path, option.value);
    return (
      <>
        <StyledIconWrapper><Icon width="12" height="12"/></StyledIconWrapper>
        {value}
      </>
    );
  }, [field, options, value]);

  const sharedTestId = `${labelProps.testId}-select`;

  const inputElement = (
    <StyledSelect 
      data-test={`${sharedTestId}-field`}
      defaultValue={value}
      disabled={field.disabled}
      onChange={handleChange} 
      placeholder={field.placeholder}
      showSearch={field.showSearch}
      mode={field.mode ?? 'multiple'}
    >
      {field.clearable && (
        <Select.Option 
          data-label=""
          key="empty" 
          value=""
        >{''}</Select.Option>
      )}
      {options.map((option) => (
        <Select.Option 
          data-label={option.label}
          data-test={`${sharedTestId}-option-${kebabCase(serializeBools(option.value))}`}
          key={serializeBools(option.value)} 
          value={option.value}
        >{getOptionLabel(option)}</Select.Option>
      ))}
    </StyledSelect>
  );

  if (fieldStyle === FieldStyle.FormItem) {
    return <FormItem {...getFormItemProps(field, width)}>{inputElement}</FormItem>;
  }

  return (
    <LabelAndValue
      {...labelProps as LabelAndValueProps}
      value={!editable ? displayValue : inputElement}
    />
  );
}
