import { DatasourceList } from '@domino/mocks/dist/mock-usecases';
import * as React from 'react';

import { getDevStoryPath } from '../../../utils/storybookUtil';
import { PoweredByStarburstProps, PoweredByStarburst as PoweredByStarburstComponent } from '../PoweredByStarburst';

export default {
  title: getDevStoryPath('Develop/Data/Datasource'),
  component: PoweredByStarburstComponent,
  argTypes: {
    datasource: {
      options: DatasourceList.map(({ id }) => id),
      mapping: DatasourceList.reduce((memo, datasource) => {
        memo[datasource.id] = datasource;
        return memo;
      }, {}),
      control: { 
        type: 'select',
        labels: DatasourceList.reduce((memo, { id , name }) => {
        memo[id] = name;
        return memo;
      }, {})
      }
    }
  }
}

type TemplateProps = PoweredByStarburstProps;

const Template = (args: TemplateProps) => {
  return <PoweredByStarburstComponent {...args} />
};

export const PoweredByStarburst = Template.bind({});
