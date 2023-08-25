import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import { equals, has, isNil, isEmpty, anyPass, or } from 'ramda';
import { reproduceAndStartWorkspace } from '@domino/api/dist/Workspace';
import {
  DominoProvenanceApiProvenanceCheckpointDto as ProvenanceCheckpoint,
  DominoWorkspaceApiWorkspaceDto as Workspace,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTierWithCapacity
} from '@domino/api/dist/types';
import HardwareTierSelect, { ExecutionType } from '../components/HardwareTierSelect';
import DominoLogoOnSubmitButton from '../components/DominoLogoOnSubmitButton';
import ModalWithButton from '../components/ModalWithButton';
import { DDFormItem } from '../components/ValidatedForm';
import {
  success as successToastr,
  error as errorToastr
} from '../components/toastr';
import { getErrorMessage } from '../components/renderers/helpers';
import CommitsInfo from './CommitsInfo';
import { HARDWARE_TIER_HELP_TEXT } from '../constants';
import {
  Title,
  StyledCard,
  DataSetInfoBox,
  StyledDDFormItem,
  StyledLabelAndValue,
  BranchNameInformation
} from './CommonComponents';
import useWorkspaceNameAndBranchName from './WorkspaceNameAndBranchName';
import { ConfirmRedirectToLogin } from '../confirmRedirect/confirmRedirectToLogin';

export const isNilOrEmpty = anyPass([isNil, isEmpty]);

export interface WorkspaceReproduceModalProps {
  projectId: string;
  envName?: string;
  envRevisionNumber?: number;
  checkpoint: ProvenanceCheckpoint;
  isGitBasedProject: boolean;
  ModalButton: React.FC;
  previousValuesStorageKey?: string;
  onSubmit?: (workspace: Workspace) => void;
  workspaceReproductionType: 'FromWorkspace' | 'FromModel';
}

const WorkspaceReproduceModal: React.FC<WorkspaceReproduceModalProps> = React.memo((props) => {
  const [hardwareTierId, setHardwareTierId] = React.useState<string>(
    props.checkpoint.hardwareTierId.value
  );
  const [redirectPath, setRedirectPath] = React.useState<string>();
  const [reloginPayload, setReloginPayload] = React.useState<string>();
  const [isSubmitInProgress, setIsSubmitInProgress] = React.useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(true);

  const [workspaceName, branchName, branchNameInvalidText, workspaceNameInvalidText,
     onWorkspaceNameChange, onBranchNameChange, validateWorkspaceNameAndBranchName] = useWorkspaceNameAndBranchName(`restarted-${props.checkpoint.executionName}`);

  const reproduceWorkspace = async () => {
    setRedirectPath(undefined);
    const isWorkspaceNameAndBranchNameValid = validateWorkspaceNameAndBranchName();
    if (isWorkspaceNameAndBranchNameValid) {
      setIsSubmitInProgress(true);
      const payload = {
        projectId: props.projectId,
        body: {
          name: workspaceName!,
          provenanceCheckpointId: props.checkpoint.id,
          hardwareTierId: { value: hardwareTierId },
          branchName: branchName!,
          workspaceReproductionType: props.workspaceReproductionType
        }
      };
      return reproduceAndStartWorkspace(payload)
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
        .catch(err => getErrorMessage(err, 'Failed to reproduce workspace.')
          .then(message => {
            errorToastr(message);
            return Promise.reject();
          }
        ))
        .finally(() => {
          setIsSubmitInProgress(false);
          setIsModalVisible(false);
        });
    } else {
      return Promise.reject();
    }
  };

  const hardwareTierChangeHandler = (hardwareTierWithCapacity: HardwareTierWithCapacity) => {
    setHardwareTierId(hardwareTierWithCapacity.hardwareTier.id);
  };

  const environmentRevisionNumber = props.envRevisionNumber ?? props.checkpoint.environmentDetails.environmentRevisionNumber;
  const environmentNameAndRevisionNumber =
    `${props.envName || props.checkpoint.environmentDetails.environmentName} - Revision #${environmentRevisionNumber}`;

  return (
    <React.Fragment>
      <ModalWithButton
        ModalButton={props.ModalButton}
        CustomSubmitButton={() =>
          <DominoLogoOnSubmitButton
            label="Open"
            disabled={or(isNilOrEmpty(workspaceName), isNilOrEmpty(branchName))}
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
        testId="workspace-reproduce-modal"
      >
        <BranchNameInformation data-test="branch-name-information"/>
        <StyledDDFormItem
          label="New Workspace Name"
          error={workspaceNameInvalidText}
        >
          <Input
            autoFocus={true}
            placeholder="New Workspace Name"
            value={workspaceName}
            onChange={onWorkspaceNameChange}
            data-test={'new-workspace-name'}
          />
        </StyledDDFormItem>
        <StyledDDFormItem label="Hardware Tier" dashedUnderline={true} tooltip={HARDWARE_TIER_HELP_TEXT}>
          <HardwareTierSelect
            projectId={props.projectId}
            selectedId={hardwareTierId}
            changeHandler={hardwareTierChangeHandler}
            overrideDefaultValue={true}
            testId={'hardware-tier'}
            executionType={ExecutionType.Workspace}
          />
        </StyledDDFormItem>
        <DDFormItem
          label="New Branch Name"
          help=" An identifier will be appended to non-unique names to avoid conflicts."
          error={branchNameInvalidText}
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
            value={environmentNameAndRevisionNumber}
          />
          <CommitsInfo checkpoint={props.checkpoint} isGitBasedProject={props.isGitBasedProject} />
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
}, (prevProps: WorkspaceReproduceModalProps, nextProps: WorkspaceReproduceModalProps) => {
  return equals(prevProps.projectId, nextProps.projectId) &&
    equals(prevProps.isGitBasedProject, nextProps.isGitBasedProject) &&
    equals(prevProps.envRevisionNumber, nextProps.envRevisionNumber) &&
    equals(prevProps.envName, nextProps.envName) &&
    equals(prevProps.checkpoint, nextProps.checkpoint);
});

export default WorkspaceReproduceModal;
