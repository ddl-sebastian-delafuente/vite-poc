import { concat, join, map, toPairs, lensProp, set } from 'ramda';

export type ProjectDetailsHelper = (ownerName?: string, projectName?: string) => string;

export type EnvironmentDetailsHelper = (environmentId?: string) => string;

export * from '../data/routes';

export const downloadClientView: () => string = () => '/download/client';

export const projectsListBase: () => string = () => '/projects';

export const jobsDashboardBase: ProjectDetailsHelper =
  (ownerName = ':ownerName', projectName = ':projectName') => `/jobs/${ownerName}/${projectName}`;

export const modelsOverviewPage: ProjectDetailsHelper =
  (id = ':id') => `/models/${id}/overview`

export const createModelApiPage: () => string = () => `/models/getBasicInfo`;

export const createModelApiPageFromProject = 
  (projectId = ':projectId') => `${createModelApiPage()}?projectId=${projectId}`;

export const workspaceDashboardBase: ProjectDetailsHelper =
  (ownerName = ':ownerName', projectName = ':projectName') => `/workspace/${ownerName}/${projectName}`;

export const experimentsDashboardBase: ProjectDetailsHelper =
  (ownerName = ':ownerName', projectName = ':projectName') => `/experiments/${ownerName}/${projectName}`;

export const getExperimentRunsPath = (
  ownerName = ':ownerName',
  projectName = ':projectName',
  experimentId = ':experimentId'
) => `/experiments/${ownerName}/${projectName}/${experimentId}`;

export const getExperimentRunDetailsPath = (
  ownerName = ':ownerName',
  projectName = ':projectName',
  experimentId = ':experimentId',
  runId  = ':runId'
) => `/experiments/${ownerName}/${projectName}/${experimentId}/${runId}`;

export const provisionedWorkspaceDashboardBase: ProjectDetailsHelper =
  (ownerName = ':ownerName', projectName = ':projectName') =>
    `${workspaceDashboardBase(ownerName, projectName)}?activeTab=provisionedWorkspaces`;

export const deletedWorkspaceDashboardBase: ProjectDetailsHelper =
  (ownerName = ':ownerName', projectName = ':projectName') =>
    `${workspaceDashboardBase(ownerName, projectName)}?activeTab=deleted`;

export const workspaceSessionBase: ProjectDetailsHelper =
  (ownerName = ':ownerName', projectName = ':projectName') => `/workspace-session/${ownerName}/${projectName}`;

export const userBase: (ownerName: string) => string =
  (ownerName = ':ownerName') => `/u/${ownerName}`;

export const projectBase: ProjectDetailsHelper =
  (ownerName = ':ownerName', projectName = ':projectName') => `/u/${ownerName}/${projectName}`;

export const environmentsBase: EnvironmentDetailsHelper =
  (environmentId = ':environmentId') => `/environments/${environmentId}`;

export const environmentRevisionCreate: (environmentId: string) => EnvironmentDetailsHelper =
  environmentId => () =>
    `${environmentsBase(environmentId)}/revisions/create`;

export const environmentDuplicate: (environmentId: string) => EnvironmentDetailsHelper =
  environmentId => () =>
    `${environmentsBase(environmentId)}/duplicate`;

export const setEnvironmentAsDefault: (environmentId: string) => EnvironmentDetailsHelper =
  environmentId => () =>
    `${environmentsBase(environmentId)}/setAsDefault`;

export const archiveEnvironment: (environmentId: string) => EnvironmentDetailsHelper =
  environmentId => () =>
    `${environmentsBase(environmentId)}/archive`;

export const projectSection: (section: string) => ProjectDetailsHelper =
  section => (ownerName = ':ownerName', projectName = ':projectName') =>
    `${projectBase(ownerName, projectName)}/${section}`;

export const projectOverviewPage: (ownerName?: string, projectName?: string, tab?: string) => string =
  (ownerName, projectName, tab) => {
    const projectOverviewRoute = projectSection('overview')(ownerName, projectName);
    return tab ? `${projectOverviewRoute}?tab=${tab}` : projectOverviewRoute;
  };

