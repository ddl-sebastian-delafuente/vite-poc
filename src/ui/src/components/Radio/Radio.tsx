import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import {
  // eslint-disable-next-line no-restricted-imports
  Radio as AntRadio,
  RadioProps as AntRadioProps,
  RadioGroupProps as AntRadioGroupProps,
  Space,
} from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import tooltipRenderer from '@domino/ui/dist/components/renderers/TooltipRenderer';
import { themeHelper } from '../../styled';
import { SpaceSize } from 'antd/lib/space';

const withSpan = (label: React.ReactNode, key: React.ReactText) =>
  <span data-test={`${key}-tooltip`}>{label}</span>;

const { Group: AntRadioGroup } = AntRadio;

const StyledAntRadioGroup = styled(AntRadioGroup)`
.ant-radio-wrapper {
  color: ${themeHelper('radio.default.container.color')};
  .ant-radio .ant-radio-inner {
  border-color: ${themeHelper('radio.default.container.borderColor')};
  }
}

.ant-radio-wrapper-checked, .ant-radio-wrapper:hover, .ant-radio-wrapper:active, .ant-radio-wrapper:focus {
  color: ${themeHelper('radio.default.selected.color')};
  .ant-radio .ant-radio-inner {
    border-color: ${themeHelper('radio.default.selected.borderColor')};
  }
  .ant-radio-inner:after {
    background: ${themeHelper('radio.default.selected.borderColor')};
  }
}

.ant-radio-input:focus + .ant-radio-inner {
  border-color: ${themeHelper('radio.default.selected.borderColor')};
  box-shadow: none;
}

&&&.ant-radio-group > label {
  padding-bottom: ${themeHelper('paddings.large')};
}

.ant-radio-wrapper.ant-radio-wrapper-disabled {
  .ant-radio-input {
    cursor: not-allowed;
  }
  color: ${themeHelper('radio.default.disabled.color')};
  .ant-radio-disabled .ant-radio-inner {
    border-color: ${themeHelper('radio.default.disabled.borderColor')} !important;
    background: ${themeHelper('radio.default.disabled.background')};
  }
  .ant-radio-inner:after {
    background: ${themeHelper('radio.default.disabled.borderColor')};
  }
  .ant-radio-disabled + span {
    color: ${themeHelper('radio.default.disabled.color')};
  }
}

.ant-radio-button-wrapper {
  border: 1px solid ${themeHelper('radio.button.container.borderColor')};
  background: ${themeHelper('radio.button.container.background')};
  color: ${themeHelper('radio.button.container.color')};
}

.ant-radio-button-wrapper-checked, .ant-radio-button-wrapper:active {
  border: 2px solid ${themeHelper('radio.button.selected.borderColor')} !important;
  background: ${themeHelper('radio.button.selected.background')};
  color: ${themeHelper('radio.button.selected.color')};
  box-shadow: none !important;
  margin: -1px;
}

.ant-radio-button-wrapper.ant-radio-button-wrapper-disabled {
  opacity: 0.4;
}
`;

export enum Defaults {
  RADIO_DISABLED_TEXT = 'Radio options disabled',
}

export type DisabledReasonType = {
  /**
   * Tooltip text when radio options are disabled
   */
  disabledReason?: string;
};
export interface RadioSpec<T = string, U = React.ReactNode> extends DisabledReasonType {
  key: string | number;
  label: U;
  value: T;
}

export type ItemsWithRadioProps<T> = AntRadioProps & RadioSpec<T>;
export type ModifiedAntRadioGroupProps = AntRadioGroupProps & DisabledReasonType;
export interface RadioGroupProps<T> extends ModifiedAntRadioGroupProps {
  /**
   * Radio options
   */
  items: Array<ItemsWithRadioProps<T>>;
  /**
   * Adds `data-test` attribute
   */
  dataTest?: string;
   /**
   * Sets direction of Radio options
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * Sets space between Radio options
   */
  spaceSize?: number | "small" | "middle" | "large" | [SpaceSize, SpaceSize] | undefined;
}

export const Radio = <T extends unknown>({
  items,
  disabled: radioGroupDisabled,
  disabledReason: radioGroupDisabledReason,
  spaceSize = 'middle',
  direction = 'vertical',
  dataTest = 'domino-radio-group',
  ...remainingRadioGroupProps
}: RadioGroupProps<T>) => (
  <StyledAntRadioGroup {...remainingRadioGroupProps} disabled={radioGroupDisabled} data-test={dataTest}>
    <Space direction={direction} size={spaceSize} style={{ display: direction == 'vertical' ? 'flex' : 'inline-flex' }} wrap={true}>
      {R.map(({ key, label, disabledReason: radioItemDisabledReason, disabled: radioItemDisabled, ...remainingRadioProps }) => (
        <AntRadio {...{ disabled: radioItemDisabled, ...remainingRadioProps }} key={key}>
          {(radioItemDisabled || radioGroupDisabled) ?
            tooltipRenderer(radioItemDisabledReason ?? radioGroupDisabledReason ?? Defaults.RADIO_DISABLED_TEXT, withSpan(label, key)) : label}
        </AntRadio>
      ), items)}
    </Space>
  </StyledAntRadioGroup>
);

export { RadioChangeEvent };
export default Radio;
