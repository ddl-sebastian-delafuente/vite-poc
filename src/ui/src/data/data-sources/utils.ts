import {
  getAuthConfigs,
  getDataSourceConfigsNew,
  isAllowedToManageDataSourceProjectOnlyData,
} from '@domino/api/dist/Datasource';
import {
  DominoDatasourceApiDataSourceDto as DataSourceDto,
  DominoDatasourceApiDataSourcePermissionsDto as DataSourcePermissionsDto,
  DominoDatasourceModelAuthConfig as DatasourceModelAuthConfig,
  DominoDatasourceModelDatasourceConfig as DatasourceModelDatasourceConfig,
} from '@domino/api/dist/types';
import * as R from 'ramda';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { RemoteDataReturn, useRemoteData } from '../../utils/useRemoteData';
import {
  DatasourceConnectorGroup,
} from '../../proxied-api/types';
import {
  AuthenticationType,
  CredentialType,
  DataSourceType,
  EngineType,
  isBasicAuth,
} from './CommonData';


export interface AreCredentialsFilledProps {
  authenticationType: AuthenticationType;
  secretCredential?: string;
  visibleCredential?: string;
}
export const areCredentialsFilled = ({
  authenticationType,
  secretCredential,
  visibleCredential,
}: AreCredentialsFilledProps): boolean => {
  switch (authenticationType) {
    case AuthenticationType.AWSIAMRoleWithUsername:
      return Boolean(visibleCredential);
    case AuthenticationType.AzureBasic:
    case AuthenticationType.GCPBasic:
    case AuthenticationType.OAuth:
      return Boolean(secretCredential);
    case AuthenticationType.AWSIAMBasic:
    case AuthenticationType.AWSIAMBasicNoOverride:
    case AuthenticationType.AWSIAMRole:
    case AuthenticationType.Basic:
    default:
      return Boolean(visibleCredential) && Boolean(secretCredential);
  }
}

export const useCanManageDataSourceProjectOnlyData = (projectId?: string): boolean => {
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  const fetchCanManageDataSourceProjectOnlyData = useCallback(async () => {
    try {
      if (projectId) {
        const result = await isAllowedToManageDataSourceProjectOnlyData({ projectId });
        setIsAllowed(result);
      }
    } catch (e) {
      console.warn(e);
    }
  }, [projectId, setIsAllowed]);

  useEffect(() => {
    fetchCanManageDataSourceProjectOnlyData();
  }, [fetchCanManageDataSourceProjectOnlyData]);

  return isAllowed;
}

export const doesUserHaveAccessToDataSource = (
    dataSource: DataSourceDto,
    currentUserId: string,
    orgUserIds: string[]
) => {
  const { isEveryone, userIds } = getDataSourcePermissions(dataSource);
  return  R.equals(currentUserId, dataSource.ownerId)
    || R.contains(currentUserId, userIds)
    || isEveryone
    || !R.isEmpty(R.intersection(userIds, orgUserIds));
}

export const isAccessibleOnDataPlane = (
    dataSource: DataSourceDto,
    dataPlaneId?: string
) => {
  const useAllDataPlanes = dataSource.useAllDataPlanes || false
  const dataPlanes = (dataSource.dataPlanes || []).map(({dataPlaneId}) => dataPlaneId)

  return useAllDataPlanes || dataPlanes.includes((dataPlaneId || ""))
}

