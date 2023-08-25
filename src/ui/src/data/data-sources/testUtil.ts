/* istanbul ignore file */

import {
  DominoNucleusLibAuthPrincipalWithFeatureFlags as User,
  DominoProjectsApiProjectSummary as ProjectSummary,
} from '@domino/api/dist/types';

import {
  AuthenticationType,
  DataSourceDto,
  DataSourceType,
} from './CommonData';

export const getAllDataSourcesResponse: DataSourceDto[] = [
  // 0 - Snowflake OAuth
  {
    'id': '611d43280ccd0069b81cf389',
    'name': 'Snowflake (OAuth)',
    authType: AuthenticationType.OAuth,
    'ownerId': '610c273e5c794f1034d9884f',
    'ownerInfo': {'ownerName': 'rfqa-admin', 'ownerEmail': 'rfqa-admin@dominodatalab.com', 'isOwnerAdmin': true},
    'addedBy': {'611d42f80ccd0069b81cf382': 'rfqa-admin'},
    'dataSourceType': DataSourceType.SnowflakeConfig,
    'config': {
      'type': 'DataSourceSnowflakeConfig',
      'database': 'AD_DEMO',
      'accountName': 'kma55258',
      'dataSourceType': 'SnowflakeConfig',
      'schema': 'PUBLIC',
      'warehouse': 'DOMINODATALAB'
    },
    dataSourcePermissions: {
      'credentialType': 'Individual',
      'isEveryone': false,
      'userIds': [],
    },
    'lastUpdated': 1629308105432,
    'lastUpdatedBy': '610c273e5c794f1034d9884f',
    'lastAccessed': {
      'test-user-1': 1614894401000,
      'test-user-2': 1635010544000,
      'test-user-3': 1612279811000,
      'test-user-4': 1611587060000,
      'test-user-5': 1626371702000
    },
    'addedToProjectTimeMap': {'611d42f80ccd0069b81cf382': 1629308105432},
    'projectIds': ['611d42f80ccd0069b81cf382'],
    'adminInfo': {
      'projectNames': {'611d42f80ccd0069b81cf382': 'giulio-test'},
      'projectIdOwnerUsernameMap': {'611d42f80ccd0069b81cf382': 'rfqa-admin'},
      'projectLastActiveMap': {}
    },
    'status': 'Active',
    'displayName': 'Snowflake',
    'dataPlanes':  [
      {
        'dataPlaneId' : "000000000000000000000000"
      }
    ],
    'useAllDataPlanes': false
  },
  // 1 - Snowflake Basic Auth
  {
    'id': '611d434b0ccd0069b81cf38b',
    'name': 'Snowflake (Basic)',
    authType: AuthenticationType.Basic,
    'ownerId': '610810f55dceb9484ff6c175',
    'ownerInfo': {
      'ownerName': 'integration-test',
      'ownerEmail': 'integration-test@dominodatalab.com',
      'isOwnerAdmin': true
    },
    'addedBy': {},
    'dataSourceType': DataSourceType.SnowflakeConfig,
    'config': {
      'type': 'DataSourceSnowflakeConfig',
      'dataSourceType': 'SnowflakeConfig',
      'accountName': 'kma55258'
    },
    dataSourcePermissions: {
      'credentialType': 'Individual',
      'isEveryone': false,
      'userIds': [],
    },
    'lastUpdated': 1629307729292,
    'lastUpdatedBy': '610810f55dceb9484ff6c175',
    'lastAccessed': {
      'test-user-1': 1620151365000,
      'test-user-2': 1618506378000,
      'test-user-3': 1622781776000,
      'test-user-4': 1635930535000,
      'test-user-5': 1615223568000,
    },
    'addedToProjectTimeMap': {},
    'projectIds': [],
    'adminInfo': {'projectNames': {}, 'projectIdOwnerUsernameMap': {}, 'projectLastActiveMap': {}},
    'status': 'Active',
    'displayName': 'Snowflake',
    'dataPlanes':  [
      {
        'dataPlaneId' : "000000000000000000000000"
      }
    ],
    'useAllDataPlanes': false
  },
  // 2 - Redshift IAM
  {
    'id': '611d43650ccd0069b81cf38e',
    'name': 'Redshift (IAM)',
    authType: AuthenticationType.AWSIAMRoleWithUsername,
    'ownerId': '610810f55dceb9484ff6c175',
    'ownerInfo': {
      'ownerName': 'integration-test',
      'ownerEmail': 'integration-test@dominodatalab.com',
      'isOwnerAdmin': true
    },
    'addedBy': {'610befdf9d25d27c1360b769': 'integration-test'},
    'dataSourceType': DataSourceType.RedshiftConfig,
    'config': {
      'type': 'DataSourceRedshiftConfig',
      'dataSourceType': DataSourceType.RedshiftConfig,
      host: 'http://a4dfdb085193147b3b08604c635ca8f6-841985891.us-west-2.elb.amazonaws.com',
      port: 1234,
      database: 'test-database-with.a4dfdb085193147b3b08604c635ca8f6-841985891-name-that-overflows-and-wraps',
    },
    dataSourcePermissions: {
      'credentialType': 'Individual',
      'isEveryone': false,
      'userIds': [],
    },
    'lastUpdated': 1629307749563,
    'lastUpdatedBy': '610810f55dceb9484ff6c175',
    'lastAccessed': {
      'test-user-1': 1614894401000,
      'test-user-2': 1635010544000,
      'test-user-3': 1612279811000,
      'test-user-4': 1611587060000,
      'test-user-5': 1626371702000
    },
    'addedToProjectTimeMap': {'610befdf9d25d27c1360b769': 1629307749563},
    'projectIds': ['610befdf9d25d27c1360b769'],
    'adminInfo': {
      'projectNames': {'610befdf9d25d27c1360b769': 'catherine'},
      'projectIdOwnerUsernameMap': {'610befdf9d25d27c1360b769': 'integration-test'},
      'projectLastActiveMap': {}
    },
    'status': 'Active',
    'displayName': 'Redshift',
    'dataPlanes':  [
      {
        'dataPlaneId' : "000000000000000000000000"
      }
    ],
    'useAllDataPlanes': false
  },
  // 3 - Redshift Basic,
  {
    'id': '611d46810ccd0069b81cf393',
    'name': 'Redshift (Basic)',
    authType: AuthenticationType.Basic,
    'ownerId': '610810f55dceb9484ff6c175',
    'ownerInfo': {
      'ownerName': 'integration-test',
      'ownerEmail': 'integration-test@dominodatalab.com',
      'isOwnerAdmin': true
    },
    'addedBy': {},
    'dataSourceType': DataSourceType.RedshiftConfig,
    'config': {
      'type': 'DataSourceRedshiftConfig',
      'dataSourceType': DataSourceType.RedshiftConfig,
      'accountName': 'kma55258'
    },
    dataSourcePermissions: {
      'credentialType': 'Individual',
      'isEveryone': false,
      'userIds': [],
    },
    'lastUpdated': 1629308545969,
    'lastUpdatedBy': '610810f55dceb9484ff6c175',
    'lastAccessed': {
      'test-user-1': 1614894401000,
      'test-user-2': 1635010544000,
      'test-user-3': 1612279811000,
      'test-user-4': 1611587060000,
      'test-user-5': 1626371702000
    },
    'addedToProjectTimeMap': {},
    'projectIds': [],
    'adminInfo': {'projectNames': {}, 'projectIdOwnerUsernameMap': {}, 'projectLastActiveMap': {}},
    'status': 'Active',
    'displayName': 'Redshift',
    'dataPlanes':  [
      {
        'dataPlaneId' : "000000000000000000000000"
      }
    ],
    'useAllDataPlanes': false
  },
  // 4 - S3 IAM,
  {
    'id': '611d46810ccd0069b81cf394',
    'name': 'S3 (IAM)',
    authType: AuthenticationType.AWSIAMRole,
    'ownerId': '610810f55dceb9484ff6c175',
    'ownerInfo': {
      'ownerName': 'integration-test',
      'ownerEmail': 'integration-test@dominodatalab.com',
      'isOwnerAdmin': true
    },
    'addedBy': {},
    'dataSourceType': DataSourceType.S3Config,
    'config': {
      'type': 'DataSourceS3Config',
      'dataSourceType': DataSourceType.S3Config,
      bucket: 'testbucket',
      region: 'testregion',
    },
    dataSourcePermissions: {
      'credentialType': 'Individual',
      'isEveryone': false,
      'userIds': [],
    },
    'lastUpdated': 1629308545969,
    'lastUpdatedBy': '610810f55dceb9484ff6c175',
    'lastAccessed': {
      'test-user-1': 1614894401000,
      'test-user-2': 1635010544000,
      'test-user-3': 1612279811000,
      'test-user-4': 1611587060000,
      'test-user-5': 1626371702000
    },
    'addedToProjectTimeMap': {},
    'projectIds': [],
    'adminInfo': {'projectNames': {}, 'projectIdOwnerUsernameMap': {}, 'projectLastActiveMap': {}},
    'status': 'Active',
    'displayName': 'S3',
    'dataPlanes':  [
      {
        'dataPlaneId' : "000000000000000000000000"
      }
    ],
    'useAllDataPlanes': false
  },
  // 5 - S3 Basic,
  {
    'id': '611d46810ccd0069b81cf395',
    'name': 'S3 (Basic)',
    authType: AuthenticationType.AWSIAMBasic,
    'ownerId': '610810f55dceb9484ff6c175',
    'ownerInfo': {
      'ownerName': 'integration-test',
      'ownerEmail': 'integration-test@dominodatalab.com',
      'isOwnerAdmin': true
    },
    'addedBy': {},
    'dataSourceType': DataSourceType.S3Config,
    'config': {
      'type': 'DataSourceS3Config',
      'dataSourceType': DataSourceType.S3Config,
      bucket: 'testbucket',
      region: 'testregion',
    },
    dataSourcePermissions: {
      'credentialType': 'Individual',
      'isEveryone': false,
      'userIds': [],
    },
    'lastUpdated': 1629308545969,
    'lastUpdatedBy': '610810f55dceb9484ff6c175',
    'lastAccessed': {},
    'addedToProjectTimeMap': {},
    'projectIds': [],
    'adminInfo': {'projectNames': {}, 'projectIdOwnerUsernameMap': {}, 'projectLastActiveMap': {}},
    'status': 'Active',
    'displayName': 'S3',
    'dataPlanes':  [
      {
        'dataPlaneId' : "000000000000000000000000"
      }
    ],
    'useAllDataPlanes': false
  },
  // 6 - MySql IAM,
  {
    'id': '611d46810ccd0069b81cf396',
    'name': 'MySql (IAM)',
    authType: AuthenticationType.AWSIAMRoleWithUsername,
    'ownerId': '610810f55dceb9484ff6c175',
    'ownerInfo': {
      'ownerName': 'integration-test',
      'ownerEmail': 'integration-test@dominodatalab.com',
      'isOwnerAdmin': true
    },
    'addedBy': {},
    'dataSourceType': DataSourceType.MySQLConfig,
    'config': {
      'type': 'DataSourceMySQLConfig',
      'dataSourceType': DataSourceType.MySQLConfig,
      bucket: 'testbucket',
      region: 'testregion',
    },
    dataSourcePermissions: {
      'credentialType': 'Individual',
      'isEveryone': false,
      'userIds': [],
    },
    'lastUpdated': 1629308545969,
    'lastUpdatedBy': '610810f55dceb9484ff6c175',
    'lastAccessed': {
      'test-user-1': 1614894401000,
      'test-user-2': 1635010544000,
      'test-user-3': 1612279811000,
      'test-user-4': 1611587060000,
      'test-user-5': 1626371702000
    },
    'addedToProjectTimeMap': {},
    'projectIds': [],
    'adminInfo': {'projectNames': {}, 'projectIdOwnerUsernameMap': {}, 'projectLastActiveMap': {}},
    'status': 'Active',
    'displayName': 'MySQL',
    'dataPlanes':  [
      {
        'dataPlaneId' : "000000000000000000000000"
      }
    ],
    'useAllDataPlanes': false
  },
  // 6 - MySQL Basic,
  {
    'id': '611d46810ccd0069b81cf397',
    'name': 'MySQL (Basic)',
    authType: AuthenticationType.Basic,
    'ownerId': '610810f55dceb9484ff6c175',
    'ownerInfo': {
      'ownerName': 'integration-test',
      'ownerEmail': 'integration-test@dominodatalab.com',
      'isOwnerAdmin': true
    },
    'addedBy': {},
    'dataSourceType': DataSourceType.MySQLConfig,
    'config': {
      'type': 'DataSourceMySQLConfig',
      'dataSourceType': DataSourceType.MySQLConfig,
      bucket: 'testbucket',
      region: 'testregion',
    },
    dataSourcePermissions: {
      'credentialType': 'Individual',
      'isEveryone': false,
      'userIds': [],
    },
    'lastUpdated': 1629308545969,
    'lastUpdatedBy': '610810f55dceb9484ff6c175',
    'lastAccessed': {
      'test-user-1': 1614894401000,
      'test-user-2': 1635010544000,
      'test-user-3': 1612279811000,
      'test-user-4': 1611587060000,
      'test-user-5': 1626371702000
    },
    'addedToProjectTimeMap': {},
    'projectIds': [],
    'adminInfo': {'projectNames': {}, 'projectIdOwnerUsernameMap': {}, 'projectLastActiveMap': {}},
    'status': 'Active',
    'displayName': 'MySQL',
    'dataPlanes':  [
      {
        'dataPlaneId' : "000000000000000000000000"
      }
    ],
    'useAllDataPlanes': false
  },
  // 7 - Big Query,
  {
    'id': '611d46810ccd0069b81cf398',
    'name': 'BigQuery',
    authType: AuthenticationType.GCPBasic,
    'ownerId': '610810f55dceb9484ff6c175',
    'ownerInfo': {
      'ownerName': 'integration-test',
      'ownerEmail': 'integration-test@dominodatalab.com',
      'isOwnerAdmin': true
    },
    'addedBy': {},
    'dataSourceType': DataSourceType.BigQueryConfig,
    'config': {
      'type': 'DataSourceBigQueryConfig',
      'dataSourceType': DataSourceType.BigQueryConfig,
      bucket: 'testbucket',
      region: 'testregion',
    },
    dataSourcePermissions: {
      'credentialType': 'Individual',
      'isEveryone': false,
      'userIds': [],
    },
    'lastUpdated': 1629308545969,
    'lastUpdatedBy': '610810f55dceb9484ff6c175',
    'lastAccessed': {
      'test-user-1': 1614894401000,
      'test-user-2': 1635010544000,
      'test-user-3': 1612279811000,
      'test-user-4': 1611587060000,
      'test-user-5': 1626371702000
    },
    'addedToProjectTimeMap': {},
    'projectIds': [],
    'adminInfo': {'projectNames': {}, 'projectIdOwnerUsernameMap': {}, 'projectLastActiveMap': {}},
    'status': 'Active',
    'displayName': 'BigQuery',
    'dataPlanes':  [
      {
        'dataPlaneId' : "000000000000000000000000"
      }
    ],
    'useAllDataPlanes': false
  },
];

