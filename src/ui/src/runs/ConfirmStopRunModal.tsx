import * as React from 'react';
import { isNil } from 'ramda';
import styled from 'styled-components';
import {
  DominoWorkspacesApiWorkspaceRepositoryState as RepoStatus,
  DominoWorkspacesApiWorkspaceRepositoryStatus as RepoStatuses,
} from '@domino/api/dist/types';
import { getWorkspaceRepositoryStatus } from '@domino/api/dist/Workspaces';
import { Popover } from '../components';
import { themeHelper } from '../styled/themeUtils';
import DataFetcher from '../utils/DataFetcher';
import DangerButtonDark from '../components/DangerButtonDark';
import HelpTextPanel from '../components/HelperTextPanel';
import ModalWithButton from '../components/ModalWithButton';
import {
  handleStopExecution,
  isWorkspace,
  STOP_RUN_BUTTON_LABEL,
  StopRunButtonProps
} from './utils';

const FileStatusDescription = styled.i`
  margin-left: ${themeHelper('margins.tiny')};
`;

const FailedFetchMessage = styled.div`
  width: 300px;
`;

const getStatusHelperText = (status: ResourceStatus): string => {
  if (status === 'Unknown') {
    return 'has unknown status';
  }
  if (status === 'Unpushed') {
    return 'has unpushed changes';
  }
  if (status === 'Modified') {
    return 'has file changes';
  }
  if (status === 'Clean') {
    return 'has no changes';
  }
  if (status === 'Unpushed and Dirty') {
    return 'has unpushed changes and uncommited file changes';
  }
  return '';
};

const shouldNotShowConfirm = (repoStatuses: RepoStatuses): boolean =>
  repoStatuses.repositories.length === 0 ||
  repoStatuses.repositories.every(({ status }: RepoStatus) => status === 'Clean');

const workspaceStatusFetcher = async ({ runId, projectId }: { runId: string; projectId: string }) =>
  getWorkspaceRepositoryStatus({ workspaceId: runId, projectId: projectId });

type ResourceStatus = 'Clean' | 'Modified' | 'Unknown' | 'Unpushed' | 'Unpushed and Dirty';

export type RunState = { repoStatuses: RepoStatuses; };

type StateDetailsProps = { runId: string; projectId: string };

export type OuterProps = { isRunning: boolean; } & StopRunButtonProps;

export type ConfirmationModalProps = StopRunButtonProps & RunState;

const RunStateFetcher: new() => DataFetcher<StateDetailsProps, RepoStatuses> = DataFetcher as any;

const ConfirmStopRunModal = ({ repoStatuses, ...props}: ConfirmationModalProps) => (
    <ModalWithButton
      handleSubmit={handleStopExecution(props)}
      ModalButton={DangerButtonDark}
      openButtonLabel={STOP_RUN_BUTTON_LABEL}
      modalSubmitButtonLabel="Confirm"
      modalProps={{ title: 'Are you sure you want to stop this run?' }}
      testId="confirm-stop-run-modal"
    >
      <RunStateDetailsView repoStatuses={repoStatuses}/>
    </ModalWithButton>
);

const RunStateDetailsView = ({ repoStatuses }: RunState) => (
  <HelpTextPanel>
    The following repositories have unresolved changes
    <ul>
      {repoStatuses.repositories.map(({ name, status }: RepoStatus) => (
        <li key={name}>
          <strong>{name}</strong>
          <FileStatusDescription>
            {getStatusHelperText(status)}
          </FileStatusDescription>
        </li>
      ))}
    </ul>
  </HelpTextPanel>
);

const BasicStopRunButton = ({ fetchError, disabled, ...props }: StopRunButtonProps & { disabled?: boolean; fetchError?: any }) => {
  const button = (
    <DangerButtonDark disabled={disabled} onClick={handleStopExecution(props)}>
      {STOP_RUN_BUTTON_LABEL}
    </DangerButtonDark>
  );
  if (!isNil(fetchError)) {
    return (
      <Popover
        title="Caution"
        content={(
          <FailedFetchMessage>
            Failed to fetch repository statuses for run. Stopping this run may result in lost work.
          </FailedFetchMessage>
        )}
        placement="leftBottom"
      >
        {button}
      </Popover>
    );
  }
  return button;
};

const ConfirmStopRunModalWithDataFetching = ({ isRunning, ...props }: OuterProps) => {
  if (!isRunning || !isWorkspace(props.workloadType)) {
    return (
      <BasicStopRunButton {...props} />
    );
  }
  return (
    <RunStateFetcher
      initialChildState={{ repositories: [] }}
      fetchData={workspaceStatusFetcher}
      runId={props.runId}
      projectId={props.projectId}
    >
      {(repoStatuses: RepoStatuses, loading: boolean, propFetcher: any, error: any) => {
        return (
          loading || shouldNotShowConfirm(repoStatuses) ? (
              <BasicStopRunButton {...props} disabled={loading} fetchError={error} />
            ) : <ConfirmStopRunModal repoStatuses={repoStatuses} {...props} />
        );
      }}
    </RunStateFetcher>
  );
};

export default ConfirmStopRunModalWithDataFetching;
