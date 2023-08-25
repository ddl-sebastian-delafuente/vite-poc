import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ConfirmStopRunModal from '../src/runs/ConfirmStopRunModal';
import fetchMock from 'fetch-mock';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const t = (c: JSX.Element) => <>{c}</>;

const stories = storiesOf(getDevStoryPath('Develop/Workspaces/ConfirmStopRunModal'), module);

const withBasicFetching = (mock: any) =>
  mock.get(
    '/v4/gateway/projects/findProjectByOwnerAndName?ownerName=string&projectName=string',
    { id: 'fakeprojectid' }
  )
  .post(
    '/v4/workspaces/stop',
    200
  );

stories.add('no repositories, running', () => {
  withBasicFetching(fetchMock.restore().get(
    '/v4/workspaces/fakerunid/resourceStatuses',
    { repositories: [] }
  ));
  return t(
    <ConfirmStopRunModal
      isRunning={true}
      runId="fakerunid"
      ownerUsername="string"
      projectName="string"
      projectId="fakeprojectId"
      workloadType="Workspace"
    />
  );
});

stories.add('with dirty repositories, running', () => {
  withBasicFetching(fetchMock.restore().get(
    '/v4/workspaces/fakerunid/resourceStatuses',
    { repositories: [
      {
        name: 'A',
        status: 'Modified',
        changes: {},
      },
      {
        name: 'B',
        status: 'Unpushed',
      },
      {
        name: 'C',
        status: 'Unknown',
      },
    ] }
  ));
  return t(
    <ConfirmStopRunModal
      isRunning={true}
      runId="fakerunid"
      ownerUsername="string"
      projectName="string"
      projectId="fakeprojectId"
      workloadType="Workspace"
    />
  );
});
