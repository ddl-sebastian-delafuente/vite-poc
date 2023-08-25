import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import ActionDropdown from '../ActionDropdown';
import FilterColumnsIcon from '../../icons/FilterColumns';
import Checkbox from '../Checkbox/Checkbox';
import FlexLayout from '../Layouts/FlexLayout';
import { themeHelper } from '../../styled';

const dropdownStyle: React.CSSProperties = { display: 'inline-block', cursor: 'pointer', height: '32px' };

const StyledFilter = styled(FilterColumnsIcon)`
  font-size: ${themeHelper('fontSizes.large')} !important;
`;

const StyledCheckbox = styled(Checkbox)`
  font-size: ${themeHelper('fontSizes.tiny')};
  align-items: center;
  .ant-checkbox  {
    top: 0;
  }
`;
export interface Column {
  key: string;
  label: string;
}

export interface ColumnFilterDropdownProps {
  getPopupContainer?: (triggerNode: Element) => HTMLElement;
  columns: Column[];
  className?: string;
  dropdownWrapperClassName?: string;
  onChange: (keys: string[], unSelectedColumnKeys?: string[]) => void;
  selectedColumns: Column[];
  dataTest?: string;
  showSelectedColumnsCount?: boolean;
  alwaysShowColumns?: string[];
  disableAlwaysShowColumnsInFilterDropdown?: boolean;
  unSelectedColumnKeys?: string[];
}

export interface ColumnFilterDropdownState {
  selectedColumnKeys: string[];
  unSelectedColumnKeys: string[];
}

interface DropdownListItemProps {
  onChange: (value: any) => any;
  label: string;
  className?: string;
  checked: boolean;
  disabled? :boolean;
}

const DropdownListItem = (props: DropdownListItemProps) => {
  return (
    <StyledCheckbox
      checked={props.checked}
      onChange={props.onChange}
      disabled={props.disabled}
    >
      {props.label}
    </StyledCheckbox>
  );
};

const StyledContainer = styled.div`
  label.ant-checkbox-wrapper {
    text-transform: uppercase;
    white-space: nowrap;
    font-weight: normal;
  }
`;

const StyledDropdownListItem = styled(DropdownListItem)`
  input {
    margin-right: 10px;
  }
`;

class ColumnFilterDropdown extends React.PureComponent<ColumnFilterDropdownProps, ColumnFilterDropdownState> {
  state = {
    selectedColumnKeys: this.getSelectedColumnKeys(this.props),
    unSelectedColumnKeys: this.props.unSelectedColumnKeys || []
  };

  UNSAFE_componentWillReceiveProps(nextProps: ColumnFilterDropdownProps) {
    if (!R.equals(this.props.selectedColumns, nextProps.selectedColumns)) {
      this.setState({
        selectedColumnKeys: this.getSelectedColumnKeys(nextProps)
      });
    }
    if (!R.equals(this.props.unSelectedColumnKeys, nextProps.unSelectedColumnKeys)) {
      this.setState({
        unSelectedColumnKeys: nextProps.unSelectedColumnKeys || []
      });
    }
  }

  getSelectedColumnKeys(props: ColumnFilterDropdownProps) {
    return R.pluck('key', props.selectedColumns);
  }

  onChange = (key: string) => (event: any) => {
    const { checked } = event.target;
    const { onChange } = this.props;
    const { selectedColumnKeys, unSelectedColumnKeys } = this.state;
    if (checked) {
      if (!R.isNil(unSelectedColumnKeys) && R.contains(key, unSelectedColumnKeys)) {
        const newUnSelectedColumnKeys = R.remove(R.findIndex(
          el => el === key, unSelectedColumnKeys), 1, unSelectedColumnKeys);

        this.setState({
          selectedColumnKeys: selectedColumnKeys.concat([key]),
          unSelectedColumnKeys: newUnSelectedColumnKeys
        }, () => onChange(this.state.selectedColumnKeys, this.state.unSelectedColumnKeys));
      } else {
        this.setState({
          selectedColumnKeys: selectedColumnKeys.concat([key]),
        }, () => onChange(this.state.selectedColumnKeys));
      }
    } else if (R.length(selectedColumnKeys) > 1) {
      this.setState({
        selectedColumnKeys: selectedColumnKeys.filter(uncheckedKey => uncheckedKey !== key),
        unSelectedColumnKeys: [...unSelectedColumnKeys, key]
      }, () => onChange(this.state.selectedColumnKeys, this.state.unSelectedColumnKeys));
    }
  }

  render() {
    const {
      dataTest,
      columns,
      className,
      getPopupContainer,
      dropdownWrapperClassName,
      selectedColumns,
      showSelectedColumnsCount = false,
      alwaysShowColumns = [],
      disableAlwaysShowColumnsInFilterDropdown
    } = this.props;
    return (
      <FlexLayout className={dropdownWrapperClassName}>
        {showSelectedColumnsCount && <div>{`Showing ${selectedColumns.length} of ${columns.length} columns`}</div>}
        <StyledContainer>
          <ActionDropdown
            dataTest={dataTest}
            getPopupContainer={getPopupContainer}
            className={className}
            dropdownStyle={dropdownStyle}
            width="40px"
            label={<StyledFilter/>}
            closeOnClick={false}
            menuItems={columns.map((column: Column) => ({
              key: column.key,
              content: (
                <StyledDropdownListItem
                  onChange={this.onChange(column.key)}
                  label={column.label}
                  checked={R.contains(column.key, this.state.selectedColumnKeys)}
                  disabled={disableAlwaysShowColumnsInFilterDropdown && R.contains(column.key, alwaysShowColumns)}
                />
              )
            }))}
          />
        </StyledContainer>
      </FlexLayout>
    );
  }
}

export default ColumnFilterDropdown;
