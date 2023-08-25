import * as React from 'react';
import * as R from 'ramda';
import { MemoryRouter as Router } from 'react-router';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import { makeMocks, MakeMocksReturn, MockProfile } from '@domino/test-utils/dist/mock-manager';
import * as Projects from '@domino/api/dist/Projects';
import {
  ComputeClusterType,
  DominoNucleusLibAuthPrincipalWithFeatureFlags as Principal,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTierWithCapacityDto,
  DominoProjectsApiUseableProjectEnvironmentsDto as UseableProjectEnvironmentsDto,
  DominoWorkspaceApiComputeClusterConfigDto as ComputeClusterConfigDto,
  DominoWorkspaceApiWorkspaceClusterConfigDto as WorkspaceClusterConfigDto
} from '@domino/api/dist/types';
import {
  adminInterfaceWhitelabelConfigurations,
  hardwareTierWithCapacityDto,
  projectSettingsDto,
} from '@domino/test-utils/dist/mocks';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import * as useStoreHook from '@domino/ui/dist/globalStore/useStore';
import { formattedPrincipalInitialState } from '@domino/ui/dist/globalStore/util';
import { testResults } from '../../components/__tests__/computeEnvironmentData';
import {
  principal as mockPrincipal
} from '../../utils/testUtil';
import ClusterContent, { ClusterContentProps } from '../ClusterContent';
import { computeQuota, getClusterDisabledMessage } from '../util';

type DefaultClusterPropertiesType = WorkspaceClusterConfigDto | ComputeClusterConfigDto | undefined;

const { Spark, Ray, Dask } = ComputeClusterLabels;

const getMockEnvironmentsWithOptionalSupportedCluster = (clusterType?: ComputeClusterType): UseableProjectEnvironmentsDto => ({
  currentlySelectedEnvironment: {
    id: '5e981b92c3427a28af9c9dd2',
    supportedClusters: [],
    v2EnvironmentDetails: {
      latestRevision: 16,
      latestRevisionStatus: 'Failed',
      latestRevisionUrl: '/environments/revisions/5e9829ef23236574390f84ba',
      selectedRevision: 15,
      selectedRevisionUrl: '/environments/revisions/5e981e23c3427a28af9c9e32'
    }
  },
  environments: [
    ...testResults,
    {
      ...testResults[0],
      owner: { ...testResults[0].owner! },
      supportedClusters: R.isNil(clusterType) ? [] : [
        R.cond([
          [R.equals(Spark), R.always([Spark])],
          [R.equals(Ray), R.always([Ray])],
          [R.equals(Dask), R.always([Dask])],
          [R.T, R.always([])]
        ])(clusterType)
      ]
    }
  ]
});

const defaultHardwareTierId = 'small-k8s';
const hwTierExecutionLimit = 6;
const hwts: HardwareTierWithCapacityDto[] = [
  {
    ...hardwareTierWithCapacityDto,
    "hardwareTier": {
      ...hardwareTierWithCapacityDto.hardwareTier,
      "id":defaultHardwareTierId,
      "name":"Small (Kubernetes)",
      "cores":1,
      "coresLimit":1,
      "memory":1,
      "maxSimultaneousExecutions":hwTierExecutionLimit,
      "clusterType":"Kubernetes",
      "gpuConfiguration":{
        "numberOfGpus": 0,
        "gpuKey": "nvidia.com/gpu"
      },
      "runMemoryLimit":{
        "memoryLimitMegabytes":1024
      },
      "isDefault":true,
      "centsPerMinute":0,
      "isFree":false,
      "isAllowedDuringTrial":false,
      "isVisible":true,
      "isGlobal":true,
      "isArchived":false,
      "creationTime":"2019-11-07T08:22:28.300Z",
      "updateTime":"2019-11-07T08:22:28.319Z",
      "nodePool": "default",
      "overprovisioning":{
        "instances":0,
        "schedulingEnabled":false,
        "daysOfWeek":["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"],
        "timezone":"UTC",
        "fromTime":"08:00:00","toTime":"19:00:00"
      },
      "dataPlaneId": "0000000000",
      "metadata": {}
    },
    "capacity":{
      "currentNumberOfExecutors":0,
      "maximumNumberOfExecutors":0,
      "numberOfCurrentlyExecutingRuns":0,
      "numberOfQueuedRuns":0,
      "maximumConcurrentRuns":0,
      "availableCapacityWithoutLaunching":0,
      "maximumAvailableCapacity":0,
      "capacityLevel":"CAN_EXECUTE_WITH_CURRENT_INSTANCES"
    }
  }
];

