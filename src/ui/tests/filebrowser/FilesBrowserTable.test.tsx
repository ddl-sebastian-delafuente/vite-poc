import * as React from 'react';
import * as Auth from '@domino/api/dist/Auth';
import * as Projects from '@domino/api/dist/Projects';
import * as Users from '@domino/api/dist/Users';
import * as Workspaces from '@domino/api/dist/Workspaces';
import { DominoProjectsApiProjectGoal as ProjectGoals } from '@domino/api/dist/types';
import userEvent from '@testing-library/user-event';
import { render, waitFor, within, configure } from '@domino/test-utils/dist/testing-library';
import { unmockMocks } from '@domino/test-utils/dist/mock-manager';
import { projectGoal } from '@domino/test-utils/dist/mocks';
import { principal, mockWorkspace } from '../../src/utils/testUtil';
import FilesBrowserTable, { Row, Props as FileBrowserProps } from '../../src/filebrowser/FilesBrowserTable';
import globalStore from '../../src/globalStore/GlobalStore';
import storageKeys from '../../src/globalStore/storageKeys';

const getToggleAllBox = (element: HTMLElement) => element.querySelector('thead input[type="checkbox"]') as HTMLInputElement;
const getRowBoxes = (element: HTMLElement) => Array.from(element.querySelectorAll('tbody input[type="checkbox"]')) as HTMLInputElement[];

const getFileRowMenuButton = (btnElements: Array<HTMLElement>, fileName: string): HTMLButtonElement | undefined => {
  const fileRowMenuButton = btnElements.find(btnElement => btnElement.textContent?.includes(fileName));
  return fileRowMenuButton ? within(fileRowMenuButton).getByTestId('action-dropdown') as HTMLButtonElement : undefined;
};

function isRunnableAsNotebook(name: string) {
  return /\.ipynb$/.test(name);
}

