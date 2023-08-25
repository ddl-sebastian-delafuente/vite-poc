import * as React from 'react';
import { storiesOf } from '@storybook/react';
import EmptyArrowUpDownButtons, { UpDownButtonsProps } from '../src/components/EmptyArrowUpDownButtons';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const stories = storiesOf(getDevStoryPath('Components/EmptyArrowUpDownButtons'), module);

const props: UpDownButtonsProps = {
  onClickUpButton: () => { return; },
  onClickDownButton: () => { return; },
};

stories.add('default', () => <EmptyArrowUpDownButtons {...props}/>)
  .add('with really constrained height', () => (
    <EmptyArrowUpDownButtons
      {...props}
      size={50}
      height={50}
    />
  ));