const appName = 'Domino';
const whiteLabelSettings = { ...adminInterfaceWhitelabelConfigurations, appName };
const formattedPrincipal = { ...formattedPrincipalInitialState };
const storeResolvedMock = { principal: undefined, whiteLabelSettings, formattedPrincipal };

const frozenMockProfile = Object.freeze({
  admin: { getWhiteLabelConfigurations: whiteLabelSettings },
  auth: { getPrincipal: mockPrincipal },
  projects: {
    getUseableEnvironments: getMockEnvironmentsWithOptionalSupportedCluster(),
    getProjectSettings: { ...projectSettingsDto, defaultHardwareTierId },
    listHardwareTiersForProject: hwts
  },
} as MockProfile);

const getMockProfile = (modifiedProfile?: MockProfile) => (Object.freeze({
  ...frozenMockProfile,
  ...modifiedProfile
} as MockProfile));

let mocks: MakeMocksReturn;

const makeMocksWithProfile = (mockProfile: MockProfile) => {
  mocks = makeMocks();
  mocks.loadProfile(mockProfile);
};
const resetCurrentMocks = () => mocks.unmock();

const defaultClusterProperties: DefaultClusterPropertiesType = {
  clusterType: Spark,
  workerCount: 3,
  workerHardwareTierId: { value: defaultHardwareTierId },
  masterHardwareTierId: { value: 'masterHardwareTierId' },
  computeEnvironmentId: 'computeEnvironmentId',
  computeEnvironmentRevisionSpec: 'ActiveRevision',
  workerStorage: { value: 4, unit: 'MB' }
};

const defaultProps: ClusterContentProps = {
  projectId: 'projectId',
  enableSparkClusters: false,
  enableRayClusters: false,
  enableDaskClusters: false,
  projectName: 'projectName',
  ownerName: 'ownerName',
  fetchDefaultClusterSettings: jest.fn(),
  onWorkerCountMaxChange: jest.fn()
};

