import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, within } from '@domino/test-utils/dist/testing-library';
import ActionBar from '../../src/filebrowser/ActionBar';

describe('<ActionBar />', () => {
  const defaultProps = {
    showDropZone: jest.fn(),
    setDownloadErrorMessage: jest.fn(),
    successfulFilesRemovalEndpoint: 'successfulFilesRemovalEndpoint',
    currentCommitId: 'currentCommitId',
    createFolderEndpoint: 'createFolderEndpoint',
    breadcrumbData: [],
    selectedEntities: [],
    ownerUsername: 'ownerUsername',
    projectName: 'projectName',
    allowFolderDownloads: false,
    removeFilesEndpoint: 'removeFilesEndpoint',
    createDatasetFromProjectEndpoint: 'createDatasetFromProjectEndpoint',
    maxAllowedFileDownloads: 3,
    commitId: 'commitId',
    csrfToken: 'csrfToken',
    areDataProjectsEnabled: false,
    currentDirPath: 'currentDirPath',
    isAnalyticProject: false,
    userIsAllowedToEditProject: true,
    createFileEndpoint: 'createFileEndpoint',
    projectContainsCommits: false,
    atHeadCommit: false,
    downloadSelectedEntitiesEndpoint: 'downloadSelectedEntitiesEndpoint',
    downloadCLIPageEndpoint: 'downloadCLIPageEndpoint',
    downloadProjectFolderAsZipEndpoint: 'downloadProjectFolderAsZipEndpoint',
    projectId: '5cdb22aa8a9a1300060eac86'
  };

  it('should disable download button if no checkboxes selected', () => {
    expect((render(<ActionBar {...defaultProps} selectedEntities={[]} />)
      .getByDominoTestId('DownloadFilesButton') as HTMLButtonElement).disabled).toBeTruthy();
  });

  it('should disable download button if directories are selected and directory download not allowed', () => {
    const props = { ...defaultProps, allowFolderDownloads: false, selectedEntities: [{ downloadUrl: 'x', isDir: true, path: 'sdf' }] };
    expect((render(<ActionBar {...props} />)
      .getByDominoTestId('DownloadFilesButton') as HTMLButtonElement).disabled).toBeTruthy();
  });

  it('should enable download button if no directories are selected and directory download not allowed', () => {
    const props = { ...defaultProps, allowFolderDownloads: false, selectedEntities: [{ downloadUrl: 'x', isDir: false, path: 'sdf' }] };
    expect((render(<ActionBar {...props} />)
      .getByDominoTestId('DownloadFilesButton') as HTMLButtonElement).disabled).toBeFalsy();
  });

  it('should disable bulk operations dropdown if no checkboxes selected', () => {
    expect((render(<ActionBar {...defaultProps} selectedEntities={[]} />)
      .getByDominoTestId('BulkActionsDropdownButton') as HTMLButtonElement).disabled).toBeTruthy();
  });

  it('should enable bulk operations dropdown if 1 checkbox is selected', () => {
    expect((render(<ActionBar {...defaultProps} selectedEntities={[{ downloadUrl: 'x', isDir: false, path: 'asdf' }]} />)
      .getByDominoTestId('BulkActionsDropdownButton') as HTMLButtonElement).disabled).toBeFalsy();
  });

  it('should show create data set from files button if data projects enabled and in analytic project', () => {
    expect(render(<ActionBar {...defaultProps} areDataProjectsEnabled={true} isAnalyticProject={true} />)
      .getByDominoTestId('CreateDataSetFromFilesModalButton')).toBeTruthy();
  });

  it('should show create file button if user is allowed to edit the project', () => {
    expect(render(<ActionBar {...defaultProps} userIsAllowedToEditProject={true} />)
      .getByDominoTestId('CreateFileButton')).toBeTruthy();
  });

  it('should show add new folder button if user can edit this project', () => {
    expect(render(<ActionBar {...defaultProps} userIsAllowedToEditProject={true} />)
      .getByDominoTestId('AddFolderModalButton')).toBeTruthy();
  });

  it('should show uploader button if project has commits, at head commit, and user can edit this project', () => {
    const props = { ...defaultProps, projectContainsCommits: true, atHeadCommit: true, userIsAllowedToEditProject: true };
    expect(render(<ActionBar {...props}/>).getByDominoTestId('UploadFilesButton')).toBeTruthy();
  });

  it('should not show bulk operations dropdown if user cannot edit project', () => {
    expect(render(<ActionBar {...defaultProps} userIsAllowedToEditProject={false} />)
      .queryByDominoTestId('BulkActionsDropdownButton')).toBeFalsy();
  });

  it('should not show delete button in bulk operations dropdown if not at head commit', async () => {
    const view = render(<ActionBar {...defaultProps} atHeadCommit={false} isLiteUser={false} selectedEntities={[{ downloadUrl: 'x', isDir: false, path: 'asdf' }]} />);
    const bulkActionsDropdownButton = view.queryByDominoTestId('BulkActionsDropdownButton') as HTMLButtonElement;
    expect(bulkActionsDropdownButton.disabled).toBeFalsy();
    await userEvent.click(bulkActionsDropdownButton);
    const bulkActionsDropdownMenu = view.getByDominoTestId('BulkActionsDropdownMenu');
    expect(within(bulkActionsDropdownMenu).queryByText('Delete')).toBeFalsy();
    expect(view.queryByDominoTestId('RemoveFilesConfirmationModalButton')).toBeFalsy();
  });

  it('should not show delete button in bulk operations dropdown if project has no commits', async () => {
    const view = render(<ActionBar {...defaultProps} projectContainsCommits={false} isLiteUser={false} selectedEntities={[{ downloadUrl: 'x', isDir: false, path: 'asdf' }]} />);
    const bulkActionsDropdownButton = view.queryByDominoTestId('BulkActionsDropdownButton') as HTMLButtonElement;
    expect(bulkActionsDropdownButton.disabled).toBeFalsy();
    await userEvent.click(bulkActionsDropdownButton);
    const bulkActionsDropdownMenu = view.getByDominoTestId('BulkActionsDropdownMenu');
    expect(within(bulkActionsDropdownMenu).queryByText('Delete')).toBeFalsy();
    expect(view.queryByDominoTestId('RemoveFilesConfirmationModalButton')).toBeFalsy();
  });

  it('should show clone file tree dropdown by default', () => {
    expect(render(<ActionBar {...defaultProps} projectContainsCommits={false} />)
      .getByDominoTestId('CloneFileTreeDropdownButton')).toBeTruthy();
  });

  it('should not show clone file tree dropdown if hideCloneButton flag is set to true', () => {
    expect(render(<ActionBar {...defaultProps} projectContainsCommits={false} hideCloneButton={true} />)
      .queryByDominoTestId('CloneFileTreeDropdownButton')).toBeFalsy();
  });

  it(`
     should show delete button in bulk operations dropdown if at head commit, user can edit project,
       and project has commits
      `, async () => {
    const view = render(
      <ActionBar {...defaultProps}
        isLiteUser={false}
        atHeadCommit={true}
        projectContainsCommits={true}
        userIsAllowedToEditProject={true}
        selectedEntities={[{ downloadUrl: 'x', isDir: false, path: 'asdf' }]}
      />);
    const bulkActionsDropdownButton = view.queryByDominoTestId('BulkActionsDropdownButton') as HTMLButtonElement;
    expect(bulkActionsDropdownButton.disabled).toBeFalsy();
    await userEvent.click(bulkActionsDropdownButton);
    const bulkActionsDropdownMenu = view.getByDominoTestId('BulkActionsDropdownMenu');
    expect(within(bulkActionsDropdownMenu).queryByText('Delete')).toBeTruthy();
    expect(view.queryByDominoTestId('RemoveFilesConfirmationModalButton')).toBeTruthy();
  });

  it('should send back an error if total files is greater than max downloads', async () => {
    const spy = jest.fn();
    const view = render(
      <ActionBar
        {...defaultProps}
        setDownloadErrorMessage={spy}
        maxAllowedFileDownloads={0}
        selectedEntities={[{ downloadUrl: 'x', isDir: false, path: 'sdf' }]}
      />);
    const downloadFilesButton = view.getByDominoTestId('DownloadFilesButton') as HTMLButtonElement;
    expect(downloadFilesButton.disabled).toBeFalsy();
    await userEvent.click(downloadFilesButton);
    expect(spy).toHaveBeenCalled();
  });
});
