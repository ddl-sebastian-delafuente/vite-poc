import * as React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { storiesOf } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { getDevStoryPath } from '../src/utils/storybookUtil';
import HostingInfo from '../src/components/Hosting/HostingInfo';

const props = {
  hostName: 'hostname',
  fileName: 'fileName',
  functionName: 'functionName',
  environmentId: 'environmentId',
  projectId: 'projectId'
};
const stories = storiesOf(getDevStoryPath('Publish/Deployments/Hosting'), module);
stories.add('Hosting Info', () => <BrowserRouter><HostingInfo {...props} /></BrowserRouter>);
