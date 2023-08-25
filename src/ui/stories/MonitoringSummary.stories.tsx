import * as React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '@domino/ui/dist/utils/storybookUtil';
import MonitoringSummary from '../src/components/MonitoringSummary/MonitoringSummary';

const mockedDataEnabled = {
    data: {
    isEnabled: true,
    modelQuality: [
      {
        count: undefined
      },
      {
        count: undefined
      },
      {
        count: undefined
      },
      {
        count: 0
      },
      {
        count: 0
      },
      {
        count: 0
      },
      {
        count: 1
      }
    ],
    dataDrift: [
      {
        count: undefined
      },
      {
        count: undefined
      },
      {
        count: undefined
      },
      {
        count: 0
      },
      {
        count: 0
      },
      {
        count: 0
      },
      {
        count: 4
      }
    ]
  }
};

const mockedDataNotEnabled = {
  data: {
    isEnabled: false,
    modelQuality: [
      {
        count: undefined
      },
      {
        count: undefined
      },
      {
        count: undefined
      },
      {
        count: 0
      },
      {
        count: 0
      },
      {
        count: 0
      },
      {
        count: 1
      }
    ],
    dataDrift: [
      {
        count: undefined
      },
      {
        count: undefined
      },
      {
        count: undefined
      },
      {
        count: 0
      },
      {
        count: 0
      },
      {
        count: 0
      },
      {
        count: 4
      }
    ]
  }
};

const stories = storiesOf(getDevStoryPath('Publish/Deployments/MonitoringSummary'), module);
stories.add('Monitoring Summary Enabled', () => <MonitoringSummary data={mockedDataEnabled.data} />);
stories.add('Monitoring Summary Disabled', () => <MonitoringSummary data={mockedDataNotEnabled.data} />);