describe('Compute cluster content component', () => {
  afterAll(resetCurrentMocks);

  it(`should show the spark form when spark properties are supplied and 'sparkClusterMode'
    is not supplied to the component`, async () => {
    makeMocksWithProfile(getMockProfile());
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          defaultClusterProperties={{
            ...defaultClusterProperties,
            workerHardwareTierId: { value: 'workerHardwareTierId' }
          }}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('spark-cluster-form')).toBeTruthy());
  });

  it(`should render cluster content docs info with help link`, async () => {
    makeMocksWithProfile(getMockProfile());
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          defaultClusterProperties={{
            ...defaultClusterProperties,
            workerHardwareTierId: { value: 'workerHardwareTierId' }
          }}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('spark-cluster-form')).toBeTruthy());
    expect(view.getByText('To learn more about Compute Clusters check out the docs.')).toBeTruthy();
    expect(view.getAllByDominoTestId('help_link')[0].getAttribute('href')).toContain('user_guide/8b4418/clusters/');
  });

  it(`should show the spark form when spark properties are supplied and 'sparkClusterMode'
    is 'OnDemand'`, async () => {
    makeMocksWithProfile(getMockProfile());
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          sparkClusterMode="OnDemand"
          defaultClusterProperties={{
            ...defaultClusterProperties,
            workerHardwareTierId: { value: 'workerHardwareTierId' }
          }}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('spark-cluster-form')).toBeTruthy());
  });

  it(`should not show the spark form when spark properties are supplied and 'sparkClusterMode'
    is not 'OnDemand'`, async () => {
    makeMocksWithProfile(getMockProfile());
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          sparkClusterMode="StandAlone"
          defaultClusterProperties={{
            ...defaultClusterProperties,
            workerHardwareTierId: { value: 'workerHardwareTierId' }
          }}
        />
      </Router>
    );
    await waitFor(() => expect(view.queryByDominoTestId('spark-cluster-form')).toBeFalsy());
    await waitFor(() => expect(view.getByDominoTestId('standalone-cluster-settings')).toBeTruthy());
  });

  it('should disable the cluster selection button when supported environments are not available in a project', async () => {
    makeMocksWithProfile(getMockProfile());
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          enableDaskClusters={true}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('selected-cluster-radio-group-option-dask').hasAttribute('disabled')).toBeTruthy())
  });

  it('should call the API given for the prop `fetchDefaultClusterSettings` on selecting a cluster', async () => {
    makeMocksWithProfile(getMockProfile());
    const mockDefaultClusterSettingsAPI = jest.fn();
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          enableRayClusters={true}
          fetchDefaultClusterSettings={mockDefaultClusterSettingsAPI}
        />
      </Router>
    );
    await waitFor(() => expect(view.queryByDominoTestId('wait-spinner')).toBeFalsy());
    await waitFor(() => expect(view.getByDominoTestId('selected-cluster-radio-group-option-spark')).toBeTruthy());
    await userEvent.click(view.getByDominoTestId('selected-cluster-radio-group-option-spark'));
    await waitFor(() => expect(mockDefaultClusterSettingsAPI).toHaveBeenCalled());
  });

  it('should show the cluster defaults from the API response given for the prop `fetchDefaultClusterSettings`', async () => {
    makeMocksWithProfile(getMockProfile());
    const workerCount = 3;
    const getDefaultClusterSettings = () => Promise.resolve(
      R.omit(['workerStorage', 'computeEnvironmentRevisionSpec'], {
        ...defaultClusterProperties,
        workerHardwareTierId: { value: 'workerHardwareTierId' },
        maxUserExecutionSlots: 25
      })
    );

    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          enableRayClusters={true}
          fetchDefaultClusterSettings={getDefaultClusterSettings}
        />
      </Router>
    );
    await waitFor(() => expect(view.queryByDominoTestId('wait-spinner')).toBeFalsy());
    await waitFor(() => expect(view.getByDominoTestId('selected-cluster-radio-group-option-spark')).toBeTruthy());
    await userEvent.click(view.getByDominoTestId('selected-cluster-radio-group-option-spark'));
    await waitFor(() => expect(view.getByDominoTestId('worker-count-input').getAttribute('value')).toEqual(`${workerCount}`));
  });

  it(`should show the max execution limit same as hwtier execution limit, when the selected worker hardware tier has
    simultaneous execution limit`, async () => {
    makeMocksWithProfile(getMockProfile());
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          projectName="projectName"
          ownerName="ownerName"
          sparkClusterMode="OnDemand"
          defaultClusterProperties={defaultClusterProperties}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('quota').textContent).toEqual(`Max: ${hwTierExecutionLimit}`));
  });

  it(`should fix the max execution limit same as hwtier execution limit, when the selected worker hardware tier has
    simultaneous execution limit and the same hwtier is not selected either as master hwtier or for run`, async () => {
    makeMocksWithProfile(getMockProfile());
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          sparkClusterMode="OnDemand"
          defaultClusterProperties={defaultClusterProperties}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('worker-count-input')).toBeTruthy());
    await waitFor(() => expect(
      parseInt(view.getByDominoTestId('worker-count-input').getAttribute('aria-valuemax') as string)
    ).toEqual(hwTierExecutionLimit));
  });

  it(`should fix the max execution limit as hwtier execution limit minus one, when the selected worker hardware tier
    has simultaneous execution limit and the same hwtier is selected for master hwtier but not for run`, async () => {
    makeMocksWithProfile(getMockProfile());
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          sparkClusterMode="OnDemand"
          defaultClusterProperties={{
            ...defaultClusterProperties,
            workerHardwareTierId: { value: defaultHardwareTierId },
            masterHardwareTierId: { value: defaultHardwareTierId }
          }}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('worker-count-input')).toBeTruthy());
    await waitFor(() => expect(
      parseInt(view.getByDominoTestId('worker-count-input').getAttribute('aria-valuemax') as string)
    ).toEqual(hwTierExecutionLimit - 1));
  });

  it(`should fix the max execution limit as hwtier execution limit minus two, when the selected worker hardware tier
    has simultaneous execution limit and the same hwtier is selected for master hwtier and for run`, async () => {
    makeMocksWithProfile(getMockProfile());
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          sparkClusterMode="OnDemand"
          defaultClusterProperties={{
            ...defaultClusterProperties,
            workerHardwareTierId: { value: defaultHardwareTierId },
            masterHardwareTierId: { value: defaultHardwareTierId }
          }}
          runHwTierId={defaultHardwareTierId}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('worker-count-input')).toBeTruthy());
    await waitFor(() => expect(
      parseInt(view.getByDominoTestId('worker-count-input').getAttribute('aria-valuemax') as string)
    ).toEqual(hwTierExecutionLimit - 2));
  });

  it(`should disable the dask cluster button and show tooltip message from admin
    when 'enableDaskClusters' is 'false'`, async () => {
    makeMocksWithProfile(getMockProfile({
      ...frozenMockProfile,
      projects: { getUseableEnvironments: getMockEnvironmentsWithOptionalSupportedCluster(Dask) },
    } as MockProfile));
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          enableRayClusters={true}
          defaultClusterProperties={{
            ...defaultClusterProperties,
            clusterType: Dask,
            workerHardwareTierId: { value: defaultHardwareTierId },
            masterHardwareTierId: { value: defaultHardwareTierId }
          }}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('selected-cluster-radio-group-option-dask')).toBeTruthy());
    await waitFor(() => expect(view.getByDominoTestId('selected-cluster-radio-group-option-dask').hasAttribute('disabled')).toBeTruthy());
    userEvent.hover(view.getByDominoTestId('Dask-tooltip'));
    await waitFor(() => expect(view.baseElement.querySelector('.ant-tooltip-open')).toBeTruthy());
    expect(view.baseElement.querySelector('.ant-tooltip-content')?.textContent).toEqual(getClusterDisabledMessage(true, Dask, appName))
  });

  it(`should disable the dask cluster button with tooltip message for no dask cluster supported environments
    when 'enableDaskClusters' is 'true' and when dask supported environments are NOT available`, async () => {
    makeMocksWithProfile(getMockProfile());
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          enableRayClusters={true}
          enableDaskClusters={true}
          defaultClusterProperties={{
            ...defaultClusterProperties,
            clusterType: Dask,
            workerHardwareTierId: { value: defaultHardwareTierId },
            masterHardwareTierId: { value: defaultHardwareTierId }
          }}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('selected-cluster-radio-group-option-dask')).toBeTruthy());
    await waitFor(() => expect(view.getByDominoTestId('selected-cluster-radio-group-option-dask').hasAttribute('disabled')).toBeTruthy());
    userEvent.hover(view.getByDominoTestId('Dask-tooltip'));
    await waitFor(() => expect(view.baseElement.querySelector('.ant-tooltip-open')).toBeTruthy());
    expect(view.baseElement.querySelector('.ant-tooltip-content')?.textContent).toEqual(getClusterDisabledMessage(false, Dask, appName))
  });

  it(`should NOT disable the dask cluster button when 'enableDaskClusters' is 'true'
    and when dask supported environments are available`, async () => {
    makeMocksWithProfile(getMockProfile({
      ...frozenMockProfile,
      projects: { getUseableEnvironments: getMockEnvironmentsWithOptionalSupportedCluster(Dask) },
    } as MockProfile));
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          enableRayClusters={true}
          enableDaskClusters={true}
          defaultClusterProperties={{
            ...defaultClusterProperties,
            clusterType: Dask,
            workerHardwareTierId: { value: defaultHardwareTierId },
            masterHardwareTierId: { value: defaultHardwareTierId }
          }}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('selected-cluster-radio-group-option-dask')).toBeTruthy());
    await waitFor(() => expect(view.getByDominoTestId('selected-cluster-radio-group-option-dask').hasAttribute('disabled')).toBeFalsy());
  });

  it('should call `fetchDefaultClusterSettings` API when default cluster is not same as selected cluster', async () => {
    makeMocksWithProfile(getMockProfile());
    const mockDefaultClusterSettingsAPI = jest.fn();
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          enableRayClusters={true}
          defaultClusterProperties={defaultClusterProperties}
          fetchDefaultClusterSettings={mockDefaultClusterSettingsAPI}
        />
      </Router>
    );
    await waitFor(() => expect(view.queryByDominoTestId('wait-spinner')).toBeFalsy());
    await waitFor(() => expect(mockDefaultClusterSettingsAPI).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(view.getByDominoTestId('selected-cluster-radio-group-option-ray')).toBeTruthy());
    await userEvent.click(view.getByDominoTestId('selected-cluster-radio-group-option-ray'));
    await waitFor(() => expect(mockDefaultClusterSettingsAPI).toHaveBeenCalledTimes(2));
  });

  it('should not call `fetchDefaultClusterSettings` API when default cluster is not same as selected cluster', async () => {
    makeMocksWithProfile(getMockProfile());
    const mockDefaultClusterSettingsAPI = jest.fn();
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          enableRayClusters={true}
          defaultClusterProperties={defaultClusterProperties}
          fetchDefaultClusterSettings={mockDefaultClusterSettingsAPI}
        />
      </Router>
    );

    await waitFor(() => expect(view.queryByDominoTestId('wait-spinner')).toBeFalsy());
    await waitFor(() => expect(view.getByDominoTestId('selected-cluster-radio-group-option-spark')).toBeTruthy());
    await userEvent.click(view.getByDominoTestId('selected-cluster-radio-group-option-spark'));
    await waitFor(() => expect(mockDefaultClusterSettingsAPI).toHaveBeenCalledTimes(1));
  });
});

