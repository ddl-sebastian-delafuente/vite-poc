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
  COMPUTE_CLUSTER_LABEL_TEXT,
  WORKER_STORAGE_LABEL_TEXT,
  WORKER_HARDWARE_TIER_HELP_TEXT,
} from '../constants';
import { SUPPORT_ARTICLE } from '../core/supportUtil';
import ComputeEnvironment from './components/ComputeEnvironment';
import ExecutorStorage from './components/ExecutorStorage';
import ExecutorCount from './components/ExecutorCount';
import HardwareTier from './components/HardwareTier';
import { computeQuota, isValidHardwareTierId } from './util';
import { ComputeClusterRestrictions } from '../components/HardwareTierSelect';
import {
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTierWithCapacity
} from '@domino/api/dist/types';
import { EnvRevision } from '../components/utils/envUtils';
import InfoBox from '../components/Callout/InfoBox';
import HelpLink from '../components/HelpLink';

export { HWTiers };

const FormWrap = styled.div`
  .ant-legacy-form-item-label {
    line-height: 32px;
  }
`;

export interface Props {
  projectId: string;
  workerHardwareTier?: string;
  environment?: string;
  workerCount?: number;
  workerStorage?: Information;
  userQuota?: number;
  clusterType: string;
  clusterEnvironments: Array<Environment>;
  runHwTierId?: string;
  projectEnvironments?: ProjectEnvironments;
  hardwareTiersData?: HardwareTierWithCapacity[];
  onMpiClusterComputeEnvironmentChange: (newId: string) => void;
  onMpiClusterWorkerCountChange: (MpiClusterWorkerCount?: number) => void;
  onMpiClusterWorkerHardwareTierIdChange: (MpiClusterWorkerHardwareTierId: string) => void;
  onMpiClusterWorkerStorageChange: (MpiClusterWorkerStorage?: Information) => void;
  getContainer?: () => HTMLElement;
  onWorkerCountMaxChange: (maxValue?: number) => void;
  onClusterEnvRevisionChange: (revision: EnvRevision) => void;
  computeRevisionSpec?: string;
  enableEnvironmentRevisions?: boolean;
  workerHardwareTierError?: boolean;
  hideDefaultRevisionOptions?: boolean;
  hideMpirunInfoBox?: boolean;
  selectedDataPlaneId?: string;
  isRestrictedProject?: boolean;
}

const MpiClusterForm: React.FC<Props> = (props) => {
  const {
    projectId,
    workerCount,
    workerHardwareTier,
    environment,
    userQuota,
    workerStorage,
    clusterType,
    clusterEnvironments,
    runHwTierId,
    projectEnvironments,
    hardwareTiersData,
    onMpiClusterWorkerCountChange,
    onMpiClusterWorkerHardwareTierIdChange,
    onMpiClusterComputeEnvironmentChange,
    onMpiClusterWorkerStorageChange,
    getContainer,
    onWorkerCountMaxChange,
    onClusterEnvRevisionChange,
    computeRevisionSpec,
    enableEnvironmentRevisions,
    workerHardwareTierError,
    hideDefaultRevisionOptions,
    hideMpirunInfoBox,
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

    // If user quota is relevant, then this execution will reserve 1 unit for the execution pod. Other clusters
    // reserve 2 to account for the execution pod and the head node of the cluster but MPI is head-less.
    const quotaReserved = (allowedQuota !== workerHardwareTierQuota) ? 1 : Number(workerHardwareTier === runHwTierId);

    const allowedMaxWorkers = allowedQuota - quotaReserved;
    const maxValue = allowedMaxWorkers > 0 ? allowedMaxWorkers : 0;
    setWorkerCountMax(maxValue);
    onWorkerCountMaxChange(maxValue);
    setIsWorkerCountMaxFromHwtierLimit(allowedQuota === workerHardwareTierQuota);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runHwTierId, workerHardwareTierQuota, userQuota]);

  /*
  When a user selects a new hardware tier, the max quota can change to the MINUMUM of the user quota and the
  selected hardware tier's quota. There is one case to be noted: when the quota changes and the workerCount is above
  the new quota's executor threshold (quota - 2), the workerCount should be set to `undefined`.
   */
  const onMpiClusterWorkerHardwareTierChange =
    (hardwareTier: HWTier) => {
      onMpiClusterWorkerHardwareTierIdChange(hardwareTier.id);
      setWorkerHardwareTierQuota(hardwareTier.maxSimultaneousExecutions);
    };

  const computeClusterRestrictions: ComputeClusterRestrictions = {
    restrictToSpark: false,
    restrictToRay: false,
    restrictToDask: false,
    restrictToMpi: true
  };

  React.useEffect(() => {
    if (hardwareTiersData && workerHardwareTier) {
      onMpiClusterWorkerHardwareTierIdChange(
        isValidHardwareTierId(computeClusterRestrictions, hardwareTiersData, workerHardwareTier) ?
          workerHardwareTier : '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hardwareTiersData, workerHardwareTier]);


  return (
    <FormWrap>
     {!hideMpirunInfoBox && <InfoBox className={"info-box"} fullWidth={true} alternativeIcon={true}>
      {"The command from Step 1 will be executed as an mpirun program with appropriate default configuration. See "}
      <HelpLink
        text="docs"
        showIcon={false}
        articlePath={SUPPORT_ARTICLE.WORK_WITH_MPI_CLUSTER}
      />
      {" for advanced configuration options."}
      </InfoBox>}
      <ExecutorCount
        workerCount={workerCount}
        quota={quota}
        maxValue={workerCountMax}
        label={WORKER_COUNT_LABEL_TEXT}
        onChange={onMpiClusterWorkerCountChange}
        checkForHwTierError={isWorkerCountMaxFromHwtierLimit}
      />
      <HardwareTier
        label={WORKER_HARDWARE_TIER_LABEL_TEXT}
        projectId={projectId}
        selectedHwTierId={workerHardwareTier}
        testId="worker-hardware-tier"
        tooltip={WORKER_HARDWARE_TIER_HELP_TEXT}
        onChange={onMpiClusterWorkerHardwareTierChange}
        getContainer={getContainer}
        clusterType={clusterType}
        computeClusterRestrictions={computeClusterRestrictions}
        hardwareTiersData={hardwareTiersData}
        error={workerHardwareTierError}
        restrictToDataPlaneId={selectedDataPlaneId}
      />
      <ComputeEnvironment
        projectId={projectId}
        environmentId={environment}
        label={COMPUTE_CLUSTER_LABEL_TEXT}
        clusterType="MPI"
        clusterHelpLink={SUPPORT_ARTICLE.MPI_CONFIG_PREREQUISITES}
        getContainer={getContainer}
        onChange={onMpiClusterComputeEnvironmentChange}
        clusterEnvironments={clusterEnvironments}
        projectEnvironments={projectEnvironments}
        onClusterEnvRevisionChange={onClusterEnvRevisionChange}
        computeRevisionSpec={computeRevisionSpec}
        enableEnvironmentRevisions={enableEnvironmentRevisions}
        revTestId="mpi-env-revision"
        hideDefaultRevisionOptions={hideDefaultRevisionOptions}
        isRestrictedProject={isRestrictedProject}
      />
      <ExecutorStorage
        label={WORKER_STORAGE_LABEL_TEXT}
        executorStorage={workerStorage}
        onChange={onMpiClusterWorkerStorageChange}
      />
    </FormWrap>
  );
};

export default MpiClusterForm;
