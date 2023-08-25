import fetchMock from 'fetch-mock';
import * as React from 'react';

import { AccessControlProvider } from '@domino/ui/dist/core/AccessControlProvider';
import { getAdminPrincipalResponse } from '../../data/data-sources/testUtil';
import { getDevStoryPath } from '../../utils/storybookUtil';
import HardwareTierSelectComponent, { HardwareTierWithDataFetchDataProps } from '../HardwareTierSelect';

export default {
  title: getDevStoryPath('Components'),
  component: HardwareTierSelectComponent,
  actions: { argTypesRegex: '^(on|set).*' },
  argTypes: {
    disabled: { control: 'boolean'},
    hasDefaultHardwareTier: { control: 'boolean'},
    isDataAnalyst: { control: 'boolean'},
  },
  args: {
    disabled: false,
    hasDefaultHardwareTier: false,
    isDataAnalyst: false,
    projectId: 'test-projectid'
  }
};

interface TemplateProps extends HardwareTierWithDataFetchDataProps {
  hasDefaultHardwareTier: boolean;
  isDataAnalyst: boolean;
}

const hardwareTiers = [
  {
    hardwareTier: {
      id: 'small-k8s',
      name: 'Small',
      cores: 1,
      coresLimit: 1,
      memory: 4,
      allowSharedMemoryToExceedDefault: false,
      clusterType: 'Kubernetes',
      gpuConfiguration: { numberOfGpus: 0, gpuKey: 'nvidia.com/gpu' },
      runMemoryLimit: { memoryLimitMegabytes: 4096 },
      isDefault: true,
      centsPerMinute: 0,
      isFree: false,
      isAllowedDuringTrial: false,
      isVisible: true,
      isGlobal: true,
      isArchived: false,
      creationTime: '2022-05-31T20:28:27Z',
      updateTime: '2022-05-31T20:28:27Z',
      nodePool: 'default',
      computeClusterRestrictions: {
        restrictToSpark: false,
        restrictToRay: false,
        restrictToDask: false,
        restrictToMpi: false
      },
      maxSimultaneousExecutions: null,
      overprovisioning: {
        instances: 0,
        schedulingEnabled: false,
        daysOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        timezone: 'UTC',
        fromTime: '08:00:00',
        toTime: '19:00:00'
      },
      podCustomization: {
        additionalRequests: {},
        additionalLimits: {},
        additionalAnnotations: {},
        additionalLabels: {},
        hugepages: {},
        capabilities: []
      },
      dataPlaneId: null,
      metadata: {}
    },
    capacity: {
      currentNumberOfExecutors: 0,
      maximumNumberOfExecutors: 0,
      numberOfCurrentlyExecutingRuns: 0,
      numberOfQueuedRuns: 0,
      maximumConcurrentRuns: 0,
      availableCapacityWithoutLaunching: 0,
      maximumAvailableCapacity: 0,
      capacityLevel: 'CAN_EXECUTE_WITH_CURRENT_INSTANCES'
    },
    dataPlane: { id: '000000000000000000000000', name: '', namespace: 'rtomdev17367-compute', isLocal: true }
  },
  {
    hardwareTier: {
      id: 'medium-k8s',
      name: 'Medium',
      cores: 4,
      coresLimit: 4,
      memory: 15,
      allowSharedMemoryToExceedDefault: false,
      clusterType: 'Kubernetes',
      gpuConfiguration: { numberOfGpus: 0, gpuKey: 'nvidia.com/gpu' },
      runMemoryLimit: { memoryLimitMegabytes: 15360 },
      isDefault: false,
      centsPerMinute: 0,
      isFree: false,
      isAllowedDuringTrial: false,
      isVisible: true,
      isGlobal: true,
      isArchived: false,
      creationTime: '2022-05-31T20:28:27Z',
      updateTime: '2022-05-31T20:28:27Z',
      nodePool: 'default',
      computeClusterRestrictions: {
        restrictToSpark: false,
        restrictToRay: false,
        restrictToDask: false,
        restrictToMpi: false
      },
      maxSimultaneousExecutions: null,
      overprovisioning: {
        instances: 0,
        schedulingEnabled: false,
        daysOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        timezone: 'UTC',
        fromTime: '08:00:00',
        toTime: '19:00:00'
      },
      podCustomization: {
        additionalRequests: {},
        additionalLimits: {},
        additionalAnnotations: {},
        additionalLabels: {},
        hugepages: {},
        capabilities: []
      },
      dataPlaneId: null,
      metadata: {}
    },
    capacity: {
      currentNumberOfExecutors: 0,
      maximumNumberOfExecutors: 0,
      numberOfCurrentlyExecutingRuns: 0,
      numberOfQueuedRuns: 0,
      maximumConcurrentRuns: 0,
      availableCapacityWithoutLaunching: 0,
      maximumAvailableCapacity: 0,
      capacityLevel: 'CAN_EXECUTE_WITH_CURRENT_INSTANCES'
    },
    dataPlane: { id: '000000000000000000000000', name: '', namespace: 'rtomdev17367-compute', isLocal: true }
  },
  {
    hardwareTier: {
      id: 'large-k8s',
      name: 'Large',
      cores: 6,
      coresLimit: 6,
      memory: 27,
      allowSharedMemoryToExceedDefault: false,
      clusterType: 'Kubernetes',
      gpuConfiguration: { numberOfGpus: 0, gpuKey: 'nvidia.com/gpu' },
      runMemoryLimit: { memoryLimitMegabytes: 27648 },
      isDefault: false,
      centsPerMinute: 0,
      isFree: false,
      isAllowedDuringTrial: false,
      isVisible: true,
      isGlobal: true,
      isArchived: false,
      creationTime: '2022-05-31T20:28:27Z',
      updateTime: '2022-05-31T20:28:27Z',
      nodePool: 'default',
      computeClusterRestrictions: {
        restrictToSpark: false,
        restrictToRay: false,
        restrictToDask: false,
        restrictToMpi: false
      },
      maxSimultaneousExecutions: null,
      overprovisioning: {
        instances: 0,
        schedulingEnabled: false,
        daysOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        timezone: 'UTC',
        fromTime: '08:00:00',
        toTime: '19:00:00'
      },
      podCustomization: {
        additionalRequests: {},
        additionalLimits: {},
        additionalAnnotations: {},
        additionalLabels: {},
        hugepages: {},
        capabilities: []
      },
      dataPlaneId: null,
      metadata: {}
    },
    capacity: {
      currentNumberOfExecutors: 0,
      maximumNumberOfExecutors: 0,
      numberOfCurrentlyExecutingRuns: 0,
      numberOfQueuedRuns: 0,
      maximumConcurrentRuns: 0,
      availableCapacityWithoutLaunching: 0,
      maximumAvailableCapacity: 0,
      capacityLevel: 'REQUIRES_LAUNCHING_INSTANCE'
    },
    dataPlane: { id: '000000000000000000000000', name: '', namespace: 'rtomdev17367-compute', isLocal: true }
  },
  {
    hardwareTier: {
      id: 'gpu-k8s',
      name: 'GPU',
      cores: 6,
      coresLimit: 6,
      memory: 45,
      allowSharedMemoryToExceedDefault: false,
      clusterType: 'Kubernetes',
      gpuConfiguration: { numberOfGpus: 1, gpuKey: 'nvidia.com/gpu' },
      runMemoryLimit: { memoryLimitMegabytes: 46080 },
      isDefault: false,
      centsPerMinute: 0,
      isFree: false,
      isAllowedDuringTrial: false,
      isVisible: true,
      isGlobal: true,
      isArchived: false,
      creationTime: '2022-05-31T20:28:27Z',
      updateTime: '2022-05-31T20:28:27Z',
      nodePool: 'default-gpu',
      computeClusterRestrictions: {
        restrictToSpark: false,
        restrictToRay: false,
        restrictToDask: false,
        restrictToMpi: false
      },
      maxSimultaneousExecutions: null,
      overprovisioning: {
        instances: 0,
        schedulingEnabled: false,
        daysOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        timezone: 'UTC',
        fromTime: '08:00:00',
        toTime: '19:00:00'
      },
      podCustomization: {
        additionalRequests: {},
        additionalLimits: {},
        additionalAnnotations: {},
        additionalLabels: {},
        hugepages: {},
        capabilities: []
      },
      dataPlaneId: null,
      metadata: {}
    },
    capacity: {
      currentNumberOfExecutors: 0,
      maximumNumberOfExecutors: 0,
      numberOfCurrentlyExecutingRuns: 0,
      numberOfQueuedRuns: 0,
      maximumConcurrentRuns: 0,
      availableCapacityWithoutLaunching: 0,
      maximumAvailableCapacity: 0,
      capacityLevel: 'REQUIRES_LAUNCHING_INSTANCE'
    },
    dataPlane: { id: '000000000000000000000000', name: '', namespace: 'rtomdev17367-compute', isLocal: true }
  },
  {
    hardwareTier: {
      id: 'gpu-small-k8s',
      name: 'GPU (small)',
      cores: 2,
      coresLimit: 2,
      memory: 10,
      allowSharedMemoryToExceedDefault: false,
      clusterType: 'Kubernetes',
      gpuConfiguration: { numberOfGpus: 1, gpuKey: 'nvidia.com/gpu' },
      runMemoryLimit: { memoryLimitMegabytes: 10240 },
      isDefault: false,
      centsPerMinute: 0,
      isFree: false,
      isAllowedDuringTrial: false,
      isVisible: true,
      isGlobal: true,
      isArchived: false,
      creationTime: '2022-05-31T20:28:28Z',
      updateTime: '2022-05-31T20:28:28Z',
      nodePool: 'default-gpu',
      computeClusterRestrictions: {
        restrictToSpark: false,
        restrictToRay: false,
        restrictToDask: false,
        restrictToMpi: false
      },
      maxSimultaneousExecutions: null,
      overprovisioning: {
        instances: 0,
        schedulingEnabled: false,
        daysOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        timezone: 'UTC',
        fromTime: '08:00:00',
        toTime: '19:00:00'
      },
      podCustomization: {
        additionalRequests: {},
        additionalLimits: {},
        additionalAnnotations: {},
        additionalLabels: {},
        hugepages: {},
        capabilities: []
      },
      dataPlaneId: null,
      metadata: {}
    },
    capacity: {
      currentNumberOfExecutors: 0,
      maximumNumberOfExecutors: 0,
      numberOfCurrentlyExecutingRuns: 0,
      numberOfQueuedRuns: 0,
      maximumConcurrentRuns: 0,
      availableCapacityWithoutLaunching: 0,
      maximumAvailableCapacity: 0,
      capacityLevel: 'REQUIRES_LAUNCHING_INSTANCE'
    },
    dataPlane: { id: '000000000000000000000000', name: '', namespace: 'rtomdev17367-compute', isLocal: true }
  }
];

