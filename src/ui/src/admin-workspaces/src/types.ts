import { TableState } from '../../components/Table/Table';
import { StorageUnit } from '@domino/api/dist/types';

export type WorkspaceTableState = TableState<WorkspacePaginationTableRow>;

export type WorkspaceAdminPageSummaryDto = {
    totalNumWorkspaces: number;
    maxAllowedNumWorkspaces: number;
    totalAllocatedVolumeSizeGiB: number;
    maxAllowedAllocatedVolumeSizeGiB?: number;
};

export type PvSpaceInfo = {
    unit: StorageUnit;
    value: number;
}

export type WorkspaceRowClusterInfo = {
  clusterType: string,
  minWorkers: number,
  maxWorkers?: number
};

export type DiskUsage = {
  diskUsagePercent: number,
  diskUsageGiB: number,
  maxDiskUsageGiB: number,
}

export type WorkspaceRow = {
    workspaceId: string;
    name: string;
    ownerUsername: string;
    workspaceCreatedTime: string;
    lastSessionStart?: string;
    environmentName: string;
    environmentRevisionNumber?: number;
    environmentRevisionId?: string;
    pvSpace: PvSpaceInfo;
    projectName: string;
    projectOwnerName: string;
    pvcName: string;
    workspaceState: string;
    clusterInfo?: WorkspaceRowClusterInfo;
    pvSpaceGiB?: number;
    diskUsage?: DiskUsage;
    dataPlaneName: string;
};

export type WorkspacePaginationTableRow = {
    workspaceId: string;
    name: string;
    ownerUsername: string;
    workspaceCreatedTime: number;
    lastSessionStart?: number;
    environmentName: string;
    environmentRevisionNumber?: number;
    environmentRevisionId?: string;
    pvSpace: PvSpaceInfo;
    projectName: string;
    projectOwnerName: string;
    pvcName: string;
    workspaceState: string;
    clusterInfo?: WorkspaceRowClusterInfo;
    dataPlaneName: string;
    pvSpaceGiB: number;
    diskUsagePercent?: number,
    diskUsageGiB?: number,
    maxDiskUsageGiB?: number,
}

export type WorkspaceCountQuota = {
    runningCount: number;
    usedCount: number;
    maxCount: number;
};
export type WorkspaceDiscSpaceQuota = {
    usedGiB: number;
    maxGiB?: number;
};
