import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ArchiveModelButton from '../src/modelmanager/ArchiveModelButton';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Publish/Model APIs'), module);

// eslint-disable-next-line
stories.add('Archive Model Button (Sync)', () => <ArchiveModelButton onConfirm={() => console.log('onConfirm')} isAsyncModel={false} />);
// eslint-disable-next-line
stories.add('Archive Model Button (Async)', () => <ArchiveModelButton onConfirm={() => console.log('onConfirm')} isAsyncModel={true} />);
