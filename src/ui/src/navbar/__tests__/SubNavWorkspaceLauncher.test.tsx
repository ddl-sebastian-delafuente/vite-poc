import * as React from 'react';
import { render } from '@testing-library/react';
import * as Workspace from '@domino/api/dist/Workspace';
import { project } from './Navbar.test';
import SubNavWorkspaceLauncher from '../projects/SubNavWorkspaceLauncher';

const defaultProps = {
  username: 'integration-test',
  userId: '5a6fd2c7e4b0e1ee4ae0bc6f',
  enableExternalDataVolumes: false,
  setGlobalSocket: jest.fn()
};

jest.mock('@domino/api/dist/Workspace');

afterAll(() => {
  jest.mock('@domino/api/dist/Workspace');
});

describe('SubNavWorkspaceLauncher', () => {
  it('should call owner workspaces API when project in the component props gets an update', () => {
    const mockOwnerWorkspacesApi = jest.spyOn(Workspace, 'ownerProvisionedWorkspaces');
    mockOwnerWorkspacesApi.mockImplementation(jest.fn());

    const latestProjectId = '5c335ee32fd89d166036b9d9';
    const { rerender } = render(
      <SubNavWorkspaceLauncher
        project={project}
        {...defaultProps}
      />
    );

    // TODO: Use `rerender` when it is available in the testing library
    rerender(
      <SubNavWorkspaceLauncher
        project={{...project, id: latestProjectId}}
        {...defaultProps}
      />
    );

    expect(mockOwnerWorkspacesApi).toHaveBeenCalledWith(expect.objectContaining({
      projectId: latestProjectId
    }));
  });
});
