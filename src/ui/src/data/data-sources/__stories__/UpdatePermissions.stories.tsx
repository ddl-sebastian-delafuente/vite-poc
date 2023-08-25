import {
  getAllOrganizations,
  getCurrentUserOrganizations,
  getCurrentUser,
  getPrincipal,
  listUsers,
} from '@domino/mocks/dist/mockStories';
import { user1 } from '@domino/mocks/dist/mock-usecases/users';
import { dataSourceDto } from '@domino/mocks/dist/mocks';
import { useReload } from '@domino/mocks/dist/storybook.utils';
import fetchMock from 'fetch-mock';
import { MemoryRouter as Router } from 'react-router-dom';
import * as React from 'react';

import { getDevStoryPath } from '../../../utils/storybookUtil';
import { 
  UserPermissionsProps,
  UserPermissions as UserPermissionsComponent,
} from '../UserPermissions';


export default {
  title: getDevStoryPath('Develop/Data/Datasource'),
  component: UserPermissionsComponent,
  argTypes: {
    dataSource: { control: false },
    onUpdateUsers: { control: false },
  },
  args: {
    currentUserUserName: user1.userName,
    currentUserId: user1.id,
    dataSource: {
      ...dataSourceDto,
      ownerId: user1.id,
      ownerInfo: {
        ownerEmail: user1.email,
        ownerName: user1.userName,
        isOwnerAdmin: true,
      }
    },
    isAdmin: true,
  }
}

type TemplateProps = UserPermissionsProps;

const Template = (args: TemplateProps) => {
  const [reload, setReload] = useReload();

  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getAllOrganizations())
      .mock(...getCurrentUserOrganizations())
      .mock(...getCurrentUser())
      .mock(...getPrincipal())
      .mock(...listUsers());

    setReload(true);
  }, [setReload])

  if (reload) {
    return <div/>
  }

  return (
    <Router>
      <UserPermissionsComponent {...args} />
    </Router>
  )
};

export const UpdatePermissions = Template.bind({});
