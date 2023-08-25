import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import Checkbox from '../Checkbox/Checkbox';
import Select, { SelectProps, OptionProp } from '../Select/Select';
import { themeHelper } from '../../styled/themeUtils';

// To hide checkbox in selected elements tags
const MultiSelectWrap = styled.div`
  .ant-select-selection .ant-checkbox-wrapper {
    display: none;
  }
`;

const WithCheckboxWrap = styled.div`
  display: flex;
`;

const ContentWrap = styled.div`
  padding-left: ${themeHelper('margins.tiny')};
`;

export const withCheckbox = (key: string, node: React.ReactNode | string, isChecked: boolean) => (
  <WithCheckboxWrap>
    <Checkbox
      checked={isChecked}
    />
    <ContentWrap>
      {node}
    </ContentWrap>
  </WithCheckboxWrap>
);

export interface MultiSelectProps extends SelectProps {
  onSelectionChange?: (selectedItems: Array<string>) => void;
}

export interface MultiSelectState {
  selectedItems: Array<string>;
}

class MultiSelect extends React.Component<MultiSelectProps, MultiSelectState> {
  constructor (props: MultiSelectProps) {
    super(props);
    this.state = {
      selectedItems: []
    };
  }
  handleChange = (selectedItems: Array<string>) => {
    this.setState({ selectedItems });
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(selectedItems);
    }
  }
  render () {
    const {
      options,
      ...rest
    } = this.props;
    return (
      <MultiSelectWrap>
        <Select
          mode="multiple"
          options={R.map(({label, value}: OptionProp) => {
            return ({
              value: value,
              label: withCheckbox(R.defaultTo(label, value) as string, label, R.contains(value, this.state.selectedItems))
            }) as OptionProp;
          }, this.props.options ? this.props.options : [])}
          onChange={this.handleChange}
          {...rest}
        />
      </MultiSelectWrap>
    );
  }
}

export default MultiSelect;
