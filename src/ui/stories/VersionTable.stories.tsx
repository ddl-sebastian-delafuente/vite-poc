import * as React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '../src/utils/storybookUtil';
import VersionTable from '../src/components/VersionTable/VersionTable';

const data = [
  {
    version: { name: 'Version 4', url: '/' },
    commitId: { name: '6ad4x3m', url: '/' },
    note: 'This version has the purpose X.',
    deployed: '-',
    author: 'Domino',
    actions: [
      {
        name: 'Open in workspace',
        cta: () => alert('DDL')
      },
      {
        name: 'Stop/Start version',
        cta: () => alert('DDL')
      },
      {
        name: 'View Logs',
        cta: () => alert('DDL')
      }
    ]
  },
  {
    version: { name: 'Version 3', url: '/' },
    commitId: { name: '6ad4x3m', url: '/' },
    note: 'This is very good model with good things in it.',
    deployed: 'Aug 2020 - present',
    author: 'Domino',
    actions: [
      {
        name: 'Open in workspace',
        cta: () => alert('DDL')
      },
      {
        name: 'Stop/Start version',
        cta: () => alert('DDL')
      },
      {
        name: 'View Logs',
        cta: () => alert('DDL')
      }
    ]
  },
  {
    version: { name: 'Version 2', url: '/' },
    commitId: { name: '6ad4x3m', url: '/' },
    note: 'This is very fun but it degrades very fast.',
    deployed: 'May - Aug 2020',
    author: 'Domino',
    actions: [
      {
        name: 'Open in workspace',
        cta: () => alert('DDL')
      },
      {
        name: 'Stop/Start version',
        cta: () => alert('DDL')
      },
      {
        name: 'View Logs',
        cta: () => alert('DDL')
      }
    ]
  },
  {
    version: { name: 'Version 2', url: '/' },
    commitId: { name: '6ad4x3m', url: '/' },
    note: 'This version has the purpose X.',
    deployed: 'Dec 2019 - Apr 2020',
    author: 'Domino',
    actions: [
      {
        name: 'Open in workspace',
        cta: () => alert('DDL')
      },
      {
        name: 'Stop/Start version',
        cta: () => alert('DDL')
      },
      {
        name: 'View Logs',
        cta: () => alert('DDL')
      }
    ]
  }
];
const stories = storiesOf(getDevStoryPath('Publish/Deployments'), module);
stories.add('Version Table', () => <VersionTable data={data} />);