function getProps(fileNames: string[], dirNames: string[], extraProps?: FileBrowserProps) {
  const fileRows: Row[] = fileNames.map(name => {
    return {
      checkbox: {
        dataPath: name,
        dataUrl: name,
      },
      name: {
        sortableName: name,
        label: name,
        fileName: name,
        url: name,
        helpUrl: name,
      },
      size: {
        label: '10 K',
        inBytes: 10,
      },
      modified: {
        label: new Date().toString(),
        time: Date.now(),
      },
      details: {
        isDir: false,
        publish: { label: name, url: name },
        isFileLaunchableAsNotebook: isRunnableAsNotebook(name),
        isFileRunnableFromView: isRunnableAsNotebook(name),
        isFileRunnableAsApp: false,
        filePath: name,
        filePathName: name,
        quotedFilePath: `'${name}'`,
        launchNotebook: {
          label: 'Launch Notebook',
          url: 'launch_nb_url',
          stringifiedGitId: 'abcdef123456',
        },
        run: {
          label: 'Run',
        },
        edit: {
          label: 'Edit',
          url: 'edit_url',
        },
        compareRevisions: {
          label: 'Compare Revisions',
          url: 'compare_rev_url',
        },
        download: {
          label: 'Download',
          url: 'download_url',
        },
        viewLatestFiles: {
          label: 'View Latest',
          url: 'view_latest_url',
        },
        share: {
          label: 'Share',
          url: 'share_url',
        },
        delte: {
          label: 'Delete',
        }
      }
    };
  });

  const dirRows = dirNames.map(name => {
    return {
      checkbox: {
        dataPath: name,
        dataUrl: name,
      },
      name: {
        sortableName: name,
        label: name,
        fileName: name,
        url: name,
        helpUrl: name,
      },
      size: {
        label: '10 K',
        inBytes: 10,
      },
      modified: {
        label: new Date().toString(),
        time: Date.now(),
      },
      details: {
        isDir: true,
        dirPath: name,
        download: {
          label: 'Download',
          url: 'download_url',
        },
        delete: {
          label: 'Delete',
        },
      },
    };
  });

  return {
    ...(extraProps || {} as FileBrowserProps),
    relativePath: '',
    ownerUsername: 'username',
    projectName: 'ThisIsAProjectName',
    projectId: 'projectID',
    csrfToken: 'abcdef123456',
    commitsNonEmpty: true,
    thisCommitId: 'a',
    headCommitId: 'a',
    projectSizeBytes: 1,
    // @ts-ignore
    rows: (dirRows as Row[]).concat(fileRows) as Row[],
    allowFolderDownloads: true,
    canEdit: true,
    createFolderEndpoint: 'createFolderEndpoint',
    breadcrumbData: [],
    removeFilesEndpoint: 'removeFilesEndpoint',
    createDatasetFromProjectEndpoint: 'createDatasetFromProjectEndpoint',
    areDataProjectsEnabled: true,
    isAnalyticProject: true,
    userIsAllowedToEditProject: true,
    createFileEndpoint: 'createFileEndpoint',
    downloadSelectedEntitiesEndpoint: 'downloadSelectedEntitiesEndpoint',
    downloadCLIPageEndpoint: 'downloadCLIPageEndpoint',
    downloadProjectFolderAsZipEndpoint: 'downloadProjectFolderAsZipEndpoint',
    successfulFilesRemovealEndpoint: 'successfulFilesRemovealEndpoint',
    revertProjectEndpoint: 'revertProjectEndpoint',
    runNumberForCommit: 'workspace #3',
    commitsRunLink: 'commitsRunLink',
    selectedRevision: {
      sha: 'sha1',
      message: 'message1',
      timestamp: 123,
      url: 'commit1url',
      author: { username: 'integration-test' },
      runId:'',
      runNumberStr:'',
      runLink:''
    },
    availableRevisions: [{
      sha: 'sha1',
      message: 'message1',
      timestamp: 123,
      url: 'commit1url',
      author: { username: 'integration-test' },
      runId:'',
      runNumberStr:'',
      runLink:''
    }, {
      sha: 'sha2',
      message: 'message2',
      timestamp: 223,
      url: 'commit2url',
      author: { username: 'integration-test' },
      runId:'',
      runNumberStr:'',
      runLink:''
    }],
    maxUploadFiles: 3,
    maxUploadFileSizeInMegabytes: 3,
    uploadEndpoint: 'uploadEndpoint',
    successfulUploadUrl: 'successfulUploadUrl',
    headRevisionDirectoryLink: 'headRevisionDirectoryLink',
  };
}

const mockProjectGoals: ProjectGoals[] = [
  {
    ...projectGoal,
    id: 'id',
    title: 'title',
    description: 'description',
    linkedEntities: [],
    currentStage: {
      ...projectGoal.currentStage,
      id: 'currentStageId',
      stage: 'currentStageStage',
      createdAt: 1,
      isArchived: false,
      stageCreationSource: 'Domino',
    },
    isComplete: true,
    isDeleted: false,
    projectId: 'projectId',
    createdAt: 1,
    createdBy: 'me',
  }
];

function renderTable(props?: FileBrowserProps) {
  return render(
    <FilesBrowserTable {...(props || {} as FileBrowserProps)} />
  );
}

const getPrincipal = jest.spyOn(Auth, 'getPrincipal');
const getProjectGoals = jest.spyOn(Projects, 'getProjectGoals');
const getWorkspaceById = jest.spyOn(Workspaces, 'getWorkspaceById');
const getIsLiteUser = jest.spyOn(Users, 'isLiteUser');
let mocks: Array<jest.SpyInstance>;

const mockReady = () => {
  getPrincipal.mockImplementation(jest.fn());
  getProjectGoals.mockResolvedValue(mockProjectGoals);
  getWorkspaceById.mockResolvedValue(mockWorkspace);
  getIsLiteUser.mockResolvedValue({ isLiteUser: false });
  mocks = [getPrincipal, getProjectGoals, getWorkspaceById, getIsLiteUser];
};

beforeEach(mockReady);

