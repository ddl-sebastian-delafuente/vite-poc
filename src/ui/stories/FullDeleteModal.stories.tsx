import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '../src/components/Button/Button';
import FullDeleteModal from '../src/filebrowser/FullDeleteModal';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Files'), module);

stories.add('FullDeleteModal', () => (
  <FullDeleteModal
    OpenModalButton={Button}
    commitId="commitId"
    filePath="filePath"
    projectId="projectId"
    projectName="projectName"
    projectOwnerName="projectOwnername"
  />
));
