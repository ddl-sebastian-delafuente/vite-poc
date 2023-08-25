import * as React from 'react';
import { storiesOf } from '@storybook/react';
import AddGitRepoContent from '../src/filebrowser/AddGitRepoContent';
import { GitCredential } from '../src/filebrowser/types';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Code/AddGitRepoContent'), module);

const credOptions: GitCredential[] = [
  {
    id: '',
    name: 'None',
    gitServiceProvider: '',
    domain: '',
    fingerprint: '',
    protocol: ''
  },
  {
    id: '1',
    name: 'Test',
    gitServiceProvider: 'BitBucket',
    domain: 'bitbucket',
    fingerprint: 'none',
    protocol: 'none'
  },
];

const gitServiceProviders = [
  {
    "value": "github",
    "label": "GitHub",
    "requiresDomain": false,
    "accessTypes": [
      {
        "accessType": "personalAccessToken",
        "label": "Personal Access Token (Https)"
      },
      {
        "accessType": "privateSshKey",
        "label": "Private SSH Key"
      }
    ]
  },
  {
    "value": "githubEnterprise",
    "label": "GitHub Enterprise",
    "requiresDomain": true,
    "accessTypes": [
      {
        "accessType": "personalAccessToken",
        "label": "Personal Access Token (Https)"
      },
      {
        "accessType": "privateSshKey",
        "label": "Private SSH Key"
      }
    ]
  },
  {
    "value": "gitlab",
    "label": "GitLab",
    "requiresDomain": true,
    "accessTypes": [
      {
        "accessType": "personalAccessToken",
        "label": "Personal Access Token (Https)"
      },
      {
        "accessType": "privateSshKey",
        "label": "Private SSH Key"
      }
    ]
  },
  {
    "value": "bitBucket",
    "label": "BitBucket",
    "requiresDomain": false,
    "accessTypes": [
      {
        "accessType": "appPassword",
        "label": "Application Password (Https)"
      },
      {
        "accessType": "personalAccessToken",
        "label": "Personal Access Token (Https)"
      }
    ]
  },
  {
    "value": "gitlabEnterprise",
    "label": "GitLab Enterprise",
    "requiresDomain": true,
    "accessTypes": [
      {
        "accessType": "personalAccessToken",
        "label": "Personal Access Token (Https)"
      },
      {
        "accessType": "privateSshKey",
        "label": "Private SSH Key"
      }
    ]
  },
  {
    "value": "bitBucketServer",
    "label": "BitBucket Server",
    "requiresDomain": false,
    "accessTypes": [
      {
        "accessType": "personalAccessToken",
        "label": "Personal Access Token (Https)"
      },
      {
        "accessType": "privateSshKey",
        "label": "Private SSH Key"
      }
    ]
  }
]

async function onSubmit() {
  // eslint-disable-next-line
  console.log('submit');
}

stories.add('no credentials', () => (
  <AddGitRepoContent
    gitCredentials={credOptions.slice(0,1)}
    gitServiceProviders={gitServiceProviders}
    areReferencesCustomizable={false}
    hideLearnMoreOnFile={false}
    onSubmit={onSubmit}
    hasError={false}
  />
));

stories.add('adding', () => (
  <AddGitRepoContent
    gitCredentials={credOptions}
    gitServiceProviders={gitServiceProviders}
    areReferencesCustomizable={false}
    hideLearnMoreOnFile={false}
    onSubmit={onSubmit}
    hasError={false}
  />
));

stories.add('adding, customizable refs', () => (
  <AddGitRepoContent
    gitCredentials={credOptions}
    gitServiceProviders={gitServiceProviders}
    areReferencesCustomizable={true}
    hideLearnMoreOnFile={false}
    onSubmit={onSubmit}
    hasError={false}
  />
));

stories.add('editing', () => (
  <AddGitRepoContent
    gitCredentials={credOptions}
    gitServiceProviders={gitServiceProviders}
    onSubmit={onSubmit}
    repoName="nam nam ename"
    areReferencesCustomizable={false}
    hideLearnMoreOnFile={false}
    hasError={false}
  />
));

stories.add('editing, with all defaults', () => (
  <AddGitRepoContent
    gitCredentials={credOptions}
    gitServiceProviders={gitServiceProviders}
    onSubmit={onSubmit}
    repoName="nam nam ename"
    url="git.http.hswww.google.com"
    defaultReference="ref"
    areReferencesCustomizable={false}
    hideLearnMoreOnFile={false}
    hasError={false}
  />
));

stories.add('editing, customizable refs', () => (
  <AddGitRepoContent
    gitCredentials={credOptions}
    gitServiceProviders={gitServiceProviders}
    onSubmit={onSubmit}
    repoName="nam nam ename"
    areReferencesCustomizable={true}
    hideLearnMoreOnFile={false}
    hasError={false}
  />
));

stories.add('editing, customizable refs, hasError true', () => (
  <AddGitRepoContent
    gitCredentials={credOptions}
    gitServiceProviders={gitServiceProviders}
    onSubmit={onSubmit}
    repoName="nam nam ename"
    areReferencesCustomizable={true}
    hideLearnMoreOnFile={false}
    hasError={true}
  />
));
