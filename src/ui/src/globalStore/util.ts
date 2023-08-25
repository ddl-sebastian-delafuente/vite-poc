import {
  DominoNucleusLibAuthPrincipalWithFeatureFlags as Principal,
  DominoNucleusLibFrontendFrontendConfigDto as FrontendConfig,
  DominoAdminInterfaceWhiteLabelConfigurations as WhiteLabelSettings,
  DominoNucleusLibAuthMixpanelSettings,
} from '@domino/api/dist/types';


export interface FormattedCommonFlags {
  /**
   * The _loaded property is being added so we can detect and state transition
   * between the initial state and the state after load and process has been done
   */
  _loaded: boolean;
  allowConcurrentRunsByDefault?: boolean;
  disableDFSBasedProjects?: boolean;
  disableJobsListAutoUpdate?: boolean;
  enableAddingDataSourcesInRemoteWorkspaces?: boolean;
  enableApps?: boolean;
  enableDarkMode?: boolean;
  enableDaskClusters: boolean;
  enableDatasets?: boolean;
  enableDiskUsageVolumeCheck?: boolean,
  enableEnvironmentRevisions?: boolean;
  enableExportsWorkflow?: boolean;
  enableExternalDataVolumes?: boolean;
  enableGitBasedProjects?: boolean;
  enableGitCredentialFlowForCollaborators: boolean;
  enableHybrid: boolean;
  enableInWorkspaceBranchSelection?: boolean;
  enableJiraIntegration: boolean;
  enableLaunchers?: boolean;
  enableMergeConflictResolution?: boolean;
  enableModelAPIs?: boolean;
  enableModelRegistry?: boolean;
  enableModelMonitoringForModelAPIs?: boolean;
  enableMpiClusters: boolean;
  enablePhotonService?: boolean;
  enablePinProjects?: boolean;
  enableRayClusters: boolean;
  enableSagemakerExportUI?: boolean;
  enableSelectFileSync?: boolean;
  enableSparkClusters: boolean;
  enableTrialBanner?: boolean;
  enableReproduction?: boolean;
  excludeModelGitDirectory?: boolean;
  externalDataVolumesFullCensor?: boolean;
  hardwareTierCapacityFetchingEnabled?: boolean;
  isMixpanelEnabled?: boolean;
  mixpanelToken?: string;
  shouldExecuteHtmlInMarkdown: boolean;
  showDSLFeatures: boolean;
  showPublicModelProductsOption: boolean;
  showPublicProjectsOption: boolean;
  showTagsNavItem: boolean;
  showUserNotifications?: boolean;
  showV1DataProjects: boolean;
  enableCopyGitlabGBP?: boolean;
  enableCopyGithubGBP?: boolean;
  hideWelcomeCarousel?: boolean;
  enableFeedbackModal?: boolean;
  feedbackSendingConfigured?: boolean;
  hybridModelApisEnabled?: boolean;
  enableRestrictedAssets?: boolean;
  allowDatasetSnapshotsOnExecutionCompletion?: boolean;
  projectTemplatesEnabled?: boolean;
  twirlConversionFor58?: boolean;
  detwirlEnvironments58?: boolean;
  projectTemplateHubEnabled?: boolean;
  detwirlSearch58?: boolean;
}

interface CommonFlags {
  booleanSettings: Array<string>;
  featureFlags: Array<string>;
  mixpanelSettings: DominoNucleusLibAuthMixpanelSettings;
}

