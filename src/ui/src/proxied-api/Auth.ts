import { getDatasetPermissions } from '@domino/api/dist/Datasetrw';
import {
  DominoDatasetrwApiDatasetRwPermission as PermissionRw
} from '@domino/api/dist/types';
import { Awaited, UnionToMap } from '../utils/typescriptUtils';
import { ResponseCache } from './utils';

export type EntityType =
  'Dataset' |
  'DatasetInstance' |
  'DatasetSnapshot' |
  'DatasetSnapshotInstance';
export const EntityType: UnionToMap<EntityType> = {
  Dataset: 'Dataset',
  DatasetInstance: 'DatasetInstance',
  DatasetSnapshot: 'DatasetSnapshot',
  DatasetSnapshotInstance: 'DatasetSnapshotInstance',
}

export type Permission = PermissionRw
export const Permission: UnionToMap<Permission> = {
  DeleteDatasetRwV2: 'DeleteDatasetRwV2',
  EditSecurityDatasetRwV2: 'EditSecurityDatasetRwV2',
  ListDatasetRwV2: 'ListDatasetRwV2',
  PerformDatasetRwActionsInProjectV2: 'PerformDatasetRwActionsInProjectV2',
  PermanentDeleteDatasetRwV2: 'PermanentDeleteDatasetRwV2',
  ReadDatasetRwV2: 'ReadDatasetRwV2',
  UpdateDatasetRwV2: 'UpdateDatasetRwV2',
  PerformDatasetRwActionsAsAdminV2: 'PerformDatasetRwActionsAsAdminV2'
}

type CacheType = Awaited<ReturnType<typeof AuthLocal.getPermissions>>;


// Temp stubbed APIs
const AuthLocal = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getPermissions: (userId: string, entityId: string, entityType: EntityType) => new Promise<PermissionRw[]>(resolve => resolve([]))
}

const getPermissionsReponseCache = ResponseCache<CacheType>({});

export const getPermissions = new Proxy(AuthLocal.getPermissions, {
  apply: async (remoteCall, thisArgs, argArray: Parameters<typeof AuthLocal.getPermissions>) => {
    const requestKey = JSON.stringify(argArray);
    const [userId, entityId, entityType] = argArray;

    // Temp to clear lint
    void userId;
    void entityId;

    try {
      const cachedResponse = getPermissionsReponseCache.getValue(requestKey);
      return cachedResponse;
    } catch (e) {
      void e;
    }

    switch(entityType) {
      case EntityType.Dataset:
      case EntityType.DatasetInstance:
      case EntityType.DatasetSnapshot:
      case EntityType.DatasetSnapshotInstance: {
          const permissions = await getDatasetPermissions({ datasetId: entityId });
          return await getPermissionsReponseCache.setValue(requestKey, permissions)
      }
      default:
        break;
    }

    return remoteCall.apply(thisArgs, argArray);
  }
});
