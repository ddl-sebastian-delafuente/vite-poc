import * as React from 'react';
import moment from 'moment';
import {
  DominoAdminInterfaceExecutionOverview as ExecutionOverview
} from '@domino/api/dist/types';
import { render } from '@domino/test-utils/dist/testing-library';
import { ComputeGridExecutionsTable } from '../';

const mockExecutionOverview = [
  {
    id: '5cdb21c04cedfd000765f39d',
    computeGridType: 'Kubernetes',
    projectId: '5cc72a924cedfd000694cba7',
    projectIdentifier: {
      ownerUsername: 'vivek',
      projectName: 'qs1'
    },
    startingUserId: '5cb4d7774cedfd0007dcfdf9',
    startingUsername: 'vivek',
    hardwareTier: {
      id: 'kubernetes-small',
      cores: 0.5,
      memoryInGiB: 0.5,
      isArchived: false
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
    id: '5eec58f8018f8079f69c37a4',
    computeGridType: 'Kubernetes',
    projectId: '5cc72a924cedfd000694cba7',
    projectIdentifier: {
      ownerUsername: 'vivek',
      projectName: 'qs1'
    },
    startingUserId: '5cb4d7774cedfd0007dcfdf9',
    startingUsername: 'vivek',
    hardwareTier: {
      id: 'kubernetes-small',
      cores: 0.5,
      memoryInGiB: 0.5
    },
    status: 'Running',
    executionUnits: [
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'run-5eec58f8018f8079f69c37a4-cmldd',
        computeNodeId: 'ip-10-0-180-104.us-west-2.compute.internal',
        status: 'Running'
      },
    ],
    created: '2019-05-14T20:09:31.525Z',
    title: '[Jupyter Notebook Session]',
    workloadType: 'Workspace',
    computeClusterOverviews: [],
    onDemandSparkClusterProperties: {
      name: 'spark-5eec58f8018f8079f69c37a4',
      masterHardwareTier: {
        id: 'small-k8s',
        cores: 1,
        memoryInGiB: 4
      },
      workerHardwareTier: {
        id: 'small-k8s',
        cores: 1,
        memoryInGiB: 4.4
      },
      webUiPath: '/vivek/qs1/workspaces/5eec58f8018f8079f69c37a4/spark/ui/'
    },
    onDemandSparkExecutionUnits: [
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'spark-5eec58f8018f8079f69c37a4-master-0',
        computeNodeId: 'ip-10-0-37-131.us-west-2.compute.internal',
        status: 'Running',
        role: 'master'
      },
      {
        deployableObjectType: 'Pod',
        deployableObjectId: 'spark-5eec58f8018f8079f69c37a4-worker-0',
        computeNodeId: 'ip-10-0-37-131.us-west-2.compute.internal',
        status: 'Running',
        role: 'worker'
      }
    ]
  },
  {
    id: '5cdb21c04cedfd000765f39d',
    computeGridType: 'Kubernetes',
    projectId: '5cc72a924cedfd000694cba7',
    projectIdentifier: {
      ownerUsername: 'vivek',
      projectName: 'qs1'
    },
    startingUserId: '5cb4d7774cedfd0007dcfdf9',
    startingUsername: 'vivek',
    hardwareTier: {
      id: 'kubernetes-small',
      cores: 0.5,
      memoryInGiB: 0.5
    },
    status: 'Pending',
    executionUnits: [],
    created: '2019-05-14T20:14:56.976Z',
    title: 'main.py',
    workloadType: 'Batch',
    computeClusterOverviews: [],
    onDemandSparkExecutionUnits: []
  },
] as ExecutionOverview[];

