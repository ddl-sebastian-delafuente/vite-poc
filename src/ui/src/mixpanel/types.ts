import { DominoProjectsApiOnDemandSparkClusterPropertiesSpec } from '@domino/api/dist/types';

export enum Locations {
  ExperimentsList = 'Experiments List View',
  ExperimentRuns = 'Experiment Runs View',
  ExperimentRunDetails = 'Experiment Run Details',
  ExperimentRunsCompare = 'Experiment Runs Compare',
  ExperimentRunsActions = 'Experiment Run',
  ExperimentRunDetailsMetrics = 'Experiment Run Details Metrics Tab',
  LaunchpadModelDetails = 'Launchpad Model Details',
  LaunchpadModelProductView = 'Launchpad Model Product View',
  ModelOverview = 'Model Overview',
  LaunchpadViewApp = 'Launchpad View App',
  LaunchpadEditAppView = 'Launchpad Model Product Edit View',
  LaunchpadPublishAppView = 'Launchpad Model Product Publish View',
  NavigationList  = 'Navigation View',
  ControlCenter = 'Control Center',
  LabProjectView = 'Lab Project View',
  Dialog = 'Dialog',
  ProjectPortfolio = 'Project Portfolio',
  AssetPortfolio = 'Asset Portfolio',
  ActivityFeed = 'Activity Feed',
  JobLaunchModal = 'Job Launch',
  WorkspaceSession = 'Workspace Session',
  WorkspaceLaunchModal = 'Workspace Launch',
  WorkspaceCommits = 'Workspace Commits',
  WorkspaceStopModal = 'Workspace Stop',
  WorkspaceBanner = 'WorkspaceBanner',
  DatasetsBanner = 'DatasetsBanner',
  DatasetsDeprecationWarning = 'DatasetsDeprecationWarning',
  ComputeAndSpend = 'Compute And Spend',
  ProjectPortfolioActiveTab = 'Projects Portfolio Active Tab',
  ProjectPortfolioCompletedTab = 'Projects Portfolio Completed Tab',
  Datasets = 'Datasets',
  HardwareTiers = 'Hardware Tiers',
  ModelMonitoring = 'Model Monitoring',
  NotificationsAdmin = 'Notifications Admin',
  NotificationsDSP = 'Notifications DSP',
  WorkspacePageView = "Workspace Page View",
  CreateNewWorkspace = "Create New Workspace Click",
  CreateNewWorkSpaceEnvironmentStep = "Create New Workspace Environment Step",
  CreateNewWorkSpaceCodeStep = "Create New Workspace Code Step",
  CreateNewWorkSpaceDatasetStep = "Create New Workspace Dataset Step",
  CreateNewWorkSpaceClusterStep = "Create New Workspace Cluster Step",
  LaunchNewWorkspaceButtonClick = "Launch New Workspace Button Click",
  ProjectsListPage = "Projects List page",
  CreateNewProject = "Create New Project",
  CreateProjectNameStep = "Create Project Name Step",
  CreateProjectCodeStep = "Create Project Code Step",
  CreateProjectButtonClick = "Create Project Button Click",
  ProjectOverviewPageView = "Project Overview Page View",
  ClickCreateNewDataset = "Click Create New Dataset",
  DatasetUploadStepView = "Dataset upload step view",
  DatasetUploadSuccess = "Dataset Upload Success",
  DatasetListView = "Dataset List View",
  DataSourceClick = "Datasource Click",
  CreateNewDataSourceClick = "Create New DataSource Click",
  DataSourceConfigureStep = "DataSource Configure Step",
  DataSourceAuthenticateStep = "DataSource Authenticate Step",
  DataSourcePermissionsStep = "Datasource Permissions Step",
  FinishDataSourceSetup = "Finish DataSource Setup",
  DataSourceOverviewPageView = "DataSource Overview Page View",
  JobsListView = "Jobs List View",
  CreateJobClick = "Create Job Click",
  CreateJobExecutionStep = "Create Job Execution Step",
  CreateJobDataStep = "Create Job Data Step",
  CreateJobClusterStep = "Create Job Cluster Step",
  NewJobAdded = "New Job Added",
  JobStatusChange = "Job Status Change",
  ProjectDataSourcePageView = "Project's Data Source Page View",
  LaunchWorkspaceFromProjectOverview = "Launch Workspace From Project Overview",
  WorkspaceView = "Workspace View",
  DataSourceEditPermissionClick = "DataSource Edit Permission Click",
  DataSourceEditPermissionPanelView = "DataSource Edit Permission Panel View",
  AddedUserToDataSource = "Added User To DataSource",
  DataSourceAddToProject = "DataSource Add To Project",
  AddDataSourceToProjectSuccess = "Add DataSource To Project Success",
  AddDataSourceToProjectFailed = "Add DataSource To Project Failed",
  ModelApiPageView = "Model Api Page View",
  ProjectTagsPageView = "Project Tags Page View",
  SearchPageView = "Search Page View",
  JobsResultSection = "Jobs Result Section"
}

