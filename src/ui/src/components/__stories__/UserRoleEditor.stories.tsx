import {
  getCurrentUserOrganizations,
  getCurrentUser,
  getAllOrganizations,
  getPrincipal,
  getProjectSummary,
  listUsers,
} from '@domino/mocks/dist/mockStories';
import {
  organization1,
  user1,
  user3,
} from '@domino/mocks/dist/mock-usecases';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { Role } from '../../proxied-api/types';
import { getDevStoryPath } from '../../utils/storybookUtil';
import {
  UserRoleEditorProps,
  UserRoleEditor as UserRoleEditorComponent
} from '../UserRoleEditor';

export default {
  title: getDevStoryPath('Components'),
  component: UserRoleEditorComponent,
  args: {
    disableAddAllProjectMembers: false,
    editable: true,
    isAdmin: true,
    projectId: 'mock-project-id',
    mockExistingUsers: false,
  }
}

interface TemplateProps extends UserRoleEditorProps {
  isAdmin?: boolean;
  mockExistingUsers: boolean;
}

const MOCK_USERS = [
  {
    targetId: user1.id,
    targetName: user1.userName,
    targetRole: Role.DatasetRwOwner,
  },
  {
    targetId: organization1.organizationUserId,
    targetName: organization1.name,
    isOrganization: true,
    targetRole: Role.DatasetRwEditor,
  },
  {
    targetId: user3.id,
    targetName: user3.userName,
    targetRole: Role.DatasetRwReader,
  }
]

const Template = ({
  editable,
  isAdmin,
  mockExistingUsers,
  ...args
}: TemplateProps) => {
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getAllOrganizations())
      .mock(...getCurrentUserOrganizations())
      .mock(...getCurrentUser())
      .mock(...getPrincipal(isAdmin))
      .mock(...getProjectSummary())
      .mock(...listUsers());

    setReload(true);
  }, [editable, isAdmin, setReload]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);


  if (reload) {
    return <div/>
  }

  const props = {
    ...args,
  };

  if (mockExistingUsers) {
    props.userList = MOCK_USERS;
  }

  return (
    <UserRoleEditorComponent {...props} editable={editable}/>
  )
};

export const UserRoleEditor = Template.bind({});
