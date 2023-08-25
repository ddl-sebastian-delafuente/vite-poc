import { 
  getCredentialConfigs,
} from '@domino/mocks/dist/mock-stories/Featurestore';
import { 
  setUserEnvironmentVariables,
} from '@domino/mocks/dist/mock-stories/Users';
import { 
  featureStoreDto, 
  OfflineStoreType,
  OnlineStoreType,
} from '@domino/mocks/dist/mocks';
import { makeSelectDropdownFromMapping } from '@domino/mocks/dist/storybook.utils';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { getDevStoryPath } from '../../../../utils/storybookUtil';
import {
  EmptyFeatureListProps,
  EmptyFeatureList as EmptyFeatureListComponent,
  EmptyStateMode,
} from '../EmptyFeatureList';

export default {
  title: getDevStoryPath('Develop/Data/Feature Store/Feature List'),
  component: EmptyFeatureListComponent,
  argTypes: {
    mode: makeSelectDropdownFromMapping(EmptyStateMode),
    offlineStoreType: makeSelectDropdownFromMapping(OfflineStoreType),
    onlineStoreType: makeSelectDropdownFromMapping(OnlineStoreType)
  },
  args: {
    featureStoreId: 'mock-feature-store-id',
    hasOfflineStoreVars: false,
    hasOnlineStoreVars: false,
    mode: EmptyStateMode.Setup,
    offlineStoreType: OfflineStoreType.Snowflake,
    onlineStoreType: OnlineStoreType.Snowflake,
    projectId: 'mock-project-id',
  }
}

interface TemplateProps extends EmptyFeatureListProps {
  hasOfflineStoreVars: boolean;
  hasOnlineStoreVars: boolean;
  offlineStoreType: OfflineStoreType;
  onlineStoreType: OnlineStoreType;
}

const Template = ({
  hasOfflineStoreVars,
  hasOnlineStoreVars,
  offlineStoreType,
  onlineStoreType,
  ...args
}: TemplateProps) => {
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getCredentialConfigs({
        offlineStoreType,
        onlineStoreType,
      }))
      .mock(...setUserEnvironmentVariables())

    setReload(true);
  }, [
    hasOfflineStoreVars,
    hasOnlineStoreVars,
    offlineStoreType,
    onlineStoreType,
    setReload
  ])

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload])

  if (reload) {
    return <div/>
  }

  return (
    <EmptyFeatureListComponent 
      {...args}
      hasEnvVars={hasOfflineStoreVars && hasOnlineStoreVars}
      featureStore={{
        ...featureStoreDto,
        offlineStoreType,
        onlineStoreType,
      }}
    />
  )
};

export const EmptyFeatureList = Template.bind({});
