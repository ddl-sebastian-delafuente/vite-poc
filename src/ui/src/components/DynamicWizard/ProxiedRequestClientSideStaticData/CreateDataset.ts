import { getCurrentUser } from '@domino/api/dist/Users';

import { WorkflowId, Role } from '../../../proxied-api/types';
import { FieldType } from '../../DynamicField';
import { WorkflowMetadata, WorkflowStep } from '../DynamicWizard.types';
import {
  RequestDataObject
} from '../proxiedDynamicWizardApiCalls.types';

const STEP_ID = {
  step1: 'Configure',
  step2: 'Git',
}

const getWorkflowMetadata = () => {
  return new Promise<WorkflowMetadata>((resolve) => resolve({
    dependencies: [],
    id: WorkflowId.CreateDataset,
    title: '',
    steps: [
      {
        id: STEP_ID.step1,
        title: 'Configure',
        descriptionValues: ['datasetName'],
        remoteValidate: true,
      },
      {
        id: STEP_ID.step2,
        title: 'Permissions'
      },
    ]
  }));
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWorkflowStep = async (workflowId: string, stepId: string, requestData: RequestDataObject) => {
  const step: WorkflowStep = {
    dependencies: [],
    layout: {
      elements: []
    }
  };

  switch (stepId) {
    case STEP_ID.step1: 
      return {
        ...step,
        layout: {
          ...step.layout,
          elements: [
            {
              fieldType: FieldType.title,
              text: 'Dataset details',
            },
            {
              fieldType: FieldType.textblock,
              text: 'New datasets will be accessible in active workspaces only after next workspace start'
            },
            {
              isRequired: true,
              label: 'Dataset Name',
              path: 'datasetName',
            },
            {
              fieldType: FieldType.textarea,
              label: 'Description',
              path: 'datasetDescription',
              placeholder: 'A clear description helps others understand the value of your dataset.'
            }
          ],
        }
      }
    case STEP_ID.step2: {
        const user = await getCurrentUser({});

        return {
          ...step,
          layout: {
            ...step.layout,
            elements: [
              {
                fieldType: FieldType.title,
                text: 'Dataset Permissions',
              },
              {
                fieldType: FieldType.userRoles,
                path: 'grants',
                defaultValue: [
                  {
                    targetId: user.id,
                    targetName: user.userName,
                    targetRole: Role.DatasetRwOwner,
                  }
                ]
              },
            ],
          }
        }
    }
    default:
      break;
  }

  throw new Error('No step found');
}

export const CreateDataset = {
  getWorkflowMetadata,
  getWorkflowStep,
}