export const projectEndpoints: (section: string) => ProjectDetailsHelper =
  section => (ownerName = ':ownerName', projectName = ':projectName') =>
    `${projectBase(ownerName, projectName)}/endpoints/${section}`;

export const projectSettings: (tab: string) => ProjectDetailsHelper =
  tab => (ownerName = ':ownerName', projectName = ':projectName') =>
    `${projectBase(ownerName, projectName)}/settings#${tab}`;

export const jobSection: (ownerName?: string, projectName?: string, jobId?: string, tab?: string) => string =
  (ownerName = ':ownerName', projectName = ':projectName', jobId = ':jobId', tab = ':tab') =>
  `${jobsDashboardBase(ownerName, projectName)}/${jobId}/${tab}`;

export const getScheduledRunsLink = (ownerName: string, projectName: string) =>
  `/jobs/${ownerName}/${projectName}?tab=schedules`;

export const getModelLogsBase = (modelId: string, modelVersionId: string, logType: string) =>
  `/models/${modelId}/versions/${modelVersionId}/logs?logType=${logType}`;

export const workspaceSection:
  (workspaceId: string, section: string) => ProjectDetailsHelper =
  (workspaceId, section) => (ownerName, projectName) =>
    `${provisionedWorkspaceDashboardBase(ownerName, projectName)}&wsId=${workspaceId}&wsTab=${section}`;

export const sharedViewWorkspaceSection:
  (workspaceId: string, section?: string) => ProjectDetailsHelper =
  (workspaceId, section) => (projectOwnerName, projectName) => {
    const basePath = `${workspaceDashboardBase(projectOwnerName, projectName)}?wsId=${workspaceId}&sharedView=true`;
    if (section) {
      return `${basePath}&wsTab=${section}`;
    }
    return basePath;
  }

// The component used at this route will take an executionId and resolve the appropriate workspace route to use
export const workspaceExecutionSection:
  (executionId: string, section: string) => ProjectDetailsHelper =
  (executionId: string, section: string) => (ownerName, projectName) =>
    `${workspaceDashboardBase(ownerName, projectName)}?executionId=${executionId}&wsTab=${section}`;

export const launchpadPublisher: ProjectDetailsHelper =
  (ownerName = ':ownerName', projectName = ':projectName') =>
    `/launchpad-publisher/${ownerName}/${projectName}/publishApp`;

export const runDashboardRun: (runId: string) => ProjectDetailsHelper = runId => projectSection(`runs/${runId}`);

interface ProjectDataIndexPathProps {
  ownerName: string,
  projectName: string,
}
export const projectDataIndexPath = (props?: ProjectDataIndexPathProps) => {
  // When param object is passed assume this is a route definition
  if (!props) {
    return `${projectBase()}/data`;
  }

  const { ownerName, projectName } = props;

  return `${projectBase(ownerName, projectName)}/data`
}

export const dataIndexPath: () => string = () => '/data';

interface FeatureStoreFeatureViewPathProps {
  featureViewId: string
}

const COMMON_FEATURE_STORE_FEATURE_VIEW_PATH = 'feature-store/feature-view'
export const projectFeatureStoreFeatureViewPath = (props?: FeatureStoreFeatureViewPathProps & ProjectDataIndexPathProps) => {
  if (!props) {
    return `${projectDataIndexPath()}/${COMMON_FEATURE_STORE_FEATURE_VIEW_PATH}/:featureViewId`;
  }

  const { featureViewId, ownerName, projectName } = props

  return `${projectDataIndexPath({ownerName, projectName})}/${COMMON_FEATURE_STORE_FEATURE_VIEW_PATH}/${featureViewId}`;
}

export const globalFeatureStoreFeatureViewPath = (props?: FeatureStoreFeatureViewPathProps) => {
  if (!props) {
    return `${dataIndexPath()}/${COMMON_FEATURE_STORE_FEATURE_VIEW_PATH}/:featureViewId`;
  }

  const { featureViewId } = props;

  return `${dataIndexPath()}/${COMMON_FEATURE_STORE_FEATURE_VIEW_PATH}/${featureViewId}`
}

export const sharedFileViewPath = (
  ownerName: string,
  projectName: string,
  fileName: string,
): string => `${projectSection('sharedView')(ownerName, projectName)}/${fileName}`;

