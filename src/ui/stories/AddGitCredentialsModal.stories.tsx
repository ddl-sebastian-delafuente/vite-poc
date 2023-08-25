import * as React from 'react';
import { storiesOf } from '@storybook/react';
import AddGitCredentialsModal from '../src/auth-and-admin/git-credentials/AddGitCredentialsModal';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Plan/Account/Git Credentials/AddGitCredentialsModal'), module);

stories.add('editing, customizable refs, in modal', () => (
  <AddGitCredentialsModal
    hideLearnMoreOnFile={false}
    areReferencesCustomizable={true}
    onSubmit={async () => undefined}
    isDisabled={false}
    gitServiceProviders={[]}
  />
));

stories.add('disabling add new repository for anonymous user', () => (
  <AddGitCredentialsModal
    hideLearnMoreOnFile={false}
    areReferencesCustomizable={true}
    onSubmit={async () => undefined}
    isDisabled={true}
    gitServiceProviders={[]}
  />
));
