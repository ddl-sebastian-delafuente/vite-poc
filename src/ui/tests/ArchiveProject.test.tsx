import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, waitFor, screen } from '@domino/test-utils/dist/testing-library';
import * as Workspace from "@domino/api/dist/Workspace";
import * as Projects from '@domino/api/dist/Projects';
import { project } from '../src/utils/testUtil';
import ArchiveProject from '../src/components/ArchiveProject';

jest.mock('@domino/api/dist/Projects');

afterAll(() => {
  jest.unmock('@domino/api/dist/Projects');
});

describe('ArchiveProject', () => {
  const archiveProjectById = jest.spyOn(Projects, 'archiveProjectById');
  const defaultProps = {
    projectId: 'projectId',
    errorPageContactEmail: 'errorPageContactEmail'
  };

  it('should render', () => {
    const view = render(<Router><ArchiveProject {...defaultProps}/></Router>);
    expect(view.getByDominoTestId('archive-project')).toBeTruthy();
  });

  it('should call archiveProjectById on archive project', async () => {
    const getProvisionedWorkspaceCountMock = jest.fn(async () => 0);
    const getProvisionedWorkspaceCount = jest.spyOn(Workspace, 'getProvisionedWorkspaceCount');
    getProvisionedWorkspaceCount.mockImplementation(getProvisionedWorkspaceCountMock);
    archiveProjectById.mockImplementation(async () => project);
    const view = render(<Router><ArchiveProject {...defaultProps}/></Router>);
    await userEvent.click(view.getByDominoTestId('archive-project'));
    await waitFor(() => expect(screen.getByText('Archive This Project?')).toBeTruthy());
    await userEvent.click(screen.getByText('Archive'));
    expect(archiveProjectById).toHaveBeenCalledTimes(1);
  });
});
