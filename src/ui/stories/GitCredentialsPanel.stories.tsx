import * as React from 'react';
import { storiesOf } from '@storybook/react';
import GitCredentialsPanel from '../src/auth-and-admin/git-credentials/GitCredentialsPanel';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Plan/Account/Git Credentials/GitCredentialsPanel'), module);

stories.add('basic view', () => <GitCredentialsPanel gitServiceProviders={[]} />);