export const getCurrentUserResponse = {
  'firstName': 'integration-test',
  'lastName': 'integration-test',
  'fullName': 'integration-test integration-test',
  'userName': 'integration-test',
  'email': 'test-notifs+integration-test@dominodatalab.com',
  'avatarUrl': '',
  'id': '610810f55dceb9484ff6c175'
};

export const getCurrentOrgResponse = [{
  'id': '616084397d23d03407e6ba8d',
  'name': 'rfqa-org',
  'organizationUserId': '616084397d23d03407e6ba8c',
  'members': [{'id': '616082ec7d23d03407e6b866', 'role': 'Admin'}, {
    'id': '610810f55dceb9484ff6c175',
    'role': 'Member'
  }, {'id': '616082f57d23d03407e6b876', 'role': 'Member'}]
}];

export const checkValidDataSourceNameResponse = {'message': 'success', 'success': true};

export const listUsersResponse = [{
  'firstName': 'integration-test',
  'lastName': 'integration-test',
  'fullName': 'integration-test integration-test',
  'userName': 'integration-test',
  'email': 'test-notifs+integration-test@dominodatalab.com',
  'avatarUrl': '',
  'id': '60faf443e43b3c7a6f5f5eea'
}, {
  'firstName': 'Jira',
  'lastName': 'User',
  'fullName': 'Jira User',
  'userName': 'jira_user_anonymous',
  'avatarUrl': '',
  'id': '60faf4614c38dd49ccf05fdc'
}, {
  'firstName': 'Org',
  'lastName': 'Org',
  'fullName': 'Organization',
  'userName': 'jira_organization',
  'avatarUrl': '',
  'id': '616084397d23d03407e6ba8c'
}];

