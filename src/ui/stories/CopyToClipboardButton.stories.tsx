import * as React from 'react';
import { storiesOf } from '@storybook/react';
import CopyToClipboardButton from '../src/components/CopyToClipboardButton';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const t = (icon: JSX.Element) => <>{icon}</>;

const stories = storiesOf(getDevStoryPath('Components'), module);

stories.add('CopyToClipboardButton', () => t(
  <CopyToClipboardButton textToCopy='this is some text to copy' />
));