afterAll(() => {
  unmockMocks(mocks);
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('<FilesBrowserTable />', () => {
  configure({ testIdAttribute: 'data-test' });
  const FILE_DETAILS_DROPDOWN = 'FileDetailsDropdownMenu';
  const files = ['file1', 'file2', 'file3'];
  const dirs = ['dir1', 'dir2', 'dir3'];

  it('should contain correct number and types of checkboxes in rows', () => {
    const { getByDominoTestId } = renderTable(getProps(files, dirs));
    const fileBrowerTable = getByDominoTestId('ProjectFileBrowserTable');
    expect(getToggleAllBox(fileBrowerTable)).toBeTruthy();
    expect(getRowBoxes(fileBrowerTable)).toHaveLength(files.length + dirs.length);
  });

  it('should check all boxes in table when check all checkbox clicked', async () => {
    const { getByDominoTestId } = renderTable(getProps(files, dirs));
    const fileBrowerTable = getByDominoTestId('ProjectFileBrowserTable');
    const toggleAllCheckbox = getToggleAllBox(fileBrowerTable);
    await waitFor(() => expect(toggleAllCheckbox.hasAttribute('disabled')).toBeFalsy());
    const allRowCheckboxes = getRowBoxes(fileBrowerTable);
    allRowCheckboxes.forEach(rowCheckbox => expect(rowCheckbox.checked).toBeFalsy());
    await userEvent.click(toggleAllCheckbox!);
    allRowCheckboxes.forEach(rowCheckbox => expect(rowCheckbox.checked).toBeTruthy());
  });

  it('should uncheck all boxes in table when check all checkbox clicked when in checked state', async () => {
    const { getByDominoTestId } = renderTable(getProps(files, dirs));
    const fileBrowerTable = getByDominoTestId('ProjectFileBrowserTable');
    const toggleAllCheckbox = getToggleAllBox(fileBrowerTable);
    await waitFor(() => expect(toggleAllCheckbox.hasAttribute('disabled')).toBeFalsy());
    const allRowCheckboxes = getRowBoxes(fileBrowerTable);
    allRowCheckboxes.forEach(rowCheckbox => expect(rowCheckbox.checked).toBeFalsy());
    await userEvent.click(toggleAllCheckbox);
    allRowCheckboxes.forEach(rowCheckbox => expect(rowCheckbox.checked).toBeTruthy());
    await userEvent.click(toggleAllCheckbox);
    allRowCheckboxes.forEach(rowCheckbox => expect(rowCheckbox.checked).toBeFalsy());
  });

  it('should show all checkboxes as unchecked by default', () => {
    const { getByDominoTestId } = renderTable(getProps(files, dirs));
    const fileBrowerTable = getByDominoTestId('ProjectFileBrowserTable');
    const toggleAllCheckbox = getToggleAllBox(fileBrowerTable);
    expect(toggleAllCheckbox.checked).toBeFalsy();
    const allRowCheckboxes = getRowBoxes(fileBrowerTable);
    allRowCheckboxes.forEach(rowCheckbox => expect(rowCheckbox.checked).toBeFalsy());
  });

  it('should be able to check the respective row checkbox and not any other', async () => {
    const { getByDominoTestId } = renderTable(getProps(files, dirs));
    const filesBrowserTable = getByDominoTestId('ProjectFileBrowserTable');
    const toggleAllCheckbox = getToggleAllBox(filesBrowserTable);
    expect(toggleAllCheckbox.checked).toBeFalsy();
    await waitFor(() => expect(toggleAllCheckbox.hasAttribute('disabled')).toBeFalsy());
    const [firstRowCheckbox, ...restOfRowCheckboxes] = getRowBoxes(filesBrowserTable);
    expect(firstRowCheckbox.checked).toBeFalsy();
    restOfRowCheckboxes.forEach(rowCheckbox => expect(rowCheckbox.checked).toBeFalsy());
    await userEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox.checked).toBeTruthy();
    restOfRowCheckboxes.forEach(rowCheckbox => expect(rowCheckbox.checked).toBeFalsy());
  });

  it('should be able to uncheck the respective row checkbox and not any other', async () => {
    const { getByDominoTestId } = renderTable(getProps(files, dirs));
    const filesBrowserTable = getByDominoTestId('ProjectFileBrowserTable');
    const toggleAllCheckbox = getToggleAllBox(filesBrowserTable);
    expect(toggleAllCheckbox.checked).toBeFalsy();
    await waitFor(() => expect(toggleAllCheckbox.hasAttribute('disabled')).toBeFalsy());
    const [firstRowCheckbox, ...restOfRowCheckboxes] = getRowBoxes(filesBrowserTable);
    expect(firstRowCheckbox.checked).toBeFalsy();
    restOfRowCheckboxes.forEach(rowCheckbox => expect(rowCheckbox.checked).toBeFalsy());
    await userEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox.checked).toBeTruthy();
    restOfRowCheckboxes.forEach(rowCheckbox => expect(rowCheckbox.checked).toBeFalsy());
    await userEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox.checked).toBeFalsy();
    restOfRowCheckboxes.forEach(rowCheckbox => expect(rowCheckbox.checked).toBeFalsy());
  });

  it('should show the full delete option if user does have permission to do full delete', async () => {
    getPrincipal.mockResolvedValue({ ...principal, isAdmin: true });
    const { getByDominoTestId, getAllByRole } = renderTable(getProps(files, dirs));
    await waitFor(() => expect(getToggleAllBox(getByDominoTestId('ProjectFileBrowserTable'))?.hasAttribute('disabled')).toBeFalsy());
    const fileRowMenuButton = getFileRowMenuButton(getAllByRole('button'), 'file1')!;
    await userEvent.click(fileRowMenuButton);
    await waitFor(() => expect(getByDominoTestId(FILE_DETAILS_DROPDOWN).textContent).toContain('Full Delete'));
  });

  it(`should not show the full delete option if user doesn't have permission to do full delete`, async () => {
    globalStore.removeItem(storageKeys.principal);
    getPrincipal.mockResolvedValue({ ...principal, isAdmin: false });
    const { getByDominoTestId, getAllByRole } = renderTable(getProps(files, dirs));
    await waitFor(() => expect(getToggleAllBox(getByDominoTestId('ProjectFileBrowserTable'))?.hasAttribute('disabled')).toBeFalsy());
    const fileRowMenuButton = getFileRowMenuButton(getAllByRole('button'), 'file1')!;
    await userEvent.click(fileRowMenuButton);
    await waitFor(() => expect(getByDominoTestId(FILE_DETAILS_DROPDOWN).textContent).not.toContain('Full Delete'));
  });

  it('should disable file/folder selection when the logged-in user is a lite-user', async () => {
    getIsLiteUser.mockResolvedValue({ isLiteUser: true });
    const { getByDominoTestId } = renderTable(getProps(files, dirs));
    const fileBrowserTable = getByDominoTestId('ProjectFileBrowserTable');
    await waitFor(() => expect(getToggleAllBox(fileBrowserTable)?.hasAttribute('disabled')).toBeTruthy());
    const allRowCheckboxes = getRowBoxes(fileBrowserTable);
    allRowCheckboxes.forEach(rowCheckbox => {
      expect(rowCheckbox.hasAttribute('disabled')).toBeTruthy();
      expect(rowCheckbox.parentElement?.getAttribute('class')).toContain('disabled');
    });
  });

  it('should disable actions dropdown for each file/directory in the table when the logged-in user is lite-user', async () => {
    getIsLiteUser.mockResolvedValue({ isLiteUser: true });
    const { getByDominoTestId, getAllByRole } = renderTable(getProps(files, dirs));
    const fileBrowserTable = getByDominoTestId('ProjectFileBrowserTable');
    await waitFor(() => expect(getToggleAllBox(fileBrowserTable)?.hasAttribute('disabled')).toBeTruthy());
    dirs.forEach(dir => expect(getFileRowMenuButton(getAllByRole('button'), dir)!.hasAttribute('disabled')).toBeTruthy());
    files.forEach(file => expect(getFileRowMenuButton(getAllByRole('button'), file)!.hasAttribute('disabled')).toBeTruthy());
  });
});
