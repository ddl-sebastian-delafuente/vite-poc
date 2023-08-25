import { makeSelectDropdownFromMapping } from '@domino/mocks/dist/storybook.utils';
import * as React from 'react';

import { getDevStoryPath } from '../../utils/storybookUtil';
import { 
  BigValueProps,
  BigValue as BigValueComponent, 
  UnitPosition } from '../BigValue';

export default {
  title: getDevStoryPath('Develop/Data'),
  component: BigValueComponent,
  argTypes: {
    unitPosition: makeSelectDropdownFromMapping(UnitPosition),
  },
  args: {
    label: 'Mock Label',
    unitPosition: UnitPosition.suffix,
    unit: 'TB',
    value: '10.1',
  }
}

const Template = (args: BigValueProps) => <BigValueComponent {...args}/>;

export const BigValue = Template.bind({});
