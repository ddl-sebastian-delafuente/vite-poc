import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import {
  DominoDatasetrwApiDatasetRwProjectMountDto as Dataset,
  DominoEnvironmentsApiEnvironmentWorkspaceToolDefinition as WorkspaceDefinition,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTierWithCapacity,
  DominoHardwaretierApiHardwareTierDto as HardwareTier,
  DominoProjectsApiOnDemandSparkClusterPropertiesSpec,
  DominoProjectsApiProjectEnvironmentDto as ComputeEnvironment,
  DominoProjectsApiUseableProjectEnvironmentsDto as ProjectEnvironments,
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoWorkspaceApiComputeClusterConfigDto as NewClusterProperties,
  DominoWorkspaceApiWorkspaceClusterConfigDto as OldClusterProperties,
  DominoWorkspaceApiWorkspaceDto as Workspace,
  DominoWorkspaceWebUpdateWorkspaceRequest,
  DominoDatamountApiDataMountDto
} from '@domino/api/dist/types';
import {
  createAndStartWorkspace,
  getDefaultComputeClusterSettings,
  updateWorkspaceConfigTemplate
} from '@domino/api/dist/Workspace';
import {getProjectSettings,getUseableEnvironments} from '@domino/api/dist/Projects';
import {listHardwareTiersForProject} from '@domino/api/dist/Projects';
import {ComputeClusterLabels} from '@domino/ui/dist/clusters/types';
import {launchedWorkspace} from '../core/routes';
import StepperContent,{StepProps} from '../components/StepperContent/StepperContent';
import {error as toastrError,success as toastrSuccess,} from '../components/toastr';
import tooltipRenderer from '../components/renderers/TooltipRenderer';
import {getErrorMessage as getErrMessage} from '../components/renderers/helpers';
import {getErrorMessage} from '../utils/errorUtil';
import ConfigStepContent from './ConfigStepContent';
import unblockableWindow from '../utils/unblockableWindow';
import {determineBrowser} from '../utils/common';
import {toastPopupBlocked} from '../utils/workspaceUtil';
import DatasetsStepContent from './DatasetsStepContent';
import {ConfirmRedirectToLogin} from '../confirmRedirect/confirmRedirectToLogin';
import {LaunchMode, WorkspaceLaunchMode} from './Launcher';
import ClusterContent from '../clusters/ClusterContent';
import {checkHwtierMessageForWorkerCount,isClusterConfigValidPerFF} from '../clusters/util';
import {HwTierMessageType} from '../clusters/types';
import { ACTIVE_REVISION,EnvRevision } from '../components/utils/envUtils';
import { DataAnalystConditionalCSS } from '@domino/ui/dist/core/DataAnalystConditionalCSS';
import {mixpanel} from "@domino/ui/dist/mixpanel";
import * as mixpanelTypes from "@domino/ui/dist/mixpanel/types";
import { ComputeClusterType } from '@domino/api/dist/types';
import withStore, { StoreProps } from '@domino/ui/dist/globalStore/withStore';
import { withAccessControl, WithAccessControlProps } from '@domino/ui/dist/core/AccessControlProvider';
import CodeStepContent from './CodeStepContent';

const computeClusterStepTitle = 'Compute Cluster';
const hardwareTierAvailabilityZoneErrorMessage = `Selected hardware tier is not available in the Availability Zone allocated to the workspace. Select another hardware tier, or Create a New Workspace with the selected hardware tier.`;
// NOTE: import error when referencing enum
const createLaunchMode: LaunchMode = 'create';

const Content = styled.div`
  .step-title {
    line-height: 16px;
    margin-bottom: 5px;
  }
`;

const StepDescription = styled.div`
  line-height: 14px;
`;

