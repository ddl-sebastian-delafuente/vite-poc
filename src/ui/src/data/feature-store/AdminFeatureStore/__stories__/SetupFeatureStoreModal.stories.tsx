import {
  getOfflineStoreConfigByType,
  getOfflineStoreConfigs,
  getOnlineStoreConfigByType,
} from '@domino/mocks/dist/mock-stories/Featurestore';
import {
  completeWorkflow,
  getCurrentUser,
  getDataSourceConfigsNew,
  getGitCredentials,
  validateStep,
} from '@domino/mocks/dist/mockStories';
import fetchMock from 'fetch-mock';
import * as React from 'react'

import { getDevStoryPath } from '../../../../utils/storybookUtil';
import {
  SetupFeatureStoreModal as SetupFeatureStoreModalComponent,
  SetupFeatureStoreModalProps
} from '../SetupFeatureStoreModal';

export default {
  title: getDevStoryPath('Develop/Data/Feature Store/Admin'),
  component: SetupFeatureStoreModalComponent,
  args: {
    noGitCredentials: false,
    visible: true,
  },
}

interface TemplateProps extends SetupFeatureStoreModalProps {
  noGitCredentials: boolean,
}

const Template = ({ noGitCredentials, ...args }: TemplateProps) => {
  const [reload, setReload] = React.useState(false);
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getDataSourceConfigsNew())
      .mock(...completeWorkflow(true))
      .mock(...getCurrentUser())
      .mock(...getGitCredentials(noGitCredentials ? [] : undefined))
      .mock(...getOfflineStoreConfigByType())
      .mock(...getOfflineStoreConfigs())
      .mock(...getOnlineStoreConfigByType())
      .mock(...validateStep(true))

    setReload(true);
  }, [args.visible, noGitCredentials]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  if (reload) {
    return <div/>
  }

  return (
    <SetupFeatureStoreModalComponent {...args} />
  )
}

export const SetupFeatureStoreModal = Template.bind({});
