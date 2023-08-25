import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {
  DominoAdminInterfaceComputeNodeInfrastructureInfo as ComputeNodeInfrastructureInfo
} from '@domino/api/dist/types';
import ComputeGridInfrastructureTable from '../src/admin-executions/src/ComputeGridInfrastructureTable';
import fetchMock from 'fetch-mock';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Admin/ComputeGridInfrastructureTable'), module);

const mockInfrastructures = [
  {
    name: "test1",
    nodePool: "pool1",
    instanceType: "instance1",
    isBuildNode: true,
  },
  {
    name: "test1",
    nodePool: "pool1",
    instanceType: "instance1",
    isBuildNode: true,
  }
] as ComputeNodeInfrastructureInfo[];

stories.add('the whole thing (w/ http mock)', () => {
  fetchMock
    .restore()
    .get(
      `/v4/admin/infrastructure`,
      mockInfrastructures
    );
  return <ComputeGridInfrastructureTable/>;
});

stories.add('empty state', () => {
  fetchMock
    .restore()
    .get(
      `/v4/admin/infrastructure`,
      []
    );
  return <ComputeGridInfrastructureTable/>;
});
