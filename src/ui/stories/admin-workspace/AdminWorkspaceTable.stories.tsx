import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { WorkspaceTable } from '../../src/admin-workspaces';
import {
  makeAdminWorkspaceTableRowNoDefaults as makeRowNoDefaults,
  makeAdminWorkspaceTableRow as makeRow,
} from './util';
import { getDevStoryPath } from '../../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Admin/WorkspaceTable'), module);

stories.add('rows', () => (
  <WorkspaceTable
    // eslint-disable-next-line
    onChange={state => console.log(state)}
    error={false}
    loading={false}
    totalEntries={4}
    pageNumber={1}
    pageSize={3}
    rows={[
        makeRow(),
        makeRow(),
        makeRow(),
        makeRowNoDefaults(),
    ]}
  />
));

stories.add('error and existing rows', () => (
  <WorkspaceTable
    loading={false}
    // eslint-disable-next-line
    onChange={state => console.log(state)}
    error={true}
    totalEntries={4}
    pageNumber={1}
    pageSize={10}
    rows={[
        makeRow(),
        makeRow(),
        makeRow(),
        makeRow(),
    ]}
  />
));

stories.add('error and no rows', () => (
  <WorkspaceTable
    loading={false}
    // eslint-disable-next-line
    onChange={state => console.log(state)}
    error={true}
    totalEntries={4}
    pageNumber={1}
    pageSize={10}
    rows={[]}
  />
));

stories.add('empty', () => (
  <WorkspaceTable
    loading={false}
    // eslint-disable-next-line
    onChange={state => console.log(state)}
    error={false}
    totalEntries={4}
    pageNumber={1}
    pageSize={10}
    rows={[]}
  />
));

stories.add('loading with rows', () => (
  <WorkspaceTable
    loading={true}
    // eslint-disable-next-line
    onChange={state => console.log(state)}
    error={false}
    totalEntries={4}
    pageNumber={1}
    pageSize={10}
    rows={[
        makeRow(),
        makeRow(),
        makeRow(),
        makeRow(),
    ]}
  />
));
