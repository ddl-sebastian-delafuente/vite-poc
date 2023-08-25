import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {
  DominoProjectsApiUseableProjectEnvironmentsDto as Environment,
} from '@domino/api/dist/types';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import ComputeEnvironmentSelector from '@domino/ui/dist/components/ComputeEnvironmentSelector';
import { testResults } from '@domino/ui/dist/components/__tests__/computeEnvironmentData';
import { Wrapper, selectHandler } from './ComputeEnvironmentDropdown.stories';
import { getDevStoryPath } from '../src/utils/storybookUtil';

// Constants
const selectedEnvironment = testResults[2];
export const environment: Environment = {
  environments: testResults,
  currentlySelectedEnvironment: {
    id: selectedEnvironment.id,
    supportedClusters: [ComputeClusterLabels.Spark],
  },
};
export const emptyEnvironment: Environment = {
  environments: [],
  currentlySelectedEnvironment: {
    id: '',
    supportedClusters: [ComputeClusterLabels.Spark],
  }
};
export const cannotEditEnvironment: Environment = {
  environments: testResults,
  currentlySelectedEnvironment: {
    id: selectedEnvironment.id,
    supportedClusters: [],
    v2EnvironmentDetails: {
      latestRevision: 3,
      latestRevisionStatus: 'queued',
      latestRevisionUrl: '/revision/o',
      selectedRevision: 3,
      selectedRevisionUrl: 'revision'
    }
  }
};
export const noActiveRevisionEnvironment: Environment = {
  environments: testResults,
  currentlySelectedEnvironment: {
    supportedClusters: [],
    id: selectedEnvironment.id,
    v2EnvironmentDetails: {
      latestRevision: 3,
      latestRevisionStatus: 'queued',
      latestRevisionUrl: '/revision/o',
      selectedRevision: 0,
      selectedRevisionUrl: 'revision'
    }
  }
};
export const helpBlockEnvironment: Environment = {
  environments: testResults,
  currentlySelectedEnvironment: {
    supportedClusters: [],
    id: selectedEnvironment.id,
    v2EnvironmentDetails: {
      latestRevision: 3,
      latestRevisionStatus: 'queued',
      latestRevisionUrl: '/revision/o',
      selectedRevision: 2,
      selectedRevisionUrl: 'revision'
    }
  }
};


// Stories
const stories = storiesOf(getDevStoryPath('Develop/Workspaces/ComputeEnvironmentSelector'), module);
stories.add('default', () => (
  <Wrapper>
    <ComputeEnvironmentSelector projectEnvironments={environment} canSelectEnvironment />
  </Wrapper>
));
stories.add('no data', () => (
  <Wrapper>
    <ComputeEnvironmentSelector projectEnvironments={emptyEnvironment} />
  </Wrapper>
));
stories.add('cannot edit', () => (
  <Wrapper>
    <ComputeEnvironmentSelector
      projectEnvironments={cannotEditEnvironment}
      canEditEnvironments={false}
      canSelectEnvironment
    />
  </Wrapper>
));
stories.add('with selected value and handler', () => (
  <Wrapper>
    <ComputeEnvironmentSelector
      projectEnvironments={environment}
      onChangeEnvironment={selectHandler}
      canSelectEnvironment
    />
  </Wrapper>
));
stories.add('with selected value and handler but cannot edit', () => (
  <Wrapper>
    <ComputeEnvironmentSelector
      projectEnvironments={environment}
      onChangeEnvironment={selectHandler}
      canEditEnvironments={false}
      canSelectEnvironment
    />
  </Wrapper>
));
stories.add('help block revision mismatch', () => (
  <Wrapper>
    <ComputeEnvironmentSelector projectEnvironments={helpBlockEnvironment} canSelectEnvironment />
  </Wrapper>
));
stories.add('help block no active revision', () => (
  <Wrapper>
    <ComputeEnvironmentSelector projectEnvironments={noActiveRevisionEnvironment} canSelectEnvironment />
  </Wrapper>
));
