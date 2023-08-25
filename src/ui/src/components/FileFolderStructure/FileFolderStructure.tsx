import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Tree } from 'antd';
import type { DataNode, DirectoryTreeProps,  } from 'antd/es/tree';

const { DirectoryTree } = Tree;

interface DirectoryProps {
  treeData: DataNode[];
}

type FileFolderStructureProps  = DirectoryProps & DirectoryTreeProps;

const FileFolderStructure = (props: FileFolderStructureProps) => {
  const { treeData, ...rest } = props;

  return (
    <DirectoryTree
      treeData={treeData}
      {...rest}
    />
  )
};

export default FileFolderStructure;