export const getAllOrganizationsResponse = getCurrentOrgResponse;

export const getAdminPrincipalResponse = (isAdminUser: boolean): User => ({
  'isAnonymous': false,
  'isAdmin': isAdminUser,
  'canonicalId': '60faf443e43b3c7a6f5f5eea',
  'canonicalName': 'integration-test',
  'allowedSystemOperations': ['ActAsProjectAdmin', 'ExecuteRunsForFree', 'ManageFeatureFlags', 'UpdateUser', 'ViewUsage', 'UseK8sDashboard', 'ManageOrganizations', 'SetUserSystemRoles', 'ViewExecutors', 'GeneratePasswordResetLinks', 'ViewEverythingInControlCenter', 'ViewUserList', 'StopRuns', 'ViewProjectList', 'ManageEnvironments', 'ManageExecutors', 'CurateProjects', 'ViewMetrics', 'ViewProjectSizes', 'ReadKubernetes', 'StopServer', 'ViewAdminMenu', 'ManageProjectTags', 'ListAllProjects', 'RestartNucleus', 'EditCentralConfig', 'ViewRevenue', 'ResetIndex', 'PreviewProjects', 'ManageHardwareTiers', 'ViewAdminDashboard', 'TriggerSearchIndexing', 'ManageBuilds', 'ViewSearchIndex', 'ViewGlobalEnvironments', 'RunMongoDBCommands', 'EditEnvironmentsAsOwner'],
  'featureFlags': ['ShortLived.FastStartDataSets', 'ShortLived.KubernetesContainerMetricsEnabled', 'ShortLived.EnableGitBasedProjects', 'EnableProjectUsageMetrics', 'ShortLived.DaskAutoscalingEnabled', 'ShortLived.ExecutionEventHistoryInLogsEnabled', 'EnableModelAPIs', 'AppPublishingEnabled', 'EnableApps', 'ShortLived.EnableRepoCreationInNewProjectModal', 'ShortLived.PluggableInteractiveSessionSubdomains', 'ShortLived.WriteLogsToNewIndices', 'ShortLived.SparkClustersEnabled', 'ShortLived.RayAutoscalingEnabled', 'ShortLived.GitReferencesCustomizableEnabled', 'ShortLived.DSLEnabled', 'ShortLived.GitRepoValidationEnabled', 'EnableLaunchers', 'ShortLived.UserExecutionsQuotaEnabled', 'ShortLived.EnableExternalDataVolumes', 'ShortLived.SparkAutoscalingEnabled', 'ShortLived.CommentsPreviewEnabled', 'ShortLived.RayClustersEnabled', 'ShortLived.DaskClustersEnabled'],
  'booleanSettings': ['enableProjectTagging', 'publicProjectsEnabled', 'publicModelProductsEnabled'],
  'mixpanelSettings': {'frontendClientEnabled': false, 'backendClientEnabled': false, 'token': ''},
  'globalBannerSettings': { 'isClosable' : false },
  'docsRoot' :''
});

