import * as React from 'react';
import { storiesOf } from '@storybook/react';
import GitRepoTable from '../src/filebrowser/GitRepoTable';
import { RefType } from '../src/filebrowser/types';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Code/GitRepoTable'), module);

const uri = 'http.github.com';
const refTypes: RefType[] = [
  'branch',
  'ref',
  'head',
  'tag',
  'commitId',
];

const repos = refTypes.map(refType => (
  {
    location: `${refType}-location`,
    repoName: `DDLAB-${refType}-repo`,
    id: "dummyId",
    domain: "dummyDomain",
    gitCredentialId: "gitCredentialId",
    serviceProvider: "unknown",
    uri,
    refType,
    refLabel: `${refType}-label`,
  }
));

const csrfToken = 'csrf123abc';
const ownerUsername = 'purple peopleeater';
const projectName = 'predicting-edible-people-count';
const projectId = ''
const isGitBasedProject = false;

stories.add('happy path', () => (
  <GitRepoTable
    csrfToken={csrfToken}
    ownerUsername={ownerUsername}
    projectName={projectName}
    projectId={projectId}
    isGitBasedProject={isGitBasedProject}
    areReferencesCustomizable={true}
    gitRepos={repos}
    onCredentialSelect={() => undefined}
  />
));

stories.add('cant customize references', () => (
  <GitRepoTable
    csrfToken={csrfToken}
    ownerUsername={ownerUsername}
    projectName={projectName}
    projectId={projectId}
    isGitBasedProject={isGitBasedProject}
    areReferencesCustomizable={false}
    gitRepos={repos}
    onCredentialSelect={() => undefined}
  />
));
