import {
  DominoProjectsApiProjectEnvironmentDto as ComputeEnvironment,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTier,
  DominoJobsInterfaceComputeClusterConfigSpecDto as ComputeClusterProperties,
  DominoProjectsApiOnDemandSparkClusterPropertiesSpec as SparkClusterProperties
} from '@domino/api/dist/types';
import { EnvRevision } from '../components/utils/envUtils';
import { GitReferenceType } from '../filebrowser/types';

export type NewRunSpec = {
  environment?: ComputeEnvironment;
  overrideHardwareTier?: HardwareTier;
  defaultref: string;
  refdetails?: string;
  command: string; // command to run
  commitId?: string;
};

export type StartRunApiHandler = (
  projectId: string,
  externalVolumeMounts?: Array<string>,
  clusterProperties?: SparkClusterProperties | ComputeClusterProperties,
) => (data: NewRunSpec) => Promise<any>;

export type StartNewJobParams = {
  projectId: string;
  commandToRun: string;
  hardwareTier?: HardwareTier;
  environment?: ComputeEnvironment;
  commitId?: string;
  gitReferenceDetails?: GitReferenceType
  externalVolumeMounts?: Array<string>;
  clusterProperties?: ComputeClusterProperties;
  environmentRevisionSpec?: EnvRevision,
  overrideVolumeSizeGiB?: number,
  snapshotDatasetsOnCompletion?: boolean ,
  title?: string
};

export type StartNewJobAPIHandler = (params: StartNewJobParams) => Promise<any>;

export type ErrorMessageFormatter = (error: any) => string;
