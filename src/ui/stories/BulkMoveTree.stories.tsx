import * as React from 'react';
import { storiesOf } from '@storybook/react';
import BulkMoveTree from '../src/filebrowser/BulkMoveTree';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Files'), module);

const props = {
  selectedPath: 'a/b',
  relativePath: 'a/b',
  // eslint-disable-next-line no-console
  selectNode: () => console.log('select'),
  tree: [{
    isOpen: true,
    dirName: 'a',
    childDirs: [
      {
        isOpen: true,
        dirName: 'a/b',
        childDirs: [],
      },
      {
        isOpen: true,
        dirName: 'a/c',
        childDirs: [],
      },
    ],
  }],
  // eslint-disable-next-line no-console
  onClose: () => console.log('close'),
  // eslint-disable-next-line no-console
  onOpen: () => console.log('open'),
}

stories.add('BulkMoveTree', () => (
  <BulkMoveTree
    {...props}
  />
));
