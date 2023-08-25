import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ProjectGitRepoDetails from '../src/filebrowserGBP/components/ProjectGitRepoDetailsGBP';
import { GitCredentialsContext } from '../src/filebrowser/util';
import { GitCredential } from '../src/filebrowser/types';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Code/ProjectGitRepoDetails'), module);

const repository = {
  id: '0',
  mountDir: '/feel/the/hatred/of/ten/thousand/years',
  name: 'you/arenotprepared',
  projectId: "111222",
  url: 'https://github.com/you/arenotprepared.git',
  refType: 'head'
};
stories.add('with no credentials', () => (
  <ProjectGitRepoDetails
    repository={repository}
  />
));

const allCredentials = [
  {name: 'one', id: '1'},
  {name: 'two', id: '2'}
] as GitCredential[];
stories.add('with credentials', () => (
  <GitCredentialsContext.Provider value={{allCredentials, getCredentialForRepo: () => undefined}}>
    <ProjectGitRepoDetails
      repository={repository}
    />
  </GitCredentialsContext.Provider>
));