export enum WorkspaceSessionLocationType {
  Workspace = 'Workspace',
  Navbar = 'Workspace\'s Nav Bar',
  SideTray = 'Workspace\'s Side Tray',
  Dialog = 'Dialog',
}

export enum WorkspaceSessionInteractionType {
  SubmittedWithCommitMessage = 'Submitted With Commit Message',
  SubmittedWithoutCommitMessage = 'Submitted Without Commit Message',
}

export interface MixpanelEvent {
  name: string;
  properties: MixpanelEventDetails;
}

export interface MixpanelEventDetails {
  location: Locations;
}

export interface ApiCallDetails {
  isApiSuccess?: boolean;
}

export interface ControlCenterEventDetails extends MixpanelEventDetails {
  selectedPlot: string;
}

export interface ViewedLaunchPadEventDetails extends MixpanelEventDetails {
  details: boolean;
  project?: string;
  modelProductType?: 'APP' | 'BATCH' | 'REPORT' | 'SCORER';
}

export interface JobConfig {
  jobName: string;
  jobCommand: string;
  hardwareTierId?: string;
  environmentId?: string;
  sparkClusterConfiguration?: DominoProjectsApiOnDemandSparkClusterPropertiesSpec;
}

export interface WorkspaceConfig {
  workspaceName?: string;
  hardwareTierId?: string;
  environmentId?: string;
  workspaceDefinitionId: string;
  dataSetConfig?: string;
  onDemandSparkClusterProperties?: DominoProjectsApiOnDemandSparkClusterPropertiesSpec;
}

export interface EditedAppLaunchPadEventDetails extends MixpanelEventDetails {
  project?: string;
  fields?: string[];
  modelProductId?: string;
}

export interface PublishAppLaunchPadEventDetails extends MixpanelEventDetails {
  project?: string;
  fields?: string[];
  modelProductId?: string;
  isGitBasedProject?: boolean;
}

export interface NavigationEventDetails {
  link: string;
  location: Locations;
}

export class ViewedLaunchPadEvent implements MixpanelEvent {
  name = 'Viewed launchpad';
  properties: ViewedLaunchPadEventDetails;
  constructor(properties: ViewedLaunchPadEventDetails) {
    this.properties = properties;
  }
}

export class PublishLaunchPadEvent implements MixpanelEvent {
  name = 'Publish model product';
  properties: PublishAppLaunchPadEventDetails;
  constructor(properties: PublishAppLaunchPadEventDetails) {
    this.properties = properties;
  }
}

export class EditedLaunchPadEvent implements MixpanelEvent {
  name = 'Edited model product';
  properties: EditedAppLaunchPadEventDetails;
  constructor(properties: EditedAppLaunchPadEventDetails) {
    this.properties = properties;
  }
}

export interface StartNewExperimentDetails extends MixpanelEventDetails {
  isParameterized: boolean;
  totalExperiments: number;
  totalParameters: number;
  submitted: boolean;
  hasErrors: boolean;
}

export class StartNewExperimentEvent implements MixpanelEvent {
  name = 'Start New Experiment';
  properties: StartNewExperimentDetails;
  constructor(properties: StartNewExperimentDetails) {
    this.properties = properties;
  }
}

export interface ActivityFeedFilterDetails extends MixpanelEventDetails {
  activeFilters: string;
  projectId: string;
}

export class ActivityFeedFilterEvent implements MixpanelEvent {
  name = 'Activity feed filtered';
  properties: ActivityFeedFilterDetails;
  constructor(properties: ActivityFeedFilterDetails) {
    this.properties = properties;
  }
}

export class ActivityFeedVisitedEvent implements MixpanelEvent {
  name = 'Activity feed visited';
  properties: ActivityFeedFilterDetails;
  constructor(properties: ActivityFeedFilterDetails) {
    this.properties = properties;
  }
}

export class BasicMixpanelEvent implements MixpanelEvent {
  name: string;
  properties: MixpanelEventDetails;
  constructor(name: string, properties: MixpanelEventDetails) {
    this.name = name;
    this.properties = properties;
  }
}

export class PrimaryNavigationEvent implements MixpanelEvent {
  name = 'Click Primary Navigation';
  properties: NavigationEventDetails;
  constructor(properties: NavigationEventDetails) {
    this.properties = properties;
  }
}

