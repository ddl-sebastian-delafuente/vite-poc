import { CredentialType, Permission } from '../../data/data-sources/CommonData';
import { WorkflowData } from './DynamicWizard.types';
import { MetaRequestObject } from './proxiedDynamicWizardApiCalls.types';


type WorkflowDescriptionMaker = (workflowData: WorkflowData, meta: MetaRequestObject) => string;

interface WorkflowDescriptionMakerMap {
  [key: string]: WorkflowDescriptionMaker;
}

const dataplanesDescription = (workflowData: WorkflowData) => {
  if (workflowData.useAllDataplanes) {
    return 'All Selected';
  }

  const dataplanes = (workflowData.dataPlanes || []) as string[];

  if (dataplanes.length === 1) {
    return '1 data plane selected';
  }

  if (dataplanes.length > 1) {
    return `${dataplanes.length} data planes selected`;
  }

  return '';
}

const permissionTypeDescription = (workflowData: WorkflowData, meta: MetaRequestObject) => {
  const credentialType = workflowData.credentialType as CredentialType;

  const users = (workflowData.userIds || []) as string[];
  if (credentialType === CredentialType.Individual) {
    return meta.isAdminUser ? Permission.Everyone : Permission.OnlyMe;
  }

  if (users.length === 1) {
    return '1 user or organization';
  }

  if (users.length > 1) {
    return `${users.length} users and organizations`;
  }

  return ''
}

const workflowDescriptionMakerMap: WorkflowDescriptionMakerMap = {
  dataPlanes: dataplanesDescription,
  permissionType: permissionTypeDescription,
}

export const getWorkflowStepDescriptionMaker = (mapperKey: string) => 
 workflowDescriptionMakerMap[mapperKey];
