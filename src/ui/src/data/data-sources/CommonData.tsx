import {
  DominoDatasourceApiDataSourcePermissionsDto as DataSourcePermissionsDto,
  DominoDatasourceApiDataSourceDto,
  DominoDatasourceModelAuthType as ModelAuthType,
  DominoDatasourceModelDatasourceType as ModelDatasourceType,
  DominoDatasourceModelEngineType as ModelEngineType,
  DominoDatasourceModelField as DatasourceModelField,
  DominoDatasourceModelStorageType as ModelStorageType,
} from '@domino/api/dist/types';
import moment from 'moment';
import * as R from 'ramda';
import * as React from 'react';

import SnowflakeLogo from '../../icons/SnowflakeLogo';
import RedshiftLogo from '../../icons/RedshiftLogo';
import DataSource from '../../icons/DataSource';
import AmazonS3Logo from '../../icons/AmazonS3Logo';
import PalantirLogo from '../../icons/PalantirLogo';
import { UnionToMap } from '../../utils/typescriptUtils';

// Shared Text
export const CREDENTIALS_ARE_SECURE_TEXT = 'These credentials are securely stored and can only be used by you.';
export const AUTH_OAUTH_TEXT = 'Authentication is already configured with Domino.';
export const AUTH_AWSIROLE_TEXT = 'Your IAM credentials are already configured with Domino. You can choose the AWS role at the time of execution';

export type AuthenticationType = ModelAuthType;
export const AuthenticationType: UnionToMap<AuthenticationType> = {
  AWSIAMBasic: 'AWSIAMBasic',
  AWSIAMBasicNoOverride: 'AWSIAMBasicNoOverride',
  AWSIAMRole: 'AWSIAMRole',
  AWSIAMRoleWithUsername: 'AWSIAMRoleWithUsername',
  AzureBasic: 'AzureBasic',
  Basic: 'Basic',
  GCPBasic: 'GCPBasic',
  OAuth: 'OAuth',
  BasicOptional: 'BasicOptional',
  UserOnly: 'UserOnly',
  NoAuth: 'NoAuth',
  ClientIdSecret: 'ClientIdSecret',
}

export type CredentialType = DataSourcePermissionsDto['credentialType'];
export const CredentialType: UnionToMap<CredentialType> = {
  Individual: 'Individual',
  Shared: 'Shared',
}

export interface DatasourceModelFieldGroup {
  [key: string]: DatasourceModelField;
}

export type DataSourceType = ModelDatasourceType;
export const DataSourceType: UnionToMap<DataSourceType> = {
  ADLSConfig: 'ADLSConfig',
  BigQueryConfig: 'BigQueryConfig',
  ClickHouseConfig: 'ClickHouseConfig',
  DB2Config: 'DB2Config',
  DruidConfig: 'DruidConfig',
  GCSConfig: 'GCSConfig',
  GenericJDBCConfig: 'GenericJDBCConfig',
  GenericS3Config: 'GenericS3Config',
  GreenplumConfig: 'GreenplumConfig',
  IgniteConfig: 'IgniteConfig',
  MariaDBConfig: 'MariaDBConfig',
  MongoDBConfig: 'MongoDBConfig',
  MySQLConfig: 'MySQLConfig',
  NetezzaConfig: 'NetezzaConfig',
  OracleConfig: 'OracleConfig',
  PalantirConfig: 'PalantirConfig',
  PostgreSQLConfig: 'PostgreSQLConfig',
  RedshiftConfig: 'RedshiftConfig',
  S3Config: 'S3Config',
  SAPHanaConfig: 'SAPHanaConfig',
  SQLServerConfig: 'SQLServerConfig',
  SingleStoreConfig: 'SingleStoreConfig',
  SnowflakeConfig: 'SnowflakeConfig',
  SynapseConfig: 'SynapseConfig',
  TabularS3GlueConfig: 'TabularS3GlueConfig',
  TeradataConfig: 'TeradataConfig',
  TrinoConfig: 'TrinoConfig',
  VerticaConfig: 'VerticaConfig'
}

export type EngineType = ModelEngineType;
export const EngineType: UnionToMap<EngineType> = {
  Domino: 'Domino',
  Starburst: 'Starburst',
}

export enum Permission {
  OnlyMe = 'Only me',
  Everyone = 'Everyone',
  Specific = 'Specific',
}

export type StorageType = ModelStorageType;
export const StorageType: UnionToMap<StorageType> = {
  Tabular: 'Tabular',
  ObjectStore: 'ObjectStore',
}

export type DataSourceDto = DominoDatasourceApiDataSourceDto;

