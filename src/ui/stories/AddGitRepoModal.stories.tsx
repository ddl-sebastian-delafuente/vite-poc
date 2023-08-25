import * as React from 'react';
import { storiesOf } from '@storybook/react';
import AddGitRepoModal from '../src/filebrowser/AddGitRepoModal';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Code/AddGitRepoModal'), module);

stories.add('editing, customizable refs, in modal', () => (
  <AddGitRepoModal
    openButtonLabel="edit"
    hideLearnMoreOnFile={false}
    areReferencesCustomizable={true}
    onSubmit={async () => undefined}
    isDisabled={false}
    hasError={false}
  />
));

stories.add('editing, customizable refs, in modal, shows hasError true', () => (
  <AddGitRepoModal
    openButtonLabel="edit"
    hideLearnMoreOnFile={false}
    areReferencesCustomizable={true}
    onSubmit={async () => undefined}
    isDisabled={false}
    hasError={true}
  />
));

stories.add('disabling add new repository for anonymous user', () => (
  <AddGitRepoModal
    openButtonLabel="edit"
    hideLearnMoreOnFile={false}
    areReferencesCustomizable={true}
    onSubmit={async () => undefined}
    isDisabled={true}
    hasError={false}
  />
));
