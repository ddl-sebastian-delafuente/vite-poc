import * as React from 'react';
import * as R from 'ramda';
// eslint-disable-next-line no-restricted-imports
import { Input, Tree, TreeProps } from 'antd';
import type { DataNode as AntdDataNode } from 'antd/es/tree';
import { forEach, filter, reduce } from 'ramda';
import Highlight from 'highlight-react/dist/highlight';
import styled from 'styled-components';
import { colors } from '@domino/ui/dist/index';

const Wrapper = styled.div`
  mark{
    background-color: ${colors.parisDiasy};
    padding:0;
  }
`;

export interface DataNode extends AntdDataNode {
  title: string;
  children?: DataNode[];
}

const {Search} = Input;

export const getParentNode = (key: React.Key, tree: DataNode[]): DataNode => {
  let parentNode: DataNode;
  forEach((node) => {
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentNode = node;
      } else if (getParentNode(key, node.children)) {
        parentNode = getParentNode(key, node.children);
      }
    }
  }, tree)
  return parentNode!;
};

interface SearchableTreeProps extends TreeProps {
  treeData: DataNode[];
  checkedKeys?: (string | number)[];
}

const SearchableTree = (props: SearchableTreeProps) => {
  const [expandedKeys, setExpandedKeys] = React.useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = React.useState(true);
  const [dataList, setDataList] = React.useState<DataNode[]>([]);
  const [treeData, setTreeData] = React.useState<AntdDataNode[]>(props.treeData);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value?.toLowerCase();
    const newExpandedKeys = dataList
      .map((item) => {
        const titleString = item.title.toLowerCase();
        if (titleString.indexOf(value) > -1) {
          return getParentNode(item.key, props.treeData)?.key;
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i) as string[];
    if (value) {
      const hasSearchTerm = (n: string) => n.toLowerCase().indexOf(value) !== -1;
      const filterData: (arr?: DataNode[]) => DataNode[] = (arr = []) =>
        filter(
          (n: DataNode) => hasSearchTerm(n.title) || filterData(n.children)?.length > 0,
          arr);
      const filteredData = filterData(props.treeData).map((n) => {
        return {
          ...n,
          children: hasSearchTerm(n.title)  ? n.children : filterData(n.children)
        };
      });
      const formatData: (data: DataNode[]) => AntdDataNode[] = data => data.map((node) => {
        return {
          ...node,
          title: <Highlight search={value}>{node.title}</Highlight>,
          ... (node.children ? {children: formatData(node.children)} : {})
        }
      });
      setTreeData(formatData(filteredData));
      setExpandedKeys(newExpandedKeys);
      setAutoExpandParent(true);
    } else {
      setTreeData(props.treeData);
      setExpandedKeys([]);
      setAutoExpandParent(false);
    }
  };

  const transformData: (data: DataNode[]) => DataNode[] = data =>
    reduce((acc: DataNode[], node: DataNode) => {
      return node.children ? acc.concat([node, ...transformData(node.children)]) : acc.concat([node])
    }, [], data);

  const onCheck = (checkedKeys: string[], info: any) => {
    if (props.onCheck && props.checkedKeys) {
      const checked = info.checked;
      const node = info.node;
      let newCheckedKeys = checked ? [...props.checkedKeys, node.key] : R.without([node.key], props.checkedKeys);
      const parentNode = getParentNode(node.key, props.treeData);
      const siblingNodeKeys = R.pluck('key')(parentNode?.children || []);
      const childrenNodeKeys = R.pluck('key')(node?.children || []);
      if (checked) {
        if (node.children) {
          newCheckedKeys = R.without(childrenNodeKeys, newCheckedKeys);
        }
        if (parentNode && R.without(newCheckedKeys, siblingNodeKeys).length === 0) {
          newCheckedKeys = [...R.without(siblingNodeKeys, newCheckedKeys), parentNode.key];
        }
      } else {
        if (node.children) {
          newCheckedKeys = R.without(childrenNodeKeys, newCheckedKeys);
        }
        if (parentNode && R.without(newCheckedKeys, siblingNodeKeys).length === siblingNodeKeys.length) {
          newCheckedKeys = R.without([parentNode.key], newCheckedKeys);
        }
      }
      props.onCheck(newCheckedKeys, info);
    }
  }

  React.useEffect(() => {
    const newDataList: DataNode[] = transformData(props.treeData);
    setDataList(newDataList);
  }, [props.treeData]);

  return (
    <Wrapper className={props.className}>
      <Search style={{marginBottom: 8}} placeholder="Search" onChange={onChange}/>
      <Tree
        {...props}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        onCheck={onCheck}
      />
    </Wrapper>
  );
};

export default SearchableTree;
