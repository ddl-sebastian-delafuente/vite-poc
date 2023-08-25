import {
  DominoCommonUserPerson as User,
  DominoDatasetrwApiDatasetRwDto as DatasetRwDto,
  DominoFeaturestoreApiCredentialConfigs as CredentialConfigs,
  DominoFeaturestoreApiFeatureStoreDto as FeatureStore,
  DominoFeaturestoreApiFeatureViewDto as FeatureView,
  DominoNucleusLibAuthPrincipalWithFeatureFlags as Principal,
  DominoQuotaApiQuotaDto as QuotaDto,
} from '@domino/api/dist/types';

import {
  GitServiceProvider,
  OfflineStoreType,
  OnlineStoreType,
  QuotaType,
} from './types';

export const initialCredentialConfigs: Readonly<CredentialConfigs> = {
  offlineStoreCredentials: [],
  onlineStoreCredentials: [],
};

export const initialDatasetRw: Readonly<DatasetRwDto> = {
  lifecycleStatus: 'Pending',
  snapshotIds: [],
  statusLastUpdatedBy: '',
  tags: {},
  datasetPath: '',
  readWriteSnapshotId: '',
  name: '',
  createdTime: 0,
  statusLastUpdatedTime: 0,
  id: '',
}

export const initialFeatureStore: Readonly<FeatureStore> = {
  creationTime: '',
  gitCommitHash: '',
  gitRepo: '',
  gitServiceProvider: GitServiceProvider.unknown,
  id: '',
  lastUpdatedTime: '',
  offlineStoreConfig: {},
  offlineStoreType: OfflineStoreType.File,
  onlineStoreConfig: {},
  onlineStoreType: OnlineStoreType.SQLite,
  ownerId: '',
  projectIds: [],
  status: 'Active',
  syncStatus: 'Successful',
  runId: '',
}

export const initialFeatureView: Readonly<FeatureView> = {
  addedBy: {},
  createdAtMillis: 0,
  description: '',
  entities: [],
  featureStoreId: '',
  features: [],
  id: '',
  lastUpdatedMillis: 0,
  status: 'Active',
  name: '',
  projectsInfo: [],
  tags: {},
}

export const initialPrincipal: Readonly<Principal> = {
  allowedSystemOperations: [],
  booleanSettings: [],
  featureFlags: [],
  isAdmin: false,
  isAnonymous: true,
  mixpanelSettings: {
    frontendClientEnabled: false,
    backendClientEnabled: false,
    token: ''
  },
  globalBannerSettings: { isClosable: false },
  docsRoot:''
}

export const initialQuota: Readonly<QuotaDto> = {
  id: '',
  quotaType: QuotaType.Global,
}

export const initialUser: Readonly<User> = {
  firstName: '',
  lastName: '',
  avatarUrl: '',
  fullName: '',
  id: '',
  userName: ''
};
