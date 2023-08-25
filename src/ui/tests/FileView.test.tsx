import * as React from 'react';
import * as Workspaces from '@domino/api/dist/Workspaces';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import { ProjectVisibility } from '../src/filebrowser/types';
import { View, InnerProps as ViewProps } from '../src/filebrowser/FileView';
import { mockWorkspace } from '../src/utils/testUtil';

const getWorkspaceByExecutionId = jest.spyOn(Workspaces, 'getWorkspaceById');

beforeEach(() => {
  getWorkspaceByExecutionId.mockImplementation((_: any) => Promise.resolve(mockWorkspace));
});

describe('<View />', () => {
  const defaultProps: ViewProps = {
    lastExistingCommitCreatedAt: 5,
    userIsAllowedToEditProject: true,
    revertFileEndpoint: 'file endpoint',
    runNumberForCommit: 'workspace #5',
    commitsRunLink: 'commits link',
    selectedRevision: {
      runId: 5,
      sha: 'sha',
      message: 'message',
      timestamp: 5,
      url: 'url',
      author: { username: 'username'},
      runNumberStr: '5',
      runLink: 'runLink'
    },
    availableRevisions: [],
    commitId: 'commitId',
    projectId: 'projectId',
    path: 'path',
    csrfToken: 'token',
    isFileRunnableAsApp: true,
    isFileRunnableFromView: true,
    isFileLaunchableAsNotebook: true,
    publishAppEndpoint: 'endpoint',
    action: 'action',
    locationUrl: 'url',
    ownerUsername: 'username',
    projectName: 'projectName',
    filename: 'filename',
    breadCrumbs: [{ url: 'url', label: 'label' }],
    headRevisionDirectoryLink: 'dirlink',
    isCommentPreviewEnabled: true,
    toolbarLinks: {
      editFileLink: 'editlink',
      compareRevisionsLink: 'comparelink',
      downloadFileLink: 'downloadlink',
      viewRawFileLink: 'rawlink',
      sharedFileViewLink: 'sharedlink',
    },
    projectVisibility: ProjectVisibility.Private,
    renderedFile: 'renderedFile',
    userCanEditProjectFiles: true,
    isFullDeleted: false,
    userIsAllowedToFullDelete: true,
    userCanStartRuns: true
  };


  const renderFileText = `
  [![Run Notebook](raw/latest/run-notebook.svg)](/workspace/:ownerName/:projectName?showWorkspaceLauncher=True)
  [![Publish Model](raw/latest/publish-model.svg)](/models/getBasicInfo?name=Sample-model&file=model.py&function=my_model&projectId=:projectId)
  `;
  const firstLineOfTextAfterReplacement = `[![Run Notebook](../raw/latest/run-notebook.svg)](/workspace/${defaultProps.ownerUsername}/${defaultProps.projectName}?showWorkspaceLauncher=True)`;
  const secondLineOfTextAfterReplacement = `[![Publish Model](../raw/latest/publish-model.svg)](/models/getBasicInfo?name=Sample-model&file=model.py&function=my_model&projectId=${defaultProps.projectId})`;

  it('should render fileview toolbar, revision control, etc when file is not deleted', () => {
    const view = render(<View {...defaultProps} />);
    expect(view.getAllByDominoTestId('FileViewToolBar')).toHaveLength(1);
    expect(view.getAllByDominoTestId('rename-file-dir-modal-btn')).toHaveLength(1);
  });


  it('should not render fileview toolbar, revision control, etc when file is deleted', () => {
    const view = render(<View {...defaultProps} isFullDeleted={true}/>);
    expect(view.queryAllByDominoTestId('FileViewToolBar')).toHaveLength(0);
    expect(view.queryAllByDominoTestId('rename-file-dir-modal-btn')).toHaveLength(0);
  });

  it('should replace :projectId, :projectName, :ownerName and "raw/latest" link in readme.md file', async () => {
    const view = render(<View {...defaultProps} renderedFile={renderFileText} filename="README.md" />);
    await waitFor(() => expect(view.getByText(firstLineOfTextAfterReplacement, { exact: false })).toBeTruthy());
    await waitFor(() => expect(view.getByText(secondLineOfTextAfterReplacement, { exact: false })).toBeTruthy());
  });
});
