import * as React from 'react';
import { getBranches } from '@domino/api/dist/Projects';
import { Repository } from '../types/filebrowserTypes';
import { useCodeNavigationContext } from './CodeNavigationContext';
import { 
  DominoProjectsApiRepositoriesResponsesGetBranchesApiResponse as GetBranchesResponse 
} from '@domino/api/dist/types';
import BranchPicker, { BranchState } from '../../components/BranchPicker';

export type GitBranchPickerProps = {
  currentBranchName: string;
  repository: Repository;
  style?: React.CSSProperties;
};

const GitBranchPicker: React.FC<GitBranchPickerProps> = ({currentBranchName, repository, style}: GitBranchPickerProps) => {
  const {branch, setBranch} = useCodeNavigationContext();

  const listBranches = async (inputPattern: string) => {
    const {projectId, id: repositoryId} = repository;
    const result = (await getBranches({
      projectId, 
      repositoryId, 
      searchPattern: inputPattern
    }) as any).data as GetBranchesResponse;
    const branchResults: string[] = result.items.map((b: { name: string }) => b.name);
    return {
      branches: branchResults,
      totalItems: result.totalItems
    } as BranchState;
  };
  
  return (
    <BranchPicker
      style={style}
      currentBranchName={branch || currentBranchName}
      setBranch={setBranch}
      listBranches={listBranches}
    />
  );
};
GitBranchPicker.displayName = 'GitBranchPicker';

export default GitBranchPicker;
