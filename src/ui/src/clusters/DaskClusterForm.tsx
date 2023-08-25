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
  WORKER_COUNT_LABEL_TEXT,
  WORKER_HARDWARE_TIER_LABEL_TEXT,
  SCHEDULER_HARDWARE_TIER_LABEL_TEXT,
  COMPUTE_CLUSTER_LABEL_TEXT,
  WORKER_STORAGE_LABEL_TEXT,
  WORKER_HARDWARE_TIER_HELP_TEXT,
  HEAD_HARDWARE_TIER_HELP_TEXT
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
  onDaskClusterComputeEnvironmentChange: (newId: string) => void;
  onDaskClusterWorkerCountChange: (daskClusterWorkerCount?: number) => void;
  onDaskClusterMaxWorkerCountChange: (daskClusterMaxWorkerCount?: number) => void;
  onDaskClusterWorkerHardwareTierIdChange: (daskClusterWorkerHardwareTierId: string) => void;
  onDaskClusterWorkerStorageChange: (daskClusterWorkerStorage?: Information) => void;
  onDaskClusterHeadHardwareTierIdChange: (daskClusterHeadHardwareTierId: string) => void;
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

const DaskClusterForm: React.FC<Props> = (props) => {
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
    onDaskClusterWorkerCountChange,
    onDaskClusterMaxWorkerCountChange,
    onDaskClusterWorkerHardwareTierIdChange,
    onDaskClusterHeadHardwareTierIdChange,
    onDaskClusterComputeEnvironmentChange,
    onDaskClusterWorkerStorageChange,
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
  selected hardware tier's quota. There is one case to be noted: when the quota changes and the workerCount is above
  the new quota's executor threshold (quota - 2), the workerCount should be set to `undefined`.
   */
  const onDaskClusterWorkerHardwareTierChange =
    (hardwareTier: HWTier) => {
      onDaskClusterWorkerHardwareTierIdChange(hardwareTier.id);
      setWorkerHardwareTierQuota(hardwareTier.maxSimultaneousExecutions);
    };

  const onDaskClusterHeadHardwareTierChange =
    (hardwareTier: HWTier) => {
      onDaskClusterHeadHardwareTierIdChange(hardwareTier.id);
    };

  const computeClusterRestrictions: ComputeClusterRestrictions = {
    restrictToSpark: false,
    restrictToRay: false,
    restrictToDask: true,
    restrictToMpi: false
  };

  React.useEffect(() => {
    if (hardwareTiersData && workerHardwareTier) {
      onDaskClusterWorkerHardwareTierIdChange(
        isValidHardwareTierId(computeClusterRestrictions, hardwareTiersData, workerHardwareTier) ?
          workerHardwareTier : '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hardwareTiersData, workerHardwareTier]);

  React.useEffect(() => {
    if (hardwareTiersData && masterHardwareTier) {
      onDaskClusterHeadHardwareTierIdChange(
        isValidHardwareTierId(computeClusterRestrictions, hardwareTiersData, masterHardwareTier) ?
          masterHardwareTier : '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hardwareTiersData, masterHardwareTier]);

  return (
    <FormWrap>
      {
        isAutoScalingEnabled ?
        <AutoScaleWorker
          workerLabel="worker"
          minWorkerCount={workerCount}
          maxWorkerCount={maxWorkerCount}
          defaultMaxWorkerCount={defaultMaxWorkerCount}
          limit={workerCountMax}
          onMinWorkerCountChange={onDaskClusterWorkerCountChange}
          onMaxWorkerCountChange={onDaskClusterMaxWorkerCountChange}
          onClusterAutoScaleOptionChange={onClusterAutoScaleOptionChange}
          executorsError={executorsError}
        /> :
        <ExecutorCount
          workerCount={workerCount}
          quota={quota}
          maxValue={workerCountMax}
          label={WORKER_COUNT_LABEL_TEXT}
          onChange={onDaskClusterWorkerCountChange}
          checkForHwTierError={isWorkerCountMaxFromHwtierLimit}
        />
      }
      <HardwareTier
        label={WORKER_HARDWARE_TIER_LABEL_TEXT}
        projectId={projectId}
        selectedHwTierId={workerHardwareTier}
        testId="worker-hardware-tier"
        tooltip={WORKER_HARDWARE_TIER_HELP_TEXT}
        onChange={onDaskClusterWorkerHardwareTierChange}
        getContainer={getContainer}
        clusterType={clusterType}
        computeClusterRestrictions={computeClusterRestrictions}
        hardwareTiersData={hardwareTiersData}
        error={workerHardwareTierError}
        restrictToDataPlaneId={selectedDataPlaneId}
      />
      <HardwareTier
        label={SCHEDULER_HARDWARE_TIER_LABEL_TEXT}
        projectId={projectId}
        selectedHwTierId={masterHardwareTier}
        testId="scheduler-hardware-tier"
        tooltip={HEAD_HARDWARE_TIER_HELP_TEXT}
        onChange={onDaskClusterHeadHardwareTierChange}
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
        clusterType="Dask"
        clusterHelpLink={SUPPORT_ARTICLE.DASK_CONFIG_PREREQUISITES}
        getContainer={getContainer}
        onChange={onDaskClusterComputeEnvironmentChange}
        clusterEnvironments={clusterEnvironments}
        projectEnvironments={projectEnvironments}
        onClusterEnvRevisionChange={onClusterEnvRevisionChange}
        computeRevisionSpec={computeRevisionSpec}
        enableEnvironmentRevisions={enableEnvironmentRevisions}
        revTestId="dask-env-revision"
        hideDefaultRevisionOptions={hideDefaultRevisionOptions}
        isRestrictedProject={isRestrictedProject}
      />
      <ExecutorStorage
        label={WORKER_STORAGE_LABEL_TEXT}
        executorStorage={workerStorage}
        onChange={onDaskClusterWorkerStorageChange}
      />
    </FormWrap>
  );
};

export default DaskClusterForm;
