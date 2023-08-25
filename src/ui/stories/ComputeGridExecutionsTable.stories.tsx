import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { DominoAdminInterfaceExecutionOverview as ExecutionOverview, } from '@domino/api/dist/types';
import ComputeGridExecutionsTable from '../src/admin-executions/src/ComputeGridExecutionsTable';
import fetchMock from 'fetch-mock';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Admin/ComputeGridExecutionsTable'), module);

const mockExecutions = [
  {
    id: '5cdb21c04cedfd000765f39d',
    computeGridType: 'Kubernetes',
    projectId: '5cc72a924cedfd000694cba7',
    projectIdentifier: {
      ownerUsername: 'robin',
      projectName: 'qs1'
    },
    startingUserId: '5cb4d7774cedfd0007dcfdf9',
    startingUsername: 'robin',
    hardwareTier: {
      id: 'kubernetes-small',
      cores: 0.5,
      memoryInGiB: 0.5,
      isArchived: false,
    },
    status: 'Pending',
    executionUnits: [
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cdb21c04cedfd000765f39d-txqbb',
        computeNodeId: 'ip-10-0-128-144.us-west-2.compute.internal',
        status: 'Pending'
      }
    ],
    created: '2019-05-14T20:14:56.976Z',
    title: 'main.py',
    workloadType: 'Batch',
    computeClusterOverviews: [],
    onDemandSparkExecutionUnits: []
  },
  {
    id: '5cd0adb54cedfd0008bf5462',
    computeGridType: 'Kubernetes',
    projectId: '5cd0ada04cedfd0007e2b525',
    projectIdentifier: {
      ownerUsername: 'fernando',
      projectName: 'app'
    },
    startingUserId: '5ca4f81b4cedfd0006dd48ac',
    startingUsername: 'fernando',
    hardwareTier: {
      id: 'kubernetes-medium',
      cores: 1,
      memoryInGiB: 1
    },
    status: 'Preparing',
    executionUnits: [
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cd0adb54cedfd0008bf5462-88c6f9df4-24nn7',
        computeNodeId: 'ip-10-0-180-104.us-west-2.compute.internal',
        status: 'Pending'
      },
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cd0adb54cedfd0008bf5462-88c6f9df4-j64sd',
        computeNodeId: 'ip-10-0-128-144.us-west-2.compute.internal',
        status: 'Failed'
      }
    ],
    created: '2019-05-06T21:57:09.766Z',
    title: 'App server',
    workloadType: 'App',
    computeClusterOverviews: [],
    onDemandSparkExecutionUnits: []
  },
  {
    id: '5cdb238c4cedfd00079f3ba0',
    computeGridType: 'Kubernetes',
    projectId: '5cc72a924cedfd000694cba7',
    projectIdentifier: {
      ownerUsername: 'robin',
      projectName: 'qs1'
    },
    startingUserId: '5cb4d7774cedfd0007dcfdf9',
    startingUsername: 'robin',
    hardwareTier: {
      id: 'kubernetes-small',
      cores: 0.5,
      memoryInGiB: 0.5
    },
    status: 'Preparing',
    executionUnits: [
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cdb238c4cedfd00079f3ba0-qcs5d',
        computeNodeId: 'ip-10-0-180-104.us-west-2.compute.internal',
        status: 'Pending'
      }
    ],
    created: '2019-05-14T20:22:36.660Z',
    title: 'main.py',
    workloadType: 'Batch',
    computeClusterOverviews: [],
    onDemandSparkExecutionUnits: []
  },
  {
    id: '5cd91a444cedfd0006c1bf64',
    computeGridType: 'Kubernetes',
    projectId: '5cb36e3d4cedfd0007d8d951',
    projectIdentifier: {
      ownerUsername: 'integration-test',
      projectName: 'po'
    },
    startingUserId: '5c9cee4e4cedfd00061cf000',
    startingUsername: 'integration-test',
    hardwareTier: {
      id: 'kubernetes-large',
      cores: 2,
      memoryInGiB: 2
    },
    status: 'Running',
    executionUnits: [
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cd91a444cedfd0006c1bf64-2xbwt',
        computeNodeId: 'ip-10-0-128-144.us-west-2.compute.internal',
        status: 'Pending'
      },
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cd91a444cedfd0006c1bf64-bq2j8',
        computeNodeId: 'ip-10-0-180-104.us-west-2.compute.internal',
        status: 'Unknown'
      },
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cd91a444cedfd0006c1bf64-jk8wp',
        computeNodeId: 'ip-10-0-180-104.us-west-2.compute.internal',
        status: 'Unknown'
      },
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cd91a444cedfd0006c1bf64-szxl2',
        computeNodeId: 'ip-10-0-123-127.us-west-2.compute.internal',
        status: 'Failed'
      }
    ],
    created: '2019-05-13T07:18:28.117Z',
    title: '[Jupyter Notebook Session]',
    workloadType: 'Workspace',
    computeClusterOverviews: [],
    onDemandSparkExecutionUnits: []
  },
  {
    id: '5cdb207b4cedfd000765f366',
    computeGridType: 'Kubernetes',
    projectId: '5cc72a924cedfd000694cba7',
    projectIdentifier: {
      ownerUsername: 'robin',
      projectName: 'qs1'
    },
    startingUserId: '5cb4d7774cedfd0007dcfdf9',
    startingUsername: 'robin',
    hardwareTier: {
      id: 'kubernetes-small',
      cores: 0.5,
      memoryInGiB: 0.5
    },
    status: 'Running',
    executionUnits: [
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cdb207b4cedfd000765f366-cmldd',
        computeNodeId: 'ip-10-0-180-104.us-west-2.compute.internal',
        status: 'Failed'
      },
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cdb207b4cedfd000765f366-hwtkj',
        computeNodeId: 'ip-10-0-123-127.us-west-2.compute.internal',
        status: 'Failed'
      },
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cdb207b4cedfd000765f366-jhq79',
        computeNodeId: 'ip-10-0-123-127.us-west-2.compute.internal',
        status: 'Succeeded'
      },
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cdb207b4cedfd000765f366-znsfh',
        computeNodeId: 'ip-10-0-180-104.us-west-2.compute.internal',
        status: 'Failed'
      }
    ],
    created: '2019-05-14T20:09:31.525Z',
    title: '[Jupyter Notebook Session]',
    workloadType: 'Workspace',
    computeClusterOverviews: [],
    onDemandSparkExecutionUnits: []
  },
  {
    id: '5cdb21c04cedfd00076f23b1',
    computeGridType: 'Kubernetes',
    projectId: '5cc72a924cedfd000694cba7',
    projectIdentifier: {
      ownerUsername: 'robin',
      projectName: 'qs1'
    },
    startingUserId: '5cb4d7774cedfd0007dcfdf9',
    startingUsername: undefined,
    hardwareTier: {
      id: 'kubernetes-small',
      cores: 0.5,
      memoryInGiB: 0.5,
    },
    status: 'Pending',
    executionUnits: [
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cdb21c04cedfd000765f39d-txqbb',
        computeNodeId: 'ip-10-0-128-144.us-west-2.compute.internal',
        status: 'Pending'
      }
    ],
    created: '2019-05-14T20:14:56.976Z',
    title: undefined,
    workloadType: 'Batch',
    computeClusterOverviews: [],
    onDemandSparkExecutionUnits: []
  }
] as ExecutionOverview[];

