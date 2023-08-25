import * as React from 'react';
import { storiesOf } from '@storybook/react';
import EditableFilePath from '../src/filebrowser/EditableFilePath';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Files/EditableFilePath'), module);

const breadCrumbs = [
  { label: 'A', url: 'A' },
  { label: 'B', url: 'B' },
  { label: 'C', url: 'C' },
];

const extraLongCrumbs = breadCrumbs.concat([
  { label: 'D', url: 'D' },
  { label: 'E', url: 'E' },
  { label: 'F', url: 'F' },
  { label: 'G', url: 'G' },
  { label: 'H', url: 'H' },
  { label: 'I', url: 'I' },
  { label: 'J', url: 'J' },
  { label: 'K', url: 'K' },
  { label: 'L', url: 'L' },
  { label: 'M', url: 'M' },
  { label: 'N', url: 'N' },
  { label: 'O', url: 'O' },
  { label: 'P', url: 'P' },
  { label: 'Q', url: 'Q' },
  { label: 'R', url: 'R' },
  { label: 'S', url: 'S' },
  { label: 'T', url: 'T' },
  { label: 'U', url: 'U' },
  { label: 'V', url: 'V' },
  { label: 'W', url: 'W' },
  { label: 'X', url: 'X' },
  { label: 'Y', url: 'Y' },
  { label: 'Z', url: 'Z' },
]);

const props = {
  resetStateOnSuccess: true,
  currentCommitId: 'fakecurrentCommitId',
  projectName: 'sdf',
  ownerUsername: 'ddd',
  oldPath: 'a/b/c',
  filename: 'c',
  closeHandler: () => undefined,
  saveAndRunHandler: () => undefined,
  breadCrumbs,
  defaultValues: { newName: 'File Name' },
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

stories.add('basic', () => <EditableFilePath {...props} />);

stories.add('show truncation', () => (
  <div style={{ border: '1px solid', width: 400 }}>
    <EditableFilePath {...{ ...props, breadCrumbs: extraLongCrumbs }} />
  </div>
));