export const getProjectSummaryResponse: ProjectSummary = {
  'id': '61143349c11cc80b5badd1cc',
  'name': 'jfu-aug',
  'description': '',
  'visibility': 'Private',
  'ownerId': '60faf443e43b3c7a6f5f5eea',
  'ownerUsername': 'integration-test',
  'importedGitRepositories': [],
  'collaboratorIds': [],
  'collaborators': [],
  'tags': [],
  'stageId': '60f749fdccb30b68d02343c6',
  'status': {'status': 'active', 'isBlocked': false}
};

export const createResponse= {
  'id': '611591a6bf1be53b47db3c81',
  authType: AuthenticationType.Basic,
  'name': 'test',
  'ownerId': '60faf443e43b3c7a6f5f5eea',
  'ownerName': 'integration-test',
  'addedBy': {'61143349c11cc80b5badd1cc': 'integration-test'},
  'dataSourceType': 'SnowflakeConfig',
  'config': {
    'type': 'DataSourceSnowflakeConfig',
    'dataSourceType': 'SnowflakeConfig',
    'accountName': 'kma55258',
    'database': ''
  },
  dataSourcePermissions: {
    'credentialType': 'Individual',
    'isEveryone': false,
    'userIds': ['60faf443e43b3c7a6f5f5eea'],
  },
  'lastUpdated': 1628803494537,
  'lastUpdatedBy': '60faf443e43b3c7a6f5f5eea',
  'projectIds': ['61143349c11cc80b5badd1cc'],
  'adminInfo': {
    'projectNames': {'61143349c11cc80b5badd1cc': 'jfu-aug'},
    'projectIdOwnerUsernameMap': {'61143349c11cc80b5badd1cc': 'integration-test'}
  },
  'status': 'Active'
};
