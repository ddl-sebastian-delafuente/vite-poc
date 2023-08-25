import * as React from 'react';
import { storiesOf } from '@storybook/react';
import * as colors from '@domino/ui/dist/styled/colors';
import AreaSpline from '../src/components/charts/AreaSpline';
import { getDevStoryPath } from '../src/utils/storybookUtil';

storiesOf(getDevStoryPath('Charts/AreaSpline'), module)
  .add('AreaSpline', () => (
    <AreaSpline
      data={[3, 15, 7, 6, 9, 12]}
      primaryColor={colors.conifer}
      height={40}
      areaOpacity={0.2}
    />
  ));
