import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoAdminInterfaceWhiteLabelConfigurations as WhiteLabelSettings,
  DominoProjectsApiProjectStageAndStatus as ProjectStageAndStatus,
  DominoCommonUserPerson
} from '@domino/api/dist/types';

export type Flags = {
  showEndpointSpend?: boolean; // Obsolete
  showTagsNavItem?: boolean;
  showAdminMenu?: boolean;
  showComputeInControlCenter?: boolean;
  showDSLFeatures?: boolean;
  showV1DataProjects?: boolean;
  enableSparkClusters: boolean;
  enableRayClusters: boolean;
  enableDaskClusters: boolean;
  enableGitBasedProjects?: boolean;
  enableMergeConflictResolution?: boolean;
  enableInWorkspaceBranchSelection?: boolean;
  enabledSelectFileSync?: boolean;
  disableDFSBasedProjects?: boolean;
  enableExternalDataVolumes?: boolean;
  externalDataVolumesFullCensor?: boolean;
  enableModelAPIs?: boolean;
  enableModelRegistry?: boolean;
  enableModelMonitoringForModelAPIs?: boolean;
  enableApps?: boolean;
  enableLaunchers?: boolean;
  showUserNotifications?: boolean;
  enableExportsWorkflow?: boolean;
  enablePinProjects?: boolean;
  enableGitCredentialFlowForCollaborators?: boolean;
  enableSagemakerExportUI?: boolean;
  hideWelcomeCarousel?: boolean;
  twirlConversionFor58?: boolean;
  enableFeedbackModal?: boolean;
  detwirlEnvironments58?: boolean;
};

export type ViewProps = {
  project?: Project;
  username?: string;
  userId?: string;
  pathnameOverride?: string;
  loading?: boolean;
  isNucleusApp?: boolean;
  flags: Flags;
  updateProject?: (p: Project) => void;
  projectStageAndStatus?: ProjectStageAndStatus;
  updateProjectStageAndStatus?: (projectStageAndStatus: ProjectStageAndStatus) => void;
  whiteLabelSettings?: WhiteLabelSettings;
  areStagesStale?: boolean;
  setAreStagesStale?: (areStagesStale: boolean) => void;
  globalSocket?: SocketIOClient.Socket;
  setGlobalSocket: (socket?: SocketIOClient.Socket) => void;
  currentUser?: DominoCommonUserPerson;
  dmmLink?: string | undefined;
  onError?: (err: any) => void;
  // this flag allows storybook to turn off mixpanel
  isMixpanelOff?: boolean;
};
