import * as React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '../src/utils/storybookUtil';
import Hosting from '../src/components/Hosting/Hosting';

const props = {
  hostingOptions: [
    { value: 'Domino', label: 'Domino' },
    { value: 'Snowflake', label: 'Snowflake' }
  ],
  sectionOptions: [
    { value: 'REST API', label: 'REST API' },
    { value: 'App', label: 'App' },
    { value: 'Launcher', label: 'Launcher' }
  ],
  environmentOptions: [
    { value: 'Domino Py3.6,R3', label: 'Domino Py3.6,R3' },
    { value: 'Domino Py3.6,R4', label: 'Domino Py3.6,R4' },
    { value: 'Domino Py3.6,R5', label: 'Domino Py3.6,R5' }
  ]
};

const stories = storiesOf(getDevStoryPath('Publish/Deployments/Hosting'), module);
stories.add('Hosting', () => <Hosting {...props} />);
