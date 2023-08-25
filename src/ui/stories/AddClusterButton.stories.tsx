import * as React from 'react';
import { values } from 'ramda';
import { storiesOf } from '@storybook/react';
import fetchMock from 'fetch-mock';
import { BrowserRouter as Router } from 'react-router-dom';
import AddClusterButton from '../src/components/AddClusterButton';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const mockOnDemandSparkProjectSettings = {
  defaultEnvironmentId: 'testEnvId',
  defaultHardwareTierId: 'testHwId',
  sparkClusterMode: 'OnDemand'
}

const mockLocalSparkProjectSettings = {
  defaultEnvironmentId: 'testEnvId',
  defaultHardwareTierId: 'testHwId',
  sparkClusterMode: 'Local'
}

export const fetchMockWithOnDemandSpark = () => fetchMock.restore().get(
  `/v4/projects/testProjectID/settings`,
  mockOnDemandSparkProjectSettings,
)

export const fetchMockWithLocalSpark = () => fetchMock.restore().get(
  `/v4/projects/testProjectID/settings`,
  mockLocalSparkProjectSettings,
)

export const stories = {
  'AddClusterButton without Config': {
    name: 'without Config',
    component: () => {
      fetchMockWithOnDemandSpark();
      return (
        <Router>
          <AddClusterButton
            projectId={'testProjectID'}
            // eslint-disable-next-line
            onClick={() => console.log('on Click')}
            // eslint-disable-next-line
            onEditCluster={() => console.log('on Edit Click')}
            // eslint-disable-next-line
            onDeleteCluster={() => console.log('on Delete Click')}
            clusterAdded={false}
            workerCount={0}
          />
        </Router>
      )
    }
  },
  'AddClusterButton with Config': {
    name: 'with Config',
    component: () => {
      fetchMockWithOnDemandSpark();
      return (
        <Router>
          <AddClusterButton
            projectId={'testProjectID'}
            // eslint-disable-next-line
            onClick={() => console.log('on Click')}
            // eslint-disable-next-line
            onEditCluster={() => console.log('on Edit Click')}
            // eslint-disable-next-line
            onDeleteCluster={() => console.log('on Delete Click')}
            clusterAdded={true}
            workerCount={5}
          />
        </Router>
      );
    }
  },
  'AddClusterButton with local Spark Cluster': {
    name: 'without Config and with local spark cluster',
    component: () => {
      fetchMockWithLocalSpark();
      return (
        <Router>
          <AddClusterButton
            projectId={'testProjectID'}
            // eslint-disable-next-line
            onClick={() => console.log('on Click')}
            // eslint-disable-next-line
            onEditCluster={() => console.log('on Edit Click')}
            // eslint-disable-next-line
            onDeleteCluster={() => console.log('on Delete Click')}
            clusterAdded={false}
            workerCount={2}
          />
        </Router>
      );
    }
  }
}

const storiesOfModule = storiesOf(getDevStoryPath('Develop/Workspaces/AddClusterButton'), module);

values(stories).forEach(story => storiesOfModule
  .add(story.name, () => (<>{story.component()}</>)));
