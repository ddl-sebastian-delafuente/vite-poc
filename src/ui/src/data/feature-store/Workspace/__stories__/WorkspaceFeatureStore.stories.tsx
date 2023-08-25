import { 
  generateWritableProjectMounts,
  generateWorkspace,
} from '@domino/mocks/dist/generators/Workspace';
import {
  getCodeSnippet
} from '@domino/mocks/dist/mock-stories/Featurestore';
import {
  featureView,
  getFeatureStore,
} from '@domino/mocks/dist/mock-usecases/featurestore';
import { 
  makeSelectDropdownFromMapping, 
  useReload,
} from '@domino/mocks/dist/storybook.utils';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { 
  GitServiceProvider,
  OfflineStoreType,
  OnlineStoreType,
} from '../../../../proxied-api/types';
import { getDevStoryPath } from '../../../../utils/storybookUtil';
import {
  WorkspaceFeatureStoreProps,
  WorkspaceFeatureStore as WorkspaceFeatureStoreComponent
} from '../WorkspaceFeatureStore';


const FEATURE_VIEW_OPTIONS = {
  singleView: [
    featureView,
  ],
  empty: [],
}

const FEATURE_VIEW_OPTION_NAMES = Object.keys(FEATURE_VIEW_OPTIONS).reduce((memo, keyName) => {
  memo[keyName] = keyName;
  return memo;
}, {})

export default {
  title: getDevStoryPath('Develop/Data/Feature Store/Workspace'),
  component: WorkspaceFeatureStoreComponent,
  argTypes: {
    featureViewName: makeSelectDropdownFromMapping(FEATURE_VIEW_OPTION_NAMES),
    offlineStoreType: makeSelectDropdownFromMapping(OfflineStoreType),
    onlineStoreType: makeSelectDropdownFromMapping(OnlineStoreType),
  },
  args: {
    featureViewName: 'empty',
    isFeatureStoreEnabledForProject: true,
    offlineStoreType: OfflineStoreType.Snowflake,
    onlineStoreType: OnlineStoreType.Snowflake,
    ownerName: 'mock-owner-name',
    projectName: 'mock-project-name',
  }
}

interface TemplateProps extends WorkspaceFeatureStoreProps {
  offlineStoreType: OfflineStoreType;
  onlineStoreType: OnlineStoreType;
  featureViewName: string;
}

const Template = ({ 
  offlineStoreType,
  onlineStoreType,
  featureViewName, 
  ...args 
}: TemplateProps) => {
  const [reload, setReload] = useReload();
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getCodeSnippet({}))

    setReload(true);
  }, [setReload]);

  const featureStore = React.useMemo(() => {
    return {
      ...getFeatureStore({ offlineStoreType, onlineStoreType }),
      gitServiceProvider: GitServiceProvider.github,
    };
  }, [offlineStoreType, onlineStoreType])

  if (reload) {
    return <div/>
  }

  const projectMounts = generateWritableProjectMounts();
  const workspace = generateWorkspace();
  
  return (
    <WorkspaceFeatureStoreComponent
      {...args}
      featureStore={featureStore}
      featureViews={FEATURE_VIEW_OPTIONS[featureViewName]}
      projectMounts={projectMounts}
      workspace={workspace}
    />
  );
}

export const WorkspaceFeatureStore = Template.bind({});