describe('<ComputeGridExecutionsTable />', () => {
  const view = render(<ComputeGridExecutionsTable propDrivenExecutionOverviewRows={mockExecutionOverview} hybridEnabled={false}/>);
  const headerRow = view.baseElement.querySelector('thead tr');
  const bodyRows = view.baseElement.querySelectorAll('tbody tr.ant-table-row');
  const executionRow = bodyRows[0];
  const sparkMasterRow = bodyRows[2];
  const sparkWorkerRow = bodyRows[3];
  const noExecutionUnitsRow = bodyRows[4];
  const executionCells = executionRow.querySelectorAll('td');
  const noExecutionUnitsCells = noExecutionUnitsRow.querySelectorAll('td');
  const sparkMasterCells = sparkMasterRow.querySelectorAll('td');
  const sparkWorkerCells = sparkWorkerRow.querySelectorAll('td');

  it('should have the right number of rows', () => {
    expect(bodyRows.length).toEqual(5);
  });

  it('should have the right number of cells and titles in the header', () => {
    if (headerRow) {
      const headerCells = headerRow.querySelectorAll('th');
      expect(headerCells.length).toEqual(10);
      expect(headerCells[0].textContent).toEqual('Workload');
      expect(headerCells[1].textContent).toEqual('Execution ID');
      expect(headerCells[2].textContent).toEqual('Hardware Tier');
      expect(headerCells[3].textContent).toEqual('User');
      expect(headerCells[4].textContent).toEqual('Project');
      expect(headerCells[5].textContent).toEqual('Title');
      expect(headerCells[6].textContent).toEqual('Started');
      expect(headerCells[7].textContent).toEqual('Status');
      expect(headerCells[8].textContent).toEqual('Infrastructure Details');
      expect(headerCells[9].textContent).toEqual('Actions');
    }
  });

  it('should have the right info for an execution row', () => {
    expect(executionCells[0].querySelector('a')!.textContent).toEqual('Batch');
    expect(executionCells[1].textContent).toEqual('5cdb21c04cedfd000765f39d');
    expect(executionCells[2].textContent).toEqual('kubernetes-small:' + String.fromCharCode(160) + '0.5 cores, 0.5 GiB');
    expect(executionCells[3].querySelector('a')!.textContent).toEqual('vivek');
    expect(executionCells[4].querySelector('a')!.textContent).toEqual('vivek/qs1');
    expect(executionCells[5].textContent).toEqual('main.py');
    expect(executionCells[6].textContent).toEqual(moment('2019-05-14T20:14:56.976Z').format('YYYY-MM-DD HH:mm:ss'));
    expect(executionCells[7].textContent).toEqual('Pending');
  });

  it('should have the right infrastructure details links for an execution row', () => {
    const infrastructureDetails = executionCells[8];

    expect(infrastructureDetails.querySelectorAll('a')[0].textContent).toEqual('Resources');
    expect(infrastructureDetails.querySelectorAll('a')[1].textContent).toEqual('Pod');
    expect(infrastructureDetails.querySelectorAll('a')[2].textContent).toEqual('Node');
    expect(infrastructureDetails.querySelectorAll('a')[3].textContent).toEqual('Logs');
    expect(infrastructureDetails.querySelectorAll('a')[6].textContent).toEqual('Support Bundle');
  });

  it('should have a stop button in the actions column for an execution row', () => {
    expect(executionCells[9].querySelector('button')?.querySelector('span')?.textContent).toEqual('Stop');
  });

  it('should have the right info for a spark master row', () => {
    expect(sparkMasterCells[0].querySelector('a')!.textContent).toEqual('Spark (master)');
    expect(sparkMasterCells[1].textContent).toEqual('5eec58f8018f8079f69c37a4');
    expect(sparkMasterCells[2].textContent).toEqual('small-k8s:' + String.fromCharCode(160) + '1 cores, 4 GiB');
    expect(sparkMasterCells[3].querySelector('a')!.textContent).toEqual('vivek');
    expect(sparkMasterCells[4].querySelector('a')!.textContent).toEqual('vivek/qs1');
    expect(sparkMasterCells[5].textContent).toEqual('[Jupyter Notebook Session]');
    expect(sparkMasterCells[6].textContent).toEqual(moment('2019-05-14T20:09:31.525Z').format('YYYY-MM-DD HH:mm:ss'));
    expect(sparkMasterCells[7].textContent).toEqual('Running');
  });

  it('should have the right info for a spark worker row', () => {
    expect(sparkWorkerCells[0].querySelector('a')!.textContent).toEqual('Spark (worker)');
    expect(sparkWorkerCells[1].textContent).toEqual('5eec58f8018f8079f69c37a4');
    expect(sparkWorkerCells[2].textContent).toEqual('small-k8s:' + String.fromCharCode(160) + '1 cores, 4.4 GiB');
    expect(sparkWorkerCells[3].querySelector('a')!.textContent).toEqual('vivek');
    expect(sparkWorkerCells[4].querySelector('a')!.textContent).toEqual('vivek/qs1');
    expect(sparkWorkerCells[5].textContent).toEqual('[Jupyter Notebook Session]');
    expect(sparkWorkerCells[6].textContent).toEqual(moment('2019-05-14T20:09:31.525Z').format('YYYY-MM-DD HH:mm:ss'));
    expect(sparkWorkerCells[7].textContent).toEqual('Running');
  });

  it('should have the right infrastructure details links for a spark row', () => {
    const infrastructureDetails = sparkMasterCells[8];

    expect(infrastructureDetails.querySelectorAll('a')[0].textContent).toEqual('Pod');
    expect(infrastructureDetails.querySelectorAll('a')[1].textContent).toEqual('Cluster Spec');
    expect(infrastructureDetails.querySelectorAll('a')[2].textContent).toEqual('Node');
  });

  it('should display the right info for an execution that has no execution units', () => {
    expect(noExecutionUnitsCells[0].querySelector('a')!.textContent).toEqual('Batch');
    expect(noExecutionUnitsCells[1].textContent).toEqual('5cdb21c04cedfd000765f39d');
    expect(noExecutionUnitsCells[2].textContent).toEqual('kubernetes-small:' + String.fromCharCode(160) + '0.5 cores, 0.5 GiB');
    expect(noExecutionUnitsCells[3].querySelector('a')!.textContent).toEqual('vivek');
    expect(noExecutionUnitsCells[4].querySelector('a')!.textContent).toEqual('vivek/qs1');
    expect(noExecutionUnitsCells[5].textContent).toEqual('main.py');
    expect(noExecutionUnitsCells[6].textContent).toEqual(moment('2019-05-14T20:14:56.976Z').format('YYYY-MM-DD HH:mm:ss'));
    expect(noExecutionUnitsCells[7].textContent).toEqual('Pending');
  });
});
