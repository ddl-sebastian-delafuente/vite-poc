import * as Dataplanes from '@domino/api/dist/Dataplanes';
import * as Datasource from '@domino/api/dist/Datasource';
import * as Featurestore from '@domino/api/dist/Featurestore';
import * as Layout from '@domino/api/dist/Layout';
import {
  DominoLayoutWebCompleteWorkflowRequest as CompleteWorkflowRequest,
  DominoLayoutWebCompleteWorkflowResponse as CompleteWorkflowResponse,
  DominoLayoutWebValidateStepRequest as ValidateStepRequest,
  DominoLayoutWebValidateStepResponse as ValidateStepResponse,
} from '@domino/api/dist/types';
import {
  getDatasourceName,
} from '../../data/data-sources/utils';
import { getOffineStoreName } from '../../data/feature-store/utils';
import {
  DatasourceConnectorGroup,
  GitServiceProvider,
  OnlineStoreType,
} from '../../proxied-api/types';
import { Option } from '../DynamicField';
import { WorkflowMetadata, WorkflowStep } from './DynamicWizard.types';
import {
  MetaRequestObject,
  RequestDataObject
} from './proxiedDynamicWizardApiCalls.types';
import * as ClientSideData from './ProxiedRequestClientSideStaticData';

export type WorkflowId = ValidateStepRequest['workflowID'];
export type StepId = ValidateStepRequest['stepID'];

// Temp stubbed apis
export const DatasourceLocal = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  completeWorkflow: (args: { body:  CompleteWorkflowRequest }) => new Promise<CompleteWorkflowResponse>(resolve => resolve({ success: true, errors: [] })),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getFieldOptions: (fieldId: string, meta: MetaRequestObject = {}) => new Promise<Option[]>((resolve) => resolve([])),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getWorkflowMetadata: (workflowId: string, requestData: RequestDataObject = {}, meta: MetaRequestObject = {}) => new Promise<WorkflowMetadata>(resolve => resolve({
    id: '',
    steps: [],
    title: '',
  })),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getWorkflowStep: (workflowId: string, stepId: string, requestData: RequestDataObject = {}, meta: MetaRequestObject = {}) => new Promise<WorkflowStep>(resolve => resolve({
    layout: {
      elements: []
    },
  })),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateStep: (args: { body: ValidateStepRequest }) => new Promise<ValidateStepResponse>((resolve) => resolve({ success: true, errors: [] })),
};

export const WORKFLOW = Object.freeze({
  addFeatureStoreCredentials: 'AddFeatureStoreCredentials',
  createDataSource: 'CreateDatasource',
  createFeatureStore: 'CreateFeatureStore',
  updateDataSourceConfiguration: 'updateDataSourceConfiguration',
  updateDataSourcePermissions: 'updateDataSourcePermissions',
});

export const completeWorkflow = new Proxy(Layout.completeWorkflow || DatasourceLocal.completeWorkflow, {
  apply: async (remoteCall, thisArgs, argArray: Parameters<typeof Layout.completeWorkflow>) => {
    const [request] = argArray;
    const { workflowID: workflowId } = request.body;

    if (ClientSideData[workflowId] && ClientSideData[workflowId].completeWorkflow) {
      return await ClientSideData[workflowId].completeWorkflow(request);
    }

    return remoteCall.apply(thisArgs, argArray);
  }
});

