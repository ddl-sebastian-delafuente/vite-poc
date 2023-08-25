import * as React from 'react';
import BulkMoveNode from './BulkMoveNode';
import { BulkMoveTreeNode } from './types';

export type Props = {
  selectedPath: string;
  selectNode: (path: string) => void;
  tree: BulkMoveTreeNode[];
  onClose: (path: string) => void;
  onOpen: (relativePath: string) => void;
};

const BulkMoveTree = ({
  tree,
  ...rest
}: Props) => {
  return (
    <div>
      {tree.map(node => {
        return (
          <BulkMoveNode
            isRoot={true}
            key={node.dirName}
            relativePath={node.dirName}
            {...node}
            {...rest}
          />
        );
      })}
    </div>
  );
};

export default BulkMoveTree;
