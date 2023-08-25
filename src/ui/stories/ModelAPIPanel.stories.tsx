import * as React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '../src/utils/storybookUtil';
import ModelAPIPanel from '../src/components/ModelAPIPanel/ModelAPIPanel';

const props = {
  description: 'This model is about the prediction of xyz things',
  input: ['cost', 'age', 'volume'],
  output: ['prediction'],
  project: 'Project Asxa',
  author: 'Domino',
  lastModified: 'yesterday',
  currentVersion: { name: 'Version 4', url: '/' },
  modelUrl: { name: '//w.wefa.wefawe/aefas/ae', url: '/' },
  artifacts: { name: '//wefasdf/sfwaesd', url: '/' },
  modelData: { name: '//wefasdf/sfwaesd', url: '/' },
  modelSchema: { name: 'View Model Schema', url: '/' },
  createdAt: '17-01-2021',
  type: 'Classification',
  hardwareTier: '1 Core',
  packages: 'PySy',
  dependencies: '.....'
};

const stories = storiesOf(getDevStoryPath('Publish/Deployments'), module);
stories.add('Model API Panel', () => <ModelAPIPanel {...props} />);
