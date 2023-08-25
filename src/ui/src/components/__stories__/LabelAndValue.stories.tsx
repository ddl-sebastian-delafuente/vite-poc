import * as React from 'react';
import styled from 'styled-components';
import {storiesOf} from '@storybook/react';
import StatusRender from '@domino/ui/dist/components/renderers/StatusRender';
import { stageTimeRenderer, durationFormat } from '@domino/ui/dist/components/renderers/tableColumns';
import { getDevStoryPath } from '@domino/ui/dist/utils/storybookUtil';
import LabelAndValue, {Direction} from '../LabelAndValue';

const defaultProps = {
  label: 'Hardware Tier',
  value: 'Default',
  direction: Direction.Row,
};

export const stories = [{
  name: 'should show label and value side by side',
  component: <LabelAndValue {...defaultProps}/>
  },
  {
    name: 'should show label and value one above the other',
    component: <LabelAndValue {...defaultProps} direction={Direction.Column}/>
  },
  {
    name: 'should show status and label and value as duration',
    component: <LabelAndValue
      label={<StatusRender status={'Running'} renderAsDot={false}/>}
      value={stageTimeRenderer(1591090042903)}
      testId="statusAndTime"
      direction={Direction.Row}
      labelStyles={{textTransform: 'capitalize'}}
    />
  },
  {
    name: 'should show value as duration format',
    component: <LabelAndValue
      label="Duration"
      value={durationFormat(1591090042903)}
      testId="duration"
      direction={Direction.Column}
    />
  }];
const Wrapper = styled.div`
  padding: 10px;
`;
const storiesOfModule = storiesOf(getDevStoryPath('Static key value information'), module);
stories.forEach(story => storiesOfModule.add(story.name, () =>
  <Wrapper>{story.component}</Wrapper>
));