const formatCommonFlags = (commonFlags: CommonFlags): FormattedCommonFlags => {
  const effectiveFeatureFlags: { [key: string]: boolean } = (commonFlags.featureFlags || []).reduce((ffs, next) => {
    ffs[next] = true;
    return ffs;
  }, {});

  const allowConcurrentRunsByDefault = commonFlags.booleanSettings.indexOf('allowConcurrentRunsByDefault') > -1;
  const disableDFSBasedProjects = !!effectiveFeatureFlags['ShortLived.DisableDFSBasedProjects'];
  const disableJobsListAutoUpdate = !!effectiveFeatureFlags['ShortLived.JobsListAutoUpdateDisabled'];
  const enableAddingDataSourcesInRemoteWorkspaces = !!effectiveFeatureFlags['ShortLived.EnableAddingDataSourcesInRemoteWorkspaces'];
  const enableApps = !!effectiveFeatureFlags.EnableApps;
  const enableDarkMode = commonFlags.booleanSettings.indexOf('enableDarkMode') > -1;
  const enableDaskClusters = !!effectiveFeatureFlags['ShortLived.DaskClustersEnabled'];
  const enableDatasets = !!effectiveFeatureFlags['ShortLived.EnableReadWriteDatasets'];
  const enableDiskUsageVolumeCheck = !!effectiveFeatureFlags['ShortLived.EnableDiskUsageVolumeCheck'];
  const enableEnvironmentRevisions = !!effectiveFeatureFlags['ShortLived.EnableEnvironmentRevisions'];
  const enableExportsWorkflow = !!effectiveFeatureFlags['ShortLived.ExportsWorkflowEnabled'];
  const enableExternalDataVolumes = !!effectiveFeatureFlags['ShortLived.EnableExternalDataVolumes'];
  const enableGitBasedProjects = !!effectiveFeatureFlags['ShortLived.EnableGitBasedProjects'];
  const enableGitCredentialFlowForCollaborators = commonFlags.booleanSettings.indexOf('enableGitCredentialFlowForCollaborators') > -1;
  const enableHybrid = !!effectiveFeatureFlags['ShortLived.HybridEnabled'];
  const enableInWorkspaceBranchSelection = !!effectiveFeatureFlags['ShortLived.EnableInWorkspaceBranchSelection'];
  const enableJiraIntegration = !!effectiveFeatureFlags['ShortLived.JiraIntegrationEnabled'];
  const enableLaunchers = !!effectiveFeatureFlags.EnableLaunchers;
  const enableMergeConflictResolution = !!effectiveFeatureFlags['ShortLived.EnhancedMergeConflictsEnabled'];
  const enableModelAPIs = !!effectiveFeatureFlags.EnableModelAPIs;
  const enableModelRegistry = !!effectiveFeatureFlags['ShortLived.ModelRegistry'];
  const enableModelMonitoringForModelAPIs = !!effectiveFeatureFlags.EnableModelMonitoringForModelAPIs;
  const enableMpiClusters = !!effectiveFeatureFlags['ShortLived.MpiClustersEnabled'];
  const enablePhotonService = !!effectiveFeatureFlags.EnablePhotonService;
  const enablePinProjects = !!effectiveFeatureFlags['ShortLived.EnablePinnedProjects'];
  const enableRayClusters = !!effectiveFeatureFlags['ShortLived.RayClustersEnabled'];
  const enableSagemakerExportUI = !!effectiveFeatureFlags['ShortLived.EnableSagemakerExportUI'];
  const enableSelectFileSync = !!effectiveFeatureFlags['ShortLived.EnableSelectFileSync'];
  const enableSparkClusters = !!effectiveFeatureFlags['ShortLived.SparkClustersEnabled'];
  const enableTrialBanner = !!effectiveFeatureFlags.LockOutTrialEnabled;
  const enableReproduction = !!effectiveFeatureFlags['ShortLived.EnableReproduction'];
  const excludeModelGitDirectory = !!effectiveFeatureFlags.excludeModelGitDirectory;
  const externalDataVolumesFullCensor = !!effectiveFeatureFlags['ShortLived.ExternalDataVolumesFullCensor'];
  const hardwareTierCapacityFetchingEnabled = !!effectiveFeatureFlags['ShortLived.HardwareTierCapacityFetchingEnabled'];
  const shouldExecuteHtmlInMarkdown = !!effectiveFeatureFlags['ShortLived.ExecuteHtmlInMarkdown'];
  const showDSLFeatures = !!effectiveFeatureFlags['ShortLived.DSLEnabled'];
  const showPublicModelProductsOption = commonFlags.booleanSettings.indexOf('publicModelProductsEnabled') > -1;
  const showPublicProjectsOption = commonFlags.booleanSettings.indexOf('publicProjectsEnabled') > -1;
  const showTagsNavItem = commonFlags.booleanSettings.indexOf('enableProjectTagging') > -1;
  const showUserNotifications = !!effectiveFeatureFlags['ShortLived.EnableUserNotifications'];
  const showV1DataProjects = !!effectiveFeatureFlags['ShortLived.ShowV1DataProjects'];
  const hybridModelApisEnabled = !!effectiveFeatureFlags['ShortLived.HybridModelApisEnabled'];
  const { frontendClientEnabled, token } = commonFlags.mixpanelSettings || {};
  const enableCopyGitlabGBP = commonFlags.booleanSettings.indexOf('enableGitLabCopy') > -1;
  const enableCopyGithubGBP = commonFlags.booleanSettings.indexOf('enableGitHubCopy') > -1;
  const hideWelcomeCarousel = commonFlags.booleanSettings.indexOf('hideWelcomeCarousel') > -1;
  const enableFeedbackModal = commonFlags.booleanSettings.indexOf('enableFeedbackModal') > -1;
  const feedbackSendingConfigured = commonFlags?.booleanSettings.indexOf('feedbackSendingConfigured') > -1;
  const enableRestrictedAssets = commonFlags?.booleanSettings.indexOf('enableRestrictedAssets') > -1;
  const allowDatasetSnapshotsOnExecutionCompletion = !!effectiveFeatureFlags['AllowDatasetSnapshotsOnExecutionCompletion'];
  const projectTemplatesEnabled = commonFlags.booleanSettings.indexOf('projectTemplatesEnabled') > -1;
  const twirlConversionFor58 = commonFlags.booleanSettings.indexOf('twirlConversionFor58') > -1;
  const detwirlEnvironments58 = commonFlags.booleanSettings.indexOf('detwirlEnvironments58') > -1;
  const projectTemplateHubEnabled = commonFlags.booleanSettings.indexOf('projectTemplateHubEnabled') > -1;
  const detwirlSearch58 = commonFlags.booleanSettings.indexOf('detwirlSearch58') > -1;

  return {
    _loaded: true,
    allowConcurrentRunsByDefault,
    disableDFSBasedProjects,
    disableJobsListAutoUpdate,
    enableAddingDataSourcesInRemoteWorkspaces,
    enableApps,
    enableDarkMode,
    enableDaskClusters,
    enableDatasets,
    enableDiskUsageVolumeCheck,
    enableEnvironmentRevisions,
    enableExportsWorkflow,
    enableExternalDataVolumes,
    enableGitBasedProjects,
    enableGitCredentialFlowForCollaborators,
    enableHybrid,
    enableInWorkspaceBranchSelection,
    enableJiraIntegration,
    enableLaunchers,
    hideWelcomeCarousel,
    enableFeedbackModal,
    enableMergeConflictResolution,
    enableModelAPIs,
    enableModelRegistry,
    enableModelMonitoringForModelAPIs,
    enableMpiClusters,
    enablePhotonService,
    enablePinProjects,
    enableRayClusters,
    enableSagemakerExportUI,
    enableCopyGitlabGBP,
    enableCopyGithubGBP,
    enableSelectFileSync,
    enableSparkClusters,
    enableTrialBanner,
    enableReproduction: enableReproduction,
    excludeModelGitDirectory,
    externalDataVolumesFullCensor,
    hardwareTierCapacityFetchingEnabled,
    isMixpanelEnabled: frontendClientEnabled,
    mixpanelToken: token,
    shouldExecuteHtmlInMarkdown,
    showDSLFeatures,
    showPublicModelProductsOption,
    showPublicProjectsOption,
    showTagsNavItem,
    showUserNotifications,
    showV1DataProjects,
    feedbackSendingConfigured,
    hybridModelApisEnabled,
    enableRestrictedAssets,
    allowDatasetSnapshotsOnExecutionCompletion,
    projectTemplatesEnabled,
    twirlConversionFor58,
    detwirlEnvironments58,
    projectTemplateHubEnabled,
    detwirlSearch58
  };
}

