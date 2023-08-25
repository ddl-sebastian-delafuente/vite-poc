import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import { has, isNil, equals } from 'ramda';
import {
  createAndStartWorkspace
} from '@domino/api/dist/Workspace';
import {
  DominoWorkspaceApiWorkspaceDto as Workspace,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTierWithCapacity,
  DominoEnvironmentsApiEnvironmentWorkspaceToolDefinition as WorkspaceDefinition,
  DominoWorkspaceApiWorkspaceInitialGitCommitDto as GitRepoCommit
} from '@domino/api/dist/types';
import DominoLogoOnSubmitButton from '@domino/ui/dist/components/DominoLogoOnSubmitButton';
import ModalWithButton from '../components/ModalWithButton';
import { DDFormItem } from '../components/ValidatedForm';
import WorkspaceDefinitionSelector from '../components/WorkspaceDefinitionSelector';
import HardwareTierSelect, { ExecutionType } from '../components/HardwareTierSelect';
import {
  success as successToastr,
  error as errorToastr
} from '../components/toastr';
import {
  HARDWARE_TIER_HELP_TEXT,
  WORKSPACE_DEFINITION_SELECT_HELP_TEXT
} from '../constants';
import { ConfirmRedirectToLogin } from '../confirmRedirect/confirmRedirectToLogin';
import {
  Title,
  StyledCard,
  DataSetInfoBox,
  StyledDDFormItem,
  StyledLabelAndValue,
  BranchNameInformation,
  WorkspaceDefinitionSelectorWrapper
} from './CommonComponents';
import useWorkspaceNameAndBranchName from './WorkspaceNameAndBranchName';
import CommitsInfo from './CommitsInfo';

export interface Props {
  projectId: string;
  ModalButton: React.FC;
  envName: string;
  envRevisionNumber: number;
  envId: string;
  isGitBasedProject?: boolean;
  dfsCommitId: string;
  gitRepoCommits: Array<GitRepoCommit>;
  previousValuesStorageKey?: string;
  onSubmit?: (ws: Workspace) => void;
}

