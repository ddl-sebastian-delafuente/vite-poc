import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as Projects from '@domino/api/dist/Projects';
import { DominoNucleusProjectProjectSettingsDto as ProjectSettingsDto } from '@domino/api/dist/types';
import { projectSettingsDto } from '@domino/test-utils/dist/mocks';
import { render, screen } from '@domino/test-utils/dist/testing-library';

import AddClusterButton from '../src/components/AddClusterButton';
import { stories } from '../stories/AddClusterButton.stories';
const AddClusterButtonStory = stories['AddClusterButton with local Spark Cluster'];

const mockProjectSettings: ProjectSettingsDto = {
  ...projectSettingsDto,
  defaultEnvironmentId: 'testEnvId',
  defaultHardwareTierId: 'testHwId',
  sparkClusterMode: 'OnDemand'
}

const mockApi = () => {
  const getProjectSettings = jest.spyOn(Projects, 'getProjectSettings');
  getProjectSettings.mockImplementation(async () => mockProjectSettings);
};

describe('AddClusterButton', () => {
  it('should render Add Cluster Button', () => {
    mockApi();
    render(
      <Router>
        <AddClusterButton
          projectId={'testProjectId'}
          onClick={() => undefined}
          onEditCluster={() => undefined}
          onDeleteCluster={() => undefined}
          clusterAdded={false}
          workerCount={0}
        />
      </Router>
    );
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByText('plus')).toBeTruthy();
  });

  it('should show worker count after adding cluster config', () => {
    const view = render(
      <Router>
        <AddClusterButton
          projectId={'testProjectId'}
          onClick={() => undefined}
          onEditCluster={() => undefined}
          onDeleteCluster={() => undefined}
          clusterAdded={true}
          workerCount={0}
        />
      </Router>
    );
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(view.container.getElementsByClassName('anticon')).toHaveLength(2);
    expect(view.container.getElementsByClassName('anticon-edit')).toHaveLength(1);
    expect(view.container.getElementsByClassName('anticon-delete')).toHaveLength(1);
  });

  it(AddClusterButtonStory.name, () => {
    render(<>{AddClusterButtonStory.component}</>);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});
