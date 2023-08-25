import * as React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { storiesOf } from '@storybook/react';
import { getDevStoryPath } from '../src/utils/storybookUtil';
import SnowflakeHostingSettings from '../src/components/Hosting/SnowflakeHostingSettings';
const props = {
    udfName: 'udfName',
    hostUrl: 'hostUrl',
    warehouseName: 'warehouseName',
    databaseName: 'databaseName',
    stage: 'stage',
    schema: 'schema',
  };

const stories = storiesOf(getDevStoryPath('Publish/Deployments/Hosting'), module);
stories.add('Snowflake Hosting Settings', () => <SnowflakeHostingSettings {...props}/>);
