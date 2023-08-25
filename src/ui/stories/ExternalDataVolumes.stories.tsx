import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ExternalDataVolumes } from '../src/admin-external-data-volumes';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Data'), module);

stories.add('External Volume Page', () => (
  <ExternalDataVolumes/>
));
