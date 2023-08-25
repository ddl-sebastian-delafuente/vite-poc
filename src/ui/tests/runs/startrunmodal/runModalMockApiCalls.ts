import * as fetchMock from 'fetch-mock';
import {
  environment1Details,
  hardwareTiers1,
  fakeProjectId,
  projectSettings1,
} from './runModalMockData';
import {
  DominoProjectsApiUseableProjectEnvironmentsDto as Environment, DominoProjectsApiDefaultOnDemandSparkClusterPropertiesSpec,
} from '@domino/api/dist/types';
import { testResults } from '../../../src/components/__tests__/computeEnvironmentData';
const selectedEnvironment = testResults[2];

const initMock = fetchMock.restore;

export const environment: Environment = {
  environments: testResults,
  currentlySelectedEnvironment: {
    id: selectedEnvironment.id,
    supportedClusters: []
    // Currently Selected Environment in Job Modal doesn't support Spark as they are incompatible.
  },
};

export const clusterProperties: DominoProjectsApiDefaultOnDemandSparkClusterPropertiesSpec = {
  computeEnvironmentId: '5b64c2634cedfd000712a82f',
  executorCount: 18,
  executorHardwareTierId: '5c0efbf39333f16ae6e596e8',
  executorStorage: { value: 5, unit: 'GiB'},
  masterHardwareTierId: '5c0efbf39333f16ae6e596e8',
  maximumExecutionSlotsPerUser: 25
};

const mockEnvironment = {
  'id': '5b64c2634cedfd000712a82f',
  'archived': false,
  'name': '3 Dash app publishing',
  'owner': {
    'id': '5ac42816e4b0e9a0a82bbe8f',
    'username': 'njablonski'
  },
  'version': 2,
  'visibility': 'Private',
  // 'html_url': '/environments/5b64c2634cedfd000712a82f',
  supportedClusters: [],
};

const mockWhiteLabelConfig = {
  "errorPageContactEmail":"support+develop@dominodatalab.com",
  "defaultProjectName":"quick-start",
  "favicon":"/favicon.ico",
  "gitCredentialsDescription":"Authenticate Domino for access to your Git repositories via <strong>GitHub Personal Access Token (PAT)</strong> or <strong>Private SSH Key</strong>.","helpContentUrl":"https://tickets.dominodatalab.com",
  "hidePopularProjects":false,
  "hideDownloadDominoCli":false,
  "hideMarketingDisclaimer":false,
  "hidePublicProjects":false,
  "hideSearchableProjects":false,
  "hideSuggestedProjects":false,
  "hideLearnMoreOnFile":false,
  "hideGitSshKey":false,
  "appName":"Domino",
  "pageFooter":"",
  "showSupportButton":false,
  "supportEmail":"support+develop@dominodatalab.com"
}

const principal = {"isAnonymous":false,"isAdmin":true,"canonicalId":"5d1f1622fdfe52c4e28e60d8","canonicalName":"gowtham_mukta","allowedSystemOperations":["ActAsProjectAdmin","EditEnvironmentsAsOwner","ManageEnvironments","RestartNucleus","StopServer","ViewProjectSizes","TriggerSearchIndexing","ManageExecutors","ResetIndex","ViewAdminMenu","ExecuteRunsForFree","ViewAdminDashboard","ViewRevenue","RunMongoDBCommands","ViewGlobalEnvironments","ManageBuilds","ManageProjectTags","ViewUserList","ViewExecutors","SetUserSystemRoles","UseK8sDashboard","ManageHardwareTiers","GeneratePasswordResetLinks","ViewSearchIndex","CurateProjects","ViewMetrics","PreviewProjects","ManageRunWorkingDirs","ViewEverythingInControlCenter","ManageFeatureFlags","ViewUsage","UpdateUser","StopRuns","ListAllProjects","ViewProjectList","ReadKubernetes","EditCentralConfig","ManageOrganizations"],"featureFlags":["ShortLived.GitReferencesCustomizableEnabled","ShortLived.CommentsPreviewEnabled","ShortLived.PluggableInteractiveSessions","ShortLived.iFrameSecurityEnabled","ShortLived.UserExecutionsQuotaEnabled","ShortLived.PluggableInteractiveSessionSubdomains","ShortLived.JiraIntegrationEnabled","ShortLived.WriteLogsToNewIndices","ShortLived.SparkClustersEnabled","ShortLived.EnableGitBasedProjects","ShortLived.ExecutionEventHistoryInLogsEnabled","AppPublishingEnabled","ShortLived.KubernetesContainerMetricsEnabled","ShortLived.FastStartDataSets","ShortLived.DSLEnabled"],"booleanSettings":["enableProjectTagging","publicModelProductsEnabled"]};

export const fetchEnabledDatasetsPrincipal = (restoredMock: any = initMock()) => restoredMock.get(
  '/v4/auth/principal',
  principal
);

export const fetchProjectSettingsDefault = (restoredMock: any = initMock()) => restoredMock.get(
  `/v4/projects/${fakeProjectId}/settings`,
  projectSettings1
);

export const fetchHardwareTiers1 = (restoredMock: any = initMock()) => restoredMock.get(
  `/v4/projects/${fakeProjectId}/hardwareTiers`,
  hardwareTiers1,
);

export const fetchEnvironments1 = (restoredMock: any = initMock()) => restoredMock.get(
  `/v4/environments/${projectSettings1.defaultEnvironmentId}`,
  environment1Details
);

export const fetchUsableEnvironments = (restoredMock: any = initMock()) => restoredMock.get(
  `/v4/projects/${fakeProjectId}/useableEnvironments`,
  environment
);

export const fetchOnDemandSparkSettings = (restoredMock: any = initMock()) => restoredMock.get(
  `/v4/jobs/project/${fakeProjectId}/defaultSparkSettings`,
  clusterProperties
);

export const fetchEnvironment = (restoredMock: any = initMock()) => restoredMock.get(
  `/v4/projects/${fakeProjectId}/environment/5b64c2634cedfd000712a82f`,
  mockEnvironment
);

export const fetchWhiteLabelConfig = (restoredMock: any = initMock()) => restoredMock.get(
  `/v4/admin/whitelabel/configurations`,
  mockWhiteLabelConfig
);
