import * as React from 'react';
import { Key, useState, useEffect } from 'react';
import * as R from 'ramda';
import { FolderOutlined, FileOutlined, CaretDownOutlined } from '@ant-design/icons';
// eslint-disable-next-line no-restricted-imports
import { Tree } from 'antd';
import type { DataNode, TreeProps as AntdTreeProps  } from 'antd/es/tree';
import styled from 'styled-components';
import { colors, themeHelper } from '../../styled';

const Wrapper = styled.div`
  .ant-tree-switcher-leaf-line {
    display: none;
  }
  .ant-tree-title {
    color: ${colors.neutral900};
  }
  .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: ${colors.blue50};
  }
  .ant-tree .ant-tree-treenode-disabled .ant-tree-node-content-wrapper .ant-tree-title {
    color: ${colors.neutral500};
  }
  .ant-tree-show-line .ant-tree-indent-unit::before {
    border-right: 1px solid ${colors.neutral300};
  }
  .ant-tree .ant-tree-node-content-wrapper:hover {
    background-color: ${colors.blue50};
  }
	.ant-tree-checkbox-inner {
		border: 1px solid ${themeHelper('checkbox.container.borderColor')};
		background-color: ${themeHelper('checkbox.container.backgroundColor')};
	}
	.ant-tree-checkbox-checked::after {
		border: 1px solid ${themeHelper('checkbox.selected.borderColor')};
	}
	.ant-tree-checkbox-checked .ant-tree-checkbox-inner {
		background-color: ${themeHelper('checkbox.selected.borderColor')};
		border-color: ${themeHelper('checkbox.selected.borderColor')};
	}
	.ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner {
		border-color: ${themeHelper('checkbox.intermediate.default.borderColor')};
	}
	.ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner::after {
		background-color: ${themeHelper('checkbox.intermediate.default.backgroundColor')};
	}
	.ant-tree-checkbox-disabled + span {
		color: ${themeHelper('checkbox.disabled.color')};
	}
	.ant-tree-checkbox-disabled .ant-tree-checkbox-inner {
		background-color: ${themeHelper('checkbox.disabled.backgroundColor')};
    border-color: ${themeHelper('checkbox.disabled.color')} !important;
	}
	.ant-tree-checkbox-indeterminate.ant-tree-checkbox-disabled .ant-tree-checkbox-inner::after {
		background-color: ${themeHelper('checkbox.intermediate.disabled.backgroundColor')};
	}
	.ant-tree-checkbox-disabled.ant-tree-checkbox-checked .ant-tree-checkbox-inner::after {
		border-color: ${themeHelper('checkbox.disabled.color')};
	}
`;
interface checkedKeysType  {
  checked: Key[];
  halfChecked: Key[];
}
interface TreeProps {
  treeData: DataNode[];
}

export type Props  = TreeProps & AntdTreeProps;

const TreeStructure = (props: Props) => {
  const { treeData, checkable, showIcon, defaultExpandedKeys,
    defaultCheckedKeys, defaultSelectedKeys, switcherIcon = <CaretDownOutlined />, ...rest } = props;
  const [data, setData] = useState<DataNode[]>(treeData);
  const [expandedKeys, setExpandedKeys] = useState<Key[] | undefined>(defaultExpandedKeys);
  const [checkedKeys, setCheckedKeys] = useState<checkedKeysType | Key[] | undefined>(defaultCheckedKeys);
  const [selectedKeys, setSelectedKeys] = useState<Key[] | undefined>(defaultSelectedKeys);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand = (expandedKeysValue: Key[]) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: checkedKeysType | Key[]) => {
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue: Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
  };


  const formatTreeData = (inputData: DataNode[]) => {
    return R.map((node) => {
      if (R.isNil(R.prop('icon', node))) {
        node['icon'] = node.isLeaf ? <FileOutlined /> : <FolderOutlined />
      }
      if (node.children) {
        formatTreeData(node.children);
      } 
      return node;  
    }, inputData);
  }
  useEffect(() => {
    if (showIcon) {
     setData(formatTreeData(treeData))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIcon, treeData]);

  return (
    <Wrapper>
      <Tree
        switcherIcon={switcherIcon}
        treeData={data}
        checkable={checkable}
        showIcon={showIcon && !checkable}
        showLine={{showLeafIcon: false}}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        autoExpandParent={autoExpandParent}
        {...rest}
      />
    </Wrapper>
  )
};

TreeStructure.DirectoryTree = Tree.DirectoryTree;

export default TreeStructure;
