import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { UserPermissions } from '../../../src/data/data-sources/UserPermissions';
import { getAllDataSourcesResponse } from '../../../src/data/data-sources/testUtil';
import { allDatasourceWithRows, t } from './CommonMocks';
import { getDevStoryPath } from '../../../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Data/Datasource'), module);

stories.add('User Permissions Section in detail page as admin', () => {
  allDatasourceWithRows(true);
  return t(
    <UserPermissions
      // @ts-ignore
      dataSource={getAllDataSourcesResponse[0]}
      onUpdateUsers={() => undefined}
      projectId="611d42f80ccd0069b81cf382"
      isAdmin={true}
      currentUserId="60faf4614c38dd49ccf05fdc"
      currentUserName="jira_user_anonymous"
    />
  );
});

stories.add('User Permissions Section in detail page as non-admin', () => {
  allDatasourceWithRows(true);
  return t(
    <UserPermissions
      // @ts-ignore
      dataSource={getAllDataSourcesResponse[0]}
      onUpdateUsers={() => undefined}
      projectId="611d42f80ccd0069b81cf382"
      isAdmin={false}
      currentUserId="611d42f80ccd0069b81cf382"
      currentUserName="rfqa-admin"
    />
  );
});