export class SecondaryNavigationEvent implements MixpanelEvent {
  name = 'Click Secondary Navigation';
  properties: NavigationEventDetails;
  constructor(properties: NavigationEventDetails) {
    this.properties = properties;
  }
}

export class SelectedPlotNavigationEvent implements MixpanelEvent {
  name = 'Overview Bar Plot Navigation';
  properties: ControlCenterEventDetails;
  constructor(properties: ControlCenterEventDetails) {
    this.properties = properties;
  }
}

export interface ArbitraryPropertyDetails {
  'areGitReposImported': boolean;
  'areGitReposCommitted': boolean;
  'isRunId': boolean;
}

export interface StopEventDetails extends MixpanelEventDetails {
  subLocation: WorkspaceSessionLocationType;
  interaction?: WorkspaceSessionInteractionType;
  arbitraryProperties: ArbitraryPropertyDetails;
}

export interface FilesDetails extends MixpanelEventDetails {
  subLocation: WorkspaceSessionLocationType;
}

export interface JobLaunchEventProperties extends MixpanelEventDetails {
  creator?: string;
  project: string;
  timeLaunched: Date;
  jobConfiguration: JobConfig;
}

export interface WorkspaceLaunchProperties extends MixpanelEventDetails {
  creator: string;
  project: string;
  timeLaunched: Date;
  workspaceConfiguration: WorkspaceConfig;
}

export interface WorkspaceStopModalDismissProperties extends MixpanelEventDetails {
  user: string;
}

export interface WorkspaceSessionDismissSyncingLoaderProperties extends MixpanelEventDetails {
  user: string;
  subLocation: WorkspaceSessionLocationType;
}

export interface ExperimentConfig {
  experimentId?: string;
  pageToken?: string;
  searchString?: string;
  runId?: string;
  ChartsCountChange?: number;
  chartConfig?: any;
  viewType?: 'ACTIVE_ONLY' | 'DELETED_ONLY' | 'ALL'
}

export interface ExperimentEventDetails extends MixpanelEventDetails {
  user: string;
  project: string;
  apiCallDetails?: ApiCallDetails;
  experimentConfig?: ExperimentConfig;
  jobConfig?: { id?: string, runIds?: string[] | string, experimentId?: string };
}

export interface WorkspaceBannerDismissProperties extends MixpanelEventDetails {
  user: string;
}

export interface DatasetsBannerDismissProperties extends MixpanelEventDetails {
  user: string;
}

export interface DatasetsDeprecationWarningDismissProperties extends MixpanelEventDetails {
  user: string;
}

export class GetLatestFilesEvent implements MixpanelEvent {
  name = 'Get Latest';
  properties: FilesDetails;
  constructor(properties: FilesDetails) {
    this.properties = properties;
  }
}

export class StopAndCommitWithMessageEvent implements MixpanelEvent {
  name = 'Submitted With Commit Message';
  properties: StopEventDetails;
  constructor(properties: StopEventDetails) {
    this.properties = properties;
  }
}

export class StopAndCommitWithOutMessageEvent implements MixpanelEvent {
  name = 'Submitted Without Commit Message';
  properties: StopEventDetails;
  constructor(properties: StopEventDetails) {
    this.properties = properties;

  }
}

export class StopAndDiscardEvent implements MixpanelEvent {
  name = 'Stop And Discard';
  properties: StopEventDetails;
  constructor(properties: StopEventDetails) {
    this.properties = properties;
  }
}

export class SyncHasConflictsEvent implements MixpanelEvent {
  name = 'Discarded With File Changes';
  properties: FilesDetails;
  constructor(properties: FilesDetails) {
    this.properties = properties;
  }
}

export class FullSyncEvent implements MixpanelEvent {
  name = 'Full Sync';
  properties: FilesDetails;
  constructor(properties: FilesDetails) {
    this.properties = properties;
  }
}

export class DismissSyncingLoaderEvent implements MixpanelEvent {
  name = 'Continue Edit While Syncing';
  properties: WorkspaceSessionDismissSyncingLoaderProperties;
  constructor(properties: WorkspaceSessionDismissSyncingLoaderProperties) {
    this.properties = properties;
  }
}

class ExperimentEvent implements MixpanelEvent {
  name = 'Experiment Event';
  properties: ExperimentEventDetails;
  constructor(name: string, properties: ExperimentEventDetails) {
    this.name = name;
    this.properties = properties;
  }
}

export class ExperimentsListEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('List Experiments', properties);
  }
}

export class ExperimentRunsListEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('List Experiment Runs', properties);
  }
}

export class ExperimentRunsListFilterEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('List Experiment Runs - Search Filter', properties);
  }
}

export class ExperimentRunsListRefreshEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('List Experiment Runs - Refresh', properties);
  }
}

export class ExperimentRunsListLoadMoreEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('List Experiment Runs - Load More', properties);
  }
}

export class ExperimentRunsNestedListEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('List Experiment Nested Runs', properties);
  }
}

export class ExperimentRunsDetailsExportCsvEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('List Experiment Runs - Export as CSV', properties);
  }
}

export class ExperimentRunsDownloadChartEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('List Experiment Runs - Download chart', properties);
  }
}

export class ExperimentRunsGetDetailsEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Get Experiment Runs Details', properties);
  }
}

export class ExperimentRunDetailsOverviewTab extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs Details - Overview Tab', properties);
  }
}

export class ExperimentRunDetailsParamsTab extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs Details - Parameters Tab', properties);
  }
}

export class ExperimentRunDetailsMetricsTab extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs Details - Metrics Tab', properties);
  }
}

export class ExperimentRunDetailsOutputsTab extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs Details  - Outputs Tab', properties);
  }
}

export class ExperimentRunDetailsOutputsArtifactsDownload extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs Details  - Outputs Tab - Download artifact', properties);
  }
}

export class ExperimentRunDetailsLogsTab extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs Details - Logs Tab', properties);
  }
}

export class ExperimentRunsAddChartEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs Details - Metrics Tab - Add Chart', properties);
  }
}

export class ExperimentRunsUpdateConfigEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs Details - Metrics Tab - Update chart config', properties);
  }
}

export class EditExperimentRunNameEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs Details - Edit run name', properties);
  }
}

export class ExperimentRunsRestoreEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs - Restore', properties);
  }
}

export class ExperimentRunsArchiveEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs - Archive', properties);
  }
}

export class ExperimentRunsAddTagEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs - Add Tag', properties);
  }
}

export class ExperimentRunsComparePageExportEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Compare Experiment Runs - Export as PDF', properties);
  }
}

export class ExperimentRunsComparePageMetricsToggleEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Compare Experiment Runs - Metrics - Toggle diffs', properties);
  }
}

export class ExperimentRunsComparePageParamsToggleEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Compare Experiment Runs - Params - Toggle diffs', properties);
  }
}

export class ExperimentRunNameClickEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Compare Experiment Runs - Run details - Run name click', properties);
  }
}

export class ExperimentJobCrossReferenceLinkClick extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Compare Experiment Runs - Run details - Job name click', properties);
  }
}

export class ExperimentJobCrossReferenceLinkClickRunDetails extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs Details - Overview Tab - Job name click', properties);
  }
}

export class ExperimentWorkspaceCrossReferenceLinkClickRunDetails extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Experiment Runs Details - Overview Tab - Workspace name click', properties);
  }
}

export class ExperimentWorkspaceCrossReferenceLinkClick extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Compare Experiment Runs - Run details - Workspace name click', properties);
  }
}

export class ExperimentRunsCompareChartConfigChangeEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Compare Experiment Runs - Chart config change', properties);
  }
}

export class ExperimentRunsCompareDownloadChartEvent extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Compare Experiment Runs - Download chart', properties);
  }
}

export class ExperimentExperimentCrossReferenceLinkClick extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Jobs Dashboard - Job results - experiment click', properties);
  }
}

export class ExperimentExperimentRunsCrossReferenceLinkClick extends ExperimentEvent {
  constructor(properties: ExperimentEventDetails) {
    super('Jobs Dashboard - Job results - experiment runs click', properties);
  }
}

export class DownloadFilesConflictEvent implements MixpanelEvent {
  name = 'Create File Conflicts';
  properties: MixpanelEventDetails;
  constructor(properties: MixpanelEventDetails) {
    this.properties = properties;
  }
}

export class JobLaunchEvent implements MixpanelEvent {
  name = 'Start Job';
  properties: JobLaunchEventProperties;
  constructor(properties: JobLaunchEventProperties) {
    this.properties = properties;
  }
}

export class WorkspaceLaunchEvent implements MixpanelEvent {
  name = 'Start Workspace';
  properties: WorkspaceLaunchProperties;
  constructor(properties: WorkspaceLaunchProperties) {
    this.properties = properties;
  }
}

export class WorkspaceStopModalDismissEvent implements MixpanelEvent {
  name = 'Dismiss Workspace Stop Modal';
  properties: WorkspaceStopModalDismissProperties;
  constructor(properties: WorkspaceStopModalDismissProperties) {
    this.properties = properties;
  }
}

export class WorkspaceBannerDismissEvent implements MixpanelEvent {
  name = 'Dismiss Workspace LCA Banner';
  properties: WorkspaceBannerDismissProperties;
  constructor(properties: WorkspaceBannerDismissProperties) {
    this.properties = properties;
  }
}

