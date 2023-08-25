import { ComputeClusterType } from '@domino/api/dist/types';

export type RevEnvironments = {
  activeEnvironmentRevisions: EnvironmentRevision[];
  defaultEnv: Environment;
  defaultEnvRev: EnvRev;
};

export type Environment = {
  _id: string;
  name: string;
  description: string;
  visibility: string;
  isArchived: boolean;
};

export type EnvRev = {
  _id: string;
  environmentId: string;
  metadata: {};
  definition: {};
};

export type EnvironmentRevision = {
  environmentRevisionId: string;
  environmentId: string;
  environmentName: string;
  revisionNumber: number;
  clusterTypes: ComputeClusterType[];
};
