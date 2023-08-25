import * as React from 'react';
import { storiesOf } from '@storybook/react';
import CreateDataSetFromFilesModal from '../src/filebrowser/CreateDataSetFromFilesModal';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Files'), module);

stories.add('CreateDataSetFromFilesModal', () => (
  <CreateDataSetFromFilesModal
    inputField={{
      type: 'text',
      componentClass: 'input',
      help: 'Data set name',
      id: 'inputName',
      defaultValue: '',
      label: 'Data Set Name'
    }}
    username="niole"
    submitLabel="Create Data Set"
    cancelLabel="Cancel"
    csrfToken="abc"
    submitUrl="def"
    title="Create Data Set"
    selectedFilePaths={[]}
  />
));
