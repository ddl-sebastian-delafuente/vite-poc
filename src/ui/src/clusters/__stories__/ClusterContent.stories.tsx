import * as React from 'react';
import * as R from 'ramda';
import { BrowserRouter as Router } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import { FetchMockStatic } from 'fetch-mock';
import {
  ComputeClusterType,
  DominoComputeclusterApiDefaultComputeClusterSettings as DefaultComputeClusterProperties,
  DominoNucleusProjectProjectSettingsDto as ProjectSettings,
  DominoProjectsApiProjectEnvironmentDto as ComputeEnvironment,
  DominoProjectsApiUseableProjectEnvironmentsDto as Environment,
  DominoWorkspaceApiComputeClusterConfigDto as ComputeClusterConfigDto,
  DominoWorkspaceApiWorkspaceClusterConfigDto as WorkspaceClusterConfigDto
} from '@domino/api/dist/types';
import ClusterContent from '../ClusterContent';
import { ComputeClusterLabels } from '../types';
import { testResults } from '../../../src/components/__tests__/computeEnvironmentData';
import { hardwareTierData, principal, project } from '../../../src/utils/testUtil';
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '../../../src/utils/storybookUtil';

type ClusterProperties = ComputeClusterConfigDto | WorkspaceClusterConfigDto | undefined;

const { Spark, Ray, Dask } = ComputeClusterLabels;
const selectedEnvironment = testResults[2];

export const environment: Environment = {
  environments: [
    ...testResults,
    { ...testResults[0], supportedClusters: [Spark] },
    { ...testResults[0], supportedClusters: [Ray] },
    { ...testResults[0], supportedClusters: [Dask] }
  ],
  currentlySelectedEnvironment: {
    id: selectedEnvironment.id,
    supportedClusters: [Spark, Ray, Dask],
  },
};

const projectId = project.id;
const defaultHardwareTierId = 'small-k8s';
const mockProjectSettings: ProjectSettings = {
  defaultEnvironmentId: 'defaultEnvironmentId',
  defaultEnvironmentRevisionSpec: 'ActiveRevision',
  defaultHardwareTierId: defaultHardwareTierId,
  sparkClusterMode: 'OnDemand',
  defaultVolumeSizeGiB: 2,
  maxVolumeSizeGiB: 3,
  minVolumeSizeGiB: 1,
  recommendedVolumeSizeGiB: 2,
};

const handleOnBeforeRender = () => {
  testResults.reduce<FetchMockStatic>(
    (mocker: FetchMockStatic, e: ComputeEnvironment) =>
      mocker.get(`/v4/projects/5e2159339f22d811d01fdd2e/environment/${e.id}`, e),
    fetchMock.restore()
  )
  .get(`/v4/projects/5e2159339f22d811d01fdd2e/hardwareTiers`, hardwareTierData)
  .get(`/v4/projects/5e2159339f22d811d01fdd2e/useableEnvironments`, environment)
  .get(`/v4/projects/5e2159339f22d811d01fdd2e/settings`, mockProjectSettings)
  .get(`/v4/auth/principal`, principal);
};

const clusterProperties: ClusterProperties = {
  clusterType: Spark,
  workerCount: 3,
  workerHardwareTierId: { value: defaultHardwareTierId },
  masterHardwareTierId: { value: 'masterHardwareTierId' },
  computeEnvironmentId: 'computeEnvironmentId',
  computeEnvironmentRevisionSpec: 'ActiveRevision',
  workerStorage: { value: 4, unit: 'MB' }
};

const defaultClusterProperties: DefaultComputeClusterProperties = {
  ...R.omit(['computeEnvironmentRevisionSpec', 'workerStorage'], clusterProperties),
  maxUserExecutionSlots: 25
};

const fetchDefaultClusterSettings = (clusterType: string) =>
  Promise.resolve({ ...defaultClusterProperties, clusterType: clusterType as ComputeClusterType });
// eslint-disable-next-line no-console
const onWorkerCountMaxChange = (maxValue?: number) => (console.log(maxValue));

const defaultProps = {
  projectId,
  enableSparkClusters: false,
  enableRayClusters: false,
  enableDaskClusters: false,
  projectName: 'projectName',
  ownerName: 'ownerName',
  defaultClusterProperties: clusterProperties,
  fetchDefaultClusterSettings,
  onWorkerCountMaxChange
};

const divStyleProperties: React.CSSProperties = {
  width: '50%',
  margin: '5px auto',
  padding: '15px',
  borderRadius: '5px',
  border: '1px solid rgba(0, 0, 0, .2)'
};

interface RouterWrapperProps {
  children?: React.ReactNode;
}
const RouterWrapper: React.FC<RouterWrapperProps> = props => (
  <Router>
    {/* @ts-ignore */}
    <div style={divStyleProperties}>
      {props.children}
    </div>
  </Router>
);

const stories = [
  {
    title: 'No clusters attached',
    onBeforeRender: () => handleOnBeforeRender,
    view: (
      <ClusterContent {...defaultProps} defaultClusterProperties={undefined}/>
    )
  },
  {
    title: 'Spark cluster attached',
    view: (
      <ClusterContent {...defaultProps} enableSparkClusters={true}/>
    )
  },
  {
    title: 'Ray cluster attached',
    view: (
      <ClusterContent
        {...defaultProps}
        enableRayClusters={true}
        defaultClusterProperties={{...clusterProperties, clusterType: Ray}}
      />
    )
  },
  {
    title: 'Dask cluster attached',
    view: (
      <ClusterContent
        {...defaultProps}
        enableDaskClusters={true}
        defaultClusterProperties={{...clusterProperties, clusterType: Dask}}
      />
    )
  },
  {
    title: 'All clusters attached',
    view: (
      <ClusterContent
        {...defaultProps}
        enableSparkClusters={true}
        enableRayClusters={true}
        enableDaskClusters={true}
      />
    )
  },
  {
    title: 'Standalone Spark Cluster Mode',
    view: (
      <ClusterContent
        {...defaultProps}
        enableSparkClusters={true}
        sparkClusterMode="Standalone"
      />
    )
  },
  {
    title: 'OnDemand Spark Cluster Mode',
    view: (
      <ClusterContent
        {...defaultProps}
        enableSparkClusters={true}
        sparkClusterMode="OnDemand"
      />
    )
  },
  {
    title: 'Local Spark Cluster Mode',
    view: (
      <ClusterContent
        {...defaultProps}
        enableSparkClusters={true}
        sparkClusterMode="Local"
      />
    )
  },
  {
    title: 'Yarn Spark Cluster Mode',
    view: (
      <ClusterContent
        {...defaultProps}
        enableSparkClusters={true}
        sparkClusterMode="Yarn"
      />
    )
  }
];

const storiesOfModule = storiesOf(getDevStoryPath('Develop/Workspaces/Cluster'), module);

stories.forEach((story) => {
  storiesOfModule.add(story.title, () => {
    handleOnBeforeRender();
    return (
      <RouterWrapper>
        {story.view}
      </RouterWrapper>
    );
  });
});
