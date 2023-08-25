import {
  getCurrentUser,
  listUsers,
} from '@domino/mocks/dist/mockStories';
import { useReload } from '@domino/mocks/dist/storybook.utils';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { getDevStoryPath } from '../../utils/storybookUtil';
import UsersAndOrgsDropdownComponent, { Props } from '../UsersAndOrgsDropdown';

export default {
  title: getDevStoryPath('Components'),
  component: UsersAndOrgsDropdownComponent,
  args: {
    omitOrgs: false,
    omitUsers: false,
  }
}

const Template = ({
  omitOrgs,
  omitUsers,
  ...args
}: Props) => {
  const [reload, setReload] = useReload();
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getCurrentUser())
      .mock(...listUsers())
      .spy('glob:/runtime_main*');

    setReload(true);
  }, [omitOrgs, omitUsers, setReload]);

  if (reload) {
    return <div/>;
  }

  return (
    <UsersAndOrgsDropdownComponent {...args} omitOrgs={omitOrgs} omitUsers={omitUsers} />
  );
};

export const UsersAndOrgsDropdown = Template.bind({});
