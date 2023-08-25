import React from 'react';
import TextArea, { TextAreaProps } from '../';

const FIELD_WIDTH = 300;

export type TextAreaWrapperProps = Pick<TextAreaProps, 'placeholder' | 'size' | 'disabled' | 'isError'>;
const TextAreaWrapper = (props: TextAreaWrapperProps) => <TextArea {...props} style={{ width: FIELD_WIDTH }} />;
export default TextAreaWrapper;
