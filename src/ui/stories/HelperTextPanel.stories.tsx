import * as React from 'react';
import { storiesOf } from '@storybook/react';
import HelperTextPanel from '../src/components/HelperTextPanel';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Components/HelperTextPanel'), module);
stories.add('basic', () => (
  <HelperTextPanel data-test="helper-text-panel">
    asdlfkjasdlfkjads
  </HelperTextPanel>
));

stories.add('with links', () => (
  <HelperTextPanel>
    asdlfkjasdlfkjads <a>hey</a> sdlfkjsdf
    asdlfkjasdlfkjads <a>hey</a> sdlfkjsdf
  </HelperTextPanel>
));
