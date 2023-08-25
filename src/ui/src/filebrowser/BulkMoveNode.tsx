import * as React from 'react';
import styled from 'styled-components';
import { CheckOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { cleanPath } from './bulkMoveUtil';
import Directory from '../icons/Directory';
import {
  baseColor,
  clickableBlue,
  focusedGrey,
} from '../styled/colors';

const StyledCheck = styled(CheckOutlined)`
  left: 4px;
  position: relative;
`;

type DirectoryContainerProps = {
  isTop?: boolean;
};
export const DirectoryContainer = styled.div<DirectoryContainerProps>`
  margin-left: ${({ isTop }) => isTop ? 0 : 22}px;
`;

const DirectoryLabel = styled.div`
  min-width: 100px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: ${clickableBlue};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Handle = styled.div`
  cursor: pointer;
  margin-right: 10px;
  display: inline-flex;
  color: ${clickableBlue};

  svg {
    border: 1px solid;
  }
`;

const StyledDirectoryIcon = styled(Directory)`
  margin-right: 10px;
  flex-shrink: 0;
`;

function getDirectoryName(path: string): string {
  const splitPath = cleanPath(path).split('/');
  return splitPath[splitPath.length - 1];
}

type SelectedIndicatorProps = {
  selected?: boolean;
};
const SelectedIndicator = styled.div<SelectedIndicatorProps>`
  background: ${({ selected }) => selected ? focusedGrey : 'white'};
  padding: 6px;
  padding-right: 10px;
  right: 6px;
  position: relative;
`;

type LabelProps = {
  selected?: boolean;
};
const Label = styled.span<LabelProps>`
  color: ${({ selected }) => selected ? baseColor : clickableBlue};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;

  &:after {
    content: "/";
    color: ${clickableBlue};
    padding-left: 2px;
  }
`;

function handleClick(handler: (path: string) => void, path: string) {
  return function onClick() {
    handler(path);
  };
}

export type ChildDirectory = {
  isOpen: boolean;
  dirName: string;
  childDirs: ChildDirectory[];
};

export type Props = {
  isOpen: boolean;
  isRoot?: boolean;
  selectedPath: string;
  selectNode: (path: string) => void;
  dirName: string;
  relativePath: string;
  childDirs: ChildDirectory[];
  onClose: (path: string) => void;
  onOpen: (relativePath: string) => void;
};

const BulkMoveNode = ({
  dirName,
  relativePath,
  childDirs,
  onClose,
  onOpen,
  selectNode,
  isOpen,
  selectedPath,
  isRoot,
}: Props) => {
  const handler = isOpen ?
    onClose :
    onOpen;
  const selected = selectedPath === relativePath;
  const name = getDirectoryName(dirName);
  const boundSelect = () => selectNode(relativePath);
  return (
    <DirectoryContainer isTop={isRoot}>
      <SelectedIndicator selected={selected}>
        <DirectoryLabel>
          {!!childDirs.length &&
          <Handle onClick={handleClick(handler, relativePath)}>
            {isOpen ?
              <MinusOutlined style={{ fontSize: '12px' }} /> :
              <PlusOutlined style={{ fontSize: '12px' }} />}
          </Handle>}
          <StyledDirectoryIcon
            height={12}
            width={12}
            onClick={boundSelect}
          />
          <Label
            selected={selected}
            onClick={boundSelect}
            title={name}
          >
            {name}
          </Label>
          {selected && <StyledCheck style={{ fontSize: '14px' }}/>}
        </DirectoryLabel>
      </SelectedIndicator>
      {isOpen &&
      childDirs.map((node: ChildDirectory) => {
        return (
          <BulkMoveNode
            {...node}
            isRoot={false}
            selectedPath={selectedPath}
            selectNode={selectNode}
            key={node.dirName}
            relativePath={node.dirName}
            onClose={onClose}
            onOpen={onOpen}
          />
        );
      })}
    </DirectoryContainer>
  );
};

export default BulkMoveNode;
