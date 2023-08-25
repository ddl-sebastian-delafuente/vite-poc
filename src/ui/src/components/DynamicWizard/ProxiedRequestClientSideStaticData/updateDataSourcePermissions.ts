import { Permission } from '../../../data/data-sources/CommonData';
import { WorkflowMetadata, WorkflowStep } from '../DynamicWizard.types';
import { RequestDataObject } from '../proxiedDynamicWizardApiCalls.types';
import {  
  PermissionTypeFieldConfig,
  UserAndOrgsFieldConfig,
} from './datasourceSharedFields';

const STEP_ID = 'updateDataSourcePermissions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWorkflowMetadata = (workflowId: string, requestData: RequestDataObject): Promise<WorkflowMetadata> => {
  return new Promise<WorkflowMetadata>((resolve) => {
    resolve({
      dependencies: [],
      id: 'updateDataSourcePermissions',
      title: '',
      steps: [
        {
          id: STEP_ID,
          title: '',
        }
      ]
    });
  })
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWorkflowStep = (workflowId: string, stepId: string, requestData: RequestDataObject): Promise<WorkflowStep> => {
  return new Promise<WorkflowStep>((resolve) => {
    const permissionType = requestData?.permissionType as Permission;

    const baseStep: Pick<WorkflowStep, 'dependencies' | 'layout'> = {
      dependencies: ['permissionType'],
      layout: {
        elements: [
          PermissionTypeFieldConfig,
        ]
      }
    }

    switch (permissionType) {
      case Permission.Specific:
        resolve({
          ...baseStep,
          layout: {
            ...baseStep.layout,
            elements: [
              ...baseStep.layout.elements,
              UserAndOrgsFieldConfig,
            ]
          }
        });
        return;
      case Permission.Everyone:
      default:
        resolve({
          ...baseStep,
        });
    }
  });
};

export const updateDataSourcePermissions = {
  getWorkflowMetadata,
  getWorkflowStep,
}