describe('Compute cluster content component - worker count tests', () => {
  let localMocks: jest.SpyInstance[];

  const modifiedPrincipalMock: Principal = {
    ...mockPrincipal,
    featureFlags: [ ...mockPrincipal.featureFlags, 'ShortLived.SparkAutoscalingEnabled']
  };
  const modifiedStoreResolvedMock = { ...storeResolvedMock, principal: modifiedPrincipalMock };

  beforeAll(() => {
    if (mocks) {
      mocks.unmock();
    }
    jest.restoreAllMocks();
    const getUseableEnvironments = jest.spyOn(Projects, 'getUseableEnvironments');
    const storeMock = jest.spyOn(useStoreHook, 'default');
    
    getUseableEnvironments.mockImplementation(
      () => Promise.resolve(getMockEnvironmentsWithOptionalSupportedCluster()));
    storeMock.mockImplementation(() => modifiedStoreResolvedMock);
    localMocks = [
      getUseableEnvironments,
      storeMock
    ];
  });

  afterAll(() => {
    localMocks.forEach(mock => mock.mockRestore());
    jest.restoreAllMocks();
  });

  it(`should not let worker count go negative for min worker-count input`, async () => {
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          defaultClusterProperties={{
            ...defaultClusterProperties,
            workerHardwareTierId: { value: 'workerHardwareTierId' }
          }}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('spark-cluster-form')).toBeTruthy());
    const minWorkersInput = view.getByDominoTestId('worker-minSize');
    expect(minWorkersInput.getAttribute('value')).toEqual('3');
    await userEvent.click(minWorkersInput);
    // arrowdown 100 times should make min worker count < 0
    for (let i = 0; i < 100; ++i) { userEvent.keyboard('{arrowdown}') }
    await waitFor(() => expect(Number(minWorkersInput.getAttribute('aria-valuenow'))).toBeGreaterThanOrEqual(0));
  });

  it(`should not let worker count go negative for max worker-count input`, async () => {
    const view = render(
      <Router>
        <ClusterContent
          {...defaultProps}
          enableSparkClusters={true}
          defaultClusterProperties={{
            ...defaultClusterProperties,
            workerHardwareTierId: { value: 'workerHardwareTierId' }
          }}
        />
      </Router>
    );
    await waitFor(() => expect(view.getByDominoTestId('spark-cluster-form')).toBeTruthy());
    await userEvent.click(view.getByDominoTestId('enable-worker-autoscale')); // enable worker-maxSize input
    const maxWorkersInput = view.getByDominoTestId('worker-maxSize');
    expect(maxWorkersInput.hasAttribute('disabled')).toEqual(false);
    expect(maxWorkersInput.getAttribute('value')).toEqual('4');
    await userEvent.click(maxWorkersInput);
    // arrowdown 100 times should make max worker count < 0
    for (let i = 0; i < 100; ++i) { userEvent.keyboard('{arrowdown}') }
    await waitFor(() => expect(Number(maxWorkersInput.getAttribute('aria-valuenow'))).toBeGreaterThanOrEqual(0));
  });
})

describe(`computeQuota util function`, () => {
  it(`should return 23 on calling computeQuota(user=23, workerHwTier=60)`, () => {
    expect(computeQuota(23, 60)).toEqual(23);
  });
  it(`should return 23 on calling computeQuota(user=23, workerHwTier=undefined)`, () => {
    expect(computeQuota(23, undefined)).toEqual(23);
  });
  it(`should return 60 on calling computeQuota(user=undefined, workerHwTier=60)`, () => {
    expect(computeQuota(undefined, 60)).toEqual(60);
  });
  it(`should return 40 on calling computeQuota(user=undefined, workerHwTier=undefined)`, () => {
    expect(computeQuota(undefined, undefined)).toEqual(40);
  });
});