export interface FormattedPrincipal extends FormattedCommonFlags {
  canReadKubernetes: boolean;
  showAdminMenu: boolean;
  showComputeInControlCenter: boolean;
  showEndpointSpend: boolean; // Obsolete
  userIsAnonymous?: boolean;
}

export const formattedPrincipalInitialState: FormattedPrincipal = {
  _loaded: false,
  canReadKubernetes: false,
  disableDFSBasedProjects: false,
  disableJobsListAutoUpdate: false,
  enableAddingDataSourcesInRemoteWorkspaces: false,
  enableDarkMode: false,
  enableDaskClusters: false,
  enableDatasets: false,
  enableDiskUsageVolumeCheck: false,
  enableEnvironmentRevisions: undefined,
  enableExternalDataVolumes: false,
  enableGitBasedProjects: false,
  enableGitCredentialFlowForCollaborators: false,
  enableHybrid: false,
  enableInWorkspaceBranchSelection: false,
  enableJiraIntegration: false,
  enableMergeConflictResolution: false,
  enableMpiClusters: false,
  enablePinProjects: true,
  enableRayClusters: false,
  enableSagemakerExportUI: false,
  enableSelectFileSync: false,
  enableSparkClusters: false,
  enableReproduction: false,
  excludeModelGitDirectory: true,
  externalDataVolumesFullCensor: false,
  hardwareTierCapacityFetchingEnabled: false,
  isMixpanelEnabled: false,
  shouldExecuteHtmlInMarkdown: false,
  showAdminMenu: false,
  showComputeInControlCenter: false,
  showDSLFeatures: false,
  showEndpointSpend: false,
  showPublicModelProductsOption: true,
  showPublicProjectsOption: true,
  showTagsNavItem: false,
  showUserNotifications: false,
  showV1DataProjects: true,
  enableCopyGitlabGBP: false,
  enableCopyGithubGBP: false,
  hideWelcomeCarousel: false,
  enableFeedbackModal: false,
  hybridModelApisEnabled: false,
  allowDatasetSnapshotsOnExecutionCompletion: false,
  projectTemplatesEnabled: false,
  twirlConversionFor58: false,
  detwirlEnvironments58: false,
  projectTemplateHubEnabled: false,
  detwirlSearch58: false
};