const projectSettings = {
  defaultEnvironmentId: '62967ad6fc398817b871f6d2',
  defaultEnvironmentRevisionSpec: 'ActiveRevision',
  defaultHardwareTierId: 'large-k8s',
  sparkClusterMode: 'OnDemand',
  defaultVolumeSizeGiB: 10,
  maxVolumeSizeGiB: 200,
  minVolumeSizeGiB: 4,
  recommendedVolumeSizeGiB: 10
};

const getHardwareTiers = ({
  hasDefaultHardwareTier,
  isDataAnalyst
}: Pick<TemplateProps, 'hasDefaultHardwareTier' | 'isDataAnalyst'>) => {
  if (isDataAnalyst && !hasDefaultHardwareTier) {
    return [];
  }

  if (isDataAnalyst) {
    return hardwareTiers.slice(0, 1);
  }

  return hardwareTiers;
};

const Template = ({ hasDefaultHardwareTier, isDataAnalyst, ...rest }: TemplateProps) => {
  const [reload, setReload] = React.useState<boolean>(false);
  React.useEffect(() => {
    fetchMock
      .restore()
      .get('glob:/v4/projects/*/settings', projectSettings)
      .get('/v4/auth/principal', getAdminPrincipalResponse(false))
      .get('/v4/users/isDataAnalystUser', isDataAnalyst)
      .get('/v4/projects/test-projectid/hardwareTiers', getHardwareTiers({ isDataAnalyst, hasDefaultHardwareTier }));

    setReload(true);
  }, [isDataAnalyst, hasDefaultHardwareTier]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload])

  return (
    <AccessControlProvider>
      {reload ? null : <HardwareTierSelectComponent {...rest} />}
    </AccessControlProvider>
  );
};

export const HardwareTierSelect = Template.bind({});
