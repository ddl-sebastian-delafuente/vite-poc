import { MemoryRouter as Router } from 'react-router-dom';
import * as React from 'react';

import { getDevStoryPath } from '../../utils/storybookUtil';

import { 
  UserListProps,
  UserList as UserListComponent
} from '../UserList';

export default {
  title: getDevStoryPath('Develop/Data'),
  component: UserListComponent,
  args: {
    users: [
      'user1',
      'user2',
      'user3'
    ]
  }
}

const Template = (args: UserListProps) => (
  <Router>
    <UserListComponent {...args} />
  </Router>
);

export const UserList = Template.bind({});
