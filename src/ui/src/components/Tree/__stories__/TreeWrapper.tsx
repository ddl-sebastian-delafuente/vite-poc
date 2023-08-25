import React from 'react';
import type { DataNode } from 'antd/es/tree';
import {FolderOutlined } from '@ant-design/icons';
import TreeStructure, { Props } from '../Tree';

export const defaultCheckedKeys = ['2'];
export const defaultExpandedKeys = ['1', '1-1', '2'];
export const defaultSelectedKeys = ['1-1-2', '1-2'];
export const treeData: DataNode[] = [
  {
    title: 'L1 ',
    key: '1',
    icon: <FolderOutlined/>,
    disabled: true,
    children: [
      {
        title: 'L2',
        key: '1-1',
        icon: <FolderOutlined/>,
        children: [
          {
            title: 'L3',
            key: '1-1-1',
            icon: <FolderOutlined/>,
            isLeaf: true,
            disabled: true
          },
          {
            title: 'L3',
            key: '1-1-2',
            icon: <FolderOutlined/>,
            isLeaf: true
          },
          {
            title: 'L3',
            key: '1-1-3',
            icon: <FolderOutlined/>,
            isLeaf: true
          }
        ],
      },
      {
        title: 'L2',
        key: '1-2',
        icon: <FolderOutlined/>,
        children: [
          {
            title: 'L3',
            key: '1-2-1' ,
            icon: <FolderOutlined/>,  
            isLeaf: true       
          }
        ]
      },
    ],
  },
  {
    title: 'L1',
    key: '2',
    children: [
      {
        title: 'L2',
        key: '2-1',
        isLeaf: true
      }
    ],
  },
];

export const TreeWrapper = (props: Props) => {
  const { treeData, defaultCheckedKeys, defaultExpandedKeys, defaultSelectedKeys, checkable, showIcon } = props;

  return (
    <TreeStructure
      treeData={treeData}
      defaultCheckedKeys={defaultCheckedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      defaultExpandedKeys={defaultExpandedKeys}
      checkable={checkable}
      showIcon={showIcon}
    />
  )
}
  
