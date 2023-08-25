import * as React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '../src/utils/storybookUtil';
import ModelQualityTable from '../src/components/ModelQualityTable/ModelQualityTable';

const data = [
  {
    metric: 'Accuracy',
    value: 0.94,
    range: '> 0.8'
  },
  {
    metric: 'Presision',
    value: 0.93,
    range: '> 0.8'
  },
  {
    metric: 'Recall',
    value: 0.92,
    range: '> 0.8'
  },
  {
    metric: 'F1',
    value: 0.93,
    range: '> 0.8'
  }
];

const stories = storiesOf(getDevStoryPath('Publish/Deployments'), module);
stories.add('Model Quality Table', () => <ModelQualityTable data={data} />);
