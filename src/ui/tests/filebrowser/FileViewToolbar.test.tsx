import * as React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import { user, project } from '../../src/utils/testUtil';
import { ProjectVisibility } from '../../src/filebrowser/types';
import FileViewToolbar from '../../src/filebrowser/FileViewToolbar';

describe('<FileViewToolbar />', () => {
  const defaultProps = {
    userCanEditProjectFiles: true,
    project,
    user,
    editFileLink: 'editFileLink',
    compareRevisionsLink: 'compareRevisionsLink',
    downloadFileLink: 'downloadFileLink',
    viewRawFileLink: 'viewRawFileLink',
    sharedFileViewLink: 'sharedFileViewLink',
    projectId: 'projectId',
    commitId: 'commitId',
    path: 'path',
    projectVisibility: ProjectVisibility.Private,
    userIsAllowedToFullDelete: false,
    isLatestCommit: true
  };

  it('should not show full delete modal if user cannot do full deletes', () => {
    const { queryByDominoTestId } = render(<FileViewToolbar {...defaultProps} userIsAllowedToFullDelete={false} />);
    expect(queryByDominoTestId('full-delete-modal')).toBeFalsy();
  });

  it('should show full delete modal if user can do full deletes', () => {
    const { queryByDominoTestId } = render(<FileViewToolbar {...defaultProps} userIsAllowedToFullDelete={true} />);
    expect(queryByDominoTestId('full-delete-modal')).toBeTruthy();
  });

  it('should not show edit button if userCanEditProjectFiles is false', () => {
    const { queryByDominoTestId } = render(<FileViewToolbar {...defaultProps} userCanEditProjectFiles={false} />);
    expect(queryByDominoTestId('EditButton')).toBeFalsy();
  });

  it('should show edit button if userCanEditProjectFiles is true', () => {
    const { queryAllByDominoTestId } = render(<FileViewToolbar {...defaultProps} userCanEditProjectFiles={true} />);
    expect((queryAllByDominoTestId('EditButton') as HTMLElement[]).length).toBeGreaterThan(0);
  });

  it('should not show link goal button if userCanEditProjectFiles is false', () => {
    const { queryByDominoTestId } = render(<FileViewToolbar {...defaultProps} userCanEditProjectFiles={false} />);
    expect(queryByDominoTestId('LinkGoalButton')).toBeFalsy();
  });

  it('should show link goal button if userCanEditProjectFiles is true', () => {
    const { queryAllByDominoTestId } = render(<FileViewToolbar {...defaultProps} userCanEditProjectFiles={true} />);
    expect((queryAllByDominoTestId('LinkGoalButton') as HTMLElement[]).length).toBeGreaterThan(0);
  });

});
