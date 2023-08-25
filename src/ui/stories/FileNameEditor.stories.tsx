import * as React from 'react';
import { storiesOf } from '@storybook/react';
import FileNameEditor from '../src/filebrowser/FileNameEditor';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Files/FileNameEditor'), module);

const props = {
  resetStateOnSuccess: true,
  currentCommitId: 'fakecurrentCommitId',
  projectName: 'sdf',
  ownerUsername: 'ddd',
  oldPath: 'a/b/c',
  filename: 'c',
  closeHandler: () => undefined,
  saveAndRunHandler: () => undefined,
  isFileRunnableAsApp: true,
  isFileRunnableFromView: true,
  isFileLaunchableAsNotebook: true,
  publishAppEndpoint: 'publishAppEndpoint',
  atHeadCommit: true,
  redirectToOverviewPageOnSave: true,
  action: 'action',
  editing: true,
  creating: false,
  showSaveAndRun: true,
  locationUrl: 'licaitonurl',
  csrfToken: 'csrfToken',
};

stories.add('creating', () => (
  <FileNameEditor
    {...props}
    creating={true}
    defaultValues={{ newName: 'File Name' }}
  />
));

stories.add('not creating', () => (
  <FileNameEditor
    {...props}
    creating={false}
    defaultValues={{ newName: 'File Name' }}
  />
));