const DATASOURCE_TYPE_NAME_MAPPING: { [key: string]: string } = {
  [DataSourceType.ADLSConfig]: 'ADLS',
  [DataSourceType.BigQueryConfig]: 'Big Query',
  [DataSourceType.ClickHouseConfig]: 'ClickHouse',
  [DataSourceType.DB2Config]: 'DB2',
  [DataSourceType.DruidConfig]: 'Druid',
  [DataSourceType.GCSConfig]: 'GCS',
  [DataSourceType.GenericJDBCConfig]: 'Generic JDBC',
  [DataSourceType.GenericS3Config]: 'Generic S3',
  [DataSourceType.GreenplumConfig]: 'Greenplum',
  [DataSourceType.IgniteConfig]: 'Ignite',
  [DataSourceType.MariaDBConfig]: 'MariaDB',
  [DataSourceType.MongoDBConfig]: 'MongoDB',
  [DataSourceType.MySQLConfig]: 'MySQL',
  [DataSourceType.NetezzaConfig]: 'Netezza',
  [DataSourceType.PalantirConfig]: 'Palantir',
  [DataSourceType.PostgreSQLConfig]: 'PostgreSQL',
  [DataSourceType.OracleConfig]: 'Oracle',
  [DataSourceType.RedshiftConfig]: 'Amazon Redshift',
  [DataSourceType.S3Config]: 'Amazon S3',
  [DataSourceType.SAPHanaConfig]: 'SAPHana',
  [DataSourceType.SingleStoreConfig]: 'SingleStore',
  [DataSourceType.SQLServerConfig]: 'SQL Server',
  [DataSourceType.SnowflakeConfig]: 'Snowflake',
  [DataSourceType.SynapseConfig]: 'Synapse',
  [DataSourceType.TabularS3GlueConfig]: 'Tabular S3 with AWS Glue',
  [DataSourceType.TeradataConfig]: 'Teradata',
  [DataSourceType.TrinoConfig]: 'Trino',
  [DataSourceType.VerticaConfig]: 'Vertica',
}

export const getDatasourceName = (datasourceType?: DataSourceType): string => {
  return DATASOURCE_TYPE_NAME_MAPPING[datasourceType || ''] || '';
}

export const getDatasourceOptionSublabel = (engineType?: EngineType, connectorGroup?: DatasourceConnectorGroup) => {
  if (engineType === EngineType.Starburst) {
    if (connectorGroup === DatasourceConnectorGroup.StarburstSelfService) {
      return '(Powered by Starburst JDBC)';
    }

    return '(Powered by Starburst)';
  }

  return undefined;
}

export const getDataSourcePermissions = (datasource: DataSourceDto): DataSourcePermissionsDto => {
  return datasource.dataSourcePermissions;
}

export const dataSourceOwnerSorter: (a: DataSourceDto, b: DataSourceDto) => number = (
  a, b) => {
  const {ownerName: ownerNameA, isOwnerAdmin: isOwnerAdminA} = a.ownerInfo;
  const {ownerName: ownerNameB, isOwnerAdmin: isOwnerAdminB} = b.ownerInfo;
  return (isOwnerAdminA === isOwnerAdminB) ? ownerNameA.localeCompare(ownerNameB) : (isOwnerAdminA ? -1 : 1);
};

export const getDefaultAuthenticationType = (datasourceType: DataSourceType | undefined) => {
  if (datasourceType === DataSourceType.SnowflakeConfig) {
    return AuthenticationType.OAuth;
  }

  return AuthenticationType.Basic;
}

export const doesAuthHaveRequiredFields = (authenticationType: AuthenticationType, visibleCredential?: string, hiddenCredential?: string) => {
  switch (authenticationType) {
    case AuthenticationType.AzureBasic:
    case AuthenticationType.GCPBasic:
      return Boolean(hiddenCredential);
    case AuthenticationType.AWSIAMRoleWithUsername:
      return Boolean(visibleCredential);
    default:
      return Boolean(visibleCredential && hiddenCredential);
  }
}

export interface UseAuthenticationStateProps {
  authenticationType?: AuthenticationType;
  authTypes: AuthenticationType[];
  credentialType: CredentialType;
  datasourceType?: DataSourceType;
  password?: string;
  username?: string;
}

export interface UseAuthenticationStateReturn
  extends Omit<UseAuthenticationStateProps, 'authenticationType' | 'authTypes' | 'credentialType' | 'datasourceType'> {
  authenticationType: AuthenticationType;
  authTypes: AuthenticationType[];
  resetAuthenticationState: () => void;
  setAuthenticationType: (authType: AuthenticationType) => void;
  setPassword: (password: string | undefined) => void;
  setUsername: (username: string | undefined) => void;
  shouldPassCredentials: boolean;
  shouldShowAuthTypeSelector: boolean;
}