export const baseFileViewPath = (
  ownerName: string,
  projectName: string,
  fileName: string,
): string =>
  `${projectSection('view')(ownerName, projectName)}/${fileName}`;

export const fileView = (
  ownerName: string,
  projectName: string,
  fileName: string,
  commitId: string
) => `${baseFileViewPath(
  ownerName,
  projectName,
  fileName,
)}?commitId=${commitId}`;

export const fileDownload = (
  ownerName: string,
  projectName: string,
  fileName: string,
  commitId: string
) => `${projectSection('raw')(ownerName, projectName)}/${commitId}/${fileName}`;

const browseFilesBasePath = (
  ownerName: string,
  projectName: string,
  path?: string,
) => {
  const basePath = projectSection('browse')(ownerName, projectName);
  if (path) {
    return `${basePath}/${path}`;
  }
  return basePath;
};

const browseCodeBasePath = (
  ownerName: string,
  projectName: string,
  path?: string,
) => {
  const basePath = projectSection('code')(ownerName, projectName);
  if (path) {
    return `${basePath}/${path}`;
  }
  return basePath;
};

export const browseFilesHead = (
  ownerName: string,
  projectName: string,
  path?: string,
) => browseFilesBasePath(ownerName, projectName, path);

export const browseFilesFullRef = (
  ownerName: string,
  projectName: string,
  branchName: string,
  commitId: string,
  path?: string
) => `${browseFilesBasePath(ownerName, projectName, path)}?branch=${branchName}&commitId=${commitId}`;

export const browseFiles = (
  ownerName: string,
  projectName: string,
  commitId: string,
  path?: string,
  branch?: string,
) => {
  const basePath = `${browseFilesBasePath(ownerName, projectName, path)}`;
  if (branch) {
    return `${basePath}?branch=${branch}&commitId=${commitId}`;
  }
  return `${basePath}?commitId=${commitId}`;
}

export const browseCode = (
  ownerName: string,
  projectName: string,
  commitId: string,
  path?: string,
  branch?: string,
) => {
  const basePath = `${browseCodeBasePath(ownerName, projectName, path)}?commit=${commitId}`;
  if (branch) {
    return `${basePath}&branch=${branch}`;
  }
  return basePath;
}

export const browseResults = (
  ownerName: string,
  projectName: string,
  commitId: string
) => `${projectSection('results')(ownerName, projectName)}/${commitId}`;

export const executorSection = (
  region: string,
  instanceId: string,
) => `/dispatcher/${region}:${instanceId}`;

export const environmentRevisionSection = (
  environmentRevisionId: string
) => `/environments/revisions/${environmentRevisionId}`;

export const generateWorkspaceQueryParams = (
  ownerName: string,
  projectName: string,
  workspaceId: string
) => `?owner=${ownerName}&projectName=${projectName}&runId=${workspaceId}`;

export const gotoWorkspace = (
  ownerName: string,
  projectName: string,
  workspaceId: string
) => `/workspace?owner=${ownerName}&projectName=${projectName}&runId=${workspaceId}`;

export const deploymentLogsDownload = (
  executionId: string,
  deploymentLogsDownloadParams = {},
  inline = false
) => {
    const params = set(lensProp('inline'), inline, deploymentLogsDownloadParams);
    return concat(
      `/v4/executions/${executionId}/events?`,
      join('&', map((qp: [string, string]) => join('=', [qp[0], qp[1]]), toPairs(params)))
    );
};

export const deploymentLogsCsvDownload = (
  executionId: string,
  deploymentLogsDownloadParams = {},
  inline = false
) => {
    const params = set(lensProp('inline'), inline, deploymentLogsDownloadParams);
    return concat(
      `/v4/executions/${executionId}/events.csv?`,
      join('&', map((qp: [string, string]) => join('=', [qp[0], qp[1]]), toPairs(params)))
    );
};

export const executionTroubleshootingBundleDownload = (
  executionId: string
) => `/v4/admin/supportbundle/${executionId}`;

export const describeNode = (
  dataPlaneId: string,
  nodeId: string
) => `kubernetes/nodes/${nodeId}?dataPlaneId=${dataPlaneId}`;

