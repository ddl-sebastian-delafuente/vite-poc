import { Action } from './reduxTypes';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoNucleusLibAuthPrincipalWithFeatureFlags as Flags,
  DominoProjectsApiProjectStageAndStatus as ProjectStageAndStatus,
  DominoWorkspaceApiWorkspaceGlobalSettingsDto as WorkspaceGlobalSettings,
  DominoCommonUserPerson
} from '@domino/api/dist/types';

export const SET_FLAGS = 'SetFlags';
export type SetFlags = (flags: Flags) => Action;
export const setFlags: SetFlags = (flags) => ({
  type: SET_FLAGS,
  data: { flags },
});

export const FETCH_FLAGS_REQUESTED = 'FetchFlagsRequested';
export type FetchFlagsRequested = () => Action;
export const setFetchFlagsRequested: FetchFlagsRequested = () => ({
  type: FETCH_FLAGS_REQUESTED,
});

export const FETCH_FLAGS_FAILED = 'FetchFlagsFailed';
export type FetchFlagsFailed = (error: any) => Action;
export const setFetchFlagsFailed: FetchFlagsFailed = (error: any) => ({
  type: FETCH_FLAGS_FAILED,
  data: error,
});

export const FETCH_PROJECT = 'FetchProject';
export type FetchProject = (project: Project) => Action;
export const setProject: FetchProject = (project) => ({
  type: FETCH_PROJECT,
  data: { project }
});

export const FETCH_PROJECT_STAGE_AND_STATUS = 'FetchProjectStageAndStatus';
export type FetchProjectStageAndStatus = (projectStageAndStatus: ProjectStageAndStatus) => Action;
export const setProjectStageAndStatus: FetchProjectStageAndStatus = (projectStageAndStatus) => ({
  type: FETCH_PROJECT_STAGE_AND_STATUS,
  data: { projectStageAndStatus }
});

export const FETCH_PROJECT_REQUESTED = 'FetchProjectRequested';
export type FetchProjectRequested = () => Action;
export const setProjectRequested: FetchProjectRequested = () => ({
  type: FETCH_PROJECT_REQUESTED,
});

export const FETCH_PROJECT_FAILED = 'FetchProjectFailed';
export type FetchProjectFailed = (error: any) => Action;
export const setFetchProjectFailed: FetchProjectFailed = error => ({
  type: FETCH_PROJECT_FAILED,
  data: error,
});

export const FETCH_WHITELABEL_SETTINGS_REQUESTED = 'FetchWhiteLabelSettingsRequested';
export type FetchWhiteLabelSettingsRequested = () => Action;
export const setWhiteLabelSettingsRequested: FetchWhiteLabelSettingsRequested = () => ({
  type: FETCH_WHITELABEL_SETTINGS_REQUESTED
});

export const FETCH_WHITELABEL_SETTINGS = 'FetchWhiteLabelSettings';
export type FetchWhiteLabelSettings = (whiteLabelSettings: any) => Action;
export const setWhiteLabelSettings: FetchWhiteLabelSettings = (whiteLabelSettings) => ({
  type: FETCH_WHITELABEL_SETTINGS,
  data: { whiteLabelSettings }
});

export const FETCH_WHITELABEL_SETTINGS_FAILED = 'FetchwhiteLabelSettingsFailed';
export type FetchWhiteLabelSettingsFailed = (error: any) => Action;
export const setWhiteLabelSettingsFailed: FetchWhiteLabelSettingsFailed = error => ({
  type: FETCH_WHITELABEL_SETTINGS_FAILED,
  data: error
});

export const SET_ARE_STAGES_STALE = 'SetAreStagesStale';
export type SetAreStagesStale = (areStagesStale: boolean) => Action;
export const setAreStagesStale: SetAreStagesStale = (areStagesStale) => ({
  type: SET_ARE_STAGES_STALE,
  data: {areStagesStale}
});

export const SET_GLOBAL_SOCKET = 'SetGlobalSocket';
export type SetGlobalSocket = (socket?: SocketIOClient.Socket) => Action;
export const setGlobalSocket: SetGlobalSocket = (socket) => ({
  type: SET_GLOBAL_SOCKET,
  data: {socket}
});

export const SET_RESTARTABLE_WORKSPACES_GLOBAL_SETTINGS = 'setRestartableWorkspacesGlobalSettings';
export type SetRestartableWorkspacesGlobalSettings = (settings: WorkspaceGlobalSettings) => Action;
export const setRestartableWorkspacesGlobalSettings: SetRestartableWorkspacesGlobalSettings = (settings) => ({
  type: SET_RESTARTABLE_WORKSPACES_GLOBAL_SETTINGS,
  data: settings
});

export const FETCH_CURRENT_USER_REQUESTED = 'FetchCurrentUserRequested';
export type FetchCurrentUserRequested = () => Action;
export const setCurrentUserRequested: FetchCurrentUserRequested = () => ({
  type: FETCH_CURRENT_USER_REQUESTED
});

export const FETCH_CURRENT_USER = 'FetchCurrentUser';
export type FetchCurrentUser = (user: DominoCommonUserPerson) => Action;
export const setCurrentUser: FetchCurrentUser = (user) => ({
  type: FETCH_CURRENT_USER,
  data: { user }
});

export const FETCH_CURRENT_USER_FAILED = 'FetchCurrentUserFailed';
export type FetchCurrentUserFailed = (error: any) => Action;
export const setCurrentUserFailed: FetchCurrentUserFailed = error => ({
  type: FETCH_CURRENT_USER_FAILED,
  data: error
});
