import * as React from 'react';
import { storiesOf } from '@storybook/react';
import EditGitRepoContent from '../src/filebrowser/EditGitRepoContent';
import { GitCredential } from '../src/filebrowser/types';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Code/EditGitRepoContent'), module);

const credOptions: GitCredential[] =[
  {
    id: 'none',
    name: 'None',
    gitServiceProvider: '',
    domain: 'none',
    fingerprint: 'none',
    protocol: 'none'
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

const props = {
  // eslint-disable-next-line
  onSubmit: async () => console.log('submit'),
  // eslint-disable-next-line
  onClose: () => console.log('close'),
  areReferencesCustomizable: true,
  repoName: 'DD-repo-lsdkfjsdlfkj',
  url: '.comgithublah blah blah',
  currentGitCredentialId: '1',
  currentGitServiceProvider: {
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
  },
  gitCredentials: credOptions,
  gitServiceProviders
};

stories.add('happy path', () => (
  <EditGitRepoContent
    {...props}
  />
));

stories.add('no git credentials', () => (
  <EditGitRepoContent
    {...{...props, gitCredentials: credOptions.slice(0,1), currentGitCredentialId: credOptions[0].id}}
  />
));

stories.add('references not customizable', () => (
  <EditGitRepoContent
    {...{ ...props, areReferencesCustomizable: false }}
  />
));
