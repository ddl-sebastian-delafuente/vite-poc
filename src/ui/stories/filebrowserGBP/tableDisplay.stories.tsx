import * as React from 'react';
import { storiesOf } from '@storybook/react';
import FileBrowserTable from '../../src/filebrowserGBP/components/FileBrowserTable';
import {
  DominoProjectsApiRepositoriesResponsesBrowseRepoBrowserEntryDto as BrowserEntryDto
} from '@domino/api/dist/types';
import { getDevStoryPath } from '../../src/utils/storybookUtil';

const data: BrowserEntryDto[] = [
  {
    kind: 'file',
    name: 'test name',
    path: 'testPath',
    sha: 'sha string',
    modified: {
      sha: 'sha string',
      author: {
        name: 'author name',
        date: '01/01/2010'
      },
      message: 'Here is a commit message'
    }
  },
  {
    kind: 'file',
    name: 'best name',
    path: 'testPath',
    sha: 'sha string',
    modified: {
      sha: 'sha string',
      author: {
        name: 'author name',
        date: '01/01/2010',
      },
      message: 'Here is a commit message'
    }
  },
  {
    kind: 'dir',
    name: 'best name',
    path: 'testPath',
    sha: 'sha string',
    modified: {
      sha: 'sha string',
      author: {
        name: 'author name',
        date: '01/01/2010',
      },
      message: 'Here is a commit message'
    }
  }
];

storiesOf(getDevStoryPath('Develop/Files'), module)
  .add('File Browser (GBP), Table Display', () => (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <FileBrowserTable entries={data} onDirectoryClick={() => {}} onFileClick={() => {}}/>
  ));
