import {
  deleteFeatureStore
} from '@domino/mocks/dist/mock-stories/Featurestore'
import {
  OfflineStoreConfigMap,
  OnlineStoreConfigMap,
} from '@domino/mocks/dist/mock-usecases/featurestore';
import { featureStoreDto, OfflineStoreType } from '@domino/mocks/dist/mocks';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { FeatureStoreSyncStatus } from '../../../../proxied-api/types';
import { getDevStoryPath } from '../../../../utils/storybookUtil';
import { 
  FeatureStoreDetailsProps,
  FeatureStoreDetails as FeatureStoreDetailsComponent 
} from '../FeatureStoreDetails';

export default {
  title: getDevStoryPath('Develop/Data/Feature Store/Admin'),
  component: FeatureStoreDetailsComponent,
  argTypes: {
    featureStore: { controls: false },
    selectedOfflineStore: {
      options: Object.keys(OfflineStoreConfigMap),
      control: { type: 'select', labels: Object.keys(OfflineStoreConfigMap) },
    },
    selectedOnlineStore: {
      options: Object.keys(OnlineStoreConfigMap),
      control: { type: 'select', labels: Object.keys(OnlineStoreConfigMap) },
    },
    syncStatus: {
      options: Object.keys(FeatureStoreSyncStatus),
      control: { type: 'select', labels: Object.keys(FeatureStoreSyncStatus) },
    }
  },
  args: {
    selectedOfflineStore: OfflineStoreType.File,
    syncStatus: FeatureStoreSyncStatus.Successful,
  }
}

interface TemplateProps extends FeatureStoreDetailsProps {
  selectedOfflineStore: string;
  selectedOnlineStore: string;
  syncStatus: FeatureStoreSyncStatus;
}

const Template = ({
  selectedOfflineStore,
  selectedOnlineStore,
  syncStatus,
  ...args
}: TemplateProps) => {
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...deleteFeatureStore())
      .get('/v4/featurestore/yaml', { yaml: 'Mock YAML' })
  }, []);

  const offlineStore = OfflineStoreConfigMap[selectedOfflineStore] || {};
  const onlineStore = OnlineStoreConfigMap[selectedOnlineStore] || {};

  return <FeatureStoreDetailsComponent {...args} featureStore={{
    ...featureStoreDto,
    ...offlineStore,
    ...onlineStore,
    syncStatus,
  }} />
}

export const FeatureStoreDetails = Template.bind({});
