import * as React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import ProjectFileBrowserView, { BrowserTab } from '../../src/filebrowser/ProjectFileBrowserView';
import { ProjectVisibility } from '../../src/filebrowser/types';

const mockChildComponent = jest.fn();
jest.mock("../../src/filebrowser/FilesBrowserTable", () => (props: any) => {
  mockChildComponent(props);
  return [];
});

describe('<ProjectFileBrowserView />', () => {
  const defaultProps = {
    headCommitId: 'header',
    thisCommitId: 'thiscommit',
    userIsAllowedToFullDelete: true,
    enableDiskUsageVolumeCheck: false,
    projectId: 'projectid',
    projectVisibility: ProjectVisibility.Public,
    isGitBasedProject: false,
    enableExternalDataVolumes: false,
    gitCredentials : [],
    allCredentialMappings: [],
    focusedTab: BrowserTab.LocalTab,
    handleTabChange: () => undefined,
    permissions: {
      globalUseFileStorage: true,
      canRun: true,
      canEdit: true,
      canBrowseReadFiles: true,
      canListProject: true,
      canFullDelete: true,
      canChangeProjectSettings: true,
    },
    projectImportsIsEmpty: false,
    addDependencyEndpoint: '',
    runTaggingEnabled: false,
    importedProjects: [],
    areReferencesCustomizable: true,
    csrfToken: '',
    ownerUsername: 'ownerteer',
    projectName: 'projeceter',
    repositories: [],
    noRepos: true,
    projectType: '',
    hideLearnMoreOnFile: true,
    breadcrumbData: [{url: '', label: ''}],
    areDataProjectsEnabled: true,
    isAnalyticProject: false,
    downloadCLIPageEndpoint: '',
    headCommitCreatedAt: 2,
    previousDirectoryUrl: '',
    relativePath: 'mnt',
    commitsNonEmpty: false,
    rows: [],
    allowFolderDownloads: true,
    projectSizeBytes: 2,
    suggestDatasets: false,
    runNumberForCommit: '2',
    commitsRunLink: '',
    selectedRevision: {
      runId: '',
      sha: '',
      message: '',
      timestamp: 2,
      url: '',
      author: {
        username: '',
      },
        runNumberStr: '',
      runLink: '',
    },
    showUploadComponentOnStart: false,
    maxUploadFiles: 30,
    maxUploadFileSizeInMegabytes: 200,
    createFolderEndpoint: '',
    successfulFilesRemovalEndpoint: '',
    createDatasetFromProjectEndpoint: '',
    createFileEndpoint: '',
    userIsAllowedToEditProject: true,
    downloadSelectedEntitiesEndpoint: '',
    downloadProjectFolderAsZipEndpoint: '',
    headRevisionDirectoryLink: '',
    revertProjectEndpoint: '',
    uploadEndpoint: '',
    successfulUploadUrl: '',
    onCredentialSelect: () => undefined,
    userIsAllowedToChangeProjectSettings: false,
  };

  it('should generate download endpoint with thisCommitId, not headCommitId', () => {
    render(<ProjectFileBrowserView {...defaultProps} />);
    const expected = {"allowFolderDownloads": true, "areDataProjectsEnabled": true, "breadcrumbData": [{"label": "", "url": ""}], "canEdit": true, "commitsNonEmpty": false, "commitsRunLink": "", "createDatasetFromProjectEndpoint": "/data/new/ownerteer/projeceter", "createFileEndpoint": "/u/ownerteer/projeceter/create/mnt", "createFolderEndpoint": "/u/ownerteer/projeceter/files/createFolder", "csrfToken": "", "downloadCLIPageEndpoint": "", "downloadProjectFolderAsZipEndpoint": "/u/ownerteer/projeceter/downloadFolder/thiscommit", "downloadSelectedEntitiesEndpoint": "/u/ownerteer/projeceter/downloadSelected/thiscommit/mnt/", "enableExternalDataVolumes": false, "headCommitCreatedAt": 2, "headCommitId": "header", "headRevisionDirectoryLink": "/u/ownerteer/projeceter/browse/mnt/", "isAnalyticProject": false, "isGitBasedProject": false, "maxUploadFileSizeInMegabytes": 200, "maxUploadFiles": 30, "ownerUsername": "ownerteer", "previousDirectoryUrl": "", "projectId": "projectid", "projectName": "projeceter", "projectSizeBytes": 2, "projectVisibility": "Public", "relativePath": "mnt", "revertProjectEndpoint": "/u/ownerteer/projeceter/revert", "rows": [], "runNumberForCommit": "2", "selectedRevision": {"author": {"username": ""}, "message": "", "runId": "", "runLink": "", "runNumberStr": "", "sha": "", "timestamp": 2, "url": ""}, "showUploadComponentOnStart": false, "successfulFilesRemovalEndpoint": "/u/ownerteer/projeceter/browse/mnt/#successfulRemoval", "successfulUploadUrl": "/u/ownerteer/projeceter/browse/mnt/#successfulUpload", "suggestDatasets": false, "thisCommitId": "thiscommit", "uploadEndpoint": "/u/ownerteer/projeceter/files/upload/mnt", "userIsAllowedToEditProject": true}
    expect(mockChildComponent).toHaveBeenCalledWith(
      expect.objectContaining(expected)
    );
  });
});