export const useAuthenticationState = ({
  credentialType,
  username: initialUsername,
  password: initialPassword,
  ...props
}: UseAuthenticationStateProps): UseAuthenticationStateReturn => {
  const authTypes = useMemo(() => props.authTypes.filter((authType) => {
    if ( credentialType === CredentialType.Shared ) {
      return [
        AuthenticationType.AWSIAMRole,
        AuthenticationType.AWSIAMRoleWithUsername,
        AuthenticationType.OAuth
      ].indexOf(authType) === -1;
    }

    return true;
  }), [ credentialType, props.authTypes ]);

  const initialAuthenticationType = useMemo(() => {
    if (props.authenticationType) {
      return props.authenticationType;
    }

    // Check authTypes are defined and choose the first option
    if (authTypes.length > 0) {
      return authTypes[0];
    }

    return AuthenticationType.Basic;
  }, [props.authenticationType, authTypes])

  const [authenticationType, setAuthenticationType] = useState<AuthenticationType>(initialAuthenticationType);
  const [password, setPassword] = useState<string | undefined>(initialPassword);
  const [username, setUsername] = useState<string| undefined>(initialUsername);

  const shouldPassCredentials = useMemo(() => {
    return isBasicAuth(authenticationType) || (authenticationType === AuthenticationType.AWSIAMRoleWithUsername) || (authenticationType === AuthenticationType.ClientIdSecret)
  }, [authenticationType]);
  const shouldShowAuthTypeSelector = useMemo(() => authTypes.length > 1, [authTypes]);

  const resetAuthenticationState = useCallback(() => {
    setPassword(undefined);
    setUsername(undefined);
  }, [setPassword, setUsername]);

  useEffect(() => setPassword(initialPassword), [initialPassword, setPassword]);
  useEffect(() => setUsername(initialUsername), [initialUsername, setUsername]);
  useEffect(() => setAuthenticationType(initialAuthenticationType), [initialAuthenticationType, setAuthenticationType]);

  return {
    authenticationType,
    authTypes,
    password,
    resetAuthenticationState,
    setAuthenticationType,
    setPassword,
    setUsername,
    shouldPassCredentials,
    shouldShowAuthTypeSelector,
    username,
  };
}

type ConfigMetadataMap = {
  [T in DataSourceType]?: number;
}

type AuthMetadataMap = {
  [T in AuthenticationType]?: number;
}

interface UseAuthConfigsReturn extends RemoteDataReturn<DatasourceModelAuthConfig[]> {
  getConfigByAuthType: (authTypes?: AuthenticationType) => DatasourceModelAuthConfig | undefined,
  mapping: AuthMetadataMap,
}

export const useAuthConfigs = (): UseAuthConfigsReturn => {
  const remote =  useRemoteData<DatasourceModelAuthConfig[]>({
    canFetch: true,
    fetcher: () => getAuthConfigs({}),
    initialValue: []
  });

  const mapping = useMemo<AuthMetadataMap>(() => {
    return remote.data.reduce((memo, { authType }, index) => {
      if (authType) {
        memo[authType] = index;
      }

      return memo;
    }, {})
  }, [remote.data]);

  const getConfigByAuthType = useCallback((authType: AuthenticationType) => {
    if (!authType || mapping[authType] === undefined) {
      return undefined
    }

    const index = mapping[authType];

    return remote.data[index!];
  }, [mapping, remote.data])

  return {
    ...remote,
    getConfigByAuthType,
    mapping,
  }
}

interface UseDatasourceConfigsReturn extends RemoteDataReturn<DatasourceModelDatasourceConfig[]> {
  getConfigByDataSourceType: (datasourceType?: DataSourceType) => DatasourceModelDatasourceConfig | undefined;
  mapping: ConfigMetadataMap;
}

export const useDatasourceConfigs = (): UseDatasourceConfigsReturn => {
  const remote = useRemoteData<DatasourceModelDatasourceConfig[]>({
    canFetch: true,
    fetcher: () => getDataSourceConfigsNew({}),
    initialValue: []
  });

  const mapping = useMemo<ConfigMetadataMap>(() => {
    return remote.data.reduce((memo, { datasourceType }, index) => {
      if (datasourceType) {
        memo[datasourceType] = index;
      }
      return memo;
    }, {})
  }, [remote.data]);

  const getConfigByDataSourceType = useCallback((datasourceType: DataSourceType) => {
    if (!datasourceType || mapping[datasourceType] === undefined) {
      return undefined
    }

    const index = mapping[datasourceType];

    return remote.data[index!];
  }, [remote.data, mapping]);

  return {
    ...remote,
    getConfigByDataSourceType,
    mapping,
  }
}
