import 'whatwg-fetch';
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import PageView from '../../src/admin-workspaces/src/PageView';
import { makeAdminWorkspaceTableRow as makeRow } from './util';
import { getDevStoryPath } from '../../src/utils/storybookUtil';

const defaultError = {
  name: 'error',
  body: new Response(),
  'headers': new Headers(),
  message: 'oh no',
  status: 502,
};

const stories = storiesOf(getDevStoryPath('Admin/WorkspacesPage'), module);

stories.add('default', () => (
  <PageView
    totalEntries={0}
    pageNumber={1}
    pageSize={2}
    rows={[
      makeRow(),
      makeRow(),
      makeRow(),
      makeRow(),
    ]}
    workspaceCountQuota={{runningCount: 0, usedCount: 50, maxCount: 1000}}
    workspaceVolumeAllocationQuota={{usedGiB: 100, maxGiB: 20000}}
    // eslint-disable-next-line
    handleStateChange={(state: any) => console.log(state)}
    summaryLoading={false}
    workspacesLoading={false}
    workspacesFetchError={undefined}
    summaryFetchError={undefined}
  />
));

stories.add('all loading, no data', () => (
  <PageView
    totalEntries={0}
    pageNumber={1}
    pageSize={0}
    rows={[]}
    // eslint-disable-next-line
    handleStateChange={(state: any) => console.log(state)}
    summaryLoading={true}
    workspacesLoading={true}
    workspacesFetchError={undefined}
    summaryFetchError={undefined}
  />
));

stories.add('failed table', () => (
  <PageView
    totalEntries={0}
    pageNumber={1}
    pageSize={0}
    rows={[]}
    workspaceCountQuota={{runningCount: 0, usedCount: 50, maxCount: 1000}}
    workspaceVolumeAllocationQuota={{usedGiB: 100, maxGiB: 20000}}
    // eslint-disable-next-line
    handleStateChange={(state: any) => console.log(state)}
    summaryLoading={false}
    workspacesLoading={false}
    workspacesFetchError={defaultError}
    summaryFetchError={undefined}
  />
));

stories.add('failed summary', () => (
  <PageView
    totalEntries={0}
    pageNumber={1}
    pageSize={0}
    rows={[]}
    // eslint-disable-next-line
    handleStateChange={(state: any) => console.log(state)}
    summaryLoading={false}
    workspacesLoading={false}
    workspacesFetchError={undefined}
    summaryFetchError={defaultError}
  />
));

stories.add('no failures, partial summary', () => (
  <PageView
    totalEntries={0}
    pageNumber={1}
    pageSize={0}
    rows={[]}
    workspaceCountQuota={{runningCount: 0, usedCount: 50, maxCount: 1000}}
    workspaceVolumeAllocationQuota={undefined}
    // eslint-disable-next-line
    handleStateChange={(state: any) => console.log(state)}
    summaryLoading={false}
    workspacesLoading={false}
    workspacesFetchError={undefined}
    summaryFetchError={undefined}
  />
));

stories.add('all loading, old table data', () => (
  <PageView
    totalEntries={0}
    pageNumber={1}
    pageSize={2}
    rows={[
      makeRow(),
      makeRow(),
      makeRow(),
      makeRow(),
    ]}
    // eslint-disable-next-line
    handleStateChange={(state: any) => console.log(state)}
    summaryLoading={true}
    workspacesLoading={true}
    workspacesFetchError={undefined}
    summaryFetchError={undefined}
  />
));
