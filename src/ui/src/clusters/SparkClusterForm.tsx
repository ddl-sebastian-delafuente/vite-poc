import * as React from 'react';
import styled from 'styled-components';
import {
  DominoHardwaretierApiHardwareTierDto as HWTier,
  DominoHardwaretierApiHardwareTierWithCapacityDto as HWTiers,
  Information,
  DominoProjectsApiProjectEnvironmentDto as Environment,
  DominoProjectsApiUseableProjectEnvironmentsDto as ProjectEnvironments
} from '@domino/api/dist/types';
import {
  EXECUTOR_COUNT_LABEL_TEXT,
  EXECUTOR_HARDWARE_TIER_LABEL_TEXT,
  MASTER_HARDWARE_TIER_LABEL_TEXT,
  COMPUTE_CLUSTER_LABEL_TEXT,
  EXECUTOR_STORAGE_LABEL_TEXT,
  EXECUTOR_HARDWARE_TIER_HELP_TEXT,
  MASTER_HARDWARE_TIER_HELP_TEXT
} from '../constants';
import { SUPPORT_ARTICLE } from '../core/supportUtil';
import ComputeEnvironment from './components/ComputeEnvironment';
import ExecutorStorage from './components/ExecutorStorage';
import ExecutorCount from './components/ExecutorCount';
import HardwareTier from './components/HardwareTier';
import AutoScaleWorker from './components/AutoScaleWorker';
import { computeQuota, isValidHardwareTierId } from './util';
import { ComputeClusterRestrictions } from '../components/HardwareTierSelect';
import {
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTierWithCapacity
} from '@domino/api/dist/types';
import { EnvRevision } from '../components/utils/envUtils';

export { HWTiers };

const FormWrap = styled.div`
  .ant-legacy-form-item-label {
    line-height: 32px;
  }
`;

export interface Props {
  projectId: string;
  workerHardwareTier?: string;
  masterHardwareTier?: string;
  environment?: string;
  workerCount?: number;
  maxWorkerCount?: number;
  defaultMaxWorkerCount?: number;
  workerStorage?: Information;
  userQuota?: number;
  clusterType: string;
  clusterEnvironments: Array<Environment>;
  runHwTierId?: string;
  projectEnvironments?: ProjectEnvironments;
  isAutoScalingEnabled: boolean;
  hardwareTiersData?: HardwareTierWithCapacity[];
  onSparkClusterComputeEnvironmentChange: (newId: string) => void;
  onSparkClusterExecutorCountChange: (sparkClusterExecutorCount?: number) => void;
  onSparkClusterMaxExecutorCountChange?: (sparkClusterMaxExecutorCount?: number) => void;
  onSparkClusterExecutorHardwareTierIdChange: (sparkClusterExecutorHardwareTierId: string) => void;
  onSparkClusterExecutorStorageChange: (sparkClusterExecutorStorage?: Information) => void;
  onSparkClusterMasterHardwareTierIdChange: (sparkClusterMasterHardwareTierId: string) => void;
  onClusterAutoScaleOptionChange?: (isEnabled: boolean) => void;
  getContainer?: () => HTMLElement;
  onWorkerCountMaxChange: (maxValue?: number) => void;
  onClusterEnvRevisionChange: (revision: EnvRevision) => void;
  computeRevisionSpec?: string;
  enableEnvironmentRevisions?: boolean;
  workerHardwareTierError?: boolean;
  masterHardwareTierError?: boolean;
  hideDefaultRevisionOptions?: boolean;
  executorsError?: boolean;
  selectedDataPlaneId?: string;
  isRestrictedProject?: boolean;
}

