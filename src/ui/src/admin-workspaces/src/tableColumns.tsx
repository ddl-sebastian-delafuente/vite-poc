import * as React from 'react';
import * as R from 'ramda';
import moment from 'moment';
import pluralize from 'pluralize';
import Link from '../../components/Link/Link';
import {
    environmentRevisionSection,
    projectOverviewPage,
    sharedViewWorkspaceSection
} from '../../core/routes';
import { WorkspaceRow, WorkspaceRowClusterInfo } from './types';
import { ColumnConfiguration } from '@domino/ui/dist/components/Table/Table';
import { customKeyColumnSorter } from '@domino/ui/dist/components/Table/utils';
import { AlignType } from 'rc-table/lib/interface';
import { roundTo } from '@domino/ui/dist/utils/common';
import useStore from '@domino/ui/dist/globalStore/useStore';

const getWorkerCountLabel = (clusterInfo: WorkspaceRowClusterInfo): string =>
  clusterInfo.maxWorkers ?
  `${clusterInfo.minWorkers} - ${clusterInfo.maxWorkers} workers` :
  `${clusterInfo.minWorkers} ${pluralize('worker', clusterInfo.minWorkers)}`;

function formatDate(date: number, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(new Date(date)).format(format);
}

// @ts-ignore
const customKeyColumnWrapper = (a: any, b: any, key: string[]) => {
    return customKeyColumnSorter(a, b, key)
}

const WorkspaceAdminTableColumns = (): ColumnConfiguration<any>[] => {
  const { formattedPrincipal } = useStore();
  const isHybridEnabled = formattedPrincipal?.enableHybrid || false;
  const dataPlaneColumn = {
    key: 'dataPlaneName',
    title: 'Data Plane Name',
    dataIndex: 'dataPlaneName',
    align: 'right' as AlignType,
    render: (dataPlaneName: string) => <span data-test="dataPlaneName">{dataPlaneName}</span>,
    width: 150,
  };

  const result: ColumnConfiguration<any>[] = [{
    key: 'workspacetitle',
    title: 'Workspace Title',
    sorter: false,
    render: ({ workspaceId, name, projectName, projectOwnerName }: WorkspaceRow) => (
        <Link
          dataTest="WorkspaceTitle"
          openInNewTab={true}
          href={sharedViewWorkspaceSection(workspaceId)(projectOwnerName, projectName)}
        >
          {name}
        </Link>
    )
  },
  {
    key: 'workspaceowner',
    title: 'Workspace Owner',
    dataIndex: 'ownerUsername',
    sorter: false,
    width: 150
  },
  {
    key: 'project',
    title: 'Project',
    sorter: false,
    render: ({ ownerUsername, projectName }: WorkspaceRow) => (
        <Link openInNewTab={true} href={projectOverviewPage(ownerUsername, projectName)}>{projectName}</Link>
    ),
    width: 200
  },
  {
    key: 'pvc',
    title: 'PVC Name',
    dataIndex: 'pvcName',
    sorter: false,
    width: 150
  },
  {
    key: 'diskUsagePercent',
    title: 'Disk Usage (%)',
    dataIndex: 'diskUsagePercent',
    sorter: (a: Record<string, unknown>, b: Record<string, unknown>) => customKeyColumnWrapper(a, b, ['diskUsagePercent']),
    render: (diskUsagePercent: number) => <span data-test="WorkspaceDiskUsagePercent">{roundTo(diskUsagePercent, 2)}</span>,
  },
  {
    key: 'diskUsageGiB',
    title: 'Disk Usage (GiB)',
    dataIndex: 'diskUsageGiB',
    render: (diskUsageGiB: number) => <span data-test="WorkspaceDiskUsageGiB">{roundTo(diskUsageGiB, 2)}</span>,
  },
  {
    key: 'maxDiskUsageGiB',
    title: 'Max Disk Usage (GiB)',
    dataIndex: 'maxDiskUsageGiB',
    sorter: (a: Record<string, unknown>, b: Record<string, unknown>) => customKeyColumnWrapper(a, b, ['maxDiskUsageGiB']),
    render: (maxDiskUsageGiB: number) => <span data-test="WorkspaceMaxDiskUsageGiB">{roundTo(maxDiskUsageGiB, 2)}</span>,
  },
  {
    key: 'volumesize',
    title: 'Volume Size (GiB)',
    dataIndex: 'pvSpaceGiB',
    align: 'right',
    render: (pvSpaceGiB: number) => <span data-test="WorkspacePVSize">{Math.round(pvSpaceGiB * 100) / 100}</span>,
  },
  {
    key: 'clusterinfo',
    title: 'Cluster',
    sorter: false,
    render: ({ clusterInfo }: WorkspaceRow) => (
      <span data-test="WorkspaceClusterInfo">
        {clusterInfo
          ? `${clusterInfo.clusterType} (${getWorkerCountLabel(clusterInfo)})`
          : 'None'}
      </span>
    )
  },
  {
    key: 'laststart',
    title: 'Last Session Start Time',
    dataIndex: 'lastSessionStart',
    sorter: (a: Record<string, unknown>, b: Record<string, unknown>) => customKeyColumnWrapper(a, b, ['lastSessionStart']),
    render: (lastStartTime?: number) =>
        !R.isEmpty(lastStartTime) ?  formatDate(lastStartTime!) : undefined,
    width: 150,
    defaultSortOrder: 'ascend'
  },
  {
    key: 'createdon',
    title: 'Created Date',
    dataIndex: 'workspaceCreatedTime',
    render: (workspaceCreatedTime: number) => formatDate(workspaceCreatedTime),
    width: 150
  },
  {
    key: 'environment',
    title: 'Environment',
    sorter: false,
    render: (workspace: WorkspaceRow) => (
        <Link
            openInNewTab={true}
            disabled={!workspace.environmentRevisionId}
            disabledReason={!workspace.environmentRevisionId ? 'This environment has no active revisions' : undefined}
            href={
                workspace.environmentRevisionId ?
                environmentRevisionSection(workspace.environmentRevisionId) :
                undefined
            }
        >
            {workspace.environmentName} (#{workspace.environmentRevisionNumber})
        </Link>
    ),
    width: 200
  },
  {
      key: 'state',
      title: 'State',
      dataIndex: 'workspaceState',
      sorter: false,
      width: 150
  }];

  if (isHybridEnabled) {
    result.push(dataPlaneColumn);
  }

  return result;
}

export default WorkspaceAdminTableColumns;
