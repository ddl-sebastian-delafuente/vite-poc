import {
  DominoDatasetrwApiDatasetRwGrantDetails as DatasetRwGrantDetails,
  DominoDatasourceModelField as ModelField,
  DominoFeaturestoreApiFeatureStoreDto as FeatureStoreDto,
  DominoFeaturestoreModelOfflineStoreType as FeaturestoreModelOfflineStoreType,
  DominoFeaturestoreModelOnlineStoreType as FeaturestoreModelOnlineStoreType,
  DominoLayoutWebCompleteWorkflowRequest as WorkflowRequest,
  DominoQuotaApiQuotaType as DominoQuotaType,
  DominoServerProjectsDomainEntitiesProjectGitRepository as ProjectGitRepository,
  DominoWorkspaceApiWorkspaceInitConfigDto as WorkspaceInitConfigDto,
} from '@domino/api/dist/types';

import { UnionToMap } from '../utils/typescriptUtils';

export type SupportedLanguage = 'Python' | 'Sas' | 'R';
export const SupportedLanguage: UnionToMap<SupportedLanguage> = {
  Python: 'Python',
  Sas: 'Sas',
  R: 'R',
}

export type DatasourceConnectorGroup =
  'Native' |
  'Starburst' |
  'StarburstSelfService';

export const DatasourceConnectorGroup: UnionToMap<DatasourceConnectorGroup> = {
  Native: 'Native',
  Starburst: 'Starburst',
  StarburstSelfService: 'StarburstSelfService',
}

export type Role = DatasetRwGrantDetails['targetRole'];
export const Role: UnionToMap<Role> = {
  DatasetRwEditor: 'DatasetRwEditor',
  DatasetRwOwner: 'DatasetRwOwner',
  DatasetRwReader: 'DatasetRwReader',
}

export type SizeStatus = 'Active' | 'Pending';
export const SizeStatus: UnionToMap<SizeStatus> = {
  Active: 'Active',
  Pending: 'Pending',
}

export type FeatureStoreSyncStatus = FeatureStoreDto['syncStatus'];
export const FeatureStoreSyncStatus: UnionToMap<FeatureStoreSyncStatus> = {
  Failed: 'Failed',
  InProgress: 'InProgress',
  Successful: 'Successful',
}

export const GitServiceProvider: UnionToMap<ProjectGitRepository['serviceProvider']> = {
  bitbucket: 'bitbucket',
  bitbucketServer: 'bitbucketServer',
  github: 'github',
  githubEnterprise: 'githubEnterprise',
  gitlab: 'gitlab',
  gitlabEnterprise: 'gitlabEnterprise',
  unknown: 'unknown',
}

export type OfflineStoreType = FeaturestoreModelOfflineStoreType;
export const OfflineStoreType: UnionToMap<OfflineStoreType> = {
  BigQuery: 'BigQuery',
  File: 'File',
  Redshift: 'Redshift',
  Snowflake: 'Snowflake',
}

export type OnlineStoreType = FeaturestoreModelOnlineStoreType;
export const OnlineStoreType: UnionToMap<OnlineStoreType> = {
  Bigtable: 'Bigtable',
  Datastore: 'Datastore', 
  DynamoDB: 'DynamoDB',
  Redis: 'Redis',
  SQLite: 'SQLite',
  Snowflake: 'Snowflake',
}

export interface OfflineStoreConfig {
  offlineStoreType: OfflineStoreType;
  fields: {
    [key: string]: ModelField;
  };
}

export type QuotaType = DominoQuotaType;
export const QuotaType: UnionToMap<QuotaType> = {
  Global: 'Global',
  Override: 'Override',
}

export type StorageUnit = WorkspaceInitConfigDto['volumeSize']['unit'];

/**
 * A Subset of `StorageUnit` only containing Mebi Byte units
 */
export type StorageUnitMeBi = Extract<StorageUnit, 'B' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB' | 'EiB' | 'ZiB' | 'YiB'>;
export const StorageUnitMeBi: UnionToMap<StorageUnitMeBi> = { 
  B: 'B',
  KiB: 'KiB',
  MiB: 'MiB',
  GiB: 'GiB',
  TiB: 'TiB',
  PiB: 'PiB', 
  EiB: 'EiB',
  ZiB: 'ZiB',
  YiB: 'YiB',
}

/**
 * A Subset of `StorageUnit` only containing byte units
 */
export type StorageUnitBytes = Extract<StorageUnit, 'B' | 'KB' | 'MB' | 'GB' | 'TB' |  'PB' | 'EB' |  'ZB' | 'YB'>;
export const StorageUnitBytes: UnionToMap<StorageUnitBytes> = {
  B: 'B',
  KB: 'KB',
  MB: 'MB',
  GB: 'GB',
  TB: 'TB',
  PB: 'PB',
  EB: 'EB',
  ZB: 'ZB',
  YB: 'YB',
}

/**
 * A Subset of `StorageUnit` only containing Mebi bit units
 */
export type StorageUnitMeBiBit = Extract<StorageUnit, 'bit' | 'Kibit' | 'Mibit' | 'Gibit' | 'Tibit' | 'Pibit' | 'Eibit' | 'Zibit' | 'Yibit'>;
export const StorageUnitMeBiBit: UnionToMap<StorageUnitMeBiBit> = {
  bit: 'bit',
  Kibit: 'Kibit',
  Mibit: 'Mibit',
  Gibit: 'Gibit',
  Tibit: 'Tibit',
  Pibit: 'Pibit',
  Eibit: 'Eibit',
  Zibit: 'Zibit',
  Yibit: 'Yibit'
}

/**
 * A Subset of `StorageUnit` only containing bit units
 */
export type StorageUnitBits = Extract<StorageUnit, 'bit' | 'Kbit' | 'Mbit' | 'Gbit' | 'Tbit' | 'Pbit' | 'Ebit' | 'Zbit' | 'Ybit'>;
export const StorageUnitBits: UnionToMap<StorageUnitBits> = {
  bit: 'bit',
  Kbit: 'Kbit',
  Mbit: 'Mbit',
  Gbit: 'Gbit',
  Tbit: 'Tbit',
  Pbit: 'Pbit',
  Ebit: 'Ebit',
  Zbit: 'Zbit',
  Ybit: 'Ybit',
}

export const StorageUnit: UnionToMap<StorageUnit> = {
  o: 'o',
  ...StorageUnitMeBi,
  ...StorageUnitBytes,
  ...StorageUnitMeBiBit,
  ...StorageUnitBits,
};



export const WorkflowId: UnionToMap<WorkflowRequest['workflowID']> = {
  CreateDataset: 'CreateDataset',
  CreateDatasource: 'CreateDatasource',
  CreateFeatureStore: 'CreateFeatureStore',
  UpdateDataset: 'UpdateDataset',
  UpdateDatasource: 'UpdateDatasource',
  UpdateFeatureStore: 'UpdateFeatureStore',
}
