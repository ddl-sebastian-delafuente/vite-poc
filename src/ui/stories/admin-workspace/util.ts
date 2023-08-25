import { StorageUnit } from '@domino/api/dist/types';

const states = ['Starting', 'Started', 'Stopping', 'Stoped'];
export const makeAdminWorkspaceTableRow = () => (
  {
    workspaceId: `workspaceId-${Math.random()}`,
    name: `workspace name ${Math.random()}`,
    ownerUsername: 'ownerName',
    lastSessionStart: Math.round(Date.now() * Math.random()),
    mostRecentSessionId: 'mostRecentSessionId',
    environmentName: 'environmentName',
    environmentRevisionNumber: Math.round(Math.random() * 10),
    environmentRevisionId: 'environmentRevisionId',
    pvSpaceGiB: Math.round(Math.random() * 200),
    projectName: 'projectName',
    projectOwnerName: 'projectOwnerName',
    pvcName: 'workspace-pvId123',
    workspaceState: states[Math.floor(Math.random() * states.length)],
    workspaceCreatedTime: Math.round(Date.now() * Math.random()),
    pvSpace: {
      unit: 'GB' as StorageUnit,
      value: Math.round(Math.random()),
    },
    dataPlaneName: 'pew pew',
  }
);

export const makeAdminWorkspaceTableRowNoDefaults = () => ({
  workspaceId: `workspaceId-${Math.random()}`,
  name: `workspace name ${Math.random()}`,
  ownerUsername: 'ownerName',
  mostRecentSessionId: 'mostRecentSessionId',
  environmentName: 'environmentName',
  pvSpaceGiB: Math.round(Math.random() * 200),
  projectName: 'projectName',
  projectOwnerName: 'projectOwnerName',
  pvcName: 'workspace-pvId123',
  workspaceState: states[Math.floor(Math.random() * states.length)],
  workspaceCreatedTime: Math.round(Date.now() * Math.random()),
  pvSpace: {
    unit: 'GB' as StorageUnit,
    value: Math.round(Math.random()),
  },
  dataPlaneName: 'pew pew',
});
