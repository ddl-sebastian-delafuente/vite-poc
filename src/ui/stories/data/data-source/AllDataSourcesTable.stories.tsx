import * as React from 'react';
import { storiesOf } from '@storybook/react';
import AllDataSourcesTable from '../../../src/data/data-sources/all-data-sources/AllDataSourcesTable';
import { allDatasourceWithEmptyState, allDatasourceWithRows, t } from './CommonMocks';
import { getDevStoryPath } from '../../../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Data/Datasource'), module);

stories.add('AllDataSourcesTable for non-admin page', () => {
  allDatasourceWithRows(false);
  return t(
    <AllDataSourcesTable isAdminPage={false} userId="60faf443e43b3c7a6f5f5eea"/>
  );
});

stories.add('AllDataSourcesTable for admin page', () => {
  allDatasourceWithRows(true);
  return t(
    <AllDataSourcesTable isAdminPage={true}/>
  );
});

stories.add('Empty AllDataSourcesTable for non-admin page', () => {
  allDatasourceWithEmptyState(false);
  return t(
    <AllDataSourcesTable isAdminPage={false} userId="60faf443e43b3c7a6f5f5eea"/>
  );
});

stories.add('Empty AllDataSourcesTable for admin page', () => {
  allDatasourceWithEmptyState(false);
  return t(
    <AllDataSourcesTable isAdminPage={true}/>
  );
});
