import { ComputeClusterType } from '@domino/api/dist/types';

export type ComputeEnvironmentRevisionSpecType = 'ActiveRevision' | 'LatestRevision' | { revisionId: string };

export type ComputeClusterLabelsType = {
  Spark: ComputeClusterType;
  Ray: ComputeClusterType;
  Dask: ComputeClusterType;
  MPI: ComputeClusterType;
};

export const ComputeClusterLabels: ComputeClusterLabelsType = {
  Spark: 'Spark',
  Ray: 'Ray',
  Dask: 'Dask',
  MPI: 'MPI'
};

export type HwTierMessageType = {
  err?: string;
  info?: string;
};
