import * as React from 'react';
import { storiesOf } from '@storybook/react';
import GitCredentialsSummaryTable from '../src/auth-and-admin/git-credentials/GitCredentialsSummaryTable';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Plan/Account/Git Credentials/GitCredentialsSummaryTable'), module);

const gitCredentials = [{
  id: 'id',
  name: 'name',
  gitServiceProvider: 'github',
  domain: 'domain',
  fingerprint: 'fingerprint',
  protocol: 'protocol'
}];

stories.add('basic view', () => (
  <GitCredentialsSummaryTable
    credentials={gitCredentials}
  />
));
