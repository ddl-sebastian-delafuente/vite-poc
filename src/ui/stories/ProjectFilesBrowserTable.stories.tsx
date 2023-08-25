import * as React from 'react';
import { storiesOf } from '@storybook/react';
import FilesBrowserTable from '../src/filebrowser/FilesBrowserTable';
import { mockRevision, mockRevisions } from './mockData';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Files/ProjectFilesBrowserTable'), module);

const numRevisions = 1000;
const withRunIds = true;
const fromNow = true;

const defaultProps = {
  selectedRevision: mockRevision({ withRunId: withRunIds, fromNow }),
  availableRevisions: mockRevisions({ numRevisions, withRunIds, fromNow }),
  projectSizeBytes: 1,
  commitsNonEmpty: true,
  breadcrumbData: [
    {
      label: 'a',
      url: 'a',
    },
    {
      label: 'b',
      url: 'b'
    },
  ],
  csrfToken: 'c^s(r*f&t!o@k%e-n',
  thisCommitId: 'def',
  headCommitId: 'def',
  headers: [
    {
      Header: '',
      accessor: 'checkbox',
      width: 25,
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Size',
      accessor: 'size',
      minWidth: 75,
    },
    {
      Header: 'Modified',
      accessor: 'modified',
      width: 150,
    },
    {
      Header: '',
      accessor: 'details',
      width: 75,
    },
  ],
  rows: [
    {
      checkbox: {
        dataPath: 'domino/dir/file',
        dataUrl: 'urltodata',
        isDir: false,
      },
      name: {
        sortableName: 'dominostats.json',
        isDir: false,
        label: 'dominostats.json',
        fileName: 'dominostats.json',
        url: 'urlforfilename',
        helpUrl: '',
      },
      size: {
        label: '6kb',
        inBytes: 6000,
      },
      modified: {
        label: '1/2/34',
        time: 123,
      },
      details: {
        isDir: false,
        isFileLaunchableAsNotebook: true,
        isFileRunnableFromView: true,
        filePath: 'domino/dir/file',
        filePathName: 'sdfkj',
        quotedFilePath: '\'domino/dir/file\'',
        launchNotebook: {
          label: 'Launch Notebook',
          url: 'launchnotebookurl',
          stringifiedGitId: 'abc',
        },
        run: {
          label: 'Run',
        },
        edit: {
          label: 'Edit',
          url: 'edit/url',
        },
        download: {
          label: 'Download',
          url: 'download/url',
        },
        share: {
          label: 'Share',
          url: 'share/url',
        },
        delte: {
          label: 'Delete',
        },
      },
    },
    {
      checkbox: {
        dataPath: 'comino/dir/file',
        dataUrl: 'urltodata',
        isDir: false,
      },
      name: {
        isDir: false,
        sortableName: 'file',
        label: '/notmodified/dir/file',
        fileName: '/notmodified/dir/file',
        url: 'urlforfilename',
        helpUrl: '',
      },
      size: {
        label: '7kb',
        inBytes: 7000,
      },
      modified: {
        label: '',
        time: 0,
      },
      details: {
        isDir: false,
        isFileLaunchableAsNotebook: true,
        isFileRunnableFromView: true,
        filePath: 'domino/dir/file',
        filePathName: 'sdfkj',
        quotedFilePath: '\'domino/dir/file\'',
        launchNotebook: {
          label: 'Launch Notebook',
          url: 'launchnotebookurl',
          stringifiedGitId: 'abc',
        },
        run: {
          label: 'Run',
        },
        edit: {
          label: 'Edit',
          url: 'edit/url',
        },
        download: {
          label: 'Download',
          url: 'download/url',
        },
        share: {
          label: 'Share',
          url: 'share/url',
        },
        delte: {
          label: 'Delete',
        },
      },
    },
    {
      checkbox: {
        dataPath: 'vomino/dir/file',
        dataUrl: 'urltodata',
        isDir: true,
      },
      name: {
        sortableName: 'dir',
        isDir: true,
        label: 'dir',
        fileName: 'dir',
        url: 'urlforfilename',
        helpUrl: '',
      },
      size: {
        label: '1kb',
        inBytes: 1000,
      },
      modified: {
        label: '1/2/34',
        time: 1234,
      },
      details: {
        isDir: true,
        dirPath: 'domino/dir/',
        download: {
          label: 'Dowload',
          url: 'download/url',
        },
        delte: {
          label: 'Delete',
        },
      },
    },
    {
      checkbox: {
        dataPath: 'zomino/dir/file',
        dataUrl: 'urltodata',
        isDir: true,
      },
      name: {
        sortableName: 'dir',
        isDir: true,
        label: 'dir',
        fileName: 'dir',
        url: 'urlforfilename',
        helpUrl: '',
      },
      size: {
        label: '0kb',
        inBytes: 0,
      },
      modified: {
        label: '',
        time: 0,
      },
      details: {
        isDir: true,
        dirPath: 'domino/dir/',
        download: {
          label: 'Dowload',
          url: 'download/url',
        },
        delte: {
          label: 'Delete',
        },
      },
    },
  ],
  ownerUsername: 'me',
  projectName: 'myProject',
  relativePath: '/',
  initiallyAvailableDirectories: ['vomino/dir/file', 'zomino/dir/file'],
};

function getEditableProps(props: any) {
  return { ...props, canEdit: true };
}

function getAllowFolderDownloadsProps(props: any) {
  return { ...props, allowFolderDownloads: true };
}

function nonEmptyCommitProps(props: any) {
  return { ...props, commitsNonEmpty: false };
}

stories.add('basic', () => (
  <FilesBrowserTable
    {...nonEmptyCommitProps(
      getAllowFolderDownloadsProps(getEditableProps(defaultProps)),
    )}
  />
));

stories.add('cant edit, can\'t download dirs', () => (
  <FilesBrowserTable {...nonEmptyCommitProps(defaultProps)} />
));

stories.add('empty comits', () => (
  <FilesBrowserTable
    {...getAllowFolderDownloadsProps(getEditableProps(defaultProps))}
  />
));
