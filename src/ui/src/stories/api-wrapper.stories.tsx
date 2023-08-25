/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import APIWrapper from '../deployments-api/api-wrapper';
import { storiesOf } from '@storybook/react';

import { getDevStoryPath } from '../utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Develop/Data'), module);

const tag1 = {
  tagId: "t00001",
  tagName: "First tag"
}

const tag2 = {
  tagId: "t00002",
  tagName: "Second tag"
}

const publisher1 = {
  publisherId: "p00001",
  publisherName: "First Publisher"
}

const publisher2 = {
  publisherId: "p00002",
  publisherName: "Second Publisher"
}

const deployment1 = {
  id: "override-d00001",
  name: "Override Deployment 1",
  projectId: "p00001",
  projectName: "Project 1",
  modelType: "API",
  predictions: 1,
  driftMeasure: 1,
  qualityMeasure: 1,
  deploymentLocation: "Location 1",
  lastModified: new Date(),
  deploymentType: "AWS",
  source: "Source 1",
  tags: [tag1, tag2],
  createdAt: new Date(),
  publisher: publisher1,
}

const deployment2 = {
  id: "override-d00002",
  name: "Override Deployment 2",
  projectId: "p00001",
  projectName: "Project 1",
  modelType: "APP",
  predictions: 2,
  driftMeasure: 2,
  qualityMeasure: 2,
  deploymentLocation: "Location 2",
  lastModified: new Date(),
  deploymentType: "AWS",
  source: "Source 2",
  tags: [tag1, tag2],
  createdAt: new Date(),
  publisher: publisher2,
}

const deployment3 = {
  id: "override-d00002",
  name: "Override Deployment 3",
  projectId: "p00001",
  projectName: "Project 1",
  modelType: "LAUNCHER",
  predictions: 3,
  driftMeasure: 3,
  qualityMeasure: 3,
  deploymentLocation: "Location 3",
  lastModified: new Date(),
  deploymentType: "AWS",
  source: "Source 3",
  tags: [tag1, tag2],
  createdAt: new Date(),
  publisher: publisher2,
}

const overrideDeployments = [
  deployment1,
  deployment2,
  deployment3
]

stories.add('APIWrapper', () => <APIWrapper
projectId={'123'}
overrideDeployments={overrideDeployments}
/>);
