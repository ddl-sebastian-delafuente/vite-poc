import * as React from  'react';

import { getDevStoryPath } from '../../utils/storybookUtil';
import { AccessDeniedFileTable as AccessDeniedFileTableComponent } from '../AccessDeniedFileTable';

export default {
  title: getDevStoryPath('Develop/Data/Read Write Datasets'),
  component: AccessDeniedFileTableComponent,
}

const Template = () => <AccessDeniedFileTableComponent appName="Domino"/>;

export const AccessDeniedFileTable = Template.bind({});
