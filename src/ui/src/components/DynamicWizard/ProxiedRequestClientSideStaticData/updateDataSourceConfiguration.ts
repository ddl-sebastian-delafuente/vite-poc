import { DataSourceType } from '../../../data/data-sources/CommonData';
import { WorkflowMetadata, WorkflowStep } from '../DynamicWizard.types';
import { RequestDataObject } from '../proxiedDynamicWizardApiCalls.types';

import {
  AccountNameFieldConfig,
  DatabaseFieldConfig,
  WarehouseFieldConfig,
  SchemaFieldConfig,
  RoleFieldConfig,
} from './datasourceSharedFields';

const STEP_ID = 'updateDataSourceConfiguration';
const WORKFLOW_ID = STEP_ID;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWorkflowMetadata = (workflowId: string, requestData: RequestDataObject): Promise<WorkflowMetadata> => {
  return new Promise<WorkflowMetadata>((resolve) => resolve({
    dependencies: [],
    id: WORKFLOW_ID,
    title: '',
    steps: [
      {
        id: STEP_ID,
        title: ''
      }
    ]
  }));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWorkflowStep = (workflowId: string, stepId: string, requestData: RequestDataObject): Promise<WorkflowStep> => {
  return new Promise<WorkflowStep>((resolve) => {
    const dataSourceType = requestData?.dataSourceType as DataSourceType;
    let step: WorkflowStep = {
      dependencies: [],
      layout: {
        elements: []
      }
    };

    switch (dataSourceType) {
      case DataSourceType.SnowflakeConfig:
        step = {
          ...step,
          layout: {
            elements: [
              AccountNameFieldConfig,
              {
                elements: [
                  DatabaseFieldConfig,
                  WarehouseFieldConfig,
                ]
              },
              {
                elements: [
                  SchemaFieldConfig,
                  RoleFieldConfig,
                ]
              }
            ]
          }
        };
        break;
    }

    resolve(step);
  });
}

export const updateDataSourceConfiguration = {
  getWorkflowMetadata,
  getWorkflowStep,
};
