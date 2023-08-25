import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ModelInputFilesInput from '../src/modelmanager/ModelInputFilesInput';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const defaultProps = {
  selectedProjectsFiles: ["main.R", "main.py", "main.r", "model.py", "model.R", "model.r", "modea.R", "test.txt"],
  defaultSelectedFiles: ["model.py"],
  fileFieldName: "model.py"
};

const stories = storiesOf(getDevStoryPath('Components'), module);

stories.add('ModelInputFilesInput Input field', () => (
  <ModelInputFilesInput
    {...defaultProps}
  />
));