const WorkspaceReproduceVerboseModal: React.FC<Props> = React.memo((props) => {
  const [hardwareTierId, setHardwareTierId] = React.useState<string>();
  const [workspaceDefinitionId, setWorkspaceDefinitionId] = React.useState<string>();
  const [redirectPath, setRedirectPath] = React.useState<string>();
  const [reloginPayload, setReloginPayload] = React.useState<string>();
  const [isSubmitInProgress, setIsSubmitInProgress] = React.useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(true);

  const [workspaceName, branchName, branchNameInvalidText, workspaceNameInvalidText,
    onWorkspaceNameChange, onBranchNameChange, validateWorkspaceNameAndBranchName] = useWorkspaceNameAndBranchName();

  const onHwTierChange = (hwTier: HardwareTierWithCapacity) => {
    setHardwareTierId(hwTier.hardwareTier.id);
  };

  const onWorkspaceDefinitionChange = (selectedWs?: WorkspaceDefinition) => {
    setWorkspaceDefinitionId(selectedWs && selectedWs.id || undefined);
  };

  const reproduceWorkspace = async () => {
    setRedirectPath(undefined);
    const isWorkspaceNameAndBranchNameValid = validateWorkspaceNameAndBranchName();
    if (isWorkspaceNameAndBranchNameValid) {
      setIsSubmitInProgress(true);
      const reproType = 'FromModelCommits' as const;
      const overrideMainGitRepoRef = (props.gitRepoCommits.length > 0)
        ? { type: "commitId", value: props.gitRepoCommits[0].commitId, }
        : undefined;
      const payload = {
        projectId: props.projectId,
        body: {
          name: workspaceName!,
          environmentId: props.envId,
          hardwareTierId: { value: hardwareTierId! },
          tools: [workspaceDefinitionId!],
          externalVolumeMounts: [],
          workspaceReproductionDetails: {
            dfsCommit: props.dfsCommitId,
            gitRepoCommits: props.gitRepoCommits,
            suggestedBranchName: branchName!,
            workspaceReproductionType: reproType!
          },
          overrideMainGitRepoRef: overrideMainGitRepoRef,
        }
      };
      return createAndStartWorkspace(payload)
        .then(response => {
          if (has('redirectPath', response)) {
            setRedirectPath((response as any).redirectPath);
            setReloginPayload(JSON.stringify(payload));
          } else {
            successToastr('Workspace reproduced successfully');
            if (props.onSubmit) {
              props.onSubmit(response);
            }
          }
        })
        .catch(err => {
          errorToastr('Failed to reproduce workspace');
          return Promise.reject(err);
        })
        .finally(() => {
          setIsSubmitInProgress(false);
          setIsModalVisible(false);
        });
    } else {
      return Promise.reject();
    }
  };

  return (
    <React.Fragment>
      <ModalWithButton
        ModalButton={props.ModalButton}
        CustomSubmitButton={() =>
          <DominoLogoOnSubmitButton
            label="Open"
            disabled={false}
            submitted={isSubmitInProgress}
            onSubmit={reproduceWorkspace}
            data-test="reproduce-workspace-submit-button"
          />}
        closable={true}
        modalProps={{
          title: 'Open in New Workspace and Branch'
        }}
        onBeforeOpen={async () => {
          setIsModalVisible(true);
          return {};
        }}
        forceClose={!isModalVisible}
        testId="workspace-reproduce-verbose-modal"
      >
        <BranchNameInformation data-test="branch-name-information"/>
        <StyledDDFormItem
          label="New Workspace Name"
          error={workspaceNameInvalidText}
          className={'form-item-workspacename-with-error'}
        >
          <Input
            autoFocus={true}
            placeholder="New Workspace Name"
            value={workspaceName}
            onChange={onWorkspaceNameChange}
            data-test={'new-workspace-name'}
          />
        </StyledDDFormItem>
        <WorkspaceDefinitionSelectorWrapper>
          <DDFormItem
            label="Workspace IDE"
            dashedUnderline={true}
            tooltip={WORKSPACE_DEFINITION_SELECT_HELP_TEXT}
          >
            <WorkspaceDefinitionSelector
              projectId={props.projectId}
              environmentId={props.envId}
              selectedWorkspaceDefId={workspaceDefinitionId}
              onWorkspaceDefinitionSelect={onWorkspaceDefinitionChange}
              testId={'workspace-ide'}
            />
          </DDFormItem>
        </WorkspaceDefinitionSelectorWrapper>
        <StyledDDFormItem
          label="Hardware Tier"
          dashedUnderline={true}
          tooltip={HARDWARE_TIER_HELP_TEXT}
        >
          <HardwareTierSelect
            projectId={props.projectId}
            selectedId={hardwareTierId}
            changeHandler={onHwTierChange}
            overrideDefaultValue={true}
            testId={'hardware-tier'}
            executionType={ExecutionType.Workspace}
          />
        </StyledDDFormItem>
        <DDFormItem
          label="New Branch Name"
          help=" An identifier will be appended to non-unique names to avoid conflicts."
          error={branchNameInvalidText}
          className={'form-item-branchname-with-error'}
        >
          <Input
            placeholder="New Branch Name"
            value={branchName}
            onChange={onBranchNameChange}
            data-test={'new-branch-name'}
          />
        </DDFormItem>

        <StyledCard width="100%">
          <Title>New Workspace and branch will be created with:</Title>
          <StyledLabelAndValue
            label="environment"
            testId="environmentName"
            value={`${props.envName} - Revision #${props.envRevisionNumber}`}
          />
          <CommitsInfo
            dfsCommitId={props.dfsCommitId}
            gitRepoCommits={props.gitRepoCommits}
            isGitBasedProject={Boolean(props.isGitBasedProject)}
          />
        </StyledCard>
        <DataSetInfoBox data-test="datasets-info-box" />
      </ModalWithButton>
      {
        !isNil(props.previousValuesStorageKey) && !isNil(redirectPath) &&
        <ConfirmRedirectToLogin
          redirectUri={redirectPath}
          storageKey={props.previousValuesStorageKey}
          value={reloginPayload}
        />
      }
    </React.Fragment>
  );
}, (prevProps: Props, nextProps: Props) => {
  return equals(prevProps.dfsCommitId, nextProps.dfsCommitId) &&
    equals(prevProps.gitRepoCommits, nextProps.gitRepoCommits) &&
    equals(prevProps.envId, nextProps.envId) &&
    equals(prevProps.envName, nextProps.envName) &&
    equals(prevProps.envRevisionNumber, nextProps.envRevisionNumber) &&
    equals(prevProps.isGitBasedProject, nextProps.isGitBasedProject) &&
    equals(prevProps.projectId, nextProps.projectId);
});

export default WorkspaceReproduceVerboseModal;
