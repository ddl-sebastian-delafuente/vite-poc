import * as React from 'react';
import * as R from 'ramda';
import { DominoCommonUserPerson as User } from '@domino/api/dist/types';
import Select, { SelectProps } from '../Select/Select';
import styled from 'styled-components';

const SelectWrapper = styled.div`
  .ant-select {
    width: 100% !important;
  }
`;
const getOptions = (users: User[]) => {
  return R.map((user: User) => {
    return {label: user.userName, value: user.email || user.userName}
  }, users)
}

export interface EmailSelectionProps extends SelectProps {
  users: User[];
  defaultValue?: Array<string>;
  onSelectionChange?: (selectedItems: Array<string>) => void;
}

const EmailSelection = (props: EmailSelectionProps) => {
  const { onSelectionChange, defaultValue, users, ...rest } = props;

  const handleChange = (selectedItems: Array<string>) => {
    if (onSelectionChange) {
      onSelectionChange(selectedItems);
    }
  }
  

  return (
    <SelectWrapper>
      <Select
        mode="multiple"
        options={getOptions(users)}
        defaultValue={defaultValue}
        onChange={handleChange}
        {...rest}
      />
    </SelectWrapper>
  )
}

export default EmailSelection;
