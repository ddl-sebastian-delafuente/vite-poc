import * as React from 'react';
import styled from 'styled-components';
import { debounceInput } from '../utils/sharedComponentUtil';
// eslint-disable-next-line no-restricted-imports
import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export const LARGE_INPUT_SIZE = 'large';
export const DEFAULT_INPUT_SIZE = 'default';
export const SMALL_INPUT_SIZE = 'small';
export const GROUPED_OPTIONS = 'groupoption';
export const OPTIONS = 'option';
const baseInputStyle = { width: '100%' };

interface ContainerProps {
  bordered: boolean;
}
const Container = styled.div<ContainerProps>`
  background: ${props => props.bordered ? 'auto' : 'transparent'};
  .certain-category-search.ant-select-show-search.ant-select-auto-complete {
    &.ant-select-enabled {
      background: ${({ bordered }) => bordered ? 'auto' : 'transparent'};
    }
  }

  .ant-input-affix-wrapper.ant-select-selection-search-input {
    background: ${({ bordered }) => bordered ? 'auto' : 'transparent'};
    border: ${({ bordered }) => !bordered ? '0' : 'inherit'};
  }

  input {
    border: ${({ bordered }) => !bordered ? '0' : 'inherit'};
    background: ${({ bordered }) => bordered ? 'auto' : 'transparent'};
    outline: none;
  }
`;

function buildOptions(options: any) {
  return options.map(({ content, value }: { key: string; content: string; value: string }) => (
    {
      label: content,
      value: value
    }
  ));
}

function getOnChangeDebounce(props: any) {
  return debounceInput(props.onChange);
}

export type IconPosition = 'prefix' | 'suffix';

// TODO FIX THE TYPES IN THIS FILE

export type PluggableTypeaheadInputProps = {
  value?: string | { key: string; label: string | JSX.Element; };
  bordered?: boolean,
  optionType?: any,
  queryText?: any,
  onChange?: any,
  showSearchIcon?: boolean,
  searchBoxIcon?: any,
  iconPosition?: IconPosition,
  className?: any,
  dropdownClassName?: any,
  dropdownMatchSelectWidth?: any,
  dropdownStyle?: any,
  size?: any,
  style?: any,
  placeholder?: any,
  options?: (any | any | any | any)[]
  disabled?: boolean;
  onSelect?: (input: any) => void;
  dataTest?: string;
  addOnAfterInput?: React.ReactNode;
};

export class PluggableTypeaheadInput extends React.PureComponent<PluggableTypeaheadInputProps, {}> {
  public static defaultProps = {
    options: [],
    bordered: true,
    showSearchIcon: false,
    iconPosition: 'left',
    searchBoxIcon: (
      <SearchOutlined style={{ fontSize: '12px' }} />
    ),
    className: 'certain-category-search',
    dropdownClassName: 'certain-category-search-dropdown',
    dropdownMatchSelectWidth: false,
    size: DEFAULT_INPUT_SIZE,
    onChange: () => ''
  };

  throttledOnChange: (newProps: any) => any;

  constructor(props: any) {
    super(props);
    this.throttledOnChange = getOnChangeDebounce(props);
  }

  UNSAFE_componentWillUpdate(newProps: any) {
    this.throttledOnChange = getOnChangeDebounce(newProps);
  }

  getSearchBoxIcon() {
    const {
      showSearchIcon,
      iconPosition,
      searchBoxIcon,
    } = this.props;

    if (showSearchIcon) {
      return {
        [iconPosition as IconPosition]: searchBoxIcon
      };
    }

    return {};
  }

  createOptions() {
    const { optionType, options } = this.props;
    switch (optionType) {
      case GROUPED_OPTIONS:
        if (!options) {
          return '';
        }
        return options.map(({ label, children }) => ({
          label: label,
          options: buildOptions(children)
        }));
      case OPTIONS:
        return buildOptions(options);
      default:
        return options;
    }
  }

  getOptionLabelProp() {
    const { optionType } = this.props;
    if (optionType) {
      return 'content';
    }
    return '';
  }

  render() {
    const {
      placeholder,
      bordered,
      dataTest,
      addOnAfterInput,
      ...rest
    } = this.props;

    return (
      <Container bordered={bordered!} className="table-search-wrapper">
        <AutoComplete
          options={this.createOptions()}
          style={baseInputStyle}
          {...rest}
          onChange={this.throttledOnChange}
          getPopupContainer={(trigger: HTMLElement) => trigger.parentElement || document.body}
        >
          <Input placeholder={placeholder} {...this.getSearchBoxIcon()} data-test={dataTest} addonAfter={addOnAfterInput}/>
        </AutoComplete>
      </Container>
    );
  }
}

export default PluggableTypeaheadInput;
