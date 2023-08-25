import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {
  ApiKeySettingsPanel,
} from '../src/auth-and-admin/apikeygenerator/ApiKeySettingsPanel';
import { mockError } from './mockData';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Plan/Account/API Key/ApiKeySettingsPanel'), module);

const handlers = {
  onRegenerate: async () => undefined,
};

stories.add('generating with error', () =>
  <ApiKeySettingsPanel {...handlers} generating={true} error={mockError()} />,
);

stories.add('generating with long error', () => (
  <ApiKeySettingsPanel
    {...handlers}
    generating={true}
    error={mockError({ long: true })}
  />
));
