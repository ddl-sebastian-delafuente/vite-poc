import * as R from 'ramda';
import {
  DominoProjectsApiOnDemandSparkClusterPropertiesSpec as SparkDefaults,
  DominoWorkspaceApiWorkspaceClusterConfigDto as OldClusterProperties,
  DominoWorkspaceApiComputeClusterConfigDto as NewClusterProperties,
  DominoComputeclusterApiDefaultComputeClusterSettings as DefaultComputeClusterProperties,
  DominoJobsInterfaceComputeClusterConfigSpecDto as ComputeClusterProperties,
  ComputeClusterType
} from '@domino/api/dist/types';
import {
  ComputeClusterLabels,
  HwTierMessageType
} from './types';
import { MAX_EXECUTIONS_ALLOWED_DEFAULT } from './constants';
import { ComputeClusterRestrictions } from '../components/HardwareTierSelect';
import {
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTierWithCapacity
} from '@domino/api/dist/types';

export const getClusterPropertiesFromOldDTO: (clusterType: ComputeClusterType, clusterProps: OldClusterProperties) =>
  NewClusterProperties = (clusterType, clusterProps) => {
  return {
    clusterType: clusterType,
    computeEnvironmentId: clusterProps.computeEnvironmentId,
    computeEnvironmentRevisionSpec: clusterProps.computeEnvironmentRevisionSpec,
    masterHardwareTierId: clusterProps.masterHardwareTierId,
    workerStorage: clusterProps.volumeSize,
    workerCount: clusterProps.executorCount,
    workerHardwareTierId: clusterProps.executorHardwareTierId
  };
};

export const getClusterPropertiesFromSparkDefaults: (clusterType: ComputeClusterType, clusterProps: SparkDefaults) =>
  NewClusterProperties = (clusterType, clusterProps) => {
  return {
    clusterType: clusterType,
    computeEnvironmentId: clusterProps.computeEnvironmentId,
    computeEnvironmentRevisionSpec: clusterProps.computeEnvironmentRevisionSpec,
    masterHardwareTierId: {value: clusterProps.masterHardwareTierId},
    workerStorage: clusterProps.executorStorage,
    workerCount: clusterProps.executorCount,
    workerHardwareTierId: {value: clusterProps.executorHardwareTierId}
  };
};

export const validateClusterProperties:
  (properties: NewClusterProperties, isClusterAutoScaleOptionEnabled: boolean | undefined, workerCountMax?: number) =>
    boolean = (properties, isClusterAutoScaleOptionEnabled = false, workerCountMax) => {
      const { workerCount, computeEnvironmentId, masterHardwareTierId, workerHardwareTierId,
        maxWorkerCount, clusterType } = properties;
      const isClusterConfigValid = 
        (
        !R.isNil(workerCount) &&
        workerCount >= 1 &&
        Number.isInteger(workerCount) &&
        !R.isNil(workerCountMax) && 
        workerCount <= workerCountMax
        ) &&
        !R.isNil(computeEnvironmentId) &&
        (clusterType == ComputeClusterLabels.MPI || (
          !R.isNil(masterHardwareTierId) &&
          !R.isNil(masterHardwareTierId.value) &&
          !R.isEmpty(masterHardwareTierId.value)
        )) &&
        !R.isNil(workerHardwareTierId) && !R.isNil(workerHardwareTierId.value) && !R.isEmpty(workerHardwareTierId.value) &&
        (!isClusterAutoScaleOptionEnabled ||
          (!R.isNil(maxWorkerCount) &&
          Number.isInteger(maxWorkerCount) &&
            (!R.isNil(workerCountMax) && maxWorkerCount <= workerCountMax) &&
            workerCount < maxWorkerCount)
        );

      return isClusterConfigValid;
    };

export const convertToJobComputeClusterProperties = (
  clusterProperties?: NewClusterProperties
) => !R.isNil(clusterProperties) && !R.isNil(clusterProperties.clusterType) ? ({
  ...clusterProperties,
  clusterType: clusterProperties.clusterType,
}) as ComputeClusterProperties : undefined;

export const getDefaultComputeClusterProperties = (
  areMultipleClustersEnabled: boolean,
  clusterType: ComputeClusterType = ComputeClusterLabels.Spark
) => (
  areMultipleClustersEnabled
    ? {
      clusterType,
      computeEnvironmentId: '',
      masterHardwareTierId: { value: '' } ,
      masterStorageGiB: 0,
      workerCount: 1,
      workerHardwareTierId: { value: '' } ,
      workerStorageGiB: 0,
      maxUserExecutionSlots: 25,
      extraConfigs: {}
    } as DefaultComputeClusterProperties
    : undefined
);

