import { DominoServerProjectsApiProjectGatewayOverview } from '@domino/api/dist/types';
import fetchMock from 'fetch-mock';
import { MemoryRouter as Router } from 'react-router-dom';
import * as React from 'react';
import {
  DominoProjectsApiUseableProjectEnvironmentsDto as Environment,
} from '@domino/api/dist/types';
import { testResults } from '../../components/__tests__/computeEnvironmentData';
import { ComputeClusterLabels } from '../../clusters/types';
import { AccessControlProvider } from '@domino/ui/dist/core/AccessControlProvider';
import { getDevStoryPath } from '../../utils/storybookUtil';
import { hardwareTierData, principal } from '../../utils/testUtil';
import LauncherComponent from '../Launcher';

const selectedEnvironment = testResults[2];

const environment: Environment = {
  environments: testResults,
  currentlySelectedEnvironment: {
    id: selectedEnvironment.id,
    supportedClusters: [ComputeClusterLabels.Spark],
  },
};

export default {
  title: getDevStoryPath('Develop/Restartable Workspaces'),
  component: LauncherComponent,
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateProps {}

const Template = (args: TemplateProps) => {
  const project: DominoServerProjectsApiProjectGatewayOverview = {
    allowedOperations: [
      'Run',
    ],
    description: 'Test Description',
    environmentName: 'Test Environment Name',
    hardwareTierId: 'test-hardware-tier-id',
    hardwareTierName: 'Test Hardware Tier Name',
    id: 'test-project-id',
    owner: {
      userName: 'test-project-owner'
    },
    name: 'Test Project Name',
    numComments: 0,
    requestingUserRole: 'Admin',
    runsCountByType: [],
    stageId: 'test-stage-id',
    status: {
      isBlocked: false,
      status: 'active'
    },
    tags: [],
    totalRunTime: '',
    updatedAt: '',
    visibility: 'Private',
  };

  React.useEffect(() => {
    const envInstance = { ...environment };

    envInstance.environments[2].supportedClusters = [ComputeClusterLabels.Spark];

    fetchMock.restore()
      .get(
        `glob:/v4/projects/*/hardwareTiers`,
        hardwareTierData,
      )
      .get(
        `glob:/v4/projects/*/useableEnvironments`,
        envInstance,
      )
      .get('glob:/v4/projects/*/settings', {
        "defaultEnvironmentId":"62d5f334c971346b3fe12fb8",
        "defaultEnvironmentRevisionSpec":"ActiveRevision",
        defaultHardwareTierId: hardwareTierData[0].hardwareTier.id,
        "sparkClusterMode":"OnDemand",
        "defaultVolumeSizeGiB":10,
        "maxVolumeSizeGiB":200,
        "minVolumeSizeGiB":4,
        "recommendedVolumeSizeGiB":4
      })
      .get('glob:/v4/projects/*/environment/*', {
        id: 'test-id',
        archived: false,
        name: 'Test',
        visibility: 'Global',
        supportedClusters: ['Spark'],
      })
      .get('glob:/v4/workspaces/project/*/environment/*/availableTools', {
        workspaceTools: []
      })
      .get('/v4/users/isDataAnalystUser', false)
      .get('/v4/auth/principal', principal)
  }, []);

  return (
    <AccessControlProvider>
      <Router>
        <LauncherComponent
          {...args}
          canUseDatasets
          currentUserId="test-user-id"
          currentUserName="UserName"
          enableDaskClusters
          enableRayClusters
          enableSparkClusters
          launchMode="create"
          ownerName="OwnerName"
          project={project}
          projectId="test-project-id"
          projectName="Test Project"
        />
      </Router>
    </AccessControlProvider>
  );
};


export const Launcher = Template.bind({});
