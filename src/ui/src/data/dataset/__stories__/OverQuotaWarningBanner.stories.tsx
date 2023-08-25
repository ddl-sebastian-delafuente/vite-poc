import {
  getDatasetStorageUsage
} from '@domino/mocks/dist/mock-stories/Datasetrw';
import { useReload } from '@domino/mocks/dist/storybook.utils';
import fetchMock from 'fetch-mock';
import { MemoryRouter as Router } from 'react-router-dom';
import * as React from 'react';

import { getDevStoryPath } from '../../../utils/storybookUtil';
import { 
  OverQuotaWarningBannerProps,
  OverQuotaWarningBanner as OverQuotaWarningBannerComponent 
} from '../OverQuotaWarningBanner';

export default {
  title: getDevStoryPath('Develop/Data/Datasets'),
  component: OverQuotaWarningBannerComponent,
  args: {
    overlimit: true,
    userId: 'mock-user-id'
  }
};

interface TemplateProps extends OverQuotaWarningBannerProps{
  overlimit: boolean;
}

const Template = ({
  overlimit,
  ...args
}: TemplateProps) => {
  const [reload, setReload] = useReload();
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getDatasetStorageUsage(overlimit))

    setReload(true);
  }, [overlimit, setReload]);

  if (reload) {
    return <div/>
  }

  return (
    <Router>
      <OverQuotaWarningBannerComponent {...args}/>
    </Router>
  );
}

export const OverQuotaWarningBanner = Template.bind({});
