import * as React from 'react';
import { storiesOf } from '@storybook/react';

import RevisionControl from '../src/filebrowser/RevisionControl';
import { mockRevision, mockRevisions } from './mockData';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const numRevisions = 1000;
const withRunIds = true;
const fromNow = true;

const stories = storiesOf(getDevStoryPath('Develop/Files/RevisionControl'), module);

stories.add('happy path', () => (
  <RevisionControl
    runLink="link_to_run"
    runNumber="job #15"
    revision={mockRevision({ withRunId: withRunIds, fromNow })}
    revisions={mockRevisions({ numRevisions, withRunIds, fromNow })}
    // eslint-disable-next-line no-console
    onChange={() => console.log('triggered on change')}
    showBranchPicker={false}
  />
));

stories.add('no run number', () => (
  <RevisionControl
    runLink="link_to_run"
    revision={mockRevision({ withRunId: withRunIds, fromNow })}
    revisions={mockRevisions({ numRevisions, withRunIds, fromNow })}
    // eslint-disable-next-line no-console
    onChange={() => console.log('triggered on change')}
    showBranchPicker={false}
  />
));
