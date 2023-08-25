// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import { test, join, split, dropLast, last } from 'ramda';
import * as React from 'react';
import styled from 'styled-components';

import * as colors from '../styled/colors';
import { themeHelper } from '../styled/themeUtils';
import { CompactTable } from './Table/CompactTable';
import tooltipRenderer from './renderers/TooltipRenderer';
import WarningBox from './WarningBox';

export interface RepositoryStatusModified {
  created?: string[];
  modified?: string[];
  deleted?: string[];
  count?: number;
  unpushed?: {
    commitsAheadCount: number;
    commitsBehindCount: number;
  }
}

const NO_SELECTION_ERR_MESSAGE = 'There are no files selected. Select one or more files';

const CommitMessageTextArea = styled(Input.TextArea)`
  margin-top: 15px;
  &.ant-input {
    border: 1px solid ${colors.dustyGray};
    border-radius: 0;
  }
  resize: none;
`;

const DirectoryName = styled.span`
  display: flex;
  align-items: center;
`;

const FileName = styled.span`
  display: flex;
  align-items: center;
  color: ${themeHelper('label.basic.color')};
`;

const OwnerAndRepoName = styled.div`
  font-weight: bold;
`;

const SelectedCount = styled.div`
`;

const StyledCompactTable = styled(CompactTable)`
  .ant-table-container {
    overflow: auto;
  }
  .ant-table-content {
    max-height: 200px;
  }
  tr:nth-child(even) {
    background-color: #F3FAFF;
  }
`;

const splitFilePath = (path: string) => {
  const splitPath = split('/', path)
  const lastOfPath = last(splitPath) || path
  const fileName: string = test(/\//, path) ? lastOfPath : path;
  const filePath: string = join('/', dropLast(1, splitPath));

  return {
    fileName,
    filePath,
  };
}

export interface GitFileSyncTableProps {
  changedFiles?: RepositoryStatusModified;
  commitMessage: string;
  commitMessageDisabled?: boolean;
  onCommitMessageChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onSelectedFilesChange?: (files: string[]) => void;
  ownerAndRepoName?: string;
  selectedFiles?: string[];
}

export const GitFileSyncTable = ({
  changedFiles = {},
  commitMessage,
  commitMessageDisabled,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onCommitMessageChange = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onSelectedFilesChange = () => {},
  ownerAndRepoName = '',
  selectedFiles = [],
}: GitFileSyncTableProps) => {
  const changedGitFiles = React.useMemo(() => {
    const createdFiles = changedFiles?.created || [];
    const deletedFiles = changedFiles?.deleted || [];
    const modifiedFiles = changedFiles?.modified || [];

    return [
      ...modifiedFiles,
      ...createdFiles,
      ...deletedFiles,
    ]
  }, [changedFiles]);

  const columns = React.useMemo(() => {
    return [
      {
        title: 'Files',
        dataIndex: 'file',
        key: 'file',
        sorter: false,
        render: (name: any) => {
          return (
            tooltipRenderer(name, <FileName>{name}</FileName>)
          );
        }
      },
      {
        title: 'Path',
        dataIndex: 'path',
        key: 'path',
        sorter: false,
        render: (name: any) => {
          return (
            tooltipRenderer(name, <DirectoryName>{name}</DirectoryName>)
          );
        }
      },
    ]
  }, []);

  const dataSource = React.useMemo(() => {
    return changedGitFiles.map((path, idx) => {
      const { fileName, filePath } = splitFilePath(path);
      return {
        key: idx,
        fullPath: path,
        file: fileName,
        path: filePath,
      }
    });
  }, [changedGitFiles]);

  const hasError = selectedFiles.length === 0;

  const selecteCountText = React.useMemo(() => {
    return `Selected ${selectedFiles.length} of ${changedGitFiles.length} files`;
  }, [changedGitFiles, selectedFiles])

  const handleRowSelect = React.useCallback((selectedRowKeys: string[], selectedItems: any[]) => {
    onSelectedFilesChange(
      selectedItems.map(({ fullPath }) => fullPath)
    );
  }, [onSelectedFilesChange]);

  return (
    <>
        <OwnerAndRepoName>{ownerAndRepoName}</OwnerAndRepoName>
        <SelectedCount>{selecteCountText}</SelectedCount>
      <StyledCompactTable
        hideColumnFilter={true}
        showPagination={false}
        showSearch={false}
        columns={columns}
        dataSource={dataSource}
        onRowSelect={handleRowSelect}
      />
      <CommitMessageTextArea
        data-test="commit-message-textarea"
        onChange={onCommitMessageChange}
        rows={1}
        placeholder="Commit message"
        value={commitMessage}
        disabled={commitMessageDisabled}
      />
      {hasError &&
        <WarningBox fullWidth={true}>
          {NO_SELECTION_ERR_MESSAGE}
        </WarningBox>
      }
    </>
  )
}
