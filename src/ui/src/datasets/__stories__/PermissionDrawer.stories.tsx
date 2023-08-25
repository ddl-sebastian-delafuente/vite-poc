import {
  getAllOrganizations,
  getCurrentUserOrganizations,
  getCurrentUser,
  getPrincipal,
  getProjectSummary,
  listUsers,
} from '@domino/mocks/dist/mockStories';
import { user1 } from '@domino/mocks/dist/mock-usecases/users';
import fetchMock from 'fetch-mock';
import * as React from  'react';

import { getDevStoryPath } from '../../utils/storybookUtil';
import { 
  PermissionsDrawerProps,
  PermissionDrawer as PermissionDrawerComponent 
} from '../PermissionDrawer';

export default {
  title: getDevStoryPath('Develop/Data/Datasets'),
  component: PermissionDrawerComponent,
  args: {
    adminPage: false,
    datasetId: 'mock-dataset-id',
    editable: true,
    projectId: 'mock-project-id',
    visible: true,
  }
}

type TemplateProps = PermissionsDrawerProps

const Template = (args: TemplateProps) => {
  const [reload, setReload] = React.useState(false);
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getAllOrganizations())
      .mock(...getCurrentUserOrganizations())
      .mock(...getCurrentUser())
      .mock(...getPrincipal())
      .mock(...getProjectSummary())
      .mock(...listUsers())
      .get('glob:/v4/datasetrw/dataset/*/grants', [
        {
          targetId: user1.id,
          targetName: user1.userName,
          targetRole: 'DatasetRwOwner'
        }
      ])
      .put('glob:/v4/datasetrw/dataset/*/grants', true);

    setReload(true);
  }, [args.visible, setReload]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  if (reload) {
    return <div/>;
  }

  return (
    <PermissionDrawerComponent {...args}/>
  )
};

export const PermissionDrawer = Template.bind({});
