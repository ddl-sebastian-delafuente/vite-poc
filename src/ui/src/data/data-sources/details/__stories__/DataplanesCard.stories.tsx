import { listDataPlanes } from '@domino/mocks/dist/mock-stories/Dataplanes';
import fetchMock from 'fetch-mock';
import * as React from 'react';

import { getDevStoryPath } from '../../../../utils/storybookUtil';
import { EngineType } from '../../CommonData';
import { 
  DataplanesCardProps,
  DataplanesCard as DataplanesCardComponent 
} from '../DataplanesCard';

export default {
  title: getDevStoryPath('Develop/Data/Datasource/Details'),
  component: DataplanesCardComponent,
  argTypes: {
    isAdminOrOwner: { control: { type: 'boolean' } }
  },
  args: {
    dataPlanes: [{ dataPlaneId: '000000000000000000000000' }],
    datasourceId: 'test-data-source-id',
    engineInfo: {
      engineType: EngineType.Domino,
    },
    isAdminOrOwner: false,
    useAllDataPlanes: false,
  }
}

const Template = (args: DataplanesCardProps) => {
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    fetchMock.restore()
      .mock(...listDataPlanes())

    setReload(true);
  }, [setReload]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  if (reload) {
    return <div/>
  }

  return (
    <DataplanesCardComponent {...args}/>
  );
}

export const DataplanesCard = Template.bind({});
