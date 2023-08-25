import {
  getOfflineStoreConfigByType,
  getOfflineStoreConfigs,
} from '@domino/mocks/dist/mock-stories/Featurestore';
import {
  completeWorkflow,
  getDataSourceConfigsNew,
} from '@domino/mocks/dist/mockStories';
import { featureStoreDto } from '@domino/mocks/dist/mocks';
import fetchMock from 'fetch-mock';
import * as React from 'react'

import { getDevStoryPath } from '../../../../utils/storybookUtil';
import {
  SetupFeatureStoreIndexProps,
  SetupFeatureStoreIndex as SetupFeatureStoreIndexComponent
} from '../SetupFeatureStoreIndex';

export default {
  title: getDevStoryPath('Develop/Data/Feature Store/Admin'),
  component: SetupFeatureStoreIndexComponent,
  args: {
    shouldCompleteWorkflow: true,
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TemplateProps extends SetupFeatureStoreIndexProps {
  shouldCompleteWorkflow: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Template = ({
  shouldCompleteWorkflow,
  ...args
}: TemplateProps) => {
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getDataSourceConfigsNew())
      .mock(...completeWorkflow(shouldCompleteWorkflow))
      .get('/v4/featurestore', featureStoreDto)
      .get('/v4/featurestore/yaml', { yaml: 'Mock YAML' })
      .delete('/v4/featurestore/', 'ok')
      .mock(...getOfflineStoreConfigByType())
      .mock(...getOfflineStoreConfigs())

    setReload(true);
  }, [shouldCompleteWorkflow]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  if (reload) {
    return <div/>
  }

  return (
    <SetupFeatureStoreIndexComponent {...args} />
  )
}

export const SetupFeatureStoreIndex = Template.bind({});
