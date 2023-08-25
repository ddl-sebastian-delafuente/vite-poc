import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Button } from 'antd';
import styled from 'styled-components';
import { Card } from '../../components/Layouts/AppContent';
import WaitSpinner from '@domino/ui/dist/components/WaitSpinner';
import { getBrowseFiles } from '@domino/api/dist/Projects';
import { ApiErrorBody, FileBrowserApiError, FileBrowserPending } from './FileBrowserError';
import RepoBrowserSummary from './RepoBrowserSummary';
import { Repository } from '../types/filebrowserTypes';
import {
  DominoProjectsApiRepositoriesResponsesGetRepoBrowseApiResponse as BrowseApiResponseDto,
  DominoProjectsApiRepositoriesResponsesBrowseRepoBrowserSummaryDto as BrowseSummaryDto,
  DominoProjectsApiRepositoriesResponsesBrowseRepoBrowserEntryDto as BrowseEntryDto
} from '@domino/api/dist/types';
import { useCodeNavigationContext } from './CodeNavigationContext';
import { useProjectCodeGitCredentialsContext } from './ProjectCodeGitCredentialsContextProvider';
import GBPDirectoryBrowser from './GBPDirectoryBrowser';
import { colors } from '../../styled';
import useStore from '../../globalStore/useStore';
import { getAppName } from '../../utils/whiteLabelUtil';

const StyledSpan = styled.span`
  height: 50%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export interface ProjectGitRepoDetailsProps {
  repository: Repository;
}

interface State {
  contents?: BrowseEntryDto[];
  error?: ApiErrorBody;
  isEmpty: boolean;
  isFetching: boolean;
  isPending: boolean;
  summary?: BrowseSummaryDto;
}
const initialState: State = {
  isEmpty: true,
  isFetching: false,
  isPending: false
};

type Action =
| { type: 'new-browse-data', payload: BrowseApiResponseDto }
| { type: 'api-error', payload: ApiErrorBody }
| { type: 'api-pending' }
| { type: 'start-fetching' }
| { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'new-browse-data': {
      // edge case: if response doesn't have a branch name, re-use the old branchName
      if (!action.payload.summary.ref.branchName) {
        action.payload.summary.ref.branchName = state.summary?.ref.branchName || '';
      }

      return {
        isEmpty: false,
        isFetching: false,
        isPending: false,
        contents: action.payload.items,
        summary: action.payload.summary
      };
    }
    case 'api-error': {
      return {
        isEmpty: false,
        isFetching: false,
        isPending: false,
        contents: undefined,
        error: action.payload,
        summary: undefined
      };
    }
    case 'api-pending': {
      return {
        ...state,
        isFetching: false,
        isPending: true
      };
    }
    case 'start-fetching': {
      return {
        ...state,
        isFetching: true
      };
    }
    case 'reset':
        return initialState;
    default:
      throw new Error();
  }
}

const ProjectGitRepoDetails: React.FC<ProjectGitRepoDetailsProps> = ({ repository }) => {
  const { whiteLabelSettings } = useStore();
  const {isLoading: isCredentialsLoading} = useProjectCodeGitCredentialsContext();
  const {
    directory: currentPath,
    branch: navigationBranch,
    commit: navigationCommit,
    resetAll: resetNavigation
  } = useCodeNavigationContext();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  // if the credentials picker changes, all data should be invalidated.
  React.useEffect(() => {
    if (isCredentialsLoading) { dispatch({type: 'reset'}); }
  }, [isCredentialsLoading]);

  const doFetch = async () => {
    if (isCredentialsLoading) { return; }

    const getBrowseFilesParams = { projectId: repository.projectId, repositoryId: repository.id } as any;
    if (currentPath.length) {
      getBrowseFilesParams.directory = currentPath.join('/');
    }

    if (repository.refType === 'branches' && repository.refLabel) {
      getBrowseFilesParams.branchName = repository.refLabel;
    }

    if (navigationBranch) {
      getBrowseFilesParams.branchName = navigationBranch;
    }

    if (navigationCommit) {
      getBrowseFilesParams.commit = navigationCommit;
    }

    dispatch({type: 'start-fetching'});
    try {
      const response: any = await getBrowseFiles(getBrowseFilesParams);
      if (response.data.pending) {
        dispatch({type: 'api-pending'});
      } else {
        dispatch({type: 'new-browse-data', payload: response.data});
      }
    } catch (response) {
      // sets error state, sets repoContent state, resets loading state
      const body = await response.body.json();
      const errorBody = typeof body === 'object' && typeof body.error === 'object' ? body.error : body;
      dispatch({type: 'api-error', payload: errorBody});
    }
  };
  // fetch data whenever credentials, branch, or directory changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { doFetch(); }, [currentPath, navigationBranch, navigationCommit, isCredentialsLoading]);
  
  // fetch data if we are in a pending state
  React.useEffect(() => { 
    if (state.isPending && !state.isFetching) {
      doFetch(); 
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isPending, state.isFetching]);

  if (state.isPending) {
    return <FileBrowserPending appName={getAppName(whiteLabelSettings)} />;
  }
  if (state.isEmpty) { return <StyledSpan><WaitSpinner /></StyledSpan>; }

  // If pending,render refresh button, else render table.  Only if flag is true
  const Content = () => {
    const resetAll = () => {
      resetNavigation();
      dispatch({ type: 'reset' });
    };
    if (state.error && (currentPath.length || navigationBranch || navigationCommit)) {
      return (
        <FileBrowserApiError apiError={state.error}>
          {/* @ts-ignore */}
          <LinkButton onClick={resetAll}>&lt; Go Back</LinkButton>
        </FileBrowserApiError>
      );
    } else if (state.error) {
      return <FileBrowserApiError apiError={state.error} />;
    } else {
      return <GBPDirectoryBrowser repo={repository} contents={state.contents!} />;
    }
  };

  return (
    <RepoDetailsCard className={`RepoDetailsCard ${state.isFetching ? 'fetching' : ''}`}>
      <RepoBrowserSummary 
        repository={repository}
        summaryDetails={state.summary!}
        style={{ width: '380px' }}
      />
      <Content />
    </RepoDetailsCard>
  );
};

ProjectGitRepoDetails.displayName = 'ProjectGitRepoDetails';

export default ProjectGitRepoDetails;

const RepoDetailsCard = styled(Card)`
  display: block;
  background-color: white;
  padding: 10px;
  margin: 0;

  &>* {
    margin-left: 0;
    margin-right: 0;
  }
  .link-icon {
    margin-left: 4px;
  }
  .ant-select-selection {
    background: transparent;
  }
  .ant-select-selection-selected-value {
    width: 100%;
    padding-right: 20px;
  }
  .ant-select-disabled {
    color: inherit;
  }

  &.fetching .blur-on-fetch {
    color: transparent;
    text-shadow: 0 0 8px #000;
  }
`;

const LinkButton = styled(Button)`
  border: none;
  color: ${colors.basicLink};
  padding: 0;

  &:hover{
    background: none;
    text-decoration: underline;
  }
`;
