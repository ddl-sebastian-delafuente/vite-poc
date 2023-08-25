import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { kebabCase } from 'lodash';
import Select, { SelectProps, RefSelectProps } from '@domino/ui/dist/components/Select';
import tooltipRenderer from '../../components/renderers/TooltipRenderer';
import { themeHelper } from '../../styled/themeUtils';
import EmptyArrowButton, { Direction } from '../EmptyArrowButton';

const { Option, OptGroup } = Select;

export interface OptionProp {
  key: string;
  label: React.ReactNode;
}

export interface MultiGroupSelectProps extends SelectProps {
  children?: React.ReactNode;
  options?: any;
  onSelectionChange?: (value: string[]) => void;
  onSearch?: (value: string) => void;
  selectedValues: Array<string>;
  onBlur?: () => void;
}

const defaultStyle = { width: 380 };

const defaultSuffixIcon = (
  <EmptyArrowButton
    direction={Direction.Down}
  />
);

const StyledSelect = styled(Select)`
  .ant-select-arrow {
    right: 6px;
  }

  .ant-select-selection-selected-value {
    padding-right: ${themeHelper('margins.tiny')};
  }

  .ant-select-selection__rendered {
    height: 36px !important;
    margin: 0 10px;
  }

  .ant-select-selection--multiple > ul > li,
    .ant-select-selection--multiple .ant-select-selection__rendered > ul > li {
      height: 30px;
      line-height: 30px;
    }

  .ant-select-search--inline .ant-select-search__field {
    width: 100% !important;
  }

  .ant-select-selection .disabledOption {
    opacity: 0.5;
  }

  .ant-select-selection__choice[title="disabled"] .ant-select-selection__choice__remove {
    display: none;
  }
  
  .ant-select-selection__choice[title="disabled"] {
    padding: 0 10px;
  }
`;

const MultiGroupSelect = React.forwardRef<RefSelectProps, MultiGroupSelectProps>(({
    children,
    options,
    onSelectionChange,
    onSearch,
    selectedValues,
    defaultValue,
    suffixIcon,
    style,
    onBlur,
    ...rest
}, ref) => {
  return (
    <StyledSelect
      defaultValue={defaultValue}
      filterOption={false}
      mode="multiple"
      notFoundContent={null}
      onBlur={onBlur}
      onChange={onSelectionChange}
      onSearch={onSearch}
      ref={ref}
      showArrow={false}
      showSearch={true}
      style={R.merge(defaultStyle, style)}
      suffixIcon={suffixIcon || defaultSuffixIcon}
      value={selectedValues}
      {...rest}
    >
      {
        children || R.map((option) => (
            <OptGroup label={option.groupName} key={option.key}>
              {
                R.map((groupOption) => (
                    <Option
                      key={groupOption.value}
                      value={groupOption.value}
                      disabled={groupOption.disabled === true}
                      data-test={`${kebabCase(groupOption.label)}-option-container`}
                      title={groupOption.disabled === true ? 'disabled' : ''}
                    >
                      {tooltipRenderer(groupOption.tooltip,(
                        <div
                          title={groupOption.label}
                          className={groupOption.disabled === true ? 'disabledOption' : ''}
                          data-test={`${kebabCase(groupOption.label)}-option`}>
                          {groupOption.label}
                        </div>
                      ))} 
                    </Option>
                  ), option.groupOptions || [])
              }
            </OptGroup>
          ), options || [])
      }
    </StyledSelect>
  )
});

export default MultiGroupSelect;
