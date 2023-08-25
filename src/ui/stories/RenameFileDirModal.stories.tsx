import * as React from 'react';
import { storiesOf } from '@storybook/react';
import RenameFileDirModal from '../src/filebrowser/RenameFileDirModal';
import { EntityType } from '../src/filebrowser/types';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Files/RenameFileModal'), module);

stories.add('directory', () => (
  <RenameFileDirModal
    locationUrl="locaitonurl"
    // eslint-disable-next-line
    onSubmit={() => console.log('submit')}
    oldPath="a/b"
    entityType={EntityType.DIRECTORY}
    ownerUsername="me"
    projectName="project"
  />
));

stories.add('file', () => (
  <RenameFileDirModal
    locationUrl="locaitonurl"
    projectName="project"
    ownerUsername="me"
    oldPath="a/b"
    entityType={EntityType.FILE}
  />
));
