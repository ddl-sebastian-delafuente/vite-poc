import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import { TextAreaProps as AntTextAreaProps } from 'antd/lib/input';
import { equals } from 'ramda';

export enum DominoTextAreaSize {
  SMALL = 'small',
  DEFAULT = 'default',
}
export type TextAreaSizeType = `${DominoTextAreaSize}`;

type AntTextAreaPropsWithoutSize = Omit<AntTextAreaProps, 'size'>;
export interface TextAreaProps extends AntTextAreaPropsWithoutSize {
  isError?: boolean;
  size?: TextAreaSizeType;
}

const { SMALL, DEFAULT } = DominoTextAreaSize;
export const TextArea: React.FC<TextAreaProps> = ({ isError = false, size = DEFAULT, status, ...rest }) => (
  <Input.TextArea
    {...rest}
    status={status ?? (isError ? 'error' : '')}
    size={equals(size, SMALL) ? SMALL : 'middle'}
  />
);

export default TextArea;
