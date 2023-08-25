import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { CommitEntryStyled } from '../../src/filebrowserGBP/components/GitCommitPicker';
import { DominoProjectsApiRepositoriesResponsesBrowseCommitShortDto as Commit } from '@domino/api/dist/types';
import { getDevStoryPath } from '../../src/utils/storybookUtil';

const dateOffset = (24*60*60*1000) * 5; //5 days
const myDate = new Date();
myDate.setTime(myDate.getTime() - dateOffset);

const data: Commit[] = [
  {
    sha: 'f624648f624648',
    author: {
    name: 'Eric Committer',
    date: new Date(new Date().getTime() - 3600*3000) // 3 hours ago
    },
    message: 'Committed during auto-shutdown of workspace this is a very long commit message'
  },
  {
    sha: 'aabb5afaabb5af',
    author: {
    name: 'Eric Committer',
    date: new Date(new Date().getTime() - 3600*24000*2.5) // 2.5 days ago
    },
    message: 'Fixed a bug in a data processing step'
  },
  {
    sha: 'ab2f44aab2f44a',
    author: {
    name: 'KD Lang',
    date: new Date(new Date().getTime() - 3600*24000*7) // 7 days ago
    },
    message: 'Added some comments'
  }
];

storiesOf(getDevStoryPath('Develop/Files'), module)
  .add('File Browser (GBP), Git Commit Picker', () => (
    <>
    <div className="ant-select-dropdown-menu-item" style={{width: 380, border: '1px solid grey', marginBottom: 20}}>
      <CommitEntryStyled commit={data[0]}/>
    </div>
    <div className="ant-select-dropdown-menu-item" style={{width: 380, border: '1px solid grey', marginBottom: 20}}>
      <CommitEntryStyled commit={data[1]}/>
    </div>
    <div className="ant-select-dropdown-menu-item" style={{width: 380, border: '1px solid grey', marginBottom: 20}}>
      <CommitEntryStyled commit={data[2]}/>
    </div>
  </>
))
