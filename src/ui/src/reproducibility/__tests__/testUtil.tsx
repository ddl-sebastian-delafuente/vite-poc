import * as React from 'react';
import { ProjectDetails } from '../../utils/testUtil';
import ModalOpenButton from '../ModalOpenButton';
import { ButtonProps } from '../../components/Button/Button';

export const getModalButton = (modalBtnProps: ButtonProps) => (
  <ModalOpenButton
    modalBtnLabel="Open in Workspace"
    modalBtnProps={modalBtnProps}
    projectId={ProjectDetails.projectId}
    projectName={ProjectDetails.projectName}
    projectOwnerName={ProjectDetails.projectOwnerName}
    loggedInUserId={ProjectDetails.loggedInUserId}
  />
);

export const BRANCH_COMMIT_DETAILS = {
  commits: ['0123456789', '0987654321'],
  commitDetails: ['name0', 'branchName0', 'name1', 'branchName1']
};

export {
  mockWorkspaceTools,
  mockWorkspaceDefinitions,
  getQuotaMock,
  mockQuotaStatus,
  mockCheckpoint,
  mockProjectSettings,
  ProjectDetails
} from '../../utils/testUtil';

export default {
  getModalButton,
  BRANCH_COMMIT_DETAILS
};
