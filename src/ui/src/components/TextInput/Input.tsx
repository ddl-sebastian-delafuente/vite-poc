import * as React from 'react';
import { equals } from 'ramda';
// eslint-disable-next-line no-restricted-imports
import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import {
  PasswordProps as AntPasswordProps,
  GroupProps as AntGroupProps,
  SearchProps as AntSearchProps,
  TextAreaProps as AntTextAreaProps,
} from 'antd/lib/input';
import styled from 'styled-components';
import { colors } from '../../styled';

export enum DominoInputSize {
  SMALL = 'small',
  DEFAULT = 'default',
}
export type InputSizeType = `${DominoInputSize}`;
export type AntInputPropsWithoutSize = Omit<AntInputProps, 'size'>;
export type AntPasswordPropsWithoutSize = Omit<AntPasswordProps, 'size'>;
export type AntGroupPropsWithoutSize = Omit<AntGroupProps, 'size'>;
export type AntSearchPropsWithoutSize = Omit<AntSearchProps, 'size'>;
export type AntTextAreaPropsWithoutSize = Omit<AntTextAreaProps, 'size'>;
export interface InputProps extends AntInputPropsWithoutSize {
  size?: InputSizeType;
}
export interface PasswordProps extends AntPasswordPropsWithoutSize {
  size?: InputSizeType;
}
export interface GroupProps extends AntGroupPropsWithoutSize {
  size?: InputSizeType;
}
export interface SearchProps extends AntSearchPropsWithoutSize {
  size?: InputSizeType;
}
export interface TextAreaProps extends AntTextAreaPropsWithoutSize {
  size?: InputSizeType;
}

const InputContainer = styled((props: AntInputProps) => <AntInput {...props}/>)`
  .ant-input-clear-icon {
    display: none;
  }
  &.ant-input-affix-wrapper-status-error .ant-input-clear-icon {
    color: ${colors.error};
    display: block;
  }
`;

const { SMALL, DEFAULT } = DominoInputSize;
const getSize = (size?: InputSizeType) => equals(size, SMALL) ? SMALL : 'middle';

const Input = ({ size = DEFAULT, ...rest }: InputProps) => <InputContainer {...rest} allowClear={true} size={getSize(size)} />;

Input.Group = ({ size = DEFAULT, ...rest }: GroupProps) => <AntInput.Group {...rest} size={size} />;
Input.Search = ({ size = DEFAULT, ...rest }: SearchProps) => <AntInput.Search {...rest} size={getSize(size)} />;
Input.Password = ({ size = DEFAULT, ...rest }: PasswordProps) => <AntInput.Password {...rest} size={getSize(size)} />;
Input.TextArea = ({ size = DEFAULT, ...rest }: TextAreaProps) => <AntInput.TextArea {...rest} size={getSize(size)} />;

export default Input;