export const formatPrincipal = (principal: Principal): FormattedPrincipal => {
  const allowedSystemOps: { [key: string]: boolean } = (principal.allowedSystemOperations || []).reduce((ops, next) => {
    ops[next] = true;
    return ops;
  }, {});

  const showAdminMenu = !!allowedSystemOps.ViewAdminMenu;
  const showComputeInControlCenter = !!allowedSystemOps.ViewEverythingInControlCenter;
  const canReadKubernetes = !!allowedSystemOps.ReadKubernetes;
  const showEndpointSpend = false; // Obsolete
  const userIsAnonymous = principal.isAnonymous;

  const formattedCommonFlags: FormattedCommonFlags = formatCommonFlags({
    mixpanelSettings: principal.mixpanelSettings,
    booleanSettings: principal.booleanSettings,
    featureFlags: principal.featureFlags
  });

  return {
    ...formattedCommonFlags,
    canReadKubernetes,
    showAdminMenu,
    showComputeInControlCenter,
    showEndpointSpend,
    userIsAnonymous,
  };
};

export interface FormattedFrontendConfig extends FormattedCommonFlags, WhiteLabelSettings {
  stage: string;
  version: string;
}

export const formattedFrontendConfigInitialState: FormattedFrontendConfig = {
  ...formattedPrincipalInitialState,
  stage: '',
  version: '',
  errorPageContactEmail: '',
  appLogo: '',
  appLogoBgColor: '',
  defaultProjectName: '',
  favicon: '',
  gitCredentialsDescription: '',
  helpContentUrl: '',
  hidePopularProjects: false,
  hideDownloadDominoCli: false,
  hideMarketingDisclaimer: false,
  hidePublicProjects: false,
  hideSearchableProjects: false,
  hideSuggestedProjects: false,
  hideLearnMoreOnFile: false,
  hideGitSshKey: false,
  appName: '',
  pageFooter: '',
  showSupportButton: false,
  supportEmail: '',
}

export const formatFrontendConfig = (frontendConfig: FrontendConfig): FormattedFrontendConfig => {

  const stage = frontendConfig.stage;
  const version = frontendConfig.version;
  const {
    errorPageContactEmail,
    appLogo,
    appLogoBgColor,
    defaultProjectName,
    favicon,
    gitCredentialsDescription,
    helpContentUrl,
    hidePopularProjects,
    hideDownloadDominoCli,
    hideMarketingDisclaimer,
    hidePublicProjects,
    hideSearchableProjects,
    hideSuggestedProjects,
    hideLearnMoreOnFile,
    hideGitSshKey,
    appName,
    pageFooter,
    showSupportButton,
    supportEmail
  } = frontendConfig.whiteLabelConfigurations;

  const formattedCommonFlags: FormattedCommonFlags = formatCommonFlags({
    mixpanelSettings: frontendConfig.mixpanelSettings,
    booleanSettings: frontendConfig.booleanSettings,
    featureFlags: frontendConfig.featureFlags
  });

  return {
    ...formattedCommonFlags,
    stage,
    version,
    errorPageContactEmail,
    appLogo,
    appLogoBgColor,
    defaultProjectName,
    favicon,
    gitCredentialsDescription,
    helpContentUrl,
    hidePopularProjects,
    hideDownloadDominoCli,
    hideMarketingDisclaimer,
    hidePublicProjects,
    hideSearchableProjects,
    hideSuggestedProjects,
    hideLearnMoreOnFile,
    hideGitSshKey,
    appName,
    pageFooter,
    showSupportButton,
    supportEmail,
  };
};
