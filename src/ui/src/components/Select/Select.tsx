import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { Select as AntSelect } from 'antd';
import {
  SelectProps as AntSelectProps,
  OptionProps,
  RefSelectProps,
  DefaultOptionType
} from 'antd/lib/select';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import tooltipRenderer from '../renderers/TooltipRenderer';
import { themeHelper } from '../../styled';

const { Option } = AntSelect;
const defaultSize = 'middle';

export interface OptionProp {
  /**
   * The value for the select option
   */
  value?: string | number;
  /**
   * The label for the select option
   */
  label: React.ReactNode;
  /**
   * Whether the select option is disabled
   */
  disabled?: boolean;
  /**
   * The reason of the disabled select option
   */
  disabledReason?: string;
  /**
   * To add `data-*` and any other prop
   */
  [prop: string]: any;
  /**
   * Group options
   */
  options?: Omit<OptionProp, 'children'>[]
}

export interface SelectProps extends Omit<AntSelectProps, 'size'> {
  children?: React.ReactNode;
  /**
   * The select options: array of {value, label} tuples. Ignored if children also provided.
   */
  options?: OptionProp[];

  /**
   * @default false
   * When `true`, parent component can control the `options` prop
   */
  useOptionsAsProp?: boolean;

  size?: 'small' | 'default';
  /**
   * Id of the container to bind to
   */
  containerId?: string;

  /**
   * `Select` container reference element access prop.
   */
  ref?: React.Ref<RefSelectProps>;

  // whether the option pane close upon selection
  closeAfterSelect?: boolean,

  // whether the option pane close upon deselection
  closeAfterDeselect?: boolean,
}

export { AntSelect as Option };

export { OptionProps };

const defaultStyle = { width: '100%' };

const StyledAntSelect = styled(AntSelect)`
  &&&.ant-select .ant-select-dropdown{
    background-color: ${themeHelper(`select.selector.container.background`)};
  }
  &&&.ant-select .ant-select-selector {
    border-color: ${themeHelper(`select.selector.container.borderColor`)};
    background: ${themeHelper(`select.selector.container.background`)};
    color: ${themeHelper(`select.selector.container.color`)};
  }
  &&&.ant-select:hover:not(.ant-select-disabled) .ant-select-selector {
    border-color: ${themeHelper(`select.selector.hover.borderColor`)};
    background: ${themeHelper(`select.selector.hover.background`)};
    color: ${themeHelper(`select.selector.hover.color`)};
  }
  &&&.ant-select.ant-select-focused:not(.ant-select-disabled) .ant-select-selector {
    border-color: ${themeHelper(`select.selector.focus.borderColor`)};
    background: ${themeHelper(`select.selector.focus.background`)};
    color: ${themeHelper(`select.selector.focus.color`)};
    box-shadow: 0px 0px 4px rgba(24, 144, 255, 0.5);
  }
  &&&.ant-select-disabled .ant-select-selector {
    border-color: ${themeHelper(`select.selector.disabled.borderColor`)};
    background: ${themeHelper(`select.selector.disabled.background`)};
    color: ${themeHelper(`select.selector.disabled.color`)};
  }
  &&&.ant-select:not(.ant-select-disabled) .ant-select-arrow {
    color: ${themeHelper(`select.selector.container.borderColor`)};
  }
  &&&.ant-select.ant-select-focused:not(.ant-select-disabled) .ant-select-arrow {
    color: ${themeHelper(`select.selector.focus.color`)};
  }
  &&&.ant-select .ant-select-item-option-disabled {
    background-color: ${themeHelper(`select.item.disabled.background`)};
    color: ${themeHelper(`select.item.disabled.color`)};
  }
  &&&.ant-select .ant-select-item-option:not(.ant-select-item-option-disabled) {
    background-color: ${themeHelper(`select.item.container.background`)};
    color: ${themeHelper(`select.item.container.color`)};
  }
  &&&.ant-select .ant-select-item.ant-select-item-group {
    background-color: ${themeHelper(`select.item.container.background`)};
    color: ${themeHelper(`select.item.container.color`)};
  }
  &&&.ant-select .ant-select-item-option:hover:not(.ant-select-item-option-disabled):not(.ant-select-item-option-selected) {
    background-color: ${themeHelper(`select.item.hover.background`)};
    color: ${themeHelper(`select.item.hover.color`)};
  }
  &&&.ant-select .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: ${themeHelper(`select.item.active.background`)};
    color: ${themeHelper(`select.item.active.color`)};
  }
`;

const Select = (props: SelectProps) => {
  const myRef = React.useRef<null | HTMLElement>(null) as React.Ref<RefSelectProps>;
  const {
    defaultValue,
    suffixIcon,
    onSelect,
    onDeselect,
    style,
    options,
    children,
    size = 'default',
    containerId,
    ref = myRef,
    useOptionsAsProp = false,
    closeAfterSelect = false,
    closeAfterDeselect = false,
    ...rest
  } = props;

  const otherProps = R.omit(['disabledReason'], rest);

  const getPopupContainer = (triggerNode: { parentElement?: HTMLElement }) => {
    const containerFromContainerId = containerId && document.getElementById(containerId);
    if (!R.isNil(containerFromContainerId)) {
      return containerFromContainerId as HTMLElement;
    }
    return triggerNode.parentElement || document.body;
  };

  const allSelectProps: AntSelectProps = {
    defaultValue,
    showArrow: true,
    suffixIcon,
    onSelect: (value: any, options: DefaultOptionType) => {
      onSelect && onSelect(value, options);
      if (closeAfterSelect) {
        // @ts-ignore
        ref?.current?.blur();
      }
    },
    onDeselect: (value: any, options: DefaultOptionType) => {
      onDeselect && onDeselect(value, options);
      if (closeAfterDeselect) {
        // @ts-ignore
        ref?.current?.blur();
      }
    },
    style: R.merge(defaultStyle, style),
    size: R.equals(size, 'default') || R.isNil(size) ? defaultSize : (size as SizeType),
    getPopupContainer,
    ...otherProps
  };

  return useOptionsAsProp ? (
    <StyledAntSelect {...allSelectProps} options={options} ref={ref} />
  ) : (
    <StyledAntSelect {...allSelectProps} ref={ref}>
      {children || R.map((option: OptionProp) => {
        const {value, label, disabled = false, disabledReason} = option;
        return (
          <Option
            key={value}
            value={value}
            disabled={disabled}
            role="option"
          >
            {disabled ? tooltipRenderer(disabledReason, label) : label}
          </Option>
        );
      }, options || [])}
    </StyledAntSelect>
  );
};

Select.Option = StyledAntSelect.Option;
Select.OptGroup = StyledAntSelect.OptGroup;

/* @component */
export default Select;