export class DatasetsBannerDismissEvent implements MixpanelEvent {
  name = 'Dismiss Datasets R/W Banner';
  properties: DatasetsBannerDismissProperties;
  constructor(properties: DatasetsBannerDismissProperties) {
    this.properties = properties;
  }
}

export class DatasetsDeprecationWarningDismissEvent implements MixpanelEvent {
  name = 'Dismiss Datasets Deprecation Warning';
  properties: DatasetsDeprecationWarningDismissProperties;
  constructor(properties: DatasetsDeprecationWarningDismissProperties) {
    this.properties = properties;
  }
}

export interface DatasetsTabEventDetails extends MixpanelEventDetails {
  tab: string;
}

export class DatasetsTabEvent implements MixpanelEvent {
  name = 'Datasets Tab selected';
  properties: DatasetsTabEventDetails;
  constructor(properties: DatasetsTabEventDetails) {
    this.properties = properties;
  }
}

export interface HardwareTiersButtonEventDetails extends MixpanelEventDetails {
  button: string;
}

export class HardwareTiersButtonEvent implements MixpanelEvent {
  name = 'Hardware Tiers Button Clicked';
  properties: HardwareTiersButtonEventDetails;
  constructor(properties: HardwareTiersButtonEventDetails) {
    this.properties = properties;
  }
}

export interface ReproduceWorkspaceEventDetails extends MixpanelEventDetails {
  userId: string;
  userName: string;
  reproducedFrom: 'FromWorkspace' | 'FromModel';
}

export class ReproduceWorkspaceButtonEvent implements MixpanelEvent {
  name = 'Reproduce workspace button clicked';
  properties: ReproduceWorkspaceEventDetails;
  constructor(properties: ReproduceWorkspaceEventDetails) {
    this.properties = properties;
  }
}

export class AdminNotificationsDeleteButtonEvent implements MixpanelEvent {
  name = 'Admin Notifications Delete button clicked';
  properties: MixpanelEventDetails;
  constructor(properties: MixpanelEventDetails) {
    this.properties = properties;
  }
}

export class AdminNotificationsExpireButtonEvent implements MixpanelEvent {
  name = 'Admin Notifications Expire button clicked';
  properties: MixpanelEventDetails;
  constructor(properties: MixpanelEventDetails) {
    this.properties = properties;
  }
}

export interface AdminNotificationsCreateMessageDetails extends MixpanelEventDetails {
  priority: string;
  start: string;
  end: string;
}

export class AdminNotificationsCreateMessageEvent implements MixpanelEvent {
  name = 'Admin Notifications Create Message';
  properties: AdminNotificationsCreateMessageDetails;
  constructor(properties: AdminNotificationsCreateMessageDetails) {
    this.properties = properties;
  }
}

export class DSPNotificationsMarkAllAsReadEvent implements MixpanelEvent {
  name = 'DSP Notifications Mark All As Read clicked';
  properties: MixpanelEventDetails;
  constructor(properties: MixpanelEventDetails) {
    this.properties = properties;
  }
}

export class DSPNotificationsOpenScreen implements MixpanelEvent {
  name = 'DSP Notifications Screen Opened';
  properties: MixpanelEventDetails;
  constructor(properties: MixpanelEventDetails) {
    this.properties = properties;
  }
}

export class AdminNotificationsOpenScreen implements MixpanelEvent {
  name = 'Admin Notifications Screen Opened';
  properties: MixpanelEventDetails;
  constructor(properties: MixpanelEventDetails) {
    this.properties = properties;
  }
}

export interface MonitoringTabDetails extends MixpanelEventDetails {
  userId: string;
  modelId: string;
}

export class MonitoringTabVisitedEvent implements MixpanelEvent {
  name = 'Monitoring tab visited';
  properties: MonitoringTabDetails;
  constructor(properties: MonitoringTabDetails) {
    this.properties = properties;
  }
}

export interface ConfigureMonitoringDetails extends MonitoringTabDetails {
  modelVersionId: string
}

export class MonitoringConfiguredEvent implements MixpanelEvent {
  name = 'Integrated Monitoring Configured';
  properties: ConfigureMonitoringDetails;
  constructor(properties: ConfigureMonitoringDetails) {
    this.properties = properties;
  }
}

export interface WorkspacePageViewDetails extends MixpanelEventDetails {
  projectId: string;
}

export class WorkspacePageView implements MixpanelEvent {
  name = "Workspace Page View";
  properties: WorkspacePageViewDetails;
  constructor(properties: WorkspacePageViewDetails) {
    this.properties = properties;
  }
}

export interface CreateNewWorkspaceDetails extends MixpanelEventDetails {
  projectId: string;
}

