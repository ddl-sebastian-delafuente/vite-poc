import * as R from 'ramda';

import {
  DominoAdminInterfaceComputeClusterPodOverview,
  DominoAdminInterfaceComputeNodeInfrastructureInfo as ComputeNodeInfrastructureInfo,
  DominoAdminInterfaceExecutionOverview as ExecutionOverview,
  DominoAdminInterfaceHardwareTierOverview, DominoAdminInterfaceOnDemandSparkExecutionUnitOverview,
  DominoCommonProjectId,
} from '@domino/api/dist/types';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import {
  jobSection,
  launchpadPublisher,
  workspaceExecutionSection,
} from '../../core/routes';
import { ExecutionOverviewRow } from './ComputeGridExecutionsTable';
import { InfrastructureInfoRow } from './ComputeGridInfrastructureTable';

// TODO move this to a place accessible to both apps/web and packages/ui
export const defaultDeploymentLogsDownloadParams = {
  'pageSize': '10000',
  'pageNumber': '1',
  'sortOrder': '1',
  'sortBy': 'timestamp',
  'excludeIgnoredEvents': 'false',
  'excludeIgnoredHeartbeats': 'false',
  'inline': 'false'
};

const executionUrlFromWorkloadTypeAndExecutionId = (
  workloadType: string,
  executionId: string,
  projectIdentifier: DominoCommonProjectId
): string => {
  const {projectName, ownerUsername} = projectIdentifier;
  if (workloadType === 'Batch' || workloadType === 'Scheduled' || workloadType === 'Launcher') {
    return jobSection(ownerUsername, projectName, executionId, 'logs');
  } else if (workloadType === 'App') {
    return launchpadPublisher(ownerUsername, projectName);
  } else if (workloadType === 'Workspace') {
    return workspaceExecutionSection(executionId, 'details')(ownerUsername, projectName);
  } else {
    return '';
  }
};

const sharedClusterRowEntries = (
  execution: ExecutionOverview,
  hwTier: DominoAdminInterfaceHardwareTierOverview,
  cluster: DominoAdminInterfaceComputeClusterPodOverview | DominoAdminInterfaceOnDemandSparkExecutionUnitOverview
) => {
  return {
    computeGridType: execution.computeGridType,
    projectId: execution.projectId,
    projectIdentifier: execution.projectIdentifier,
    startingUserId: execution.startingUserId,
    startingUsername: execution.startingUsername,
    hardwareTier: {
      hardwareTierId: hwTier.id,
      hardwareTierCores: hwTier.cores,
      hardwareTierMemoryInGiB: hwTier.memoryInGiB,
      hardwareTierIsArchived: hwTier.isArchived,
    },
    started: execution.created,
    title: execution.title,
    status: cluster.status,
    executionUnits: [
      {
        deployableObjectType: cluster.deployableObjectType,
        deployableObjectId: cluster.deployableObjectId,
        computeNodeId: cluster.computeNodeId,
        status: cluster.status
      }
    ],
    isClusterPod: true,
  };
};

export const makeExecutionRows = (executions: ExecutionOverview[]): ExecutionOverviewRow[] => {
  const rows: ExecutionOverviewRow[] = [];

  executions.forEach(execution => {
    const {
      id: executionId,
      computeGridType,
      projectId,
      startingUserId,
      startingUsername,
      status,
      executionUnits,
      created,
      title,
      workloadType,
      hardwareTier,
      projectIdentifier,
      computeClusterOverviews,
      onDemandSparkClusterProperties
    } = execution;

    rows.push({
      executionIdAndDomainUrl: {
        executionId: executionId,
        url: executionUrlFromWorkloadTypeAndExecutionId(workloadType, executionId, projectIdentifier)
      },
      computeGridType,
      projectId,
      projectIdentifier,
      startingUserId,
      startingUsername,
      hardwareTier: {
        hardwareTierId: hardwareTier.id,
        hardwareTierCores: hardwareTier.cores,
        hardwareTierMemoryInGiB: hardwareTier.memoryInGiB,
        hardwareTierIsArchived: hardwareTier.isArchived,
      },
      status,
      executionUnits,
      started: created,
      title,
      workloadType,
      isClusterPod: false,
      key: `${rows.length}`,
    });

    if (computeClusterOverviews.length > 0) {
      R.forEach(clusterOverview => {
        R.forEach(podOverview => {
          const hwTier = podOverview.isMaster
            ? clusterOverview.masterHardwareTier!
            : clusterOverview.workerHardwareTier;

          rows.push({
            ...sharedClusterRowEntries(execution, hwTier, podOverview),
            executionIdAndDomainUrl: {
              executionId: execution.id,
              url: clusterOverview.webUiPath
            },
            workloadType: `${clusterOverview.clusterType} (${podOverview.role})`,
            clusterName: clusterOverview.clusterName,
            clusterType: clusterOverview.clusterType,
            key: `${rows.length}`,
          });
        }, clusterOverview.podOverviews);
      }, computeClusterOverviews);
    } else if (onDemandSparkClusterProperties) {
      R.forEach(sparkEu => {
        const hwTier = sparkEu.role === 'master'
          ? onDemandSparkClusterProperties.masterHardwareTier
          : onDemandSparkClusterProperties.workerHardwareTier;

        rows.push({
          ...sharedClusterRowEntries(execution, hwTier, sparkEu),
          executionIdAndDomainUrl: {
            executionId: execution.id,
            url: onDemandSparkClusterProperties.webUiPath
          },
          workloadType: `Spark (${sparkEu.role})`,
          clusterName: onDemandSparkClusterProperties.name,
          clusterType: ComputeClusterLabels.Spark,
          key: `${rows.length}`,
        });
      }, execution.onDemandSparkExecutionUnits);
    }
  });

  return rows;
};

export const filterExecutionOverviewRows = (record: ExecutionOverviewRow, searchText: string): boolean => {
  const keysWithObjects = ['executionIdAndDomainUrl', 'hardwareTier', 'executionUnits', 'projectIdentifier'];

  const recordExecutionId =
    R.prop('executionId')(record.executionIdAndDomainUrl);
  const recordHardwareTier =
    R.join('', R.values(R.pick(['hardwareTierId', 'hardwareTierName'], record.hardwareTier)));
  const recordProjectIdentifier =
    R.join('', R.values(R.pick(['ownerUsername', 'projectName'], record.projectIdentifier)));
  const recordExecutionUnits =
    R.join('', R.map(R.values, record.executionUnits));
  const recordValuesOfKeysWithoutObjects =
    R.join('', R.values(R.omit(keysWithObjects, record)));

  const target = R.join('', [
      recordExecutionId,
      recordHardwareTier,
      recordProjectIdentifier,
      recordExecutionUnits,
      recordValuesOfKeysWithoutObjects
    ]
  ).toLowerCase();
  return target.indexOf(searchText.toLowerCase()) !== -1;
};

export const infrastructureInfoRowFromInfrastructureInfo =
  (infrastructureInfo: ComputeNodeInfrastructureInfo): InfrastructureInfoRow => ({
    name: infrastructureInfo.name,
    nodePool: infrastructureInfo.nodePool || '',
    instanceType: infrastructureInfo.instanceType || '',
    isBuildNode: infrastructureInfo.isBuildNode,
    dataPlane: infrastructureInfo.dataPlane
  });

export const filterInfrastructureInfoRows = (record: InfrastructureInfoRow, searchText: string): boolean => {
  const target = R.join('', R.values(R.pick(['name', 'nodePool', 'instanceType'], record)))
    .toLowerCase();
  return target.indexOf(searchText.toLowerCase()) !== -1;
};
