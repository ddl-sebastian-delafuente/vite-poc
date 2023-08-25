import React from 'react';
import * as R from 'ramda';
import Input, { InputProps } from '../Input';
import { EditInlineCommonProps } from '../../EditInline/EditInline';
import EditInlineWrapper from '../../EditInline/__stories__/EditInlineWrapper';
import tooltipRenderer from '../../renderers/TooltipRenderer';

export const FIELD_WIDTH = 300;

type TextInputWrapperProps = InputProps & EditInlineCommonProps & {
  /**
   * Control showing password-esque input.
   * 
   * **NOTE**: Only usable when `isEditInline` is `false`.
   */
  isPassword?: boolean;
};

const TextInputWrapper: React.FC<TextInputWrapperProps> = ({
  isPassword = false,
  isError = false,
  isEditInline = false,
  disabled,
  disabledReason,
  status,
  ...rest
}) => {
  const propsWithValue = {
    ...rest,
    disabled,
    disabledReason,
    style: {width: FIELD_WIDTH},
    status: status ?? (isError ? 'error' : ''),
  };

  /**
   * Sending in a `value` prop to Ant's `Input` is disabling the component's internal
   * state controlled change in input value. Hence the `value` prop is omitted below.
   */
  const propsWithoutValue = R.omit(['value'], propsWithValue);
  
  const InputOrPassword = R.cond([
    [R.equals(true), R.always(<Input.Password {...propsWithoutValue} autoComplete="new-password" />)],
    [R.equals(false), R.always(<Input {...propsWithoutValue} />)]
  ])(isPassword) as JSX.Element;

  const InputOrDisabledInput = R.cond([
    [R.equals(true), R.always(tooltipRenderer(disabledReason, <span>{InputOrPassword}</span>, 'right'))],
    [R.equals(false), R.always(InputOrPassword)]
  ])(disabled) as JSX.Element;

  return isEditInline ? <EditInlineWrapper {...propsWithValue} /> : InputOrDisabledInput;
};

export default TextInputWrapper;