export class CreateNewWorkspaceClick implements MixpanelEvent {
  name = "Create New Workspace";
  properties: CreateNewWorkspaceDetails;
  constructor(properties: CreateNewWorkspaceDetails) {
    this.properties = properties;
  }
}

export interface LaunchNewWorkspaceEnvironmentDetails extends MixpanelEventDetails {
  projectId: string;
}

export class LaunchNewWorkspaceEnvironmentStepView implements MixpanelEvent {
  name = "Launch New Workspace Environment Step View";
  properties: LaunchNewWorkspaceEnvironmentDetails;
  constructor(properties: LaunchNewWorkspaceEnvironmentDetails) {
    this.properties = properties;
  }
}

export interface LaunchNewWorkspaceCodeDetails extends MixpanelEventDetails {
  projectId: string;
}

export class LaunchNewWorkspaceCodeStepView implements MixpanelEvent {
  name = "Launch New Workspace Code Step View";
  properties: LaunchNewWorkspaceCodeDetails;
  constructor(properties: LaunchNewWorkspaceCodeDetails) {
    this.properties = properties;
  }
}

export interface LaunchNewWorkspaceDatasetDetails extends MixpanelEventDetails {
  projectId: string;
}

export class LaunchNewWorkspaceDatasetStepView implements MixpanelEvent {
  name = "Launch New Workspace Dataset Step View";
  properties: LaunchNewWorkspaceDatasetDetails;
  constructor(properties: LaunchNewWorkspaceDatasetDetails) {
    this.properties = properties;
  }
}

export interface LaunchNewWorkspaceClusterDetails extends MixpanelEventDetails {
  projectId: string;
}

export class LaunchNewWorkspaceClusterStepView implements MixpanelEvent {
  name = "Launch New Workspace Cluster Step View";
  properties: LaunchNewWorkspaceClusterDetails;
  constructor(properties: LaunchNewWorkspaceClusterDetails) {
  this.properties = properties;
  }
}

export interface LaunchWorkspaceButtonClickDetails extends MixpanelEventDetails {
  projectId: string;
}

