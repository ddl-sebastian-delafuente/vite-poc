import * as React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '../src/utils/storybookUtil';
import VersionHistory, { ParametersTableData } from '../src/components/VersionHistory/VersionHistory';

const now = new Date();

const data: ParametersTableData[] = [
  {
    versionNumber: 3,
    author: 'Ralf DSP',
    exported: now.getUTCDate(),
    status: 'preparing',
    exportTarget: 'exportTarget',
    exportVersionId: 'exportVersionId',
    modelId: 'modelId',
    modelVersionId: 'modelVersionId',
    snowflakeExportJobId: 'exportJobId',
  }
];

const props = {
  data,
  ownerName: 'ownerName',
  projectName: 'projectName'
};

const stories = storiesOf(getDevStoryPath('Publish/Deployments'), module);
stories.add('Version History', () => <VersionHistory {...props} />);
