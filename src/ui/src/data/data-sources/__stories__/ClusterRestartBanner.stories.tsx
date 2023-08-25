import {
  getDataSourcesByEngineType,
  shouldRestartStarburst,
} from '@domino/mocks/dist/mockStories';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { getDevStoryPath } from '../../../utils/storybookUtil';
import { 
  ClusterRestartBanner as ClusterRestartBannerComponent
} from '../ClusterRestartBanner';

export default {
  title: getDevStoryPath('Develop/Data/Datasource'),
  component: ClusterRestartBannerComponent,
  argTypes: {
    canRestartStarburst: { control: { type: 'boolean' } }
  },
  args: {
    canRestartStarburst: true,
  }
};

interface TemplateProps {
  canRestartStarburst: boolean;
}

const Template = ({ canRestartStarburst }: TemplateProps) => {
  const [rerender, setRerender] = React.useState<boolean>(false);

  React.useEffect(() => {
    setRerender(true);
    fetchMock.restore()
      .mock(...getDataSourcesByEngineType())
      .mock(...shouldRestartStarburst(canRestartStarburst))
      .mock('/v4/datasource/starburst/restart', true, { method: 'GET' })
  }, [canRestartStarburst, setRerender]);

  React.useEffect(() => {
    if (rerender) {
      setRerender(false);
    }
  }, [rerender, setRerender])

  if (rerender) {
    return <></>
  }
  
  return <ClusterRestartBannerComponent />
};

export const ClusterRestartBanner = Template.bind({});
