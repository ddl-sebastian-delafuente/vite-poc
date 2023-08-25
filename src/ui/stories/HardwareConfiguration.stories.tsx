import * as React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '../src/utils/storybookUtil';
import HardwareConfiguration, { HardwareLabel } from '../src/components/Hosting/HardwareConfiguration';

const props = {
  instanceOptions: [
    { value: '2', label: '2' },
    { value: '3', label: '3' }
  ],
  hardwareOptions: [
    {
      value: 'Small',
      label: <HardwareLabel label="Small" description="1 core · 4 GiB RAM · $0.034/min" time="&lt; 1 MIN" />
    },
    {
      value: 'Large',
      label: <HardwareLabel label="Large" description="4 core · 16 GiB RAM · $0.094/min" time="&lt; 30 SEC" />
    }
  ]
};

const stories = storiesOf(getDevStoryPath('Publish/Deployments/Hosting'), module);
stories.add('HardwareConfiguration', () => <HardwareConfiguration {...props} />);
