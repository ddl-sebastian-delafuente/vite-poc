import { snapshotFilesView } from '@domino/mocks/dist/mock-usecases';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { getDevStoryPath } from '../../utils/storybookUtil';
import { DownloadSelectedFiles as DownloadSelectedFilesComponent, DownloadSelectedFilesProps } from '../DownloadSelectedFiles';

export default {
  title: getDevStoryPath('Develop/Data/Datasets'),
  component: DownloadSelectedFilesComponent,
  argTypes: {
    allItems: { control: { type: 'boolean' } }
  },
  args: {
    allItems: false,
    manifest: snapshotFilesView.rows,
    singleFile: false,
    snapshotId: 'test-snapshot-id',
    taskTime: 30,
  }
}

interface TemplateProps extends DownloadSelectedFilesProps {
  singleFile: boolean;
  taskTime: number;
}

const Template = ({
  manifest,
  singleFile,
  taskTime,
  ...args
}: TemplateProps) => {
  React.useEffect(() => {
    let startTime: Date;
    fetchMock.restore()
      .get('glob:/v4/datasetrw/snapshot/*/file/meta?*', {
        uri: '/v4/datasetrw/snapshot/mock-snapshot-id/file/raw?path=test-file.txt',
      })
      .post('glob:/v4/datasetrw/snapshot/*/download', () => {
        startTime = new Date();
        return {
          taskId: 'test-task-id',
          taskKey: 'test-task-key',
          taskStatsu: 'Created',
        };
      })
      .get('glob:/v4/datasetrw/snapshot/test-snapshot-id/download/*', () => {
        const currentTime = new Date();

        const elapsedTime = currentTime.valueOf() - startTime.valueOf();

        return {
          taskId: 'test-task-id',
          taskKey: 'test-task-key',
          taskStatus: elapsedTime > (taskTime * 1000) ? 'Succeeded' : 'Started'
        }
      })
  }, [taskTime]);

  const resolvedManifest = React.useMemo(() => {
    if (!singleFile) {
      return manifest;
    }

    return manifest.slice(0, 1);
  }, [manifest, singleFile]);

  return (
    <DownloadSelectedFilesComponent manifest={resolvedManifest} {...args} />
  )
}

export const DownloadSelectedFiles = Template.bind({})
