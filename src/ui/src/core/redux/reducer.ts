import { Action } from './reduxTypes';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoNucleusLibAuthPrincipalWithFeatureFlags as Flags,
  DominoAdminInterfaceWhiteLabelConfigurations as WhiteLabelSettings,
  DominoProjectsApiProjectStageAndStatus as ProjectStageAndStatus,
  DominoWorkspaceApiWorkspaceGlobalSettingsDto as WorkspaceGlobalSettings,
  DominoCommonUserPerson
} from '@domino/api/dist/types';
import {
  FETCH_FLAGS_FAILED,
  FETCH_FLAGS_REQUESTED,
  FETCH_PROJECT,
  FETCH_PROJECT_FAILED,
  FETCH_PROJECT_REQUESTED,
  SET_FLAGS,
  FETCH_PROJECT_STAGE_AND_STATUS,
  FETCH_WHITELABEL_SETTINGS_REQUESTED,
  FETCH_WHITELABEL_SETTINGS_FAILED,
  FETCH_WHITELABEL_SETTINGS,
  SET_ARE_STAGES_STALE,
  SET_GLOBAL_SOCKET,
  SET_RESTARTABLE_WORKSPACES_GLOBAL_SETTINGS,
  FETCH_CURRENT_USER_FAILED,
  FETCH_CURRENT_USER,
} from './actions';
import { formatPrincipal, FormattedPrincipal } from '../../globalStore/util';

export enum FetchStatus {
  success = 'success',
  inflight = 'inflight',
  failed = 'failed'
}

export interface CoreState extends Omit<FormattedPrincipal, '_loaded'> {
  isMixpanelEnabled: boolean;
  mixpanelToken?: string;
  shouldExecuteHtmlInMarkdown: boolean;
  fetched?: FetchStatus;
  fetchedOps?: FetchStatus;
  fetchedWhitelabelConfig?: FetchStatus;
  fetchedCurrentUser?: FetchStatus;
  flags?: Flags;
  flagFetchFailure?: any;
  projectFetchFailure?: any;
  whiteLabelSettingsFetchFailure?: any;
  showAppPublishingEnabled: boolean;
  showApiEndPoints: boolean;
  overviewPage: boolean;
  project?: Project;
  projectStageAndStatus?: ProjectStageAndStatus;
  whiteLabelSettings?: WhiteLabelSettings;
  areStagesStale: boolean;
  globalSocket?: SocketIOClient.Socket;
  restartableWorkspacesGlobalSettings?: WorkspaceGlobalSettings;
  currentUser?: DominoCommonUserPerson;
  currentUserFetchFailure?: any;
  enableFeedbackModal?: boolean,
  enablePinProjects?: boolean;
  allowConcurrentRunsByDefault?: boolean;
  hideWelcomeCarousel?: boolean;
  twirlConversionFor58?: boolean;
}

export const initialState: CoreState = {
  isMixpanelEnabled: false,
  shouldExecuteHtmlInMarkdown: false,
  fetched: undefined,
  fetchedOps: undefined,
  fetchedWhitelabelConfig: undefined,
  showComputeInControlCenter: false,
  showTagsNavItem: false,
  showPublicProjectsOption: true,
  showPublicModelProductsOption: true,
  showAdminMenu: false,
  showEndpointSpend: false, // Obsolete
  showAppPublishingEnabled: false,
  canReadKubernetes: false,
  showApiEndPoints: false,
  overviewPage: false,
  project: undefined,
  projectStageAndStatus: undefined,
  whiteLabelSettings: undefined,
  showDSLFeatures: false,
  showV1DataProjects: true,
  enableAddingDataSourcesInRemoteWorkspaces: false,
  enableJiraIntegration: false,
  enableSparkClusters: false,
  enableRayClusters: false,
  enableDaskClusters: false,
  enableMpiClusters: false,
  enableGitBasedProjects: false,
  enableMergeConflictResolution: false,
  enableInWorkspaceBranchSelection: false,
  enableSelectFileSync: false,
  enableDiskUsageVolumeCheck: false,
  disableDFSBasedProjects: false,
  areStagesStale: false,
  disableJobsListAutoUpdate: false,
  enableExternalDataVolumes: false,
  externalDataVolumesFullCensor: false,
  globalSocket: undefined,
  restartableWorkspacesGlobalSettings: undefined,
  fetchedCurrentUser: undefined,
  currentUser: undefined,
  enableReproduction: false,
  showUserNotifications: false,
  enableEnvironmentRevisions: undefined,
  hardwareTierCapacityFetchingEnabled: false,
  enablePinProjects: true,
  enableHybrid: false,
  enableGitCredentialFlowForCollaborators: false,
  enableDarkMode: false,
  enableSagemakerExportUI: false,
  allowConcurrentRunsByDefault: false,
  enableCopyGitlabGBP: false,
  enableCopyGithubGBP: false,
  hideWelcomeCarousel: false,
  enableFeedbackModal: false,
  enableRestrictedAssets: false,
  twirlConversionFor58: false,
  detwirlEnvironments58: false,
};

export default function coreReducer(
  state: CoreState = initialState,
  action: Action
): CoreState {
  switch (action.type) {
    case FETCH_FLAGS_REQUESTED:
      return {
        ...state,
        fetched: FetchStatus.inflight,
      };
    case FETCH_PROJECT_REQUESTED:
      return {
        ...state,
        fetchedOps: FetchStatus.inflight,
      };
    case SET_FLAGS:
      return {
        ...state,
        flags: action.data.flags,
        fetched: FetchStatus.success,
        ...formatPrincipal(action.data.flags),
      };
    case FETCH_FLAGS_FAILED:
      return {
        ...state,
        flagFetchFailure: action.data,
        fetched: FetchStatus.failed,
      };
    case FETCH_PROJECT:
      return {
        ...state,
        fetchedOps: FetchStatus.success,
        project: action.data.project,
      };
    case FETCH_PROJECT_STAGE_AND_STATUS:
      return {
        ...state,
        projectStageAndStatus: action.data.projectStageAndStatus
      };
    case FETCH_PROJECT_FAILED:
      return {
        ...state,
        projectFetchFailure: action.data,
        fetchedOps: FetchStatus.failed,
      };
    case FETCH_WHITELABEL_SETTINGS_REQUESTED:
      return {
        ...state,
        fetchedWhitelabelConfig: FetchStatus.inflight
      };
    case FETCH_WHITELABEL_SETTINGS:
      return {
        ...state,
        whiteLabelSettings: action.data.whiteLabelSettings,
      };
    case FETCH_WHITELABEL_SETTINGS_FAILED:
      return {
        ...state,
        whiteLabelSettingsFetchFailure: action.data,
        fetchedWhitelabelConfig: FetchStatus.failed,
      };
    case SET_ARE_STAGES_STALE:
      return {
        ...state,
        areStagesStale: action.data.areStagesStale
      };
    case SET_GLOBAL_SOCKET:
      return {
        ...state,
        globalSocket: action.data.socket
      };
    case SET_RESTARTABLE_WORKSPACES_GLOBAL_SETTINGS:
      return {
        ...state,
        restartableWorkspacesGlobalSettings: action.data
      };
    case FETCH_CURRENT_USER:
      return {
        ...state,
        fetchedCurrentUser: FetchStatus.success,
        currentUser: action.data.user
      };
    case FETCH_CURRENT_USER_FAILED:
      return {
        ...state,
        currentUserFetchFailure: action.data,
        fetchedCurrentUser: FetchStatus.failed
      };
    default:
      return {
        ...state
      };
  }
}
