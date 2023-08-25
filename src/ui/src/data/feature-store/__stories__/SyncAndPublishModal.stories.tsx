import {
  getJob,
  startJob
} from '@domino/mocks/dist/mock-stories/Jobs';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { getDevStoryPath } from '../../../utils/storybookUtil';
import { 
  SyncAndPublishModalProps,
  SyncAndPublishModal as SyncAndPublishModalComponent 
} from '../SyncAndPublishModal';

export default {
  title: getDevStoryPath('Develop/Data/Feature Store'),
  component: SyncAndPublishModalComponent,
  args: {
    environmentId: 'mock-environment-id',
    featureStoreId: 'mock-featurestore-id',
    gitRepoBranch: 'mockGitRepoBranch',
    gitRepoPath: 'mockGitRepoPath',
    gitFiles: {
      created: ['/some/file/path/newfile.txt'],
      modified: ['/some/filepath/modifedFile.txt'],
      deleted: ['/some/filepath/deletedFile.txt'],
    },
    projectId: 'mock-project-id',
    visible: true
  }
}

type TemplateProps = SyncAndPublishModalProps;

const Template = (args: TemplateProps) => {
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getJob())
      .mock(...startJob())
  }, []);

  return (
    <SyncAndPublishModalComponent {...args} />
  );
}

export const SyncAndPublishModal = Template.bind({});
