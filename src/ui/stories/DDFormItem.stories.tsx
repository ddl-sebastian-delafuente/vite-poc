import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { DDFormItem } from '../src/components/ValidatedForm';
import { getDevStoryPath } from '../src/utils/storybookUtil';
import Input from '../src/components/TextInput/Input';

export const stories = [{
  name: 'Basic Form Item',
  component: (
    <DDFormItem label="Label Text">
      <Input
        value={''}
        onChange={() => undefined}
      />
    </DDFormItem>
  )
}, {
  name: 'Form Item with dashedUnderline label',
  component: (
    <DDFormItem label="Styled Label Text" dashedUnderline={true}>
      <Input
        value={''}
        onChange={() => undefined}
      />
    </DDFormItem>
  )
}, {
  name: 'Form Item with Tooltip',
  component: (
    <DDFormItem label="Label Text with tooltip" tooltip={'Test tooltip'} dashedUnderline={true}>
      <Input
        value={''}
        onChange={() => undefined}
      />
    </DDFormItem>
  )
}];

const storiesOfModule = storiesOf(getDevStoryPath('Components/DDFormItem'), module);
stories.forEach(story => storiesOfModule.add(story.name, () => story.component));