export const AuthenticationTypeRadioOptions: { [key: string]: { label: string } } = {
  // Placeholder label name
  [AuthenticationType.AWSIAMBasic]: { label: 'Access Key / Secret' },
  [AuthenticationType.AWSIAMBasicNoOverride]: { label: 'Access Key / Secret' },
  [AuthenticationType.AWSIAMRole]: { label: 'IAM Credentials' },
  [AuthenticationType.AWSIAMRoleWithUsername]: { label: 'IAM Credentials' },

  // Placeholder label name
  [AuthenticationType.AzureBasic]: { label: 'AzureBasic' },
  [AuthenticationType.Basic]: { label: 'Username / Password' },

  // Placeholder label name
  [AuthenticationType.GCPBasic]: { label: 'GCP' },
  [AuthenticationType.OAuth]: { label: 'OAuth' },
}

// Shared interfaces/types
export interface ConfigObjProps {
  accountName?: string;
  database?: string;
  schema?: string;
  warehouse?: string;
  role?: string;
  driver?: string;
  server?: string;
  port?: string;
}

// Shared data
export const dataTypeOptions = Object.freeze({
  SnowflakeConfig: {
    icon: <SnowflakeLogo width="12" height="12" />,
    icon16: <SnowflakeLogo width="16" height="16" />,
    iconComponent: SnowflakeLogo
  },
  RedshiftConfig: {
    icon: <RedshiftLogo width="12" height="12" />,
    icon16: <RedshiftLogo width="16" height="16" />,
    iconComponent: RedshiftLogo
  },
  S3Config: {
    icon: <AmazonS3Logo width="12" height="12" />,
    icon16: <AmazonS3Logo width="16" height="16" />,
    iconComponent: AmazonS3Logo
  },
  PalantirConfig: {
    icon: <PalantirLogo width="12" height="12" />,
    icon16: <PalantirLogo width="16" height="16" />,
    iconComponent: PalantirLogo
  }
});

// Shared methods
export const getDateInFormat = (date: number) => moment(date).format('MMMM Do, YYYY');

export const getDataSourceIcon16 = (dataSourceType: DataSourceType) =>
  R.pathOr(<DataSource width={16} height={16}/>, [dataSourceType, 'icon16'])(dataTypeOptions);

export const getDataSourceIconComponent = (dataSourceType: DataSourceType) =>
  R.pathOr(DataSource, [dataSourceType, 'iconComponent'])(dataTypeOptions);

export const getDataSourceIcon = (dataSourceType: DataSourceType) =>
  R.pathOr(<DataSource width={12} height={12}/>, [dataSourceType, 'icon'])(dataTypeOptions);

export const getGeneralPermissionName = (isAdminUser = false) => isAdminUser ? Permission.Everyone : Permission.OnlyMe;

export const getUsername = (value?: string, dataSourceType?: DataSourceType) =>
  isDummyUsernameAuth(dataSourceType) ? undefined : value;

export const isDummyUsernameAuth = (dataSourceType?: DataSourceType) => {
  return [
    DataSourceType.ADLSConfig,
    DataSourceType.BigQueryConfig,
    DataSourceType.GCSConfig,
  ].indexOf(dataSourceType as DataSourceType) > -1;
}

export const isBasicAuth = (authenticationType: AuthenticationType) => {
  return [
    AuthenticationType.AWSIAMBasic,
    AuthenticationType.AWSIAMBasicNoOverride,
    AuthenticationType.AzureBasic,
    AuthenticationType.Basic,
    AuthenticationType.GCPBasic,
  ].indexOf(authenticationType) > -1;
}

export const isIAMAuth = (authenticationType: AuthenticationType) => {
  return [
    AuthenticationType.AWSIAMRole,
    AuthenticationType.AWSIAMRoleWithUsername,
  ].indexOf(authenticationType) !== -1;
}

export const isPassThroughAuthType = (authenticationType: AuthenticationType) => {
  return [
    AuthenticationType.AWSIAMRole,
    AuthenticationType.AWSIAMRoleWithUsername,
    AuthenticationType.OAuth
  ].indexOf(authenticationType) !== -1;
}

export const isPassThroughDataSourceType = (dataSourceType?: DataSourceType) => {
  return [
    DataSourceType.SnowflakeConfig,
    DataSourceType.S3Config,
  ].indexOf(dataSourceType as DataSourceType) !== -1
}

export const isPassThroughAuth = (authenticationType: AuthenticationType, dataSourceType?: DataSourceType) => {
  return isPassThroughAuthType(authenticationType) && isPassThroughDataSourceType(dataSourceType);
}
