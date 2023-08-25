import * as R from 'ramda';
import { stopJob } from '@domino/api/dist/Jobs';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiProjectEnvironmentDto as ComputeEnvironment,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTier,
  DominoJobsInterfaceComputeClusterConfigSpecDto as ComputeClusterProperties,
  DominoComputeclusterApiDefaultComputeClusterSettings as DefaultComputeClusterProperties,
  DominoProjectsApiRepositoriesReferenceDto as GitReferenceDTO
} from '@domino/api/dist/types';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import {
  stopWorkspaceDiscardChanges,
  stopWorkspaceSaveChanges,
} from '@domino/api/dist/Workspaces';
import { listProjectModelProducts, stop as stopApp } from '@domino/api/dist/ModelProducts';
import { find } from 'ramda';
import { error as errorToast, success } from '../components/toastr';
import { StartNewJobParams } from './types';
import { GitReferenceType } from '../filebrowser/types';

export const STOP_RUN_BUTTON_LABEL = 'Stop';

export const isWorkspace = (workloadType?: string) => workloadType === 'Workspace';
export const isUtilityWorkspace = (workloadType?: string) => workloadType === 'Utility Workspace';
export const isJob = (workloadType?: string) => workloadType === 'Batch';
export const isScheduled = (workloadType?: string) => workloadType === 'Scheduled';
export const isApp = (workloadType?: string) => workloadType === 'App';
// We are showing launcher runs also in jobs dashboard
export const isLauncher = (workloadType?: string) => workloadType === 'Launcher';

export type StopRunButtonProps = {
  runId: string;
  ownerUsername: string;
  projectName: string;
  workloadType: string;
  projectId: string;
};

export const handleStopExecution: (props: StopRunButtonProps, commit?: boolean) => () => void =
  ({runId, projectId, workloadType}, commit) => async () => {
    try {
      if (isJob(workloadType) || isLauncher(workloadType) || isScheduled(workloadType)) {
        await stopJob({ body: { jobId: runId, projectId: projectId, commitResults: commit || false} });
      } else if (isWorkspace(workloadType)) {
        await stopWorkspaceDiscardChanges({ body: { workspaceId: runId } });
      } else if (isUtilityWorkspace(workloadType)) {
        if (commit) {
          await stopWorkspaceSaveChanges({ body: { workspaceId: runId } });
        } else {
          await stopWorkspaceDiscardChanges({ body: { workspaceId: runId } });
        }
      } else if (isApp(workloadType)) {
        const modelProducts = await listProjectModelProducts({projectId});
        const modelProductOfCurrentRunId = find(modelProduct =>
          modelProduct.latestAppVersionId === runId, modelProducts);
        if (modelProductOfCurrentRunId) {
          await stopApp({modelProductId: modelProductOfCurrentRunId.id, force: true});
        }
      } else {
        errorToast(`Cannot stop workload type: ${workloadType}`);
        return;
      }
      success('Stopping run ...');
    } catch (error) {
      errorToast('Error stopping run');
      console.error(error);
    }
  };

export const getProjectOwnerName: (project: Project) => string = R.pathOr('', ['owner', 'userName']);
export const getProjectName = (project: Project) => (project.name || '') as string;
export const getProjectId = (project: Project) => (project.id || '') as string;
export const isGitBasedProject = (project?: Project) => (project && Boolean(project.mainRepository?.uri)) as boolean;
export const getProjectIdDefault: (project?: Project) => string =
  R.compose((p: Project) => p.id, R.defaultTo({ id: '' }));
export const getDefaultSubmitArguments = (project?: Project) =>
  !R.isNil(project) ? [project.owner.userName, project.name] : [];

export const getHardwareTierIdFromJobSpec = (
  data: HardwareTier
): string | undefined => R.pathOr(undefined, ['hardwareTier', 'id'], data);

export const getEnvironmentId = (
  data: ComputeEnvironment
): string | undefined => R.pathOr(undefined, ['id'], data);

export const getClusterProperties = (
  clusterProperties?: ComputeClusterProperties
): ComputeClusterProperties | undefined => R.isNil(clusterProperties) ? undefined : clusterProperties;

export const defaultErrorMessageFormatter = (err: { status: number }) => {
  const message = {
    notAuthorized: `You are unauthorized to complete this action.`,
    serverError: `Make sure you filled out all fields correctly. Contact support if this problem continues.`,
    default: `Something went wrong. Contact support if this problem continues.`
  };
  switch (err.status) {
    case 403: return message.notAuthorized;
    case 500: return message.serverError;
    default: return message.default;
  }
};

export const getDefaultMaximumExecutionSlots = (
  defaultComputeClusterProperties?: DefaultComputeClusterProperties
): number | undefined => R.pathOr(
  25,
  ['maxUserExecutionSlots'],
  !R.isNil(defaultComputeClusterProperties) ? defaultComputeClusterProperties : undefined
);

export const getMainRepoGitRef = (
  gitReferenceDetails?: GitReferenceType
): GitReferenceDTO | undefined => (
  R.isNil(gitReferenceDetails)
    ? undefined
    : {
      type: R.pathOr('head', ['defaultRef'], gitReferenceDetails),
      value: R.pathOr(undefined, ['refDetails'], gitReferenceDetails)
    }
);

export const validateNewJobLaunchProperties = (
  params: StartNewJobParams,
  isGitBased = false
): string | boolean => {
  let areExecutionPropertiesSet = false;
  let areClusterPropertiesSet = false;
  const {
    commandToRun,
    environment,
    hardwareTier,
    clusterProperties,
    gitReferenceDetails
  } = params;

  if (isGitBased && R.isNil(gitReferenceDetails)) {
    return `No git reference details given`;
  } else if (isGitBased && !R.isNil(gitReferenceDetails)) {
    const { defaultRef, refDetails } = gitReferenceDetails;
    if (R.isNil(defaultRef) && R.isNil(refDetails)) {
      return `Both git reference type and value are NOT given`;
    } else if (!R.isNil(defaultRef) && R.isNil(refDetails) && defaultRef !== 'head') {
      return `No git reference value given`;
    }
  }

  if (R.isNil(commandToRun) || R.isEmpty(commandToRun)) {
    return `No file name (command) given`;
  }
  if (R.isNil(environment)) {
    return `No execution environment selected`;
  }
  if (R.isNil(hardwareTier)) {
    return `No hardware tier selected`;
  }
  areExecutionPropertiesSet = true;

  if (!R.isNil(clusterProperties)) {
    const { Spark, MPI } = ComputeClusterLabels;
    const {
      clusterType,
      computeEnvironmentId,
      masterHardwareTierId,
      workerCount,
      workerHardwareTierId
    } = clusterProperties;

    if (R.isNil(clusterType)) {
      return `Cluster type is not selected`;
    } else if (R.isNil(computeEnvironmentId)) {
      return `Compute environment is not selected`;
    } else if (clusterType !== MPI && (R.isNil(masterHardwareTierId) || R.isEmpty(masterHardwareTierId.value))) {
      return `${clusterType === Spark ? 'Master' : 'Head'} hardware tier is not selected`;
    } else if (workerCount < 1) {
      return `${clusterType === Spark ? 'Executor' : 'Worker'} count must be greater than one`;
    } else if (R.isNil(workerHardwareTierId) || R.isEmpty(workerHardwareTierId.value)) {
      return `${clusterType === Spark ? 'Executor' : 'Worker'} hardware tier is not selected`;
    }
  }

  areClusterPropertiesSet = true;

  return areExecutionPropertiesSet && areClusterPropertiesSet;
};
