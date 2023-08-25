import * as React from 'react';
import fetchMock from 'fetch-mock';
import { storiesOf } from '@storybook/react';
import ActionBar from '../src/filebrowser/ActionBar';
import { getDevStoryPath } from '../src/utils/storybookUtil';

fetchMock.restore();

const t = (cmp: JSX.Element) => <>{cmp}</>;

const stories = storiesOf(getDevStoryPath('Develop/Files/ActionBar FileBrowser'), module);

const defaultProps = {
  showDropZone: () => undefined,
  selectedEntities: [],
  ownerUsername: 'integration-test',
  projectName: 'quickstart',
  allowFolderDownloads: true,
  removeFilesEndpoint: 'removeFilesEndpoint',
  successfulFilesRemovalEndpoint: 'successfulFilesRemovalEndpoint',
  createDatasetFromProjectEndpoint: 'createDatasetFromProjectEndpoint',
  maxAllowedFileDownloads: 1,
  commitId: 'commitId',
  csrfToken: 'csrfToken',
  areDataProjectsEnabled: true,
  currentDirPath: 'rootpath',
  createFolderEndpoint: 'createFolderEndpoint',
  isAnalyticProject: true,
  userIsAllowedToEditProject: true,
  createFileEndpoint: 'createFileEndpoint',
  projectContainsCommits: true,
  atHeadCommit: true,
  downloadSelectedEntitiesEndpoint: 'downloadSelectedEntitiesEndpoint',
  downloadCLIPageEndpoint: 'downloadCLIPageEndpoint',
  downloadProjectFolderAsZipEndpoint: 'downloadProjectFolderAsZipEndpoint',
  breadcrumbData: [{ label: 'label', url: 'labelurl' }, { label: 'termlabel', url: 'termurl' }],
  currentCommitId: 'currentCommitId',
  setDownloadErrorMessage: (message?: string) => console.info(message),
  projectId: '5cdb22aa8a9a1300060eac86'
};

stories.add('default, no selected files', () => t(
  <ActionBar
    {...defaultProps}
  />
  ));

stories.add('selected files', () => t(
  <ActionBar
    {...defaultProps}
    selectedEntities={[
      {
        downloadUrl: 'x',
        isDir: true,
        path: 'cat/dog',
      },
      {
        downloadUrl: 'x',
        isDir: false,
        path: 'cat/car.txt',
      },
    ]}
  />
));
