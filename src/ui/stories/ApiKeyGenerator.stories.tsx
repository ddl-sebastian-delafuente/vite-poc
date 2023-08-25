import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { ApiKeyGenerator } from '../src/auth-and-admin/apikeygenerator/ApiKeyGenerator';
import { mockApiKey, mockError } from './mockData';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Plan/Account/API Key/ApiKeyGenerator'), module);

const handlers = {
  onConfirmationModalHide: () => undefined,
  onRegenerateButtonClick: () => undefined,
  onConfirmationModalCancelButtonClick: () => undefined,
  onConfirmationModalConfirmButtonClick: () => undefined,
  onCopyToClipboardButtonClick: () => undefined,
};

stories.add('basic', () => <ApiKeyGenerator {...handlers} generating={false}  />);

stories.add('confirmation modal visible', () =>
  <ApiKeyGenerator generating={false}  {...handlers} confirmationModalVisible={true} />,
);

stories.add('generating', () => <ApiKeyGenerator {...handlers} generating={true} />);

stories.add('generated', () =>
  <ApiKeyGenerator generating={false}  {...handlers} apiKey={mockApiKey()} />,
);

stories.add('with error', () =>
  <ApiKeyGenerator generating={false}  {...handlers} error={mockError()} />,
);

stories.add('with long error', () =>
  <ApiKeyGenerator generating={false}  {...handlers} error={mockError({ long: true })} />,
);

stories.add('generating with error', () =>
  <ApiKeyGenerator {...handlers} generating={true} error={mockError()} />,
);

stories.add('generating with long error', () => (
  <ApiKeyGenerator
    {...handlers}
    generating={true}
    error={mockError({ long: true })}
  />
));
