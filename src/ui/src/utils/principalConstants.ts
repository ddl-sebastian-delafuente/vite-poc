export const COMMON = {
  ShortLived: 'ShortLived'
} as const;

export const PRINCIPAL = {
  FeatureFlags: {
    FastStartDataSets: `${COMMON.ShortLived}.FastStartDataSets`,
    SparkClustersEnabled: `${COMMON.ShortLived}.SparkClustersEnabled`,
    RayClustersEnabled: `${COMMON.ShortLived}.RayClustersEnabled`,
    DaskClustersEnabled: `${COMMON.ShortLived}.DaskClustersEnabled`,
    MpiClustersEnabled: `${COMMON.ShortLived}.MpiClustersEnabled`,
    EnvironmentRevisionsEnabled: `${COMMON.ShortLived}.EnableEnvironmentRevisions`,
    HardwareTierCapacityFetchingEnabled: `${COMMON.ShortLived}.HardwareTierCapacityFetchingEnabled`
  }
} as const;

export default PRINCIPAL;
