import * as React from 'react';
import * as R from 'ramda';
import { getCheckpointForCommits } from '@domino/api/dist/Workspace';
import {
  DominoWorkspaceApiWorkspaceDto as Workspace,
  DominoProvenanceApiProvenanceCheckpointDto as ProvenanceCheckpoint,
  DominoModelmanagerApiModelGitRepoCommit as GitRepoCommit
} from '@domino/api/dist/types';
import {
  createAndStartWorkspace,
  reproduceAndStartWorkspace
} from '@domino/api/dist/Workspace';
import { ButtonProps } from '../components/Button/Button';
import { warning as warningToast } from '../components/toastr';
import { RELOGIN_WS_START_FAIL } from '../restartable-workspaces/Launcher';
import WorkspaceReproduceModal from './WorkspaceReproduceModal';
import WorkspaceReproduceVerboseModal from './WorkspaceReproduceVerboseModal';
import { openWorkspaceSession } from '@domino/ui/dist/utils/workspaceUtil';
import ModalOpenButton from './ModalOpenButton';
import { mixpanel } from '../mixpanel';
import { ReproduceWorkspaceButtonEvent, Locations } from '../mixpanel/types';
import {
  clearPreviousDataStorage,
  previousDataStorageKeys,
  getPreviouslySelectedValue
} from '@domino/ui/dist/confirmRedirect/confirmRedirectToLogin';
import useStore from '../globalStore/useStore';
import { getAppName, replaceWithWhiteLabelling } from '../utils/whiteLabelUtil';

export interface ReproduceInWorkspaceButtonProps {
  projectId: string;
  dfsCommitId: string;
  gitRepoCommits: Array<GitRepoCommit>;
  isGitBasedProject: boolean;
  canBeReproduced: boolean;
  envName: string;
  envRevisionNumber: number;
  envId: string;
  projectOwnerName: string;
  projectName: string;
  loggedInUserId: string;
  ModalButton?: any;
}

const REPRODUCTION_DISABLED_REASON = '"Open in Workspace" is only available for Model API versions published from Domino 5.0 or later';

const ReproduceInWorkspaceButton: React.FC<ReproduceInWorkspaceButtonProps> = React.memo((props) => {
  const { whiteLabelSettings } = useStore();
  const [checkpoint, setCheckpoint] = React.useState<ProvenanceCheckpoint>();

  const onWorkspaceReproduce = (ws: Workspace) => {
    openWorkspaceSession(ws.id, props.projectOwnerName, props.projectName, ws.mostRecentSession);
    mixpanel.track(() =>
      new ReproduceWorkspaceButtonEvent({
        location: Locations.ModelOverview,
        userId: ws.ownerId,
        userName: ws.ownerName,
        reproducedFrom: 'FromModel'
      })
    );
  };

  const checkAndReproducePreviousWorkspaceFromVerboseModal = async () => {
    const previousData = getPreviouslySelectedValue(previousDataStorageKeys.reproduceVerboseFromModelVersionDetails);
    if (!R.isNil(previousData)) {
      const payload = JSON.parse(previousData);
      if (R.equals(payload.projectId, props.projectId)) {
        const result = await createAndStartWorkspace(payload);

        clearPreviousDataStorage(previousDataStorageKeys.reproduceVerboseFromModelVersionDetails);
        clearPreviousDataStorage(previousDataStorageKeys.credPropInitiator);
        if (R.has('redirectPath', result)) {
          warningToast(RELOGIN_WS_START_FAIL, '', 0);
        } else {
          onWorkspaceReproduce(result);
        }
      }
    }
  };

  const checkAndReproducePreviousWorkspace = async () => {
    const previousData = getPreviouslySelectedValue(previousDataStorageKeys.reproduceFromModelVersionDetails);
    if (!R.isNil(previousData)) {
      const payload = JSON.parse(previousData);
      if (R.equals(payload.projectId, props.projectId)) {
        const result = await reproduceAndStartWorkspace(payload);

        clearPreviousDataStorage(previousDataStorageKeys.reproduceFromModelVersionDetails);
        clearPreviousDataStorage(previousDataStorageKeys.credPropInitiator);
        if (R.has('redirectPath', result)) {
          warningToast(RELOGIN_WS_START_FAIL, '', 0);
        } else {
          onWorkspaceReproduce(result);
        }
      }
    }
  };

  const checkForPreviousWorkspace = () => {
    const previousUserId = getPreviouslySelectedValue(previousDataStorageKeys.credPropInitiator);
    if (R.equals(previousUserId, props.loggedInUserId)) {
      checkAndReproducePreviousWorkspaceFromVerboseModal();
      checkAndReproducePreviousWorkspace();
    }
  };

  React.useEffect(() => {
    checkForPreviousWorkspace();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCheckpoint = async () => {
    const body = {
      dfsCommitId: props.dfsCommitId,
      gitRepoCommits: R.map(commit => ({
        repoId: commit.repoId,
        commitId: commit.commitId
      }), props.gitRepoCommits)
    };
    try {
      const response = await getCheckpointForCommits({
        projectId: props.projectId,
        body: body,
      });

      setCheckpoint(response);
    } catch (err) {
      console.warn(`Failed to fetch checkpoint for commits: ${body}`);
    }
  };

  React.useEffect(() => {
    fetchCheckpoint();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getModalButton = (modalBtnProps: ButtonProps) => (
    <ModalOpenButton
      modalBtnLabel="Open in Workspace"
      modalBtnProps={modalBtnProps}
      ModalButton={props.ModalButton}
      projectId={props.projectId}
      projectName={props.projectName}
      projectOwnerName={props.projectOwnerName}
      loggedInUserId={props.loggedInUserId}
      disabled={!props.canBeReproduced}
      disabledReason={!props.canBeReproduced ? replaceWithWhiteLabelling(getAppName(whiteLabelSettings))(REPRODUCTION_DISABLED_REASON) : undefined}
    />);

  return checkpoint ? (
    <WorkspaceReproduceModal
      projectId={props.projectId}
      envName={props.envName}
      envRevisionNumber={props.envRevisionNumber}
      checkpoint={checkpoint}
      isGitBasedProject={props.isGitBasedProject}
      ModalButton={getModalButton}
      onSubmit={onWorkspaceReproduce}
      workspaceReproductionType="FromModel"  // Currently this button is only used for models
      previousValuesStorageKey={previousDataStorageKeys.reproduceFromModelVersionDetails}
    />
  ) : (
    <WorkspaceReproduceVerboseModal
      projectId={props.projectId}
      envName={props.envName}
      envRevisionNumber={props.envRevisionNumber}
      isGitBasedProject={props.isGitBasedProject}
      envId={props.envId}
      dfsCommitId={props.dfsCommitId}
      gitRepoCommits={props.gitRepoCommits}
      ModalButton={getModalButton}
      onSubmit={onWorkspaceReproduce}
      previousValuesStorageKey={previousDataStorageKeys.reproduceVerboseFromModelVersionDetails}
    />);
});

export default ReproduceInWorkspaceButton;