const executionsWithDaskOverview = [
  {
    id: '5cdb238c4cedfd00079f3ba0',
    computeGridType: 'Kubernetes',
    projectId: '5cc72a924cedfd000694cba7',
    projectIdentifier: {
      ownerUsername: 'robin',
      projectName: 'qs1'
    },
    startingUserId: '5cb4d7774cedfd0007dcfdf9',
    startingUsername: 'robin',
    hardwareTier: {
      id: 'kubernetes-small',
      cores: 0.5,
      memoryInGiB: 0.5
    },
    status: 'Preparing',
    executionUnits: [
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cdb238c4cedfd00079f3ba0-qcs5d',
        computeNodeId: 'ip-10-0-180-104.us-west-2.compute.internal',
        status: 'Pending'
      }
    ],
    created: '2019-05-14T20:22:36.660Z',
    title: 'main.py',
    workloadType: 'Batch',
    computeClusterOverviews: [],
    onDemandSparkExecutionUnits: []
  },
  {
    id: '5cd91a444cedfd0006c1bf64',
    computeGridType: 'Kubernetes',
    projectId: '5cb36e3d4cedfd0007d8d951',
    projectIdentifier: {
      ownerUsername: 'integration-test',
      projectName: 'po'
    },
    startingUserId: '5c9cee4e4cedfd00061cf000',
    startingUsername: 'integration-test',
    hardwareTier: {
      id: 'kubernetes-large',
      cores: 2,
      memoryInGiB: 2
    },
    status: 'Running',
    executionUnits: [
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cd91a444cedfd0006c1bf64-2xbwt',
        computeNodeId: 'ip-10-0-128-144.us-west-2.compute.internal',
        status: 'Pending'
      },
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cd91a444cedfd0006c1bf64-bq2j8',
        computeNodeId: 'ip-10-0-180-104.us-west-2.compute.internal',
        status: 'Unknown'
      },
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cd91a444cedfd0006c1bf64-jk8wp',
        computeNodeId: 'ip-10-0-180-104.us-west-2.compute.internal',
        status: 'Unknown'
      },
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5cd91a444cedfd0006c1bf64-szxl2',
        computeNodeId: 'ip-10-0-123-127.us-west-2.compute.internal',
        status: 'Failed'
      }
    ],
    created: '2019-05-13T07:18:28.117Z',
    title: '[Jupyter Notebook Session]',
    workloadType: 'Workspace',
    computeClusterOverviews: [{
      clusterName: 'dask-60b135e95374fd03055497e1',
      clusterType: 'Dask',
      masterHardwareTier: {id: 'small-k8s', cores: 1, memoryInGiB: 4},
      podOverviews: [
        {
          computeNodeId: 'ip-10-0-59-10.us-west-2.compute.internal',
          deployableObjectId: 'ray-60b135e95374fd03055497e1-ray-head-0',
          deployableObjectType: 'Pod',
          isMaster: true,
          role: 'scheduler',
          status: 'Starting'
        },
        {
          computeNodeId: 'ip-10-0-59-10.us-west-2.compute.internal',
          deployableObjectId: 'ray-60b135e95374fd03055497e1-ray-head-0',
          deployableObjectType: 'Pod',
          isMaster: true,
          role: 'worker',
          status: 'Starting'
        },
      ],
      webUiPath: '/integration-test/quick-start/workspace/60b135e95374fd03055497e1/ray/ui/',
      workerHardwareTier: {id: 'small-k8s', cores: 1, memoryInGiB: 4}
    }],
    onDemandSparkExecutionUnits: []
  }];

stories.add('the whole thing (w/ http mock)', () => {
  fetchMock
    .restore()
    .get(
      `/v4/admin/executions`,
      mockExecutions
    );
  return (
    <ComputeGridExecutionsTable/>
  );
});

stories.add('with compute cluster overviews for Dask', () => {
  fetchMock
    .restore()
    .get(
      `/v4/admin/executions`,
      executionsWithDaskOverview
    );
  return (
    <ComputeGridExecutionsTable/>
  );
});

stories.add('empty state', () => {
  fetchMock
    .restore()
    .get(
      `/v4/admin/executions`,
      []
    );
  return (
    <ComputeGridExecutionsTable/>
  );
});