export const describePod = (
  dataPlaneId: string,
  podId: string
) => `kubernetes/pods/${podId}?dataPlaneId=${dataPlaneId}`;

export const describeComputeCluster = (
  dataPlaneId: string,
  clusterType: string,
  clusterName: string
) => `kubernetes/computeClusters/${clusterType}/${clusterName}?dataPlaneId=${dataPlaneId}`;

export const describeRun = (
  dataPlaneId: string,
  executionId: string
) => `kubernetes/runs/${executionId}/description?dataPlaneId=${dataPlaneId}`;

export const launchedWorkspace = (ownerName?: string, projectName?: string, runId?: string, workspaceId?: string) => {
  let workspacePath = `/workspace-session/${ownerName}/${projectName}`;
  if (ownerName && projectName && runId) {
    workspacePath += `?owner=${ownerName}&projectName=${projectName}&runId=${runId}`;
    if (workspaceId) {
      workspacePath += `&workspaceId=${workspaceId}`;
    }
 }
  return workspacePath;
};

  // Form the URI for fetching a job/workspace result file
export const getResultURI = (ownerName: string, projectName: string, fileName: string) => {
  const owner = encodeURIComponent(ownerName);
  const project = encodeURIComponent(projectName);
  const file = encodeURIComponent(fileName);

  return `/u/${owner}/${project}/render/${file}`;
};

// TODO: this needs to be removed and replaced with getRepoFile in frontend/apps/web/src/modules/projects/Overview.tsx
// getRepoFile also needs to return text/plain instead of application/json
export const getGBPFileURI = (projectId: string, repositoryId: string, fileName: string) => {
  const projId = encodeURIComponent(projectId);
  const gitRepoId = encodeURIComponent(repositoryId);
  const file = encodeURIComponent(fileName);
  return `/v4/projects/${projId}/gitRepositories/${gitRepoId}/git/raw?fileName=${file}`;
}

export const projectTagSearch = (tagName: string) => `/search?query=project.tag%3D${tagName}&area=project`;

export const getProjectDataSourceDetailsPage = (
  ownerName?: string,
  projectName?: string,
  dataSourceId = ':dataSourceId') => {
  return `${projectBase(ownerName, projectName)}/data/${dataSourceId}`;
};

export const getProjectDataSourcePath = (
  ownerName?: string,
  projectName?: string,
) => `${projectBase(ownerName, projectName)}/data`;

export const getModelApiUri = (modelId: string) =>
  `/v1/models/${modelId}`;

export const workspacesBasePath =
  `${process.env.PUBLIC_URL || ''}/workspace/:ownerName/:projectName`;

export const classicWorkspacesBasePath =
  `${process.env.PUBLIC_URL || ''}/workspaces/:ownerName/:projectName/:workspaceId?/:tab?`;

export const jobsBasePath =
  `${process.env.PUBLIC_URL || ''}/jobs/:ownerName/:projectName/:jobId?/:tab?`;

export const dataSourceOverviewPath =
  `${process.env.PUBLIC_URL || ''}/data/dataSource/:ownerName/:dataSourceId?`;

export const getPublishNewVersionUri = (modelId: string, projectId: string) =>
  `/models/${modelId}/versions/publish?projectId=${projectId}`;

export const getExperimentsBasePath = (
  ownerName = ':ownerName',
  projectName = ':projectName',
) => `/experiments/${ownerName}/${projectName}`;

export const getModelPredictionDatasetLink = (
  userName: string,
  projectName: string,
  datasetId: string,
  datasetName: string,
  modelVersionId: string
) =>
  `${window.location.origin}/u/${userName}/${projectName}/data/rw/upload/${datasetName}/${datasetId}/:snapshotid/${modelVersionId}`;

export const getModelVersionCardLink = (
  ownerName: string,
  projectName: string,
  modelName: string,
  modelVersion: string
  ) => `${window.location.origin}/u/${ownerName}/${projectName}/model-registry/${modelName}/model-card?version=${modelVersion}`;
  
export const environmentsListBase: () => string = () => '/environment';

export const environmentDetails = (environmentId = ':environmentId') => `${environmentsListBase()}/${environmentId}`;
