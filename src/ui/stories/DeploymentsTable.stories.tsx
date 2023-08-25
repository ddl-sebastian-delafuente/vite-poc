import * as React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '../src/utils/storybookUtil';
import DeploymentsTable from '../src/components/DeploymentsTable/DeploymentsTable';

const now = new Date();
const yesterday = new Date('Mon Dec 06 2021 10:47:34 GMT-0300');
const aMonthAgo = new Date('Thu Nov 11 2021 10:47:34 GMT-0300');
const twoMonthAgo = new Date('Thu Oct 07 2021 10:47:34 GMT-0300');
const aYearAgo = new Date('Thu Sep 24 2020 10:47:34 GMT-0300');

const data = [
  {
    deployment: { name: 'Production API', url: '/' },
    project: { name: 'Project Asxa', url: '/' },
    predictions: 100000000000,
    drift: 0,
    quality: 0,
    hosted: { name: 'Snowflake' },
    lastModified: now
  },
  {
    deployment: { name: 'test21', url: '/' },
    project: { name: 'Project Asxa', url: '/' },
    predictions: 1500000000,
    drift: 0,
    quality: 3,
    hosted: { name: 'Nvidia' },
    lastModified: yesterday
  },
  {
    deployment: { name: 'oil consumption #17', url: '/' },
    project: { name: 'Project 17', url: '/' },
    predictions: 200000,
    drift: 0,
    hosted: { name: 'Nvidia' },
    lastModified: aMonthAgo
  },
  {
    deployment: { name: 'BMAF', url: '/' },
    project: { name: 'Esdfe', url: '/' },
    predictions: 375000000000,
    drift: 5,
    quality: 0,
    hosted: { name: 'Domino', description: 'Launcher' },
    lastModified: twoMonthAgo
  },
  {
    deployment: { name: 'Rail Traffic prediction', url: '/' },
    project: { name: 'Project Asxa', url: '/' },
    predictions: 'Not Running',
    hosted: { name: 'Domino', description: 'API' },
    lastModified: aYearAgo
  }
];

const stories = storiesOf(getDevStoryPath('Publish/Deployments'), module);
stories.add('Deployments Table', () => <DeploymentsTable data={data} />);
