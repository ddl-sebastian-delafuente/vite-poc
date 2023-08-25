import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ProjectsTable from '../src/admin-projects/src/ProjectsTable';
import fetchMock from 'fetch-mock';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const mockData = {"page":[{"projectId":"5e9f2a83929f3431e9dfc05c","ownerUsername":"system-test","ownerName":"Johnny Doe","name":"quick-start quick-start quick-start","created":"2020-04-21T17:16:52.763Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5ea714270b932c0cb4b55a7d","ownerUsername":"integration-test","ownerName":"John Doe","name":"i-am-a-very-long-project-name-that-doesnt-show-up","created":"2020-04-27T17:19:38.960Z","runs":4,"lastRunStart":"2020-05-02T00:42:55.151Z","totalRunTimeInHours":0.028405555555555555,"archived":false},{"projectId":"5e9c8f59cbd2444bf6f5cba6","ownerUsername":"integration-test","ownerName":"John Doe","name":"501","created":"2020-04-19T17:50:18.107Z","runs":0,"totalRunTimeInHours":0,"archived":true},{"projectId":"5e9c8dc2cbd2444bf6f5cb92","ownerUsername":"integration-test","ownerName":"John Doe","name":"500","created":"2020-04-19T17:43:31.499Z","runs":2,"lastRunStart":"2020-04-21T16:59:44.570Z","totalRunTimeInHours":0.003641388888888889,"archived":false},{"projectId":"5e9c8dc2cbd2444bf6f5cb8f","ownerUsername":"integration-test","ownerName":"John Doe","name":"499","created":"2020-04-19T17:43:30.732Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dc1cbd2444bf6f5cb8c","ownerUsername":"integration-test","ownerName":"John Doe","name":"498","created":"2020-04-19T17:43:30.007Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dc0cbd2444bf6f5cb89","ownerUsername":"integration-test","ownerName":"John Doe","name":"497","created":"2020-04-19T17:43:29.252Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dbfcbd2444bf6f5cb86","ownerUsername":"integration-test","ownerName":"John Doe","name":"496","created":"2020-04-19T17:43:28.405Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dbecbd2444bf6f5cb83","ownerUsername":"integration-test","ownerName":"John Doe","name":"495","created":"2020-04-19T17:43:27.222Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dbdcbd2444bf6f5cb80","ownerUsername":"integration-test","ownerName":"John Doe","name":"494","created":"2020-04-19T17:43:26.511Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dbdcbd2444bf6f5cb7d","ownerUsername":"integration-test","ownerName":"John Doe","name":"493","created":"2020-04-19T17:43:25.741Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dbccbd2444bf6f5cb7a","ownerUsername":"integration-test","ownerName":"John Doe","name":"492","created":"2020-04-19T17:43:25.015Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dbbcbd2444bf6f5cb77","ownerUsername":"integration-test","ownerName":"John Doe","name":"491","created":"2020-04-19T17:43:24.260Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dbacbd2444bf6f5cb74","ownerUsername":"integration-test","ownerName":"John Doe","name":"490","created":"2020-04-19T17:43:23.475Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db9cbd2444bf6f5cb71","ownerUsername":"integration-test","ownerName":"John Doe","name":"489","created":"2020-04-19T17:43:22.355Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db9cbd2444bf6f5cb6e","ownerUsername":"integration-test","ownerName":"John Doe","name":"488","created":"2020-04-19T17:43:21.500Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db8cbd2444bf6f5cb6b","ownerUsername":"integration-test","ownerName":"John Doe","name":"487","created":"2020-04-19T17:43:20.811Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db7cbd2444bf6f5cb68","ownerUsername":"integration-test","ownerName":"John Doe","name":"486","created":"2020-04-19T17:43:20.127Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db6cbd2444bf6f5cb65","ownerUsername":"integration-test","ownerName":"John Doe","name":"485","created":"2020-04-19T17:43:19.413Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db6cbd2444bf6f5cb62","ownerUsername":"integration-test","ownerName":"John Doe","name":"484","created":"2020-04-19T17:43:18.674Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db5cbd2444bf6f5cb5f","ownerUsername":"integration-test","ownerName":"John Doe","name":"483","created":"2020-04-19T17:43:17.839Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db4cbd2444bf6f5cb5c","ownerUsername":"integration-test","ownerName":"John Doe","name":"482","created":"2020-04-19T17:43:17.097Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db3cbd2444bf6f5cb59","ownerUsername":"integration-test","ownerName":"John Doe","name":"481","created":"2020-04-19T17:43:16.408Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db3cbd2444bf6f5cb56","ownerUsername":"integration-test","ownerName":"John Doe","name":"480","created":"2020-04-19T17:43:15.666Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db2cbd2444bf6f5cb53","ownerUsername":"integration-test","ownerName":"John Doe","name":"479","created":"2020-04-19T17:43:14.995Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db1cbd2444bf6f5cb50","ownerUsername":"integration-test","ownerName":"John Doe","name":"478","created":"2020-04-19T17:43:14.324Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db1cbd2444bf6f5cb4d","ownerUsername":"integration-test","ownerName":"John Doe","name":"477","created":"2020-04-19T17:43:13.647Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8db0cbd2444bf6f5cb4a","ownerUsername":"integration-test","ownerName":"John Doe","name":"476","created":"2020-04-19T17:43:12.950Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dafcbd2444bf6f5cb47","ownerUsername":"integration-test","ownerName":"John Doe","name":"475","created":"2020-04-19T17:43:12.190Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dafcbd2444bf6f5cb44","ownerUsername":"integration-test","ownerName":"John Doe","name":"474","created":"2020-04-19T17:43:11.537Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8daecbd2444bf6f5cb41","ownerUsername":"integration-test","ownerName":"John Doe","name":"473","created":"2020-04-19T17:43:10.851Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dadcbd2444bf6f5cb3e","ownerUsername":"integration-test","ownerName":"John Doe","name":"472","created":"2020-04-19T17:43:10.176Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dadcbd2444bf6f5cb3b","ownerUsername":"integration-test","ownerName":"John Doe","name":"471","created":"2020-04-19T17:43:09.517Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8daccbd2444bf6f5cb38","ownerUsername":"integration-test","ownerName":"John Doe","name":"470","created":"2020-04-19T17:43:08.875Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dabcbd2444bf6f5cb35","ownerUsername":"integration-test","ownerName":"John Doe","name":"469","created":"2020-04-19T17:43:08.193Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8dabcbd2444bf6f5cb32","ownerUsername":"integration-test","ownerName":"John Doe","name":"468","created":"2020-04-19T17:43:07.445Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da9cbd2444bf6f5cb2f","ownerUsername":"integration-test","ownerName":"John Doe","name":"467","created":"2020-04-19T17:43:06.779Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da9cbd2444bf6f5cb2c","ownerUsername":"integration-test","ownerName":"John Doe","name":"466","created":"2020-04-19T17:43:05.750Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da8cbd2444bf6f5cb29","ownerUsername":"integration-test","ownerName":"John Doe","name":"465","created":"2020-04-19T17:43:05.067Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da7cbd2444bf6f5cb26","ownerUsername":"integration-test","ownerName":"John Doe","name":"464","created":"2020-04-19T17:43:04.369Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da7cbd2444bf6f5cb23","ownerUsername":"integration-test","ownerName":"John Doe","name":"463","created":"2020-04-19T17:43:03.676Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da6cbd2444bf6f5cb20","ownerUsername":"integration-test","ownerName":"John Doe","name":"462","created":"2020-04-19T17:43:02.960Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da5cbd2444bf6f5cb1d","ownerUsername":"integration-test","ownerName":"John Doe","name":"461","created":"2020-04-19T17:43:02.202Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da5cbd2444bf6f5cb1a","ownerUsername":"integration-test","ownerName":"John Doe","name":"460","created":"2020-04-19T17:43:01.518Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da4cbd2444bf6f5cb17","ownerUsername":"integration-test","ownerName":"John Doe","name":"459","created":"2020-04-19T17:43:00.838Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da3cbd2444bf6f5cb14","ownerUsername":"integration-test","ownerName":"John Doe","name":"458","created":"2020-04-19T17:43:00.155Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da2cbd2444bf6f5cb11","ownerUsername":"integration-test","ownerName":"John Doe","name":"457","created":"2020-04-19T17:42:59.464Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da2cbd2444bf6f5cb0e","ownerUsername":"integration-test","ownerName":"John Doe","name":"456","created":"2020-04-19T17:42:58.758Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da1cbd2444bf6f5cb0b","ownerUsername":"integration-test","ownerName":"John Doe","name":"455","created":"2020-04-19T17:42:58.036Z","runs":0,"totalRunTimeInHours":0,"archived":false},{"projectId":"5e9c8da0cbd2444bf6f5cb08","ownerUsername":"integration-test","ownerName":"John Doe","name":"454","created":"2020-04-19T17:42:57.264Z","runs":0,"totalRunTimeInHours":0,"archived":false}],"totalMatches":1216}
const stories = storiesOf(getDevStoryPath('Develop/Files/ProjectsTable'), module);

stories.add('populated', () => {
  const pageSize = 50
  const offset = 0
  const totalEntries = 200

  fetchMock.restore().get(
  `/v4/admin/dashboardEntries?offset=${offset}&pageSize=${pageSize}`,
    mockData
  );

  return (
    <ProjectsTable
      offset={offset}
      pageSize={pageSize}
      checkpointProjectId={undefined}
      totalEntries={totalEntries}
    />
  );
});

stories.add('empty state', () => {
  const pageSize = 50
  const offset = 0
  const totalEntries = 0

  fetchMock.restore().get(
    `/v4/admin/dashboardEntries?offset=${offset}&pageSize=${pageSize}`,
    []
  );

  return (
    <ProjectsTable
      offset={offset}
      pageSize={pageSize}
      checkpointProjectId={undefined}
      totalEntries={totalEntries}
    />
  );
});

stories.add('error state', () => {
  const pageSize = 50
  const offset = 0
  const totalEntries = 0

  fetchMock.restore()

  return (
    <ProjectsTable
      offset={offset}
      pageSize={pageSize}
      checkpointProjectId={undefined}
      totalEntries={totalEntries}
    />
  );
});
