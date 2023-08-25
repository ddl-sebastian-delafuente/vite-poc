import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { CompactTable } from '../src/components/Table/CompactTable';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const defaultsProps = {
  dataSource: [
    {
      key: 0,
      name: 'Darth Vader'
    },
    {
      key: 1,
      name: 'Obi-Wan Kenobi'
    },
    {
      key: 2,
      name: 'Han Solo'
    },
    {
      key: 3,
      name: 'Yoda'
    }
  ],
  columns: [
    {
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Address',
      key: 'address',
      dataIndex: 'address',
    }
  ],
  hideRowSelection: true,
  showSearch: false,
  hideColumnFilter: true,
  isStriped: true,
  highlightSortedColumn: true
};

export const stories = [{
  name: 'CompactTable',
  component: <CompactTable {...defaultsProps} />
}];

const storiesOfModule = storiesOf(getDevStoryPath('Components'), module);

stories.forEach((story) => {
  storiesOfModule.add(story.name, () => (
    <>
      {story.component}
    </>
  ));
});
