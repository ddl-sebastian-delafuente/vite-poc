import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import ActionDropdown from '../ActionDropdown';
import FilterColumnsIcon from '../../icons/FilterColumns';
import FlexLayout from '../Layouts/FlexLayout';
import { colors, themeHelper } from '../../styled';
import SearchableTree, { DataNode, getParentNode } from '../Tree/SearchableTree';

const dropdownStyle: React.CSSProperties = {display: 'inline-block', cursor: 'pointer', height: '32px'};

const StyledFilter = styled(FilterColumnsIcon)`
  font-size: ${themeHelper('fontSizes.large')} !important;
`;
const StyledSearchableTree = styled(SearchableTree)`
  background-color: ${colors.neutral50};
`;

export interface Column {
  key: string;
  label: string;
}

export interface ColumnWithChildren extends Column {
  children?: Column[];
}

export interface ColumnFilterDropdownProps {
  getPopupContainer?: (triggerNode: Element) => HTMLElement;
  columns: ColumnWithChildren[];
  className?: string;
  dropdownWrapperClassName?: string;
  onChange: (keys: string[], unSelectedColumnKeys?: string[], halfCheckedKeys?: string[]) => void;
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

const StyledContainer = styled.div`
  label.ant-checkbox-wrapper {
    text-transform: uppercase;
    white-space: nowrap;
    font-weight: normal;
  }

  .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title {
    padding: 0;
  }
`;

const NestedColumnFilterDropdown = (props: ColumnFilterDropdownProps) => {
  const {
    alwaysShowColumns = [],
    disableAlwaysShowColumnsInFilterDropdown
  } = props;
  const getSelectedColumnKeys = () => {
    return R.reduce((acc: string[], column: ColumnWithChildren) => {
      return column.children ? acc.concat(R.pluck('key', column.children)) : acc.concat([column.key]);
    }, [], props.selectedColumns) as string[];
  };

  const [selectedColumnKeys, setSelectedColumnKeys] = React.useState<string[]>(getSelectedColumnKeys());
  const [unSelectedColumnKeys, setUnSelectedColumnKeys] = React.useState<string[]>(props.unSelectedColumnKeys || []);
  const [treeData, setTreeData] = React.useState<DataNode[]>([]);

  React.useEffect(() => {
    setSelectedColumnKeys(getSelectedColumnKeys());
  }, [props.selectedColumns]);

  React.useEffect(() => {
    setUnSelectedColumnKeys(unSelectedColumnKeys || []);
  }, [props.unSelectedColumnKeys]);

  const onChange = (checkedKeys: string[], info: any) => {
    const {onChange} = props;
    const checked = info.checked;
    const node = info.node;
    const key = node.key;
    const parentNode = getParentNode(key, treeData);
    const childrenNodeKeys = R.pluck('key')(node?.children || []);
    setSelectedColumnKeys(checkedKeys);
    if (checked) {
      const unselected = R.without([key, ...checkedKeys, ...childrenNodeKeys, parentNode?.key], unSelectedColumnKeys);
      setUnSelectedColumnKeys(unselected);
      onChange(checkedKeys, unselected);
    } else if (!R.isEmpty(selectedColumnKeys)) {
      const unselected = R.without([...checkedKeys, ...childrenNodeKeys], unSelectedColumnKeys);
      setUnSelectedColumnKeys([...unselected, key]);
      onChange(checkedKeys, [...unselected, key]);
    }
  };

  const getTreeData = () => {
    const newTreeData = props.columns.map((column) => ({
      ...column,
      title: column.label,
      disabled: disableAlwaysShowColumnsInFilterDropdown && R.contains(column.key, alwaysShowColumns)
    } as DataNode));
    setTreeData(newTreeData);
  };

  const getColumnsLength = (columns: ColumnWithChildren[]) => {
    return R.reduce((acc: number, columns: ColumnWithChildren) => {
      return columns.children && columns.children.length > 0 ? acc + columns.children.length : acc + 1;
    }, 0, columns);
  };

  React.useEffect(() => {
    getTreeData();
  }, [props.columns, alwaysShowColumns, disableAlwaysShowColumnsInFilterDropdown]);

  const {
    dataTest,
    columns,
    className,
    getPopupContainer,
    dropdownWrapperClassName,
    selectedColumns,
    showSelectedColumnsCount = false,
  } = props;
  return (
    <FlexLayout className={dropdownWrapperClassName}>
      {showSelectedColumnsCount && <div>{`Showing ${getColumnsLength(selectedColumns)} of ${getColumnsLength(columns)} columns`}</div>}
      <StyledContainer>
        <ActionDropdown
          dataTest={dataTest}
          getPopupContainer={getPopupContainer}
          className={className}
          dropdownStyle={dropdownStyle}
          width="40px"
          label={<StyledFilter/>}
          closeOnClick={false}
          destroyPopupOnHide={true}
          menuStyle={{
            backgroundColor: 'none',
            padding: '10px 12px 5px 12px'
          }}
          menuItems={[{
            key: 'columnTree',
            content: <StyledSearchableTree
              checkable={true}
              checkedKeys={selectedColumnKeys}
              treeData={treeData}
              onCheck={onChange}
              selectable={false}
              defaultExpandAll={true}
            />
          }]}
        />
      </StyledContainer>
    </FlexLayout>
  );
};

export default NestedColumnFilterDropdown;
