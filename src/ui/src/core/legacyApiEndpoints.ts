export const getChildDirectoriesAtPathUrl = (ownerUsername: string, projectName: string) =>
    `/u/${ownerUsername}/${projectName}/files/getDirectories`;

export const getMoveFilesAndFoldersUrl = (ownerUsername: string, projectName: string) =>
  `/u/${ownerUsername}/${projectName}/files/moveFilesAndFolders`;

export const renameFileOrDirUrl = (ownerUsername: string, projectName: string, renameEndptType: string) =>
  `/u/${ownerUsername}/${projectName}/files/${renameEndptType}`;

export const removeProjectDependencyUrl = (projectUser: string, importedProjectName: string) =>
  `/u/${projectUser}/${importedProjectName}/dependencies/remove`;

export const changeImportedProjectFork = (
  ownerUsername: string,
  projectName: string,
  projectUser: string,
  importedProjectName: string,
) =>
  `/u/${ownerUsername}/${projectName}/dependencies/changeImportFork?` +
  `importedProjectOwnerUsername=${projectUser}&importedProjectName=${importedProjectName}`;

export const searchForImportableProjectsEndpoint = (query: string) => `/searchForImportableProjects?query=${query}`;

export const renderFileContentsEndpoint =
  (ownerUsername: string, projectName: string, path: string, commitId: string, renderUnknownFilesAsText: boolean) =>
  `/u/${ownerUsername}/${projectName}/render/${path}?commitId=${commitId}&renderUnknownFilesAsText=` +
  `${renderUnknownFilesAsText}`;

export const launchFileInNotebookEndpoint = (projectOwnerName: string, newProjectName: string): string =>
  `/u/${projectOwnerName}/${newProjectName}/nb/launchFileInNotebook`;

export const syncUrl = (ownerUsername: string, projectName: string, runId: string) =>
  `/u/${ownerUsername}/${projectName}/run/synchronizeRunWorkingDirectory/${runId}`;

export const selectFileSyncUrl = (ownerUsername: string, projectName: string, runId: string) =>
  `/u/${ownerUsername}/${projectName}/run/synchronizeRunWorkingDirectory/${runId}`;

export const commitReposUrl = (ownerUsername: string, projectName: string, runId: string) =>
  `/u/${ownerUsername}/${projectName}/commitAndPushRepos/${runId}`;

export const pullReposUrl = (ownerUsername: string, projectName: string, runId: string) =>
  `/u/${ownerUsername}/${projectName}/run/pullRepos/${runId}`;

export const revisionsPollingUrl = (environmentId: string, pageNumber: number, pageSize: number) =>
  `/environments/${environmentId}/json/paged/${pageNumber}/${pageSize}`;
