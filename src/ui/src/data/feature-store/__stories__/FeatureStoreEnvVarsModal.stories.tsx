import {
  getOfflineStoreConfigs,
  getCredentialConfigs,
} from '@domino/mocks/dist/mock-stories/Featurestore';
import {
  setUserEnvironmentVariables,
} from '@domino/mocks/dist/mock-stories/Users';
import {
  OfflineStoreConfigMap,
  OnlineStoreConfigMap,
} from '@domino/mocks/dist/mock-usecases/featurestore';
import { makeSelectDropdownFromMapping } from '@domino/mocks/dist/storybook.utils';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { 
  OfflineStoreType,
  OnlineStoreType,
} from '../../../proxied-api/types';
import { getDevStoryPath } from '../../../utils/storybookUtil';
import { 
  FeatureStoreEnvVarsModalProps,
  FeatureStoreEnvVarsModal as FeatureStoreEnvVarsModalComponent 
} from '../FeatureStoreEnvVarsModal';

export default {
  title: getDevStoryPath('Develop/Data/Feature Store'),
  component: FeatureStoreEnvVarsModalComponent,
  argTypes: {
    data: { control: false },
    offlineStoreType: makeSelectDropdownFromMapping(OfflineStoreType),
    onlineStoreType: makeSelectDropdownFromMapping(OnlineStoreType)
  },
  args: {
    editMode: false,
    featureStoreId: 'mock-feature-store-id',
    hasOnlineStore: false,
    hasOfflineStore: true,
    offlineStoreType: OfflineStoreType.Snowflake,
    onlineStoreType: OnlineStoreType.Snowflake,
    visible: true,
  }
}

interface TemplateProps extends FeatureStoreEnvVarsModalProps {
  editMode: boolean,
  hasOfflineStore: boolean,
  hasOnlineStore: boolean,
}

const Template = ({
  editMode,
  hasOfflineStore,
  hasOnlineStore,
  offlineStoreType,
  onlineStoreType,
  ...args
}: TemplateProps) => {
  const [reload, setReload] = React.useState(false);
  const data = editMode ? {} : undefined
  
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getCredentialConfigs({
        offlineStoreType: hasOfflineStore ? offlineStoreType : undefined,
        onlineStoreType: hasOnlineStore ? onlineStoreType : undefined,
      }))
      .mock(...getOfflineStoreConfigs())
      .mock(...setUserEnvironmentVariables())

    setReload(true);
  }, [
    hasOfflineStore,
    hasOnlineStore,
    offlineStoreType,
    onlineStoreType,
    setReload
  ]);
  
  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  if (reload) {
    return <div/>
  }

  const offlineStoreConfig = hasOfflineStore && offlineStoreType ? 
    OfflineStoreConfigMap[offlineStoreType]?.offlineStoreConfig : undefined;

  const onlineStoreConfig = hasOnlineStore && onlineStoreType ? 
    OnlineStoreConfigMap[onlineStoreType]?.onlineStoreConfig : undefined

  return (
    <FeatureStoreEnvVarsModalComponent 
      {...args} 
      data={data}
      offlineStoreConfig={offlineStoreConfig}
      onlineStoreConfig={onlineStoreConfig}
      offlineStoreType={hasOfflineStore ? offlineStoreType : undefined} 
      onlineStoreType={hasOnlineStore ? onlineStoreType: undefined}
    />
  )
};

export const FeatureStoreEnvVarsModal = Template.bind({});