const StepDescriptionWithLineClamp = styled(StepDescription)`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TruncatedStepDescription = styled(StepDescription)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const handleWorkspaceLaunch = (apiResponse: Workspace, ownerName: string, projectName: string,
  callback: () => void) => {
  if (R.isNil(apiResponse.mostRecentSession)) {
    throw Error(`Something went wrong while creating workspace: ${apiResponse}`);
  }
  // Create a blank workspace window immediately to avoid popup-blocking
  const openWindow = window.open(unblockableWindow.EMPTY_WINDOW_URL);
  const workspaceHref = launchedWorkspace(
    ownerName,
    projectName,
    apiResponse.mostRecentSession.executionId,
    apiResponse.id
  );
  if (workspaceHref) {
    unblockableWindow.new(workspaceHref, openWindow);
    callback();
  }
  // Check if new tab popup was blocked before toasting success in Safari context
  const isSafari = determineBrowser() === 'Safari';
  if (
    isSafari &&
    (!openWindow || openWindow.closed || typeof openWindow.closed === 'undefined')
  ) {
    toastPopupBlocked();
  } else {
    toastrSuccess('Workspace launched in new tab');
  }
};

type HardwareTierMetadata = {
  userHwTier?: HardwareTier;
  selectedHwTier?: HardwareTier;
}

export type Props = {
  clusterProperties?: DominoProjectsApiOnDemandSparkClusterPropertiesSpec;
  workspaceDefinitionId?: string;
  selectedWorkspaceDefinitionTitle?: string;
  selectedHardwareTierId?: string;
  workspaceTitle?: string;
  onCancel: () => void;
  enableSparkClusters: boolean;
  enableRayClusters: boolean;
  enableDaskClusters: boolean;
  projectId: string;
  projectName: string;
  ownerName: string;
  currentUserName: string;
  canUseDatasets: boolean;
  project: Project;
  clusterAdded: boolean;
  onSubmit: () => void;
  workspace?: Workspace;
  workspaceClusterConfig?: NewClusterProperties | OldClusterProperties;
  launchMode: LaunchMode;
  enableExternalDataVolumes?: boolean;
  externalVolumeMounts: Array<DominoDatamountApiDataMountDto>;
  onSaveWorkspace?: (workspace: Workspace) => void;
  previousValuesStorageKey?: string;
  onSaveRestart?: (payloadBody: DominoWorkspaceWebUpdateWorkspaceRequest) => void;
  enableEnvironmentRevisions?: boolean;
  enableHybrid?: boolean;
  isGitBasedProject?: boolean;
};

export type State = {
  isHardwareTierError: boolean;
  isClusterAutoScaleOptionEnabled?: boolean;
  workspaceTitle?: string;
  hardwareTierId?: string;
  hardwareTierName?: string;
  selectedDataPlaneId: string;
  environmentId?: string;
  environmentName?: string;
  environment?: ComputeEnvironment;
  workspaceDefinitionId?: string;
  workspaceDefinitionTitle?: string;
  areProjectEnvironmentsFetching: boolean;
  projectEnvironments?: ProjectEnvironments;
  selectedComputeCluster: string;
  datasets: Array<Dataset>;
  isSubmitInProgress: boolean;
  redirectPath?: string;
  reloginPayload?: string;
  clusterProperties?: NewClusterProperties;
  sparkClusterMode?: string;
  workerCountMax?: number;
  workspaceHwTierMessage?: HwTierMessageType;
  envRevision?: EnvRevision;
  configStepContentHasError?: boolean;
  computeClusterTouched: boolean;
  isEnvironmentLoaded: boolean;
  isHardwareTierLoaded: boolean;
  isWorkspaceIdeTouched: boolean;
  isComputeClusterFormFiledsLoaded: boolean;
  computeClusterStepHasError?: boolean;
  additionalDetailsHasError?: boolean;
  recommendedVolumeSizeGiB?: number;
  defaultVolumeSizeGiB: number;
  isComputeClusterStepValidated: boolean;
  selectedVolumeSizeGiB?: number;
  isVolumeSizeDataFetching: boolean;
  hwtsForProject: Array<HardwareTierWithCapacity>;
  branchName?: string;
  commitId?: string;
  codeStepHasError?: boolean;
};

export type RestartableWorkspaceLauncherInternalProps = Props & StoreProps & WithAccessControlProps;

export class RestartableWorkspaceLauncher extends React.Component<RestartableWorkspaceLauncherInternalProps, State> {
  containerRef = React.createRef<HTMLDivElement>();
  constructor(props: RestartableWorkspaceLauncherInternalProps) {
    super(props);
    const { workspace, workspaceClusterConfig } = this.props;

    this.state = {
      isHardwareTierError: false,
      workspaceTitle: !R.isNil(workspace) ? workspace.name : undefined,
      hardwareTierId: !R.isNil(workspace) ? workspace.configTemplate.hardwareTier.id.value : undefined,
      hardwareTierName: undefined,
      selectedDataPlaneId: "000000000000000000000000",
      environmentId: !R.isNil(workspace) ? workspace.configTemplate.environment.id : undefined,
      environmentName: undefined,
      environment: undefined,
      workspaceDefinitionId: !R.isNil(workspace) ? workspace.configTemplate.tools[0] : undefined,
      areProjectEnvironmentsFetching: true,
      projectEnvironments: undefined,
      selectedComputeCluster: !R.isNil(workspaceClusterConfig) ?
        'clusterType' in workspaceClusterConfig
          ? (workspaceClusterConfig as NewClusterProperties).clusterType : ComputeClusterLabels.Spark
          : 'none',
      datasets: [],
      isSubmitInProgress: false,
      computeClusterTouched: false,
      isEnvironmentLoaded: false,
      isHardwareTierLoaded: false,
      isWorkspaceIdeTouched: false,
      isComputeClusterFormFiledsLoaded: false,
      configStepContentHasError: undefined,
      isComputeClusterStepValidated: false,
      computeClusterStepHasError: undefined,
      additionalDetailsHasError: undefined,
      clusterProperties: undefined,
      sparkClusterMode: undefined,
      workerCountMax: undefined,
      recommendedVolumeSizeGiB: undefined,
      defaultVolumeSizeGiB: 0,
      selectedVolumeSizeGiB: undefined,
      isVolumeSizeDataFetching: true,
      hwtsForProject: [],
      envRevision: !R.isNil(workspace) ? R.cond([
        [R.equals('Active'), () => ACTIVE_REVISION],
        [R.T, () => ({revisionId: R.pathOr(undefined, ['configTemplate', 'environment', 'revisionId'], workspace)})]
      ])(R.pathOr(undefined, ['configTemplate', 'environment', 'revisionType'], workspace)) : undefined,
      branchName: undefined,
      commitId: undefined,
      codeStepHasError: undefined
    };
  }

  componentDidMount() {
    const { projectId } = this.props;
    getUseableEnvironments({ projectId })
      .then(projectEnvironments => this.setState({ projectEnvironments }))
      .catch(err => console.warn(`getUseableEnvironments`, err))
      .finally(() => this.setState({ areProjectEnvironmentsFetching: false }));

    getProjectSettings({ projectId })
      .then(({ sparkClusterMode, recommendedVolumeSizeGiB, defaultVolumeSizeGiB }) =>
      this.setState({ sparkClusterMode, recommendedVolumeSizeGiB, defaultVolumeSizeGiB, isVolumeSizeDataFetching: false }))
      .catch(err => {
        console.warn(`getProjectSettings`, err);
        this.setState({isVolumeSizeDataFetching: false});
      });
    listHardwareTiersForProject({ projectId: this.props.project ? this.props.project.id : '' }).then(fetchedHardwareTiers => {
      this.setState({ hwtsForProject: fetchedHardwareTiers });
    });
  }

  getDefaultStep = (workspaceLauncherSteps: StepProps[]) => {
    const {
      accessControl,
      workspaceClusterConfig
    } = this.props;

    if (!accessControl.hasAccess()) {
      return undefined;
    }

    const clusterConfigValid = this.getClusterConfigValid();

    return !R.isNil(workspaceClusterConfig) && !clusterConfigValid ?
        R.findIndex((step: StepProps) => step.title === computeClusterStepTitle, workspaceLauncherSteps) :
        undefined
  }

  getClusterConfigValid = () => {
    const {
      enableSparkClusters,
      enableRayClusters,
      enableDaskClusters,
      workspaceClusterConfig
    } = this.props;

    const enableMpiClusters = this.getEnableMpiClusters();

    return !R.isNil(workspaceClusterConfig) && isClusterConfigValidPerFF(
      (workspaceClusterConfig as NewClusterProperties).clusterType || ComputeClusterLabels.Spark,
      enableSparkClusters,
      enableRayClusters,
      enableDaskClusters,
      enableMpiClusters
    );
  }

  getEnableMpiClusters = () => {
    return this.props.formattedPrincipal ? this.props.formattedPrincipal.enableMpiClusters : false;
  }

  onWorkspaceDefinitionStepComplete = () => {
    this.setState({ isWorkspaceIdeTouched: true }, () => {
      this.updateConfigStepContentHasError();
      this.checkForWorkspaceHwtierErr();
    });
    const { configStepValid } = this.isWsConfigValid();
    return configStepValid;
  }

  updateConfigStepContentHasError = () => {
    if (this.state.isHardwareTierLoaded && this.state.isEnvironmentLoaded) {
      const { configStepValid } = this.isWsConfigValid();
      this.setState({ configStepContentHasError: this.state.isWorkspaceIdeTouched ? !configStepValid : undefined });
    }
  }

  updateComputeClusterStepHasError = () => {
    if (this.state.isComputeClusterFormFiledsLoaded) {
      const { clusterConfigValid } = this.isWsConfigValid();
      const { clusterProperties, selectedDataPlaneId, selectedComputeCluster, hwtsForProject } = this.state;
      const masterHardwareTierId = clusterProperties?.masterHardwareTierId?.value;
      const workerHardwareTierId = clusterProperties?.workerHardwareTierId.value;
      const masterHardwareTier = hwtsForProject.find(hwt => hwt.hardwareTier.id === masterHardwareTierId);
      const workerHardwareTier = hwtsForProject.find(hwt => hwt.hardwareTier.id === workerHardwareTierId);
      if ((masterHardwareTier?.dataPlane.id !== selectedDataPlaneId && selectedComputeCluster !== 'MPI') || workerHardwareTier?.dataPlane.id !== selectedDataPlaneId) {
        this.setState({ computeClusterStepHasError: selectedComputeCluster !== 'none' ? true : false });
      } else {
        this.setState({ computeClusterStepHasError: !clusterConfigValid });
      }
    }
  }

  onAdditionalDetailsStepComplete = (fromNavigationButton: boolean) => {
    const { wsConfigValid } = this.isWsConfigValid();
    if (fromNavigationButton && wsConfigValid) {
      R.cond([
        [R.equals('edit'), this.updateWorkspace],
        [R.equals('restart'), this.onSaveRestartClick],
        [R.T, this.launchWorkspace]
      ])(this.props.launchMode);
    }
    this.setState({
      additionalDetailsHasError: false
    });
    return true;
  }

  onComputeClusterStepComplete = () => {
    const { clusterConfigValid } = this.isWsConfigValid();
    this.updateComputeClusterStepHasError();
    this.setState({isComputeClusterStepValidated: true});
    return clusterConfigValid;
  }

  getHwTierMetadata = (selectedHwTierId: string, userHardwareTierId: string) => {
    return this.state.hwtsForProject.reduce((hwtMetadata, hwt) => {
      if (R.equals(hwt.hardwareTier.id, userHardwareTierId)) {
        return { ...hwtMetadata, userHwTier: hwt.hardwareTier };
      }
      if (R.equals(hwt.hardwareTier.id, selectedHwTierId)) {
        return { ...hwtMetadata, selectedHwTier: hwt.hardwareTier };
      }
      return hwtMetadata;
    }, {} as HardwareTierMetadata);
  };

  checkAndGetHwTierNoAvailabilityZoneIntersectionErrorState = (hwTierMetadata: Partial<HardwareTierMetadata>) => {
    const { userHwTier, selectedHwTier } = hwTierMetadata;
    const hwTierErrorState: Partial<State> = { isHardwareTierError: false, workspaceHwTierMessage: undefined };
    if (
      !R.isNil(userHwTier) &&
      !R.isNil(selectedHwTier) &&
      !R.isNil(userHwTier.availabilityZones) &&
      !R.isNil(selectedHwTier.availabilityZones) &&
      R.equals(R.intersection(userHwTier.availabilityZones, selectedHwTier.availabilityZones).length, 0)
    ) {
      hwTierErrorState.isHardwareTierError = true;
      hwTierErrorState.workspaceHwTierMessage = { err: hardwareTierAvailabilityZoneErrorMessage };
    }
    return hwTierErrorState;
  };

  updateComputeClusterFieldsLoaded = (isLoaded = true) => {
    this.setState({ isComputeClusterFormFiledsLoaded: isLoaded }, this.updateComputeClusterStepHasError);
  }

  handleWorkspaceTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({workspaceTitle: event.target.value });
  }

  isLauncherInEditOrRestartMode = () => R.or(
    R.equals(this.props.launchMode, WorkspaceLaunchMode.EDIT),
    R.equals(this.props.launchMode, WorkspaceLaunchMode.RESTART)
  );

  handleHWTierSelect = (hwTier: HardwareTierWithCapacity) => {
    const { workspace } = this.props;

    const userHardwareTierId = workspace?.mostRecentSession?.config.hardwareTier.id;
    const hardwareTier = hwTier.hardwareTier;

    const newState: Partial<State> = {
      hardwareTierId: hardwareTier.id,
      hardwareTierName: hwTier.hardwareTier.name,
      selectedDataPlaneId: hwTier.dataPlane.id,
      isHardwareTierLoaded: true,
      isHardwareTierError: false
    };

    if (this.isLauncherInEditOrRestartMode() && !R.isNil(userHardwareTierId) && !R.isNil(userHardwareTierId?.value)) {
      const hwTierMetadata = this.getHwTierMetadata(hardwareTier.id, userHardwareTierId!.value);
      const hwTierErrorState = this.checkAndGetHwTierNoAvailabilityZoneIntersectionErrorState(hwTierMetadata);
      if (!R.isNil(hwTierErrorState)) {
        newState.isHardwareTierError = hwTierErrorState.isHardwareTierError;
        newState.workspaceHwTierMessage = hwTierErrorState.workspaceHwTierMessage;
      }
    }

    this.setState(newState as State, () => {
      if (hwTier && hwTier.hardwareTier.id) {
        this.updateConfigStepContentHasError();
      }
    });
  }

  handleEnvironmentSelect = (env: ComputeEnvironment) => {
    this.setState({
      environmentId: env.id,
      environmentName: env.name,
      environment: env,
      isEnvironmentLoaded: true
    }, () => {
      if (env && env.id) {
        this.updateConfigStepContentHasError();
      }
    });
  }

  handleEnvRevisionSelect = (revision: EnvRevision) => {
    this.setState({envRevision: revision});
  }

  handleWorkspaceDefinitionSelect = (selectedWs?: WorkspaceDefinition) => {
    this.setState({
      workspaceDefinitionTitle: selectedWs && selectedWs.title || undefined,
      workspaceDefinitionId: selectedWs && selectedWs.id || undefined,
      isWorkspaceIdeTouched: true
    }, this.updateConfigStepContentHasError);
  }

  resetState = () => {
    this.setState({
      isClusterAutoScaleOptionEnabled: false,
      workspaceTitle: undefined,
      hardwareTierId: undefined,
      hardwareTierName: undefined,
      environmentId: undefined,
      environmentName: undefined,
      environment: undefined,
      workspaceDefinitionId: undefined,
      workspaceDefinitionTitle: undefined,
      isComputeClusterFormFiledsLoaded: false,
      computeClusterTouched: false,
      isEnvironmentLoaded: false,
      isHardwareTierLoaded: false,
      isWorkspaceIdeTouched: false,
      envRevision: ACTIVE_REVISION,
      configStepContentHasError: undefined,
      computeClusterStepHasError: undefined,
      additionalDetailsHasError: undefined,
    });
  }

  getClusterConfig = () => {
    const { clusterProperties } = this.state;
    const { enableEnvironmentRevisions } = this.props;
    if (!R.isNil(clusterProperties)) {
      return enableEnvironmentRevisions ? clusterProperties : R.omit(['computeEnvironmentRevisionSpec'], clusterProperties);
    }
    return undefined;
  }

  isWsConfigValid = () => {
    const {
      clusterProperties,
      environment,
      environmentId,
      hardwareTierId,
      isClusterAutoScaleOptionEnabled,
      selectedComputeCluster,
      workspaceDefinitionId,
      workerCountMax,
      isHardwareTierError,
      branchName,
      commitId
    } = this.state;

    const selectedType = selectedComputeCluster as ComputeClusterType;

    const isClusterConfigValid = selectedComputeCluster !== 'none' ? (
        !R.isNil(clusterProperties) && Boolean(clusterProperties.computeEnvironmentId) &&
        (
          selectedType === ComputeClusterLabels.MPI ||
          Boolean(clusterProperties.masterHardwareTierId?.value)
        ) &&
        (
          Boolean(clusterProperties.workerCount) &&
          Number.isInteger(clusterProperties.workerCount) &&
          clusterProperties.workerCount >= 1 &&
          !R.isNil(workerCountMax) &&
          clusterProperties.workerCount <= workerCountMax
        ) &&
        Boolean(clusterProperties.workerHardwareTierId?.value) &&
        (
          !isClusterAutoScaleOptionEnabled ||
          (
            !R.isNil(clusterProperties.maxWorkerCount) &&
            Number.isInteger(clusterProperties.maxWorkerCount) &&
            (!R.isNil(workerCountMax) && clusterProperties.maxWorkerCount <= workerCountMax) &&
            clusterProperties.workerCount < clusterProperties.maxWorkerCount
          )
        )
      ) : true;

      const isConfigStepValid = !R.isNil(environment) && R.isEmpty(environment.supportedClusters) &&
      Boolean(workspaceDefinitionId) && Boolean(environmentId) && Boolean(hardwareTierId) && !isHardwareTierError;

      const isCreateMode = R.equals(this.props.launchMode, WorkspaceLaunchMode.CREATE);
      const hasOverrideMainGitRepoRef = Boolean(branchName || commitId);
      const isCodeInfoValid = this.props.isGitBasedProject ?
        isCreateMode ? hasOverrideMainGitRepoRef : true
      : true;

    return {
      wsConfigValid: isConfigStepValid && isClusterConfigValid && isCodeInfoValid,
      clusterConfigValid: isClusterConfigValid,
      configStepValid: isConfigStepValid
    };
  }

  isWorkspaceConfigValid = (forLaunch: boolean) => {
    const userAction = forLaunch ? 'launch' : 'save';
    const { environmentId, hardwareTierId, workspaceDefinitionId } = this.state;

    const {
      wsConfigValid: isWorkspaceConfigLaunchable,
      clusterConfigValid: isClusterConfigValid,
    } = this.isWsConfigValid();

    if (!isWorkspaceConfigLaunchable) {
      if (!workspaceDefinitionId) {
        toastrError(`Select a Workspace IDE to ${userAction} this Workspace.`);
      } else if (!environmentId) {
        toastrError(`Select an environment with a built revision to ${userAction} this Workspace.`);
      } else if (!hardwareTierId) {
        toastrError(`Select a hardware tier to ${userAction} this Workspace.`);
      } else if (!isClusterConfigValid) {
        toastrError(`Select proper Cluster configuration to ${userAction} this Workspace.`);
      }
    }
    return isWorkspaceConfigLaunchable;
  }

  launchWorkspace = async () => {
    const {
      currentUserName,
      projectId,
      projectName,
      ownerName,
      externalVolumeMounts,
      enableEnvironmentRevisions,
      isGitBasedProject
    } = this.props;
    mixpanel.track(() =>
      new mixpanelTypes.LaunchNewWorkspaceButtonClick({
        projectId,
        location: mixpanelTypes.Locations.LaunchNewWorkspaceButtonClick
      })
    )
    const {
      environmentId,
      hardwareTierId,
      workspaceDefinitionId,
      workspaceDefinitionTitle,
      workspaceTitle,
      envRevision,
      selectedVolumeSizeGiB,
      defaultVolumeSizeGiB,
      commitId,
      branchName
    } = this.state;
    const defaultWorkspaceTitle = `${R.defaultTo('Anonymous', currentUserName)}'s ${workspaceDefinitionTitle} session`;
    const finalWorkspaceTitle = workspaceTitle || defaultWorkspaceTitle;

    if (this.isWorkspaceConfigValid(true)) {
      const effectiveVolumeMounts = externalVolumeMounts.filter(mount => mount.dataPlanes.map(dp => dp.id).includes(this.state.selectedDataPlaneId))
      const body = {
        projectId: projectId,
        name: finalWorkspaceTitle,
        environmentId: environmentId!,
        hardwareTierId: { value: hardwareTierId! },
        tools: [workspaceDefinitionId!],
        computeClusterConfig: this.getClusterConfig(),
        externalVolumeMounts: effectiveVolumeMounts.map(mount => mount.id),
        environmentRevisionSpec: envRevision,
        overrideVolumeSizeGiB: !R.equals(defaultVolumeSizeGiB, selectedVolumeSizeGiB) ? selectedVolumeSizeGiB : undefined,
        overrideMainGitRepoRef: {
          type: commitId ? 'commitId' : 'branches',
          value: commitId ? commitId : branchName
        }
      };
      const requestPayload = enableEnvironmentRevisions ? body : R.omit(['environmentRevisionSpec'], body);
      const finalPayload = isGitBasedProject ? requestPayload : R.omit(['overrideMainGitRepoRef'], requestPayload)
      this.setState({isSubmitInProgress: true});
      try {
        const payload = {
          ownerName,
          projectName,
          projectId,
          body: finalPayload
        };
        this.setState({ redirectPath: undefined });
        const result = await createAndStartWorkspace({projectId, body: finalPayload});
        if (R.has('redirectPath', result)) {
          this.setState({
            redirectPath: (result as any).redirectPath,
            reloginPayload: JSON.stringify(payload)
          });
        } else {
          handleWorkspaceLaunch(result, ownerName, projectName, () => {
            this.props.onSubmit();
            this.resetState();
          });
        }
      } catch (err) {
        return getErrorMessage(err).then((message: string) => {
          toastrError(
            <div>Workspace could not be started. {message}</div>
          );
          return Promise.reject(message);
        }).catch(err => console.error(err));
      } finally {
        this.setState({isSubmitInProgress: false});
      }
    }
    return undefined;
  }

  updateWorkspace = async () => {
    const { workspace, project, onSaveWorkspace, enableEnvironmentRevisions } = this.props;
    const {
      environmentId,
      envRevision,
      hardwareTierId,
      workspaceDefinitionId,
      workspaceTitle
    } = this.state;

    if (!R.isNil(workspace) && this.isWorkspaceConfigValid(false)) {
      try {
        this.setState({isSubmitInProgress: true});
        const body = {
          environmentId: environmentId!,
          environmentRevisionSpec: envRevision,
          hardwareTierId: { value: hardwareTierId! },
          tools: [workspaceDefinitionId!],
          name: workspaceTitle!,
          computeClusterConfig: this.getClusterConfig()
        };
        const reqBody = enableEnvironmentRevisions ? body : R.omit(['environmentRevisionSpec'], body)
        const result = await updateWorkspaceConfigTemplate({
          projectId: project.id,
          workspaceId: workspace.id,
          body: reqBody
        });
        this.props.onSubmit();
        if (onSaveWorkspace) {
          onSaveWorkspace(result);
        }
        toastrSuccess('Workspace config saved');
      } catch (err) {
        toastrError(await getErrMessage(err, 'Something went wrong while updating the workspace config.'));
      } finally {
        this.setState({isSubmitInProgress: false});
      }
    }
  }

  onSaveRestartClick = () => {
    const { workspace, onSaveRestart, enableEnvironmentRevisions } = this.props;
    const {
      environmentId,
      envRevision,
      hardwareTierId,
      workspaceDefinitionId,
      workspaceTitle
    } = this.state;

    if (!R.isNil(workspace) && this.isWorkspaceConfigValid(false) && !R.isNil(onSaveRestart)) {
      this.props.onCancel();
      const body = {
        environmentId: environmentId!,
        environmentRevisionSpec: envRevision,
        hardwareTierId: { value: hardwareTierId! },
        tools: [workspaceDefinitionId!],
        name: workspaceTitle!,
        computeClusterConfig: this.getClusterConfig()
      }
      const payload = enableEnvironmentRevisions ? body : R.omit(['environmentRevisionSpec'], body);
      onSaveRestart(payload);
    }
  }

  onDatasetsFetch = (datasets: Array<Dataset>) => {
    this.setState({ datasets });
  }

  getContainer = () => (this.containerRef && this.containerRef.current) || document.body;

  onClusterConfigChange = (payload?: NewClusterProperties) => {
    if (!R.isNil(payload)) {
      this.setState({ computeClusterTouched: true });
    } else {
      this.setState({ isComputeClusterFormFiledsLoaded: true });
    }
    this.setState({
      selectedComputeCluster: R.isNil(payload) ? 'none' : payload.clusterType,
      clusterProperties: payload
    }, () => {
      if(this.state.computeClusterTouched){
        this.updateComputeClusterStepHasError();
      }
    });
  }

  onWorkerCountMaxChange = (maxValue?: number) => {
    this.setState({ workerCountMax: maxValue }, this.checkForWorkspaceHwtierErr);
  }

  onClusterAutoScaleOptionChange = (isEnabled: boolean) => {
    this.setState({isClusterAutoScaleOptionEnabled : isEnabled});
  }

  checkForWorkspaceHwtierErr = () => {
    const { hardwareTierId, clusterProperties, workerCountMax } = this.state;
    const userHardwareTierId = this.props.workspace?.mostRecentSession?.config.hardwareTier.id;

    if (!hardwareTierId) {
      this.setState({
        workspaceHwTierMessage: {
          err: 'Please select a hardware tier',
        },
      })
      return;
    }

    if (this.isLauncherInEditOrRestartMode() && !R.isNil(userHardwareTierId) && !R.isNil(userHardwareTierId?.value)) {
      const hwTierMetadata = this.getHwTierMetadata(hardwareTierId, userHardwareTierId!.value);
      const hwTierErrorState = this.checkAndGetHwTierNoAvailabilityZoneIntersectionErrorState(hwTierMetadata);
      if (hwTierErrorState.isHardwareTierError || !R.isNil(hwTierErrorState.workspaceHwTierMessage)) {
        this.setState({ ...(hwTierErrorState as State) });
        return;
      }
    }

    if (!R.isNil(clusterProperties) && !R.isNil(clusterProperties.workerHardwareTierId) &&
      hardwareTierId === clusterProperties.workerHardwareTierId.value) {
      this.setState({ workspaceHwTierMessage: checkHwtierMessageForWorkerCount(workerCountMax) });
      return;
    }

    this.setState({ workspaceHwTierMessage: undefined });
  }

  getLabel = (launchMode: LaunchMode) => {
    return R.cond([
      [R.equals(WorkspaceLaunchMode.EDIT), R.always('Save')],
      [R.equals(WorkspaceLaunchMode.RESTART), R.always('Save & Restart')],
      [R.T, R.always('Launch')],
    ])(launchMode);
  }

  getTestId = (launchMode: LaunchMode) => {
    return R.cond([
      [R.equals(WorkspaceLaunchMode.EDIT), R.always('save')],
      [R.equals(WorkspaceLaunchMode.RESTART), R.always('save-and-restart')],
      [R.T, R.always('launch-now')],
    ])(launchMode);
  }

  handleVolumeSizeChange = (volSize: number) => {
    this.setState({ selectedVolumeSizeGiB: volSize });
  }

  onChangeBranchName = (name: string) => this.setState({branchName: name});

  render() {
    const {
      projectId,
      currentUserName = 'Anonymous',
      ownerName,
      projectName,
      launchMode,
      project,
      enableExternalDataVolumes,
      previousValuesStorageKey,
      enableSparkClusters,
      enableRayClusters,
      enableDaskClusters,
      workspaceClusterConfig,
      enableEnvironmentRevisions,
      isGitBasedProject
    } = this.props;
    const {
      workspaceTitle,
      hardwareTierId,
      selectedDataPlaneId,
      environmentId,
      workspaceDefinitionId,
      workspaceDefinitionTitle,
      environmentName,
      hardwareTierName,
      isSubmitInProgress,
      redirectPath,
      reloginPayload,
      sparkClusterMode,
      workspaceHwTierMessage,
      areProjectEnvironmentsFetching,
      projectEnvironments,
      envRevision,
      configStepContentHasError,
      computeClusterStepHasError,
      additionalDetailsHasError,
      isComputeClusterStepValidated,
      defaultVolumeSizeGiB,
      recommendedVolumeSizeGiB,
      isVolumeSizeDataFetching,
      branchName,
      commitId,
      selectedComputeCluster
    } = this.state;

    const configStepDescription = R.join(' and ', R.filter(val => Boolean(val), [environmentName, hardwareTierName]));
    const datasetStepDescription = 'Data';
    const selectedWsDefId = (
      this.props.workspaceDefinitionId ? this.props.workspaceDefinitionId : workspaceDefinitionId
    );
    const { workspace } = this.props;
    const restrictToDataPlaneId = workspace ? workspace.dataPlaneId : undefined;
    const launcherDefaultSteps: StepProps[] = [
      {
        title: <>Environment &<br />Hardware</>,
        content: (
          <ConfigStepContent
            getContainer={this.getContainer}
            projectId={projectId}
            ownerName={ownerName}
            projectName={projectName}
            displayUserName={R.defaultTo('Anonymous', currentUserName)}
            workspaceTitle={workspaceTitle}
            hardwareTierId={hardwareTierId}
            environmentId={environmentId}
            isEnvironmentControlled={Boolean(environmentId)}
            workspaceDefinitionId={selectedWsDefId}
            workspaceDefinitionTitle={workspaceDefinitionTitle}
            handleWorkspaceTitleChange={this.handleWorkspaceTitleChange}
            handleHWTierSelect={this.handleHWTierSelect}
            handleEnvironmentSelect={this.handleEnvironmentSelect}
            handleWorkspaceDefinitionSelect={this.handleWorkspaceDefinitionSelect}
            hwTierMessage={workspaceHwTierMessage}
            projectEnvironments={projectEnvironments}
            areProjectEnvironmentsFetching={areProjectEnvironmentsFetching}
            handleEnvRevisionSelect={this.handleEnvRevisionSelect}
            envRevision={R.pathOr(envRevision, ['revisionId'], envRevision)}
            enableEnvironmentRevisions={enableEnvironmentRevisions}
            configStepContentHasError={configStepContentHasError}
            recommendedVolumeSizeGiB={recommendedVolumeSizeGiB}
            defaultVolumeSizeGiB={defaultVolumeSizeGiB}
            handleVolumeSizeChange={this.handleVolumeSizeChange}
            showVolumeSizeSelection={R.equals(this.props.launchMode, createLaunchMode)}
            isVolumeSizeDataFetching={isVolumeSizeDataFetching}
            restrictToDataPlaneId={restrictToDataPlaneId}
            isRestrictedProject={project.details?.isRestricted}
          />
        ),
        description: (
          tooltipRenderer(
            configStepDescription, (
            <span>
              <StepDescriptionWithLineClamp>ENV: {environmentName}</StepDescriptionWithLineClamp>
              {
                !R.isNil(hardwareTierName) &&
                <StepDescriptionWithLineClamp>HW: {hardwareTierName}</StepDescriptionWithLineClamp>
              }
            </span>
          ))
        ),
        onStepLoad: () => mixpanel.track(() =>
          new mixpanelTypes.LaunchNewWorkspaceEnvironmentStepView({
            projectId: projectId,
            location: mixpanelTypes.Locations.CreateNewWorkSpaceEnvironmentStep
          })
        ),
        onNavigationAttempt: this.onWorkspaceDefinitionStepComplete,
        hasError: configStepContentHasError,
        isSubmitInProgress: isSubmitInProgress,
        finalAction: {
          label: this.getLabel(launchMode),
          showSpinnerOnSubmit: true,
          testId: this.getTestId(launchMode),
        }
      },
      this.props.accessControl.hasAccess() ? {
        title: computeClusterStepTitle,
        content: (
          <>
            <ClusterContent
              projectId={projectId}
              defaultClusterProperties={workspaceClusterConfig}
              enableSparkClusters={enableSparkClusters}
              enableRayClusters={enableRayClusters}
              enableDaskClusters={enableDaskClusters}
              onChange={this.onClusterConfigChange}
              projectName={projectName}
              ownerName={ownerName}
              sparkClusterMode={sparkClusterMode}
              fetchDefaultClusterSettings={(clusterType: string) => getDefaultComputeClusterSettings({
                projectId,
                clusterType
              })}
              runHwTierId={hardwareTierId}
              onWorkerCountMaxChange={this.onWorkerCountMaxChange}
              areProjectEnvironmentsFetching={areProjectEnvironmentsFetching}
              projectEnvironments={projectEnvironments}
              onClusterAutoScaleOptionChange={this.onClusterAutoScaleOptionChange}
              enableEnvironmentRevisions={enableEnvironmentRevisions}
              hideMpirunInfoBox={true}
              isClusterFormValidated={isComputeClusterStepValidated && computeClusterStepHasError}
              updateComputeClusterFieldsLoaded={this.updateComputeClusterFieldsLoaded}
              selectedDataPlaneId={selectedDataPlaneId}
              isRestrictedProject={project.details?.isRestricted}
            />
          </>
        ),
        description: (
          <StepDescription>
            {R.equals('none', selectedComputeCluster) ? 'None' : selectedComputeCluster}
          </StepDescription>),

        onStepLoad: () => mixpanel.track(() =>
          new mixpanelTypes.LaunchNewWorkspaceClusterStepView({
            projectId: projectId,
            location: mixpanelTypes.Locations.CreateNewWorkSpaceClusterStep
          })
        ),
        hasError: isComputeClusterStepValidated ? computeClusterStepHasError : undefined,
        onNavigationAttempt: this.onComputeClusterStepComplete,
        isSubmitInProgress: isSubmitInProgress,
        finalAction: {
          label: this.getLabel(launchMode),
          showSpinnerOnSubmit: true,
          testId: this.getTestId(launchMode),
        }
      } : undefined,
      {
        title: 'Additional Details',
        description: (
          tooltipRenderer(
            datasetStepDescription,
            <TruncatedStepDescription>{datasetStepDescription}</TruncatedStepDescription>
          )
        ),
        content: (
          <>
            {isGitBasedProject && R.equals(launchMode, WorkspaceLaunchMode.CREATE) &&
              <CodeStepContent
                projectId={projectId}
                project={project}
                branchName={branchName}
                onChangeBranchName={this.onChangeBranchName}
                commitId={commitId}
                onChangeCommitId={(id) => this.setState({commitId: id})}
              />
            }
            <DatasetsStepContent
              projectId={projectId}
              onDatasetsFetch={this.onDatasetsFetch}
              enableExternalDataVolumes={enableExternalDataVolumes}
              currentUser={currentUserName}
              selectedDataPlaneId={selectedDataPlaneId}
              enableHybrid={this.props.enableHybrid}
            />
          </>
        ),
        onNavigationAttempt: this.onAdditionalDetailsStepComplete,
        hasError: additionalDetailsHasError,
        onStepLoad: () => {
          mixpanel.track(() =>
            new mixpanelTypes.LaunchNewWorkspaceDatasetStepView({
              projectId: projectId,
              location: mixpanelTypes.Locations.CreateNewWorkSpaceDatasetStep
            }));
          mixpanel.track(() =>
            new mixpanelTypes.LaunchNewWorkspaceCodeStepView({
              projectId: project.id,
              location: mixpanelTypes.Locations.CreateNewWorkSpaceCodeStep
            })
          );
        },
          btnText: this.getLabel(launchMode),
          showSpinnerOnSubmit: true,
          isSubmitInProgress: isSubmitInProgress
      }
    ].filter(Boolean) as StepProps[];

    const workspaceLauncherSteps = launcherDefaultSteps;

    return (
      <div ref={this.containerRef}>
        <Content>
          <DataAnalystConditionalCSS>
            <StepperContent
              stepsWidth="182px"
              contentWidth="565px"
              height="630px"
              hideNextButton={!this.props.accessControl.hasAccess()}
              outlineSecondaryButton={true}
              onCancel={this.props.onCancel}
              steps={workspaceLauncherSteps}
              defaultStep={this.getDefaultStep(workspaceLauncherSteps)}
            />
          </DataAnalystConditionalCSS>
        </Content>
        {
          !!previousValuesStorageKey && !!redirectPath &&
          <ConfirmRedirectToLogin
            redirectUri={redirectPath}
            storageKey={previousValuesStorageKey}
            value={reloginPayload}
          />
        }
      </div>
    );
  }
}

export default withStore(withAccessControl(RestartableWorkspaceLauncher));
