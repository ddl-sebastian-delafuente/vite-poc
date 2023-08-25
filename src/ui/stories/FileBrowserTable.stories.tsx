import * as React from 'react';
import { useState } from 'react';
import { storiesOf } from '@storybook/react';
import FileBrowserTable from '../src/components/FileBrowserTable';
import Button from '../src/components/Button/Button';
import { getDevStoryPath } from '../src/utils/storybookUtil';
import { Key } from 'antd/lib/table/interface';

const t = (icon: JSX.Element) => <>{icon}</>;

const stories = storiesOf(getDevStoryPath('Develop/Files/FileBrowserTable'), module);

const easyData = [
  { name: 'hey', size: 2, isDir: true },
  { name: 'kjkj', size: 2, isDir: false },
  { name: 'lkjljhey', isDir: false },
  { name: 'kjkj2', size: 2, isDir: false },
  { name: 'lkjljhey2', isDir: false },
  { name: 'kjkj3', size: 2, isDir: false },
  { name: 'lkjljhey3', isDir: false },
  { name: 'kjkj4', size: 2, isDir: false },
  { name: 'lkjljhey4', isDir: false },
  { name: 'kjkj5', size: 2, isDir: false },
  { name: 'lkjljhey5', isDir: false },
];

const depth2Data = [
  { name: 'hey2', size: 2, isDir: true },
  { name: 'kjkj2', size: 2, isDir: false },
  { name: 'lkjljhey2', isDir: false },
];

const withFlatPaths = [
  { name: { path: 'A/B' }, size: 2, isDir: true },
  { name: { path: 'A/x.js' }, size: 2, isDir: false },
];

const randomColumnsData = [
  { name: 'hey', dog: 'blah', size: 2, isDir: true },
  { name: 'kjkj', size: 2, blarg: 'slfkjds', isDir: false },
  { name: 'lkjljhey', i9999: 899898, isDir: false },
];

const FileBrowserTableWithDeleteButton = () => {
  const [selectedFiles, setSelectedFiles] = useState<Key[]>([]);
  return (
    <FileBrowserTable
      path=""
      onGoUpDirectory={async () => easyData}
      onDrilldown={async () => depth2Data}
      columns={[]}
      dataSource={easyData}
      hideRowSelection={false}
      rowSelection={{
        selectedRowKeys: selectedFiles,
        onChange: setSelectedFiles,
      }}
      onDynamicBreadcrumb={{
        isReplaceComponentVisible: selectedFiles.length > 0,
        ReplaceComponent: () => (
          <Button
            btnType="secondary"
            onClick={() => setSelectedFiles([])}
          >
            Clear selection to show path if applicable
          </Button>),
      }}
    />
  );
};

stories.add('no drilldown', () => t(
  <FileBrowserTable path="" dataSource={easyData} columns={[]} />
));

stories.add('with client side drilldown', () => t(
  <FileBrowserTable
    path=""
    onGoUpDirectory={async () => easyData}
    onDrilldown={async () => depth2Data}
    columns={[]}
    dataSource={easyData}
  />
));

stories.add('dynamically show path or button', () => t(
  <FileBrowserTableWithDeleteButton />
));

stories.add('with drilldown and pagination', () => t(
  <FileBrowserTable
    path=""
    onGoUpDirectory={async () => easyData}
    onDrilldown={async () => depth2Data}
    columns={[]}
    dataSource={easyData}
    defaultPageSize={10}
    showPagination={true}
    showPageSizeSelector={true}
  />
));

stories.add('no client side drilldown', () => t(
  <FileBrowserTable
    path=""
    onGoUpDirectory={async () => undefined}
    onDrilldown={async () => undefined}
    columns={[]}
    dataSource={easyData}
  />
));

stories.add('with more columns', () => t(
  <FileBrowserTable
    path=""
    onGoUpDirectory={async () => easyData}
    onDrilldown={async () => depth2Data}
    columns={[
      {
        key: 'dog',
        title: 'Dog',
        dataIndex: 'dog',
      },
      {
        key: 'blarg',
        title: 'Blarg',
        dataIndex: 'blarg',
      },
      {
        key: 'i9999',
        title: 'i9999',
        dataIndex: 'i9999',
      },
    ]}
    dataSource={randomColumnsData}
  />
));

stories.add('no row on drilldown', () => t(
  <FileBrowserTable
    path=""
    onGoUpDirectory={async () => easyData}
    onDrilldown={async () => []}
    columns={[
      {
        key: 'dog',
        title: 'Dog',
        dataIndex: 'dog',
      },
      {
        key: 'blarg',
        title: 'Blarg',
        dataIndex: 'blarg',
      },
      {
        key: 'i9999',
        title: 'i9999',
        dataIndex: 'i9999',
      },
    ]}
    dataSource={randomColumnsData}
  />
  ));

stories.add('with value formatting', () => t(
  <FileBrowserTable
    onGoUpDirectory={async () => withFlatPaths}
    onDrilldown={async () => []}
    columns={[]}
    nameDataIndex={['name', 'path']}
    getEntityName={(flatPath: string) => flatPath.split('/')[flatPath.split('/').length - 1]}
    path="A"
    dataSource={withFlatPaths}
  />
));
