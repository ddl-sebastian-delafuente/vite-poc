import * as React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '../src/utils/storybookUtil';
import ArbitraryHostingSettings from '../src/components/Hosting/ArbitraryHostingSettings';

const stories = storiesOf(getDevStoryPath('Publish/Deployments/Hosting'), module);
stories.add('Arbitrary Hosting Settings', () => <ArbitraryHostingSettings hostUrl="hostUrl"/>);
