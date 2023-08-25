import {
  getOfflineStoreConfigByType,
  getOfflineStoreConfigs,
} from '@domino/mocks/dist/mock-stories/Featurestore';
import {
  completeWorkflow,
  getCurrentUser,
  getDataSourceConfigsNew,
} from '@domino/mocks/dist/mockStories';
import fetchMock from 'fetch-mock';
import * as React from 'react'

import { getDevStoryPath } from '../../../../utils/storybookUtil';
import { SetupFeatureStoreButton as SetupFeatureStoreButtonComponent } from '../SetupFeatureStoreButton';

export default {
  title: getDevStoryPath('Develop/Data/Feature Store/Admin'),
  component: SetupFeatureStoreButtonComponent,
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Template = (args: TemplateProps) => {
  const [reload, setReload] = React.useState(false);
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getDataSourceConfigsNew())
      .mock(...completeWorkflow(true))
      .mock(...getCurrentUser())
      .mock(...getOfflineStoreConfigByType())
      .mock(...getOfflineStoreConfigs());

    setReload(true);
  }, [setReload]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload])

  if (reload) {
    return <div/>
  }

  return (
    <SetupFeatureStoreButtonComponent />
  )
}

export const SetupFeatureStoreButton = Template.bind({});