export const getFieldOptions = new Proxy(DatasourceLocal.getFieldOptions, {
  apply: async (remoteCall, thisArgs, argArray: Parameters<typeof DatasourceLocal.getFieldOptions>) => {
    const [fieldId, meta = {}] = argArray;

    if (fieldId === 'dataPlanes') {
      try {
        const dataplanes =  await Dataplanes.listDataPlanes({});

        return dataplanes.map(({ id, name }) => ({
          label: name,
          value: id,
        }));
      } catch (e) {
        console.warn(e);
      }

      return [];
    }

    if (fieldId === 'dataSourceType') {
      const configs = await Datasource.getDataSourceConfigsNew({
        hideStarburst: !meta.isAdminPage
      });

      // temporary hardcode grouping need to think about how to implement long term
      const groupOrder = [
        { label: 'Native', group: DatasourceConnectorGroup.Native },
        { label: 'Powered by Starburst', group: DatasourceConnectorGroup.Starburst },
        { label: 'Powered by Starburst JDBC', group: DatasourceConnectorGroup.StarburstSelfService },
      ];

      return configs.reduce((memo, { connectorGroup, datasourceType }) => {
        const groupIndex = groupOrder.findIndex(go => go.group === connectorGroup);
        const { label } = groupOrder[groupIndex];

        if (groupIndex === -1) {
          console.warn('unable to locate connectorGroup', connectorGroup);
          return memo;
        }

        if (!memo[groupIndex]) {
          memo[groupIndex] = {
            label,
            options: [],
            value: false,
          };
        }

        memo[groupIndex].options?.push({
          label: getDatasourceName(datasourceType),
          value: datasourceType
        });

        return memo;
      }, [] as Option[]);
    }

    if (fieldId === 'offlineStoreType') {
      try {
        const configs = await Featurestore.getOfflineStoreConfigs({});

        return configs.map(({ offlineStoreType }) => ({
          label: getOffineStoreName(offlineStoreType),
          value: offlineStoreType,
        }));
      } catch (e) {
        console.warn(e);
      }
      return [];
    }

    if (fieldId === 'onlineStoreType') {
      return Object.keys(OnlineStoreType).map((onlineStoreType) => ({
        label: onlineStoreType,
        value: onlineStoreType,
      }));
    }

    if (fieldId === 'gitProvider') {
      return [
        { label: 'Bitbucket Server', value: GitServiceProvider.bitbucketServer },
        { label: 'Bitbucket', value: GitServiceProvider.bitbucket },
        { label: 'GitHub Enterprise', value: GitServiceProvider.githubEnterprise },
        { label: 'GitHub', value: GitServiceProvider.github },
        { label: 'GitLab', value: GitServiceProvider.gitlab },
        { label: 'GitLab Enterprise', value: GitServiceProvider.gitlabEnterprise },
        { label: 'Other', value: GitServiceProvider.unknown },
      ];
    }

    return remoteCall.apply(thisArgs, argArray);
  }
});

export const getWorkflowMetadata = new Proxy(DatasourceLocal.getWorkflowMetadata, {
  apply: async (remoteCall, thisArgs, argArray: Parameters<typeof DatasourceLocal.getWorkflowMetadata>) => {
    const [workflowId, requestData = {}, meta = {}] = argArray;

    if (ClientSideData[workflowId] && ClientSideData[workflowId].getWorkflowMetadata) {
      return ClientSideData[workflowId].getWorkflowMetadata(workflowId, requestData, meta);
    }

    return remoteCall.apply(thisArgs, argArray);
  }
});

export const getWorkflowStep = new Proxy(DatasourceLocal.getWorkflowStep, {
  apply: async (remoteCall, thisArgs, argArray: Parameters<typeof DatasourceLocal.getWorkflowStep>) => {
    const [workflowId, stepId, requestData = {}, meta = {}] = argArray;

    if (ClientSideData[workflowId] && ClientSideData[workflowId].getWorkflowStep) {
      return await ClientSideData[workflowId].getWorkflowStep(workflowId, stepId, requestData, meta);
    }

    return remoteCall.apply(thisArgs, argArray);
  }
});

export const validateStep = new Proxy(Layout.validateStep || DatasourceLocal.validateStep, {
  apply: async (remoteCall, thisArgs, argArray: Parameters<typeof Layout.validateStep>) => {
    return remoteCall.apply(thisArgs, argArray);
  }
});
