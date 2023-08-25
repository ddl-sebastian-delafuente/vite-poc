import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ComputeGridHardwareTierTable, { HardwareTierRow } from '../src/admin-hardwareTier/src/ComputeGridHardwareTierTable';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Admin/ComputeGridHardwareTierTable'), module);

const mockHardwareTiers = [
  {
    id: "1",
    name: "test1",
    resources: {
      cores: 0.1,
      coresLimit: 0.1,
      memory: 0.1,
      memoryLimit: 0.1
    },
    clusterType: "Kubernetes",
    gpuConfiguration: {
      numberOfGpus: 1,
      gpuKey: "nvidia.com/gpu"
    },
    isDefault: true,
    centsPerMinute: 0.1,
    isFree: false,
    isAllowedDuringTrial: true,
    isVisible: true,
    isGlobal: true,
    isArchived: true,
    nodePool: "default-gpu",
    overprovisioning: {
      instances: 2,
      schedulingEnabled: false,
      daysOfWeek: ['MONDAY' , 'TUESDAY'],
      timezone: "EST",
      fromTime: "08:00:00",
      toTime: "19:00:00"
    },
    dataPlaneId: "0000000000"
  },
  {
    id: "2",
    name: "test2",
    resources: {
      cores: 0.25,
      coresLimit: 0.25,
      memory: 0.25,
      memoryLimit: 0.25
    },
    clusterType: "ClassicAWS",
    gpuConfiguration: {
      numberOfGpus: 1,
      gpuKey: "nvidia.com/gpu"
    },
    isDefault: false,
    centsPerMinute: 0.2,
    isFree: true,
    isAllowedDuringTrial: false,
    isVisible: false,
    isGlobal: false,
    nodePool: "default",
    overprovisioning: {
      instances: 2,
      schedulingEnabled: false,
      daysOfWeek: ['MONDAY' , 'TUESDAY'],
      timezone: "EST",
      fromTime: "08:00:00",
      toTime: "19:00:00"
    },
    dataPlaneId: "0000000000"
  }
] as HardwareTierRow[];

const mockCsrfToken = "aaabbb"

stories.add('Populated table where canManage === true', () => {
  return (<ComputeGridHardwareTierTable hardwareTierRows={mockHardwareTiers} canManage={true} csrfToken={mockCsrfToken}/>);
});

stories.add('Populated table where canManage === false', () => {
  return (<ComputeGridHardwareTierTable hardwareTierRows={mockHardwareTiers} canManage={false} csrfToken={mockCsrfToken}/>);
});

stories.add('Populated table where canManage === true && isDominoHosted === true', () => {
  return (<ComputeGridHardwareTierTable hardwareTierRows={mockHardwareTiers} canManage={true} isDominoHosted={true} csrfToken={mockCsrfToken}/>);
});

stories.add('empty state where canManage === true', () => {
  return (<ComputeGridHardwareTierTable hardwareTierRows={[]} canManage={true} csrfToken={mockCsrfToken}/>);
});

stories.add('empty state where canManage === false', () => {
  return (<ComputeGridHardwareTierTable hardwareTierRows={[]} canManage={false} csrfToken={mockCsrfToken}/>);
});
