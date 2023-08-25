import * as React from 'react';
import styled from 'styled-components';

import { 
  colors,
  sizes,
  themeHelper 
} from '../../../styled';
import { usePrevious } from '../../../utils/CustomHooks';
import { UnionToMap } from '../../../utils/typescriptUtils';
import Checkbox, { CheckboxChangeEvent } from '../../Checkbox/Checkbox';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { 
  getFormItemProps,
  serializeBools,
  useAntFormSync,
  useRemoteFieldOptions,
} from '../DynamicField.utils';
import { LayoutFieldDataplane} from '../DynamicField.types';

const CheckboxContainer = styled.div`
  &:not(:last-child) {
    margin-bottom: ${themeHelper('margins.tiny')}
  }
`;

const DataplaneLabel = styled.span`
  border-radius: ${sizes.STANDARD_BORDER_RADIUS};
  background: ${colors.disabledLabelBackground};
  color: ${colors.black};
  padding: ${themeHelper('paddings.tiny')}
`

const EditableContainer = styled.div`
  border-radius: ${sizes.STANDARD_BORDER_RADIUS};
  border: 1px solid ${colors.lightGreyCardBorderColor};
  min-height: 80px;
  max-height: 255px;
  overflow-y: auto;
  padding: ${themeHelper('paddings.medium')};
  width: 100%;
`;

type CheckAllStatus = 'checked' | 'indeterminate' | 'none';
const CheckAllStatus: UnionToMap<CheckAllStatus> = {
  checked: 'checked',
  indeterminate: 'indeterminate',
  none: 'none',
}

const CHECK_ALL_OPTION = '__ALL__';

type SelectAllStatus = null | 'pending' | 'done';

export const DataplaneField = ({
  editable,
  isAdminPage,
  isAdminUser,
  onChange,
  userId,
  value = [],
  width,
  ...props
}: LayoutFieldFactoryProps) => {
  const prevValue = usePrevious(value);
  // Used with field.selectAllByDefault. Need to wait till options are loaded
  const [selectAllStatus, setSelectAllStatus] = React.useState<SelectAllStatus>(null);
  const field = props.field as LayoutFieldDataplane;
  const [options] = useRemoteFieldOptions(field, { isAdminPage, isAdminUser, userId });
  const formItemProps = getFormItemProps(field, width);

  React.useEffect(() => {
    if (field.selectAllByDefault && selectAllStatus !== 'done') {
      if (!prevValue && value && options.length === 0) {
        setSelectAllStatus('pending');
        return;
      }

      if (options.length > 0) {
        if (onChange) {
          onChange(field.path, options.map(({ value }) => value));
        }
        
        setSelectAllStatus('done');
        return;
      }
    }
  }, [
    field.path,
    field.selectAllByDefault, 
    onChange,
    options, 
    prevValue, 
    selectAllStatus,
    setSelectAllStatus,
    value,
  ]);

  useAntFormSync({
    field,
    name: formItemProps.name,
    onChange,
    value,
  });

  const checkAllStatus: CheckAllStatus = React.useMemo(() => {
    if (value.length === 0) {
      return CheckAllStatus.none;
    }

    if (options.length !== value.length) {
      return CheckAllStatus.indeterminate;
    }

    return CheckAllStatus.checked;
  }, [options, value]);

  const handleChange = React.useCallback((id: string | boolean) => (e: CheckboxChangeEvent) => {
    if (id === CHECK_ALL_OPTION) {
      const checkAll = checkAllStatus === CheckAllStatus.indeterminate || checkAllStatus === CheckAllStatus.none;
      const allValues = checkAll ? options.map(({ value }) => value) : [];

      if (onChange) {
        onChange(field.path, allValues);
      }

      return;
    }
    
    const targetValue = e.target.checked;

    const newValue = targetValue ? 
      value.concat(id) : value.filter((a: string) => a !== id);
    
    if (onChange) {
      onChange(field.path, newValue);
    }
  }, [checkAllStatus, field.path, onChange, options, value]);

  const selectedOptions = React.useMemo(() => {
    if (editable) {
      return [];
    }

    if (field.useAllDataplanes) {
      return options;
    }

    return options.filter(option => value.indexOf(option.value) !== -1);
  }, [editable, field.useAllDataplanes, options, value]);

  const dataplaneOptions = React.useMemo(() => {
    if (!editable) {
      return [];
    }

    return options.map(({ label, value: optionValue }) => (
      <CheckboxContainer key={serializeBools(optionValue)}>
        <Checkbox
          checked={value.indexOf(optionValue) > -1}
          disabled={field.disabled}
          key={serializeBools(optionValue)}
          onChange={handleChange(optionValue)}
        >
          <DataplaneLabel>{label}</DataplaneLabel>
        </Checkbox>
      </CheckboxContainer>
    ))
  }, [editable, field.disabled, handleChange, options, value]);

  if (editable) {
    return (
      <EditableContainer>
        <CheckboxContainer>
          <Checkbox 
            checked={checkAllStatus === CheckAllStatus.checked}
            disabled={field.disabled}
            indeterminate={checkAllStatus === CheckAllStatus.indeterminate}
            onChange={handleChange(CHECK_ALL_OPTION)}
          >Select All</Checkbox>
        </CheckboxContainer>
        {dataplaneOptions}
      </EditableContainer>
    );
  }

  return (
    <EditableContainer>
      {selectedOptions.map((option) => (
        <CheckboxContainer key={serializeBools(option.value)}>
          <DataplaneLabel>{option.label}</DataplaneLabel>
        </CheckboxContainer>
      ))}
    </EditableContainer>
  )
}
