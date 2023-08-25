import {
  deleteQuota,
  getQuota,
  getQuotaOverrides,
  updateQuota,
} from '@domino/mocks/dist/mock-stories/Quota'
import {
  getCurrentUserOrganizations,
  getCurrentUser,
  getAllOrganizations,
  getProjectSummary,
  listUsers,
} from '@domino/mocks/dist/mockStories';
import { useReload } from '@domino/mocks/dist/storybook.utils';
import * as React from 'react';
import fetchMock from 'fetch-mock';

import { getDevStoryPath } from '../../../../utils/storybookUtil';
import { 
  DatasetAdminQuotaSectionProps,
  DatasetAdminQuotaSection as DatasetAdminQuotaSectionComponent 
} from '../DatasetAdminQuotaSection';

export default {
  title: getDevStoryPath('Develop/Data/Datasets/Admin'),
  component: DatasetAdminQuotaSectionComponent,
  args: {
    storageUsage: 123485410453134,
    existingExceptions: false,
    existingGlobalQuota: false,
  }
};

interface TemplateProps extends DatasetAdminQuotaSectionProps {
  existingExceptions: boolean;
  existingGlobalQuota: boolean;
}

const Template = ({
  existingExceptions,
  existingGlobalQuota,
  ...args
}: TemplateProps) => {
  const [reload, setReload] = useReload();
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getAllOrganizations())
      .mock(...getCurrentUser())
      .mock(...getCurrentUserOrganizations())
      .mock(...getProjectSummary())
      .mock(...listUsers())
      .mock(...deleteQuota())
      .mock(...getQuota({ isExisting: existingGlobalQuota }))
      .mock(...getQuotaOverrides({ isExisting: existingExceptions }))
      .post('glob:/v4/quota/quota-overrides', 'ok')
      .mock(...updateQuota())

    setReload(true);
  }, [existingExceptions, existingGlobalQuota, setReload])

  if (reload) {
    return <div/>
  }

  return (
    <DatasetAdminQuotaSectionComponent {...args}/>
  );
};

export const QuotaSection = Template.bind({});
