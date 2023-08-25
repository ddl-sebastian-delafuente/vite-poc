import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import FileNameEditor from '../FileNameEditor';

describe('<FileNameEditor />', () => {
  const defaultProps = {
    currentCommitId: 'x',
    resetStateOnSuccess: false,
    isFileRunnableAsApp: false,
    isFileRunnableFromView: false,
    isFileLaunchableAsNotebook: false,
    publishAppEndpoint: 'publishAppEndpoint',
    atHeadCommit: false,
    action: 'action',
    ownerUsername: 'ownerUsername',
    projectName: 'projectName',
    oldPath: 'oldPath',
    redirectToOverviewPageOnSave: false,
    creating: true,
    editing: false,
    saveAndRunHandler: () => undefined,
    showSaveAndRun: false,
    locationUrl: 'locationUrl',
    csrfToken: 'csrfToken',
  };

  it('should populate filePath input with new file name on change when creating', async () => {
    const view = render(
      <FileNameEditor
        {...defaultProps}
        creating={true}
        editing={false}
      />
    );
    userEvent.type(view.getByDominoTestId('new-name-input'), 'newname');
    await waitFor(() => expect(view.baseElement.querySelector('input#path')?.getAttribute('value')).toBe('oldPath/newname'));
  });

  it(`
     should populate filePath input with new file name on change when creating, even when
     directory ends with /`, async () => {
    const view = render(
      <FileNameEditor
        {...defaultProps}
        oldPath="oldPath/"
        creating={true}
        editing={false}
      />
    );
    userEvent.type(view.getByDominoTestId('new-name-input'), 'newname');
    await waitFor(() => expect(view.baseElement.querySelector('input#path')?.getAttribute('value')).toBe('oldPath/newname'));
  });

  it(`
     should populate filePath input with new file name on change when creating, even when
     directory starts with /`, async () => {
    const view = render(
      <FileNameEditor
        {...defaultProps}
        oldPath="/oldPath/"
        creating={true}
        editing={false}
      />
    );
    userEvent.type(view.getByDominoTestId('new-name-input'), 'newname');
    await waitFor(() => expect(view.baseElement.querySelector('input#path')?.getAttribute('value')).toBe('oldPath/newname'));
  });

  it(`
     should populate filePath input with new file name on change when creating, even when no directory
  `, async () => {
    const view = render(
      <FileNameEditor
        {...defaultProps}
        oldPath=""
        creating={true}
        editing={false}
      />
    );
    userEvent.type(view.getByDominoTestId('new-name-input'), 'newname');
    await waitFor(() => expect(view.baseElement.querySelector('input#path')?.getAttribute('value')).toBe('newname'));
  });

  it('should populate filePath input with new file name when creating when there is a default file name', () => {
    const view = render(
      <FileNameEditor
        {...defaultProps}
        oldPath="coololdpath/defaultfilename"
        creating={true}
        editing={false}
      />
    );
    expect(view.baseElement.querySelector('input#path')?.getAttribute('value')).toBe('coololdpath/defaultfilename');
  });

  it('should populate the path input with just the file name if no directory provided', () => {
    const view = render(
      <FileNameEditor
        {...defaultProps}
        oldPath="defaultfilename"
        creating={true}
        editing={false}
      />
    );
    expect(view.baseElement.querySelector('input#path')?.getAttribute('value')).toBe('defaultfilename');
  });
});
