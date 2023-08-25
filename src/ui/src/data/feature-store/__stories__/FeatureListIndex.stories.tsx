import { 
  addFeatureViewToProject,
  getCredentialConfigs,
  getFeatureStore,
  getFeatureViews,
  getFeatureViewsByProjectAndUser,
  getOfflineStoreConfigs,
  getProjectsForFeatureView,
} from '@domino/mocks/dist/mock-stories/Featurestore';
import { search } from '@domino/mocks/dist/mock-stories/Gateway';
import {
  getJob,
  startJob
} from '@domino/mocks/dist/mock-stories/Jobs';
import { 
  listUserEnvironmentVariables,
  setUserEnvironmentVariables,
} from '@domino/mocks/dist/mock-stories/Users';
import { makeSelectDropdownFromMapping } from '@domino/mocks/dist/storybook.utils';
import fetchMock from 'fetch-mock';
import { MemoryRouter as Router } from 'react-router-dom';
import * as React from 'react';

import { 
  FeatureStoreSyncStatus,
  OfflineStoreType,
  OnlineStoreType,
} from '../../../proxied-api/types';
import { getDevStoryPath } from '../../../utils/storybookUtil';
import { 
  DisplayMode,
  FeatureListIndex as FeatureListIndexComponent, 
  FeatureListIndexProps,
} from '../FeatureListIndex';

export default {
  title: getDevStoryPath('Develop/Data/Feature Store'),
  component: FeatureListIndexComponent,
  argTypes: {
    displayMode: makeSelectDropdownFromMapping(DisplayMode),
    offlineStoreType: makeSelectDropdownFromMapping(OfflineStoreType),
    onlineStoreType: makeSelectDropdownFromMapping(OnlineStoreType),
    ownerName: { control: false },
    projectId: { control: false },
    projectName: { control: false },
    syncStatus: makeSelectDropdownFromMapping(FeatureStoreSyncStatus)
  },
  args: {
    displayMode: DisplayMode.global,
    emptyGlobalFeatureList: false,
    emptyProjectFeatureList: false,
    featureStoreEnabled: true,
    hasOfflineStoreVars: false,
    hasOnlineStoreVars: false,
    offlineStoreType: OfflineStoreType.Snowflake,
    onlineStoreType: OnlineStoreType.Snowflake,
    ownerName: 'mockOwnerName',
    projectId: 'mock-project-id',
    projectName: 'mock-project-name',
    syncStatus: FeatureStoreSyncStatus.Successful,
    userIsAnonymous: false,
  }
};

interface TemplateProps extends FeatureListIndexProps {
  emptyGlobalFeatureList: boolean;
  emptyProjectFeatureList: boolean;
  featureStoreEnabled: boolean;
  hasOfflineStoreVars: boolean;
  hasOnlineStoreVars: boolean;
  offlineStoreType: OfflineStoreType;
  onlineStoreType: OnlineStoreType;
  syncStatus: FeatureStoreSyncStatus;
}

const Template = ({
  displayMode,
  emptyGlobalFeatureList,
  emptyProjectFeatureList,
  featureStoreEnabled,
  hasOfflineStoreVars,
  hasOnlineStoreVars,
  offlineStoreType,
  onlineStoreType,
  syncStatus,
  ...args
}: TemplateProps) => {
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    fetchMock.restore()
      .mock(...addFeatureViewToProject())
      .mock(...getJob())
      .mock(...startJob())
      .mock(...search({}))
      .mock(...listUserEnvironmentVariables({
        offlineStoreType: hasOfflineStoreVars ? offlineStoreType : undefined,
        onlineStoreType: hasOnlineStoreVars ? onlineStoreType : undefined,
      }))
      .mock(...getCredentialConfigs({
        offlineStoreType,
        onlineStoreType,
      }))
      .mock(...getProjectsForFeatureView())
      .mock(...getFeatureViewsByProjectAndUser(emptyProjectFeatureList))
      .mock(...getFeatureViews(emptyGlobalFeatureList))
      .mock(...setUserEnvironmentVariables())
      .get('glob:/v4/gateway/projects*', [
        {
          id: '632ba1c5fbd03c16b545e581',
          name: 'quick-start',
          ownerId: '632ba1c4fbd03c16b545e57f',
          ownerName: 'integration-test',
          description:
            'This is a sample Domino Project. This project contains examples for using notebooks, publishing models as APIs, and publishing Python/Flask and R/Shiny web applications.',
          visibility: 'Private',
          tags: [],
          runCounts: [],
          lastUpdated: '2022-09-21T23:44:10.782Z',
          relationship: 'Owned',
          projectType: 'Analytic',
          stageId: '632b72affc5c5c4c97db0fb9',
          status: { status: 'active', isBlocked: false }
        },
        {
          id: 'mock-project-id',
          name: 'mock project',
          ownerId: '632ba1c4fbd03c16b545e57f',
          ownerName: 'integration-test',
          description:
            'This is a sample Domino Project. This project contains examples for using notebooks, publishing models as APIs, and publishing Python/Flask and R/Shiny web applications.',
          visibility: 'Private',
          tags: [],
          runCounts: [],
          lastUpdated: '2022-09-21T23:44:10.782Z',
          relationship: 'Owned',
          projectType: 'Analytic',
          stageId: '632b72affc5c5c4c97db0fb9',
          status: { status: 'active', isBlocked: false }
        }
      ])
      .mock(...getOfflineStoreConfigs())
      .mock(...getFeatureStore({
        failCall: !featureStoreEnabled,
        offlineStoreType, 
        onlineStoreType,
        syncStatus,
      }))

    setReload(true)
  }, [
    args.userIsAnonymous, 
    emptyGlobalFeatureList,
    emptyProjectFeatureList, 
    featureStoreEnabled, 
    hasOfflineStoreVars,
    hasOnlineStoreVars,
    offlineStoreType,
    onlineStoreType,
    setReload, 
    syncStatus
  ]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  if (reload) {
    return <div/>
  }

  const isProjectMode = displayMode === DisplayMode.project;
  const ownerName = isProjectMode ? 'mockOwnerName' : undefined;
  const projectId = isProjectMode ? 'mock-project-id-1' : undefined;
  const projectName = isProjectMode ? 'mock-project-name' : undefined;

  return (
    <Router>
      <FeatureListIndexComponent 
        {...args} 
        displayMode={displayMode}
        ownerName={ownerName}
        projectId={projectId}
        projectName={projectName}
      />
    </Router>
  );
};

export const FeatureListIndex = Template.bind({});