const SparkClusterForm = (props: Props) => {
  const {
    projectId,
    workerCount,
    maxWorkerCount,
    defaultMaxWorkerCount,
    workerHardwareTier,
    masterHardwareTier,
    environment,
    userQuota,
    workerStorage,
    executorsError,
    clusterType,
    clusterEnvironments,
    runHwTierId,
    projectEnvironments,
    isAutoScalingEnabled,
    hardwareTiersData,
    onSparkClusterExecutorCountChange,
    onSparkClusterMaxExecutorCountChange,
    onSparkClusterExecutorHardwareTierIdChange,
    onSparkClusterMasterHardwareTierIdChange,
    onSparkClusterComputeEnvironmentChange,
    onSparkClusterExecutorStorageChange,
    onClusterAutoScaleOptionChange,
    getContainer,
    onWorkerCountMaxChange,
    onClusterEnvRevisionChange,
    computeRevisionSpec,
    enableEnvironmentRevisions,
    workerHardwareTierError,
    masterHardwareTierError,
    hideDefaultRevisionOptions,
    selectedDataPlaneId,
    isRestrictedProject
  } = props;

  const [workerHardwareTierQuota, setWorkerHardwareTierQuota] = React.useState<number>();
  const [quota, setQuota] = React.useState<number>();
  const [workerCountMax, setWorkerCountMax] = React.useState<number>();
  const [isWorkerCountMaxFromHwtierLimit, setIsWorkerCountMaxFromHwtierLimit] = React.useState<boolean>(false);

  React.useEffect(() => {
    const allowedQuota = computeQuota(userQuota, workerHardwareTierQuota);
    setQuota(allowedQuota);

    const quotaReserved = (allowedQuota !== workerHardwareTierQuota) ? 2 :
      (Number(workerHardwareTier === runHwTierId) + Number(workerHardwareTier === masterHardwareTier));

    const allowedMaxWorkers = allowedQuota - quotaReserved;
    const maxValue = allowedMaxWorkers > 0 ? allowedMaxWorkers : 0;
    setWorkerCountMax(maxValue);
    onWorkerCountMaxChange(maxValue);
    setIsWorkerCountMaxFromHwtierLimit(allowedQuota === workerHardwareTierQuota);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runHwTierId, masterHardwareTier, workerHardwareTierQuota, userQuota]);

  /*
  When a user selects a new hardware tier, the max quota can change to the MINUMUM of the user quota and the
  selected hardware tier's quota.
   */
  const onSparkClusterExecutorHardwareTierChange =
    (hardwareTier: HWTier) => {
      onSparkClusterExecutorHardwareTierIdChange(hardwareTier.id);
      setWorkerHardwareTierQuota(hardwareTier.maxSimultaneousExecutions);
  };

  const onSparkClusterMasterHardwareTierChange =
    (hardwareTier: HWTier) => {
      onSparkClusterMasterHardwareTierIdChange(hardwareTier.id);
    };

  const computeClusterRestrictions: ComputeClusterRestrictions = {
    restrictToSpark: true,
    restrictToRay: false,
    restrictToDask: false,
    restrictToMpi: false
  };

  React.useEffect(() => {

    if (hardwareTiersData && workerHardwareTier) {
      onSparkClusterExecutorHardwareTierIdChange(
        isValidHardwareTierId(computeClusterRestrictions, hardwareTiersData, workerHardwareTier) ?
          workerHardwareTier : '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hardwareTiersData, workerHardwareTier]);

  React.useEffect(() => {
    if (hardwareTiersData && masterHardwareTier) {
      onSparkClusterMasterHardwareTierIdChange(
        isValidHardwareTierId(computeClusterRestrictions, hardwareTiersData, masterHardwareTier) ?
          masterHardwareTier : '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hardwareTiersData, masterHardwareTier]);

  return (
    <FormWrap data-test="spark-cluster-form">
      {
        isAutoScalingEnabled ?
        <AutoScaleWorker
          workerLabel="executor"
          minWorkerCount={workerCount}
          maxWorkerCount={maxWorkerCount}
          defaultMaxWorkerCount={defaultMaxWorkerCount}
          limit={workerCountMax}
          onMinWorkerCountChange={onSparkClusterExecutorCountChange}
          onMaxWorkerCountChange={onSparkClusterMaxExecutorCountChange}
          onClusterAutoScaleOptionChange={onClusterAutoScaleOptionChange}
          executorsError={executorsError}
        /> :
        <ExecutorCount
          workerCount={workerCount}
          quota={quota}
          maxValue={workerCountMax}
          label={EXECUTOR_COUNT_LABEL_TEXT}
          onChange={onSparkClusterExecutorCountChange}
          checkForHwTierError={isWorkerCountMaxFromHwtierLimit}
        />
      }
      <HardwareTier
        label={EXECUTOR_HARDWARE_TIER_LABEL_TEXT}
        projectId={projectId}
        selectedHwTierId={workerHardwareTier}
        testId="executor-hardware-tier"
        tooltip={EXECUTOR_HARDWARE_TIER_HELP_TEXT}
        onChange={onSparkClusterExecutorHardwareTierChange}
        getContainer={getContainer}
        clusterType={clusterType}
        computeClusterRestrictions={computeClusterRestrictions}
        hardwareTiersData={hardwareTiersData}
        error={workerHardwareTierError}
        restrictToDataPlaneId={selectedDataPlaneId}
      />
      <HardwareTier
        label={MASTER_HARDWARE_TIER_LABEL_TEXT}
        projectId={projectId}
        selectedHwTierId={masterHardwareTier}
        testId="master-hardware-tier"
        tooltip={MASTER_HARDWARE_TIER_HELP_TEXT}
        onChange={onSparkClusterMasterHardwareTierChange}
        getContainer={getContainer}
        clusterType={clusterType}
        computeClusterRestrictions={computeClusterRestrictions}
        hardwareTiersData={hardwareTiersData}
        error={masterHardwareTierError}
        restrictToDataPlaneId={selectedDataPlaneId}
      />
      <ComputeEnvironment
        projectId={projectId}
        environmentId={environment}
        label={COMPUTE_CLUSTER_LABEL_TEXT}
        clusterType="Spark"
        clusterHelpLink={SUPPORT_ARTICLE.SPARK_CONFIG_PREREQUISITES}
        getContainer={getContainer}
        onChange={onSparkClusterComputeEnvironmentChange}
        clusterEnvironments={clusterEnvironments}
        projectEnvironments={projectEnvironments}
        onClusterEnvRevisionChange={onClusterEnvRevisionChange}
        computeRevisionSpec={computeRevisionSpec}
        enableEnvironmentRevisions={enableEnvironmentRevisions}
        revTestId="spark-env-revision"
        hideDefaultRevisionOptions={hideDefaultRevisionOptions}
        isRestrictedProject={isRestrictedProject}
      />
      <ExecutorStorage
        label={EXECUTOR_STORAGE_LABEL_TEXT}
        executorStorage={workerStorage}
        onChange={onSparkClusterExecutorStorageChange}
      />
    </FormWrap>
  );
};

export default SparkClusterForm;