/*
if the user quota is 0, return it. If the workerHardwareTierQuota does not exist, return the userQuota, and if
both userQuota and workerHardwareTierQuota exist, then return the min of the two (or their default values).
 */
export const computeQuota = (user?: number, workerHwTier?: number) =>
  R.cond([
    [R.equals(!R.isNil(user) && R.isNil(workerHwTier)), R.always(user)],
    [R.equals(!R.isNil(workerHwTier) && R.isNil(user)), R.always(workerHwTier)],
    [R.equals(!R.isNil(workerHwTier) && !R.isNil(user)), R.always(Math.min(user!, workerHwTier!))],
    [R.T, R.always(MAX_EXECUTIONS_ALLOWED_DEFAULT)]
  ])(true) as number;

export const clusterFeatureFlags = {
  Spark: 'enableSparkClusters',
  Ray: 'enableRayClusters'
};

export const isClusterConfigValidPerFF = (clusterType: string, sparkClustersEnabled: boolean,
  rayClustersEnabled: boolean, daskClustersEnabled: boolean, mpiClustersEnabled: boolean) => {
  if (clusterType === ComputeClusterLabels.Spark) {
    return sparkClustersEnabled;
  }
  if (clusterType === ComputeClusterLabels.Ray) {
    return rayClustersEnabled;
  }
  if (clusterType === ComputeClusterLabels.Dask) {
    return daskClustersEnabled;
  }
  if (clusterType === ComputeClusterLabels.MPI) {
    return mpiClustersEnabled;
  }
  return false;
};

export const checkHwtierMessageForWorkerCount: (workerCountMax?: number) => (HwTierMessageType | undefined) =
  (workerCountMax) => {
  if (R.isNil(workerCountMax)) {
    return undefined;
  }
  if (workerCountMax === 0) {
    return {
      err: 'Hardware tier configured beyond max execution limit.'
    };
  }
  return {
    info: 'We have auto adjusted the max execution limit to accommodate the limits imposed by worker hardware tier.'
  };
};

/**
 *
 * @param showAdminMessage `boolean` depends on the validity of cluster configuration `isClusterConfigValid`
 * @param clusterType `string` that corresponds to the `ComputeClusterType`
 * @returns `string` &mdash; either `No Cluster Supported Environments` message OR
 * `Admin has disabled the Cluster` message
 */
export const getClusterDisabledMessage = (showAdminMessage: boolean, clusterType: string, appName: string) => showAdminMessage ?
  `${clusterType} clusters are disabled by your ${appName} administrator. Please contact them for assistance.` :
  `There are no ${clusterType} enabled Environments available. Please add one to continue.`;

export const isValidHardwareTierId = (
  computeClusterRestrictions: ComputeClusterRestrictions,
  hardwareTiers: HardwareTierWithCapacity[],
  hardwareTierId: string) => {
  const unrestrictedTiers = hardwareTiers.filter(hwt =>
    !!hwt.hardwareTier.computeClusterRestrictions &&
    !hwt.hardwareTier.computeClusterRestrictions.restrictToSpark &&
    !hwt.hardwareTier.computeClusterRestrictions.restrictToRay &&
    !hwt.hardwareTier.computeClusterRestrictions.restrictToDask
  );

  const computeClusterFilteredTiers = hardwareTiers.filter(hwt =>
    (!!hwt.hardwareTier.computeClusterRestrictions && !!computeClusterRestrictions) &&
    (
      (hwt.hardwareTier.computeClusterRestrictions.restrictToSpark &&
        computeClusterRestrictions.restrictToSpark) ||
      (hwt.hardwareTier.computeClusterRestrictions.restrictToRay &&
        computeClusterRestrictions.restrictToRay) ||
      (hwt.hardwareTier.computeClusterRestrictions.restrictToDask &&
        computeClusterRestrictions.restrictToDask)
    )
  );

  const filteredHardwareTiers = !computeClusterRestrictions ||
    (!!computeClusterRestrictions &&
      !computeClusterRestrictions.restrictToSpark &&
      !computeClusterRestrictions.restrictToRay &&
      !computeClusterRestrictions.restrictToDask) ?
    unrestrictedTiers : computeClusterFilteredTiers;

  if (filteredHardwareTiers.length <= 0) {
    return true;
  } else {
    return R.contains(hardwareTierId, filteredHardwareTiers.map(item => item.hardwareTier.id))
  }
}

export const getClusterType = (clusterProperties: NewClusterProperties | OldClusterProperties) => {
  return R.has('clusterType', clusterProperties) ?
    (clusterProperties as NewClusterProperties).clusterType : 'Spark' as ComputeClusterType;
};