export class LaunchNewWorkspaceButtonClick implements MixpanelEvent {
  name = "Launch Workspace Button Click";
  properties: LaunchWorkspaceButtonClickDetails;
  constructor(properties: LaunchWorkspaceButtonClickDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProjectsPageViewDetails extends MixpanelEventDetails {
}

export class ProjectsPageView implements MixpanelEvent {
  name = "Projects page view";
  properties: ProjectsPageViewDetails;
  constructor(properties: ProjectsPageViewDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateNewProjectDetails extends MixpanelEventDetails {
}

export class CreateNewProjectClick implements MixpanelEvent {
  name = "Create New Project Click";
  properties: CreateNewProjectDetails;
  constructor(properties: CreateNewProjectDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateProjectNameStepDetails extends MixpanelEventDetails {
}

export class CreateProjectNameStepView implements MixpanelEvent {
  name = "Create Project Name Step View";
  properties: CreateProjectNameStepDetails;
  constructor(properties: CreateProjectNameStepDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateProjectCodeStepDetails extends MixpanelEventDetails {
}

export class CreateProjectCodeStepView implements MixpanelEvent {
  name = "Create Project Code Step View";
  properties: CreateProjectCodeStepDetails;
  constructor(properties: CreateProjectCodeStepDetails) {
    this.properties = properties;
  }
}

export enum CostHostingType {
  Git = 'git',
  DFS = 'DFS'
}

export interface CreateProjectButtonClickDetails extends MixpanelEventDetails {
  costHosting: CostHostingType
}

export class CreateProjectButtonClick implements MixpanelEvent {
  name = "Create Project Button Click";
  properties: CreateProjectButtonClickDetails;
  constructor(properties: CreateProjectButtonClickDetails) {
    this.properties = properties;
  }
}

export interface ProjectOverviewPageViewDetails extends MixpanelEventDetails {
  projectId: string;
}

export class ProjectOverviewPageView implements MixpanelEvent {
  name = "Project Overview Page View";
  properties: ProjectOverviewPageViewDetails;
  constructor(properties: ProjectOverviewPageViewDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateNewDatasetDetails extends MixpanelEventDetails {
}

export class ClickCreateNewDataset implements MixpanelEvent {
  name = "Click Create New Dataset";
  properties: CreateNewDatasetDetails;
  constructor(properties: CreateNewDatasetDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DatasetUploadStepViewDetails extends MixpanelEventDetails {
}

export class DatasetUploadStepView implements MixpanelEvent {
  name = "Dataset Upload Step View";
  properties: DatasetUploadStepViewDetails;
  constructor(properties: DatasetUploadStepViewDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DatasetUploadSuccessDetails extends MixpanelEventDetails {
}

export class DatasetUploadSuccess implements MixpanelEvent {
  name = "Dataset Upload Success";
  properties: DatasetUploadSuccessDetails;
  constructor(properties: DatasetUploadSuccessDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DatasetListViewDetails extends MixpanelEventDetails {
}

export class DatasetListView implements MixpanelEvent {
  name = "Dataset List View";
  properties: DatasetListViewDetails;
  constructor(properties: DatasetListViewDetails) {
    this.properties = properties;
  }
}

export interface DataSourceClickDetails extends MixpanelEventDetails {
  dataSourceId: string;
}

export class DataSourceClickEvent implements MixpanelEvent {
  name = "DataSource Click";
  properties: DataSourceClickDetails;
  constructor(properties: DataSourceClickDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateNewDatasourceClickDetails extends MixpanelEventDetails {
}

export class CreateNewDataSourceClick implements MixpanelEvent {
  name = "Create New DataSource Click";
  properties: CreateNewDatasourceClickDetails;
  constructor(properties: CreateNewDatasourceClickDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DatasourceConfigureStepDetails extends MixpanelEventDetails {
}

export class DatasourceConfigureStep implements MixpanelEvent {
  name = "Datasource Configure Step View";
  properties: DatasourceConfigureStepDetails;
  constructor(properties: DatasourceConfigureStepDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DatasourceAuthenticateStepDetails extends MixpanelEventDetails {
}

export class DatasourceAuthenticateStep implements MixpanelEvent {
  name = "Datasource Authenticate Step View";
  properties: DatasourceAuthenticateStepDetails;
  constructor(properties: DatasourceAuthenticateStepDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DatasourcePermissionsStepDetails extends MixpanelEventDetails {
}

export class DatasourcePermissionsStep implements MixpanelEvent {
  name = "Datasource Permissions Step View";
  properties: DatasourcePermissionsStepDetails;
  constructor(properties: DatasourcePermissionsStepDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FinishDataSourceSetupDetails extends MixpanelEventDetails {
}

export class FinishDataSourceSetup implements MixpanelEvent {
  name = "Finish DataSource Setup";
  properties: FinishDataSourceSetupDetails;
  constructor(properties: FinishDataSourceSetupDetails) {
    this.properties = properties;
  }
}

export interface DataSourceOverviewPageViewDetails extends MixpanelEventDetails {
  dataSourceId: string;
}

export class DataSourceOverviewPageView implements MixpanelEvent {
  name = "DataSource Overview Page View";
  properties: DataSourceOverviewPageViewDetails;
  constructor(properties: DataSourceOverviewPageViewDetails) {
    this.properties = properties;
  }
}

export interface JobsListViewDetails extends MixpanelEventDetails {
  projectId: string;
}

export class JobsListView implements MixpanelEvent {
  name = "Jobs List View";
  properties: JobsListViewDetails;
  constructor(properties: JobsListViewDetails) {
    this.properties = properties;
  }
}

export interface CreateJobClickDetails extends MixpanelEventDetails {
  projectId: string;
}

export class CreateJobClick implements MixpanelEvent {
  name = "Create Job Click";
  properties: CreateJobClickDetails;
  constructor(properties: CreateJobClickDetails) {
    this.properties = properties;
  }
}

export interface CreateJobExecutionStepDetails extends MixpanelEventDetails {
  projectId: string;
}

export class CreateJobExecutionStep implements MixpanelEvent {
  name = "Create Job Execution Step";
  properties: CreateJobExecutionStepDetails;
  constructor(properties: CreateJobExecutionStepDetails) {
    this.properties = properties;
  }
}

export interface CreateJobDataStepDetails extends MixpanelEventDetails {
  projectId: string;
}

export class CreateJobDataStep implements MixpanelEvent {
  name = "Create Job Data Step";
  properties: CreateJobDataStepDetails;
  constructor(properties: CreateJobDataStepDetails) {
    this.properties = properties;
  }
}

export interface CreateJobClusterStepDetails extends MixpanelEventDetails {
  projectId: string;
}

export class CreateJobClusterStep implements MixpanelEvent {
  name = "Create Job Cluster Step";
  properties: CreateJobClusterStepDetails;
  constructor(properties: CreateJobClusterStepDetails) {
    this.properties = properties;
  }
}

export interface NewJobAddedDetails extends MixpanelEventDetails {
  projectId: string;
}

export class NewJobAdded implements MixpanelEvent {
  name = "New Job Added";
  properties: NewJobAddedDetails;
  constructor(properties: NewJobAddedDetails) {
    this.properties = properties;
  }
}

export interface JobStatusDetails extends MixpanelEventDetails {
  projectId: string;
  jobId: string;
  status: string;
}

export class JobStatusChange implements MixpanelEvent {
  name = "Job Status Change";
  properties: JobStatusDetails;
  constructor(properties: JobStatusDetails) {
    this.properties = properties;
  }
}

export interface ProjectDataSourcePageViewDetails extends MixpanelEventDetails {
  projectId: string;
}

export class ProjectDataSourcePageView implements MixpanelEvent {
  name = "Project's Data Source Page View";
  properties: ProjectDataSourcePageViewDetails;
  constructor(properties: ProjectDataSourcePageViewDetails) {
    this.properties = properties;
  }
}

export interface LaunchWorkspaceFromProjectOverviewDetails extends MixpanelEventDetails {
  projectId: string;
}

export class LaunchWorkspaceFromProjectOverview implements MixpanelEvent {
  name = "Launch Workspace Click From Project Overview";
  properties: LaunchWorkspaceFromProjectOverviewDetails;
  constructor(properties: LaunchWorkspaceFromProjectOverviewDetails) {
    this.properties = properties;
  }
}

export interface WorkspaceViewDetails extends MixpanelEventDetails {
  workspaceFailed: boolean;
}

export class WorkspaceView implements MixpanelEvent {
  name = "Workspace View";
  properties: WorkspaceViewDetails;
  constructor(properties: WorkspaceViewDetails) {
    this.properties = properties;
  }
}

export interface DataSourceEditPermissionsDetails extends MixpanelEventDetails {
  dataSourceId: string;
}

export class DataSourceEditPermissionClick implements MixpanelEvent {
  name = "DataSource Edit Permission Click";
  properties: DataSourceEditPermissionsDetails;
  constructor(properties: DataSourceEditPermissionsDetails) {
    this.properties = properties;
  }
}

export interface DataSourceEditPermissionPanelViewDetails extends MixpanelEventDetails {
  dataSourceId: string;
}

export class DataSourceEditPermissionPanelView implements MixpanelEvent {
  name = "DataSource Edit Permission Panel View";
  properties: DataSourceEditPermissionPanelViewDetails;
  constructor(properties: DataSourceEditPermissionPanelViewDetails) {
    this.properties = properties;
  }
}

export interface AddedUserToDataSourceDetails extends MixpanelEventDetails {
  dataSourceId: string;
}

export class AddedUserToDataSource implements MixpanelEvent {
  name = "Added User To DataSource";
  properties: AddedUserToDataSourceDetails;
  constructor(properties: AddedUserToDataSourceDetails) {
    this.properties = properties;
  }
}

export interface DataSourceAddToProjectDetails extends MixpanelEventDetails {
  dataSourceId: string;
  projectId: string;
}

export class DataSourceAddToProject implements MixpanelEvent {
  name = "DataSource Add To Project Click";
  properties: DataSourceAddToProjectDetails;
  constructor(properties: DataSourceAddToProjectDetails) {
    this.properties = properties;
  }
}

export interface AddDataSourceToProjectSuccessDetails extends MixpanelEventDetails {
  dataSourceId: string;
  projectId: string;
}

export class AddDataSourceToProjectSuccess implements MixpanelEvent {
  name = "Add Data Source To Project Success";
  properties: AddDataSourceToProjectSuccessDetails;
  constructor(properties: AddDataSourceToProjectSuccessDetails) {
    this.properties = properties;
  }
}

export interface AddDataSourceToProjectFailedDetails extends MixpanelEventDetails {
  dataSourceId: string;
  projectId: string;
}

export class AddDataSourceToProjectFailed implements MixpanelEvent {
  name = "Add Data Source To Project Failed";
  properties: AddDataSourceToProjectFailedDetails;
  constructor(properties: AddDataSourceToProjectFailedDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModelApiPageViewDetails extends MixpanelEventDetails {
}

export class ModelApiPageView implements MixpanelEvent {
  name = "Model Api Page View";
  properties: ModelApiPageViewDetails;
  constructor(properties: ModelApiPageViewDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProjectTagsPageViewDetails extends MixpanelEventDetails {
}

export class ProjectTagsPageView implements MixpanelEvent {
  name = "Project Tags Page View";
  properties: ProjectTagsPageViewDetails;
  constructor(properties: ProjectTagsPageViewDetails) {
    this.properties = properties;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchPageViewDetails extends MixpanelEventDetails {
}

export class SearchPageView implements MixpanelEvent {
  name = "Search Page View";
  properties: SearchPageViewDetails;
  constructor(properties: SearchPageViewDetails) {
    this.properties = properties;
  }
}
