import * as React from 'react';
import { storiesOf } from '@storybook/react';
import OtherProjectsTable from '../src/filebrowser/OtherProjectsTable';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Files/OtherProjectsTable'), module);

const csrfToken = 'csrf123abc';
const ownerUsername = 'purple peopleeater';
const projectName = 'predicting-edible-people-count';

const projects = [
  'a', 'b', 'sdsdfdsf', 'p', 'd', 'kk'
];
const availableReleases = [
  {
    releaseId: 'a',
    runNumber: 0,
    runHeading: 'this-is-a-run',
    createdAt: 'january 1 2007',
    isSelected: false,
  },
  {
    releaseId: 'b',
    runNumber: 8,
    runHeading: 'no-this-is-a-run',
    createdAt: 'january 2 2007',
    isSelected: false,
  },
  {
    releaseId: 'c',
    runNumber: 8,
    runHeading: 'lskdfjno-this-is-a-run',
    createdAt: 'january 2 2007',
    isSelected: true,
  },
];

const props = {
  ownerUsername,
  csrfToken,
  userIsAllowedToChangeProjectSettings: true,
  runTaggingEnabled: true,
  projectName,
  importedProjects: [
    {
      id: '0',
      projects,
      availableReleases,
      isReleaseOptionSelected: false,
      variablesAvailable: true,
      ownerUsername: 'me',
      projectName: 'you',
      isActive: true,
      mountPath: 'a/b/c',
      isArchived: false,
      filesAvailable: true,
      packageAvailable: true,
    },
    {
      id: '1',
      projects,
      availableReleases,
      isReleaseOptionSelected: true,
      variablesAvailable: false,
      ownerUsername: 'merm',
      projectName: 'yourm',
      isActive: true,
      mountPath: 'a/b/c/yorm',
      isArchived: false,
      filesAvailable: false,
      packageAvailable: true,
    },
  ]
};

stories.add('happy path', () => <OtherProjectsTable {...props} />);

const withInactiveProps = {
  ...props,
  importedProjects: [
    {
      id: '0',
      projects,
      availableReleases,
      isReleaseOptionSelected: false,
      variablesAvailable: true,
      ownerUsername: 'me',
      projectName: 'you',
      isActive: true,
      mountPath: 'a/b/c',
      isArchived: false,
      filesAvailable: true,
      packageAvailable: true,
    },
    {
      id: '1',
      projects,
      availableReleases,
      isReleaseOptionSelected: true,
      variablesAvailable: false,
      ownerUsername: 'merm',
      projectName: 'yourm',
      isActive: false,
      mountPath: 'a/b/c/yorm',
      isArchived: false,
      filesAvailable: false,
      packageAvailable: false,
    },
  ]

};
stories.add('with inactive rows', () => <OtherProjectsTable {...withInactiveProps} />);
