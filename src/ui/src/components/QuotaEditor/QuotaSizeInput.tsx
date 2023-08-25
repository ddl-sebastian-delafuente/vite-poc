import * as React from 'react';
import styled from 'styled-components';

import { themeHelper } from '../../styled/themeUtils';
import Input, { InputProps } from '../TextInput/Input';

export interface QuotaSizeInputProps extends InputProps {
  units?: string;
  width?: string;
}

const InputWrapper = styled.div`
  align-items: center;
  display: flex;

  & > *:not(:last-child) {
    margin-right: ${themeHelper('margins.tiny')}
  }
`;

const StyledInput = styled(Input)`
  flex-grow: 0;
  flex-shrink: 0;
`

export const QuotaSizeInput = ({ 
  placeholder = 'Enter Override Value',
  units = 'GB',
  width = '200px',
  ...props 
}: QuotaSizeInputProps) => {
  return (
    <InputWrapper>
      <StyledInput 
        {...props}
        placeholder={placeholder}
        style={{ width }}
      />
      <span>{units}</span>
    </InputWrapper>
  )
}
