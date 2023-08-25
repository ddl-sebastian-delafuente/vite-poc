import {
  getAuthConfigByType,
  getDataSourceConfigByType,
} from '@domino/api/dist/Datasource';
import { getCurrentUser } from '@domino/api/dist/Users';

import {
  AuthenticationTypeRadioOptions,
  AuthenticationType,
  CredentialType,
  DataSourceType,
  EngineType,
  Permission,
  isBasicAuth,
  isPassThroughAuthType,
  isPassThroughAuth,
} from '../../../data/data-sources/CommonData';
import { getDatasourceName } from '../../../data/data-sources/utils';
import {
  applyKeys,
  BannerType,
  FieldType,
  LayoutElements,
  mergeLayoutAndFieldMap,
} from '../../DynamicField';
import {
  DependencyKeyword,
  WorkflowMetadata,
  WorkflowStepMetadata,
  WorkflowStep
} from '../DynamicWizard.types';
import {
  MetaRequestObject,
  RequestDataObject
} from '../proxiedDynamicWizardApiCalls.types';
import {
  AccessKeyFieldConfig,
  AccessKeyIDFieldConfig,
  AccountIDFieldConfig,
  AccountNameFieldConfig,
  AuthBannerAWSIRole,
  AuthBannerCredentialsHidden,
  AuthBannerCredentialsSecure,
  AuthBannerCredentialsValidated,
  AuthBannerOAuth,
  AuthTextblockAuthSelector,
  AuthTextblockIndividualAccounts,
  AuthTextblockIndividualAccountsAdmins,
  AuthTextblockServiceAccounts,
  AuthenticationTypeFieldConfig,
  AuthenticationTypeHiddenFieldConfig,
  BucketFieldConfig,
  CatalogCodeFieldConfig,
  CatalogFieldConfig,
  ClientIdFieldConfig,
  ClientSecretFieldConfig,
  CredentialTypeFieldConfig,
  CredentialTypeHiddenFieldConfig,
  CredentialTypeOptionIndividual,
  CredentialTypeOptionShared,
  DataSourceDescriptionFieldConfig,
  DataSourceNameFieldConfig,
  DataSourceTypeFieldConfig,
  DatabaseFieldConfig,
  DataplanesSelectorFieldConfig,
  DataplanesUseAllHiddenFieldConfig,
  EngineTypeHiddenFieldConfig,
  HostFieldConfig,
  PasswordFieldConfig,
  PermissionTypeFieldConfig,
  PermissionTypeHiddenIndividualFieldConfig,
  PermissionTypeOptionEveryone,
  PermissionTypeOptionSpecific,
  PortFieldConfig,
  PortRedshiftFieldConfig,
  PrivateKeyFieldConfig,
  ProjectFieldConfig,
  RegionFieldConfig,
  RoleFieldConfig,
  SQLFieldGroup,
  SchemaFieldConfig,
  SecretAccessKeyFieldConfig,
  TestCredentialsButtonFieldConfig,
  UserAndOrgsFieldConfig,
  UsernameFieldConfig,
  WarehouseFieldConfig,
} from './datasourceSharedFields';

export const CREATE_DATASOURCE_STEP = Object.freeze({
  authentication: 'Authenticate',
  configure: 'Configure',
  credentials: 'Credentials',
  dataplanes: 'Dataplanes',
  permissions: 'Permissions',
});

// A list of fields specific for a given authentication type
export const AUTHENTICATION_SPECIFIC_FIELDS = {
  [AuthenticationType.AWSIAMBasic]: [
    AccessKeyIDFieldConfig,
    SecretAccessKeyFieldConfig,
  ],
  [AuthenticationType.AWSIAMBasicNoOverride]: [
    AccessKeyIDFieldConfig,
    SecretAccessKeyFieldConfig,
  ],
  [AuthenticationType.AWSIAMRoleWithUsername]: [
    {
      ...UsernameFieldConfig,
      label: 'Database username'
    }
  ],
  [AuthenticationType.AWSIAMRole]: [
    AccessKeyIDFieldConfig,
    SecretAccessKeyFieldConfig,
  ],
  [AuthenticationType.AzureBasic]: [
    AccessKeyFieldConfig,
  ],
  [AuthenticationType.Basic]: [
    UsernameFieldConfig,
    PasswordFieldConfig,
  ],
  [AuthenticationType.GCPBasic]: [
    PrivateKeyFieldConfig,
  ],
  [AuthenticationType.OAuth]: [],
  [AuthenticationType.BasicOptional]: [
    UsernameFieldConfig,
    PasswordFieldConfig,
  ],
  [AuthenticationType.UserOnly]: [
    UsernameFieldConfig,
  ],
  [AuthenticationType.NoAuth]: [
  ],
  [AuthenticationType.ClientIdSecret]: [
    ClientIdFieldConfig,
    ClientSecretFieldConfig,
  ]
}

const iamHelpTextDataSources = [
  DataSourceType.MySQLConfig,
  DataSourceType.PostgreSQLConfig
];

export const getAuthFields = (authenticationType: AuthenticationType, datasourceType?: DataSourceType) => {
  const authFields = AUTHENTICATION_SPECIFIC_FIELDS[authenticationType];

  // Apply any additional metadata that is datasource specific if getting too complex
  // convert to transducer
  return authFields.map((field) => {
    const requiresIAMHelpText = iamHelpTextDataSources.indexOf(datasourceType as DataSourceType) > -1 &&
      authenticationType === AuthenticationType.AWSIAMRoleWithUsername &&
      field.path === 'username';

    if (requiresIAMHelpText) {
      return {
        ...field,
        helpText: '*IAM Credentials are only applicable to RDS MySQL and RDS Postgres.'
      }
    }

    return field;
  })
}

const GenericJDBCFields = [
  {
    bannerType: BannerType.Info,
    fieldType: FieldType.banner,
    id: 'jdbc-info',
    message: 'You selected a data store connection powered by Starburst JDBC.'
  },
  CatalogCodeFieldConfig,
]

// A list of fields specific for a given datasource
export const DATASOURCE_CONFIG_SPECIFIC_FIELDS = {
  [DataSourceType.ADLSConfig]: [
    AccountNameFieldConfig,
    BucketFieldConfig,
  ],
  [DataSourceType.BigQueryConfig]: [
    ProjectFieldConfig,
  ],
  [DataSourceType.ClickHouseConfig]: GenericJDBCFields,
  [DataSourceType.DB2Config]: GenericJDBCFields,
  [DataSourceType.DruidConfig]: GenericJDBCFields,
  [DataSourceType.GCSConfig]: [
    BucketFieldConfig,
  ],
  [DataSourceType.GenericJDBCConfig]: GenericJDBCFields,
  [DataSourceType.GenericS3Config]: [
    BucketFieldConfig,
    HostFieldConfig,
  ],
  [DataSourceType.GreenplumConfig]: GenericJDBCFields,
  [DataSourceType.IgniteConfig]: GenericJDBCFields,
  [DataSourceType.MariaDBConfig]: GenericJDBCFields,
  [DataSourceType.MongoDBConfig]: [
    HostFieldConfig,
    PortFieldConfig,
  ],
  [DataSourceType.MySQLConfig]: SQLFieldGroup,
  [DataSourceType.NetezzaConfig]: GenericJDBCFields,
  [DataSourceType.OracleConfig]: [
    HostFieldConfig,
    {
      ...PortFieldConfig,
      defaultValue: '1521'
    },
    DatabaseFieldConfig,
  ],
  [DataSourceType.PalantirConfig]: [
    HostFieldConfig,
    PortFieldConfig,
  ],
  [DataSourceType.PostgreSQLConfig]: [
    HostFieldConfig,
    {
      ...PortFieldConfig,
      defaultValue: '5432'
    },
    DatabaseFieldConfig,
  ],
  [DataSourceType.RedshiftConfig]: [
    HostFieldConfig,
    PortRedshiftFieldConfig,
    DatabaseFieldConfig,
  ],
  [DataSourceType.S3Config]: [
    BucketFieldConfig,
    RegionFieldConfig,
  ],
  [DataSourceType.SAPHanaConfig]: GenericJDBCFields,
  [DataSourceType.SingleStoreConfig]: GenericJDBCFields,
  [DataSourceType.SQLServerConfig]: [
    HostFieldConfig,
    {
      ...PortFieldConfig,
      defaultValue: '1433'
    },
    DatabaseFieldConfig,
  ],
  [DataSourceType.SnowflakeConfig]: [
    AccountNameFieldConfig,
    {
      elements: [
        DatabaseFieldConfig,
        WarehouseFieldConfig,
      ]
    },
    {
      elements: [
        SchemaFieldConfig,
        RoleFieldConfig,
      ]
    },
  ],
  [DataSourceType.SynapseConfig]: GenericJDBCFields,
  [DataSourceType.TabularS3GlueConfig]: [
    AccountIDFieldConfig,
    DatabaseFieldConfig,
    RegionFieldConfig,
  ],
  [DataSourceType.TeradataConfig]: [
    HostFieldConfig,
  ],
  [DataSourceType.TrinoConfig]: [
    HostFieldConfig,
    PortFieldConfig,
    {
      elements: [
        CatalogFieldConfig,
        SchemaFieldConfig,
      ]
    },
  ],
  [DataSourceType.VerticaConfig]: GenericJDBCFields,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCredentialStepResponse = async (dataSourceType: DataSourceType, engineType: EngineType, meta: MetaRequestObject) => {
  const baseStep = {
    dependencies: ['engineType'],
    layout: {
      elements: [
        { fieldType: FieldType.title, text: 'Credential Type' },
        { fieldType: FieldType.textblock, text: 'Please select the type of credentials to use with this data source.' },
      ]
    }
  };

  // Prevent S3 tabular from using individual credential types
  if (dataSourceType === DataSourceType.TabularS3GlueConfig || dataSourceType === DataSourceType.MongoDBConfig || dataSourceType === DataSourceType.PalantirConfig) {
    return {
      ...baseStep,
      layout: {
        elements: [
          ...baseStep.layout.elements,
          {
            ...CredentialTypeFieldConfig,
            defaultValue: CredentialType.Shared,
            disabled: true,
            options: [
              {
                ...CredentialTypeOptionIndividual,
                disabled: true,
              },
              CredentialTypeOptionShared,
            ]
          }
        ]
      }
    }
  }

  return {
    ...baseStep,
    layout: {
      elements: [
        ...baseStep.layout.elements,
        {
          ...CredentialTypeFieldConfig,
          options: [
            CredentialTypeOptionIndividual,
            CredentialTypeOptionShared,
          ]
        },
      ]
    }
  }
}

export const getConfigureStepResponse = async (dataSourceType: DataSourceType, meta: MetaRequestObject) => {
  const baseStep: WorkflowStep = {
    dependencies: ['dataSourceType'],
    layout: {
      elements: [
        DataSourceTypeFieldConfig
      ]
    },
    resetDependencies: ['dataSourceType']
  };

  const baseMetadata: LayoutElements = [
    DataSourceNameFieldConfig,
    DataSourceDescriptionFieldConfig,
  ];

  if (!meta.isAdminPage) {
    baseStep.layout.elements.push(CredentialTypeHiddenFieldConfig);
  }

  if (!dataSourceType) {
    return baseStep;
  }

  try {
    const dataSourceTypeSpecificFields = applyKeys(DATASOURCE_CONFIG_SPECIFIC_FIELDS[dataSourceType] || [], dataSourceType);

    const dataSourceConfig = await getDataSourceConfigByType({ dataSourceType: dataSourceType });
    const mergedFields = mergeLayoutAndFieldMap({ elements: dataSourceTypeSpecificFields || [] }, dataSourceConfig?.fields || {});

    const output = {
      ...baseStep,
      layout: {
        ...baseStep.layout,
        elements: baseStep.layout.elements.concat([
          ...mergedFields.elements,
          ...baseMetadata,
          {
            ...EngineTypeHiddenFieldConfig,
            defaultValue: dataSourceConfig.engineType,
          },
        ])
      }
    };

    return output;
  } catch (e) {
    console.warn(e);
    return baseStep;
  }
}

export const getAuthenticationStepResponse = async (authenticationType: AuthenticationType, credentialType: CredentialType, dataSourceType: DataSourceType, meta: MetaRequestObject) => {
  const baseStep: Pick<WorkflowStep, 'dependencies' | 'layout'> = {
    dependencies: [DependencyKeyword.validationStatus, 'authType', 'credentialType', 'dataSourceType'],
    layout: {
      elements: [],
    },
  };

  try {
    if (!dataSourceType) {
      return baseStep;
    }
    const dataSourceConfig = await getDataSourceConfigByType({ dataSourceType: dataSourceType });

    // Insert title
    const dataTypeDisplayName = getDatasourceName(dataSourceType);
    const titleText = credentialType === CredentialType.Individual ?
      `Add Your ${dataTypeDisplayName} Credentials ${meta.isAdminUser && dataSourceConfig.engineType === EngineType.Starburst ? '(Optional)' : ''}` :
      `Add ${dataTypeDisplayName} Service Account Credentials`
    baseStep.layout.elements.push({
      fieldType: FieldType.title,
      hasIcon: true,
      path: 'dataSourceType',
      text: titleText,
      value: dataSourceType,
    });

    // If credential type is Shared we need to hide passthrough auth types
  const authTypes = dataSourceConfig.authTypes.filter((authType) => {
    if ( credentialType === CredentialType.Shared ) {
      return !isPassThroughAuthType(authType);
    }

    return true;
  });

    const getAuthTextBlock = () => {
      if (credentialType === CredentialType.Individual) {
        if (meta.isAdminUser && dataSourceConfig.engineType === EngineType.Starburst) {
          return AuthTextblockIndividualAccountsAdmins;
        }

        return AuthTextblockIndividualAccounts;
      }

      return AuthTextblockServiceAccounts;
    }

    const hasAuthType = authTypes.indexOf(authenticationType) > -1;
    const resolvedAuthenticationType = hasAuthType ? authenticationType : authTypes[0];

    const authLayout = getAuthFields(resolvedAuthenticationType, dataSourceType);
    const authConfig = await getAuthConfigByType({ authType: resolvedAuthenticationType });
    const mergedFields = mergeLayoutAndFieldMap({ elements: authLayout || [] }, authConfig?.fields || {});

    const shouldShowAuthTypeSelector = authTypes.length > 1;

    const shouldShowOAuthMessage =
      resolvedAuthenticationType === AuthenticationType.OAuth;

    const shouldShowAWSIRoleMessage =
      resolvedAuthenticationType === AuthenticationType.AWSIAMRole;

    const shouldShowAuthenticationSucccessMessage =
      meta.validated;

    const shouldShowCredentialSecureMessage =
      !isPassThroughAuth(resolvedAuthenticationType, dataSourceType) &&
      !meta.isAdminUser &&
      dataSourceConfig.engineType !== EngineType.Starburst;

    const shouldShowTestCredentialsButton =
      !shouldShowAuthenticationSucccessMessage &&
      isBasicAuth(resolvedAuthenticationType) &&
      meta.isAdminUser &&
      credentialType === CredentialType.Individual &&
      dataSourceConfig.engineType !== EngineType.Starburst;

    const shouldShowAdminCredentialsHiddenMessage =
      credentialType === CredentialType.Shared &&
      !shouldShowAuthenticationSucccessMessage;

    const elements = [
      // Show auth selector or should messages for Individual/Service accounts
      ...(shouldShowAuthTypeSelector ? [
        AuthTextblockAuthSelector,
        {
          ...AuthenticationTypeFieldConfig,
          defaultValue: resolvedAuthenticationType,
          options: dataSourceConfig.authTypes.map((authType) => ({
            ...AuthenticationTypeRadioOptions[authType],
            value: authType,
          }))
        }
      ] : [
        getAuthTextBlock(),
        {
          ...AuthenticationTypeHiddenFieldConfig,
          defaultValue: resolvedAuthenticationType
        }
      ]),

      // Display fields
      ...(!isPassThroughAuth(resolvedAuthenticationType, dataSourceType) ? [
        shouldShowCredentialSecureMessage ? AuthBannerCredentialsSecure : null,
        ...mergedFields.elements,
      ] : []),

      shouldShowOAuthMessage ? AuthBannerOAuth : null,
      shouldShowAWSIRoleMessage ? AuthBannerAWSIRole : null,
      shouldShowAuthenticationSucccessMessage ? AuthBannerCredentialsValidated : null,
      shouldShowTestCredentialsButton ? TestCredentialsButtonFieldConfig : null,
      shouldShowAdminCredentialsHiddenMessage ? AuthBannerCredentialsHidden : null,
    ].filter(Boolean) as LayoutElements;

    return {
      ...baseStep,
      layout: {
        ...baseStep.layout,
        elements: baseStep.layout.elements.concat(elements),
      }
    }
  } catch (e) {
    console.warn(e);
    return baseStep;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDataplaneStepResponse = async (dataSourceType: DataSourceType, credentialType: CredentialType, engineType: EngineType, requestData: RequestDataObject, meta: MetaRequestObject) => {
  const useAllDataplanes = requestData?.useAllDataPlanes && requestData?.useAllDataPlanes !== 'false';
  const isStarburst = engineType === EngineType.Starburst;

  const disableDataplanes = isStarburst || credentialType === CredentialType.Individual;

  const baseStep: Pick<WorkflowStep, 'dependencies' | 'layout'> = {
    dependencies: ['credentialType', 'engineType', 'useAllDataPlanes'],
    layout: {
      elements: [
        {
          fieldType: FieldType.title,
          text: 'Nexus Data Planes',
        },
        {
          fieldType: FieldType.textblock,
          text: 'Configure which data planes are accessible to this data source. By default all data planes are selected - remember that if users try to utilize a data source with the incorrect data plane configuration, the training will fail.'
        },
        DataplanesUseAllHiddenFieldConfig,
        !useAllDataplanes && {
          ...DataplanesSelectorFieldConfig,
          defaultValue: isStarburst ? ['000000000000000000000000'] : undefined,
          disabled: disableDataplanes,
          selectAllByDefault: !isStarburst,
        },
      ].filter(Boolean) as LayoutElements,
    },
  };

  return baseStep;
}

const getWorkflowMetadata = async (workflowId: string, requestData: RequestDataObject, meta: MetaRequestObject): Promise<WorkflowMetadata> => {
  const authenticationType = requestData?.authType as AuthenticationType;
  const credentialType = requestData?.credentialType as CredentialType;
  const engineType = requestData?.engineType as EngineType;

  const baseMetadata: Pick<WorkflowMetadata, 'completeButtonText' | 'id' | 'dependencies' | 'title'> = {
    completeButtonText: 'Finish Setup',
    dependencies: ['authType', 'credentialType'],
    id: workflowId,
    title: '',
  };

  const baseAuthentication: WorkflowStepMetadata = {
    descriptionValues: ['username'],
    id: CREATE_DATASOURCE_STEP.authentication,
    nextButtonText: 'Test Credentials',
    remoteValidate: true,
    title: 'Authenticate',
    validationSuccessNextButtonText: 'Next',
  };
  const baseConfiguration: WorkflowStepMetadata = { id: CREATE_DATASOURCE_STEP.configure, title: 'Configure', descriptionValues: ['dataSourceType', 'name'], remoteValidate: true };
  const baseCredentialType: WorkflowStepMetadata = { id: CREATE_DATASOURCE_STEP.credentials, title: 'Type', descriptionValues: ['credentialType'], requiredMark: false, };
  const baseDataplanes: WorkflowStepMetadata = { id: CREATE_DATASOURCE_STEP.dataplanes, isOptional: true, title: 'Data Planes', requiredMark: false,  descriptionValues: ['dataPlanes'] };
  const basePermissions: WorkflowStepMetadata = { id: CREATE_DATASOURCE_STEP.permissions, title: 'Permissions', isOptional: true,  descriptionValues: ['permissionType'] };

  const getAuthStepMetadata = (): WorkflowStepMetadata => {
    const shouldSkipRemoteValidation =
      (!meta.isAdminUser && (
        isPassThroughAuthType(authenticationType) ||
        engineType === EngineType.Starburst
      )) ||
      (engineType === EngineType.Starburst && credentialType === CredentialType.Shared);

    if (shouldSkipRemoteValidation) {
      return {
        ...baseAuthentication,
        nextButtonText: undefined,
        remoteValidate: false,
        validationSuccessNextButtonText: undefined,
      };
    }

    if (meta.isAdminUser && credentialType === CredentialType.Individual) {
      const shouldShowSkipForNow = engineType !== EngineType.Starburst &&
        authenticationType !== AuthenticationType.OAuth &&
        authenticationType !== AuthenticationType.AWSIAMRoleWithUsername &&
        authenticationType !== AuthenticationType.AWSIAMRole;

      return {
        ...baseAuthentication,
        isOptional: true,
        nextButtonText: shouldShowSkipForNow ? 'Skip for now' : undefined,
        remoteValidate: false,
      };
    }

    return baseAuthentication;
  }

  return {
    ...baseMetadata,
    steps: [
      baseConfiguration,
      meta.isAdminPage ? baseCredentialType : null,
      getAuthStepMetadata(),
      basePermissions,
      (meta.isAdminPage && meta.flags?.hybridEnabled) ? baseDataplanes : null,
    ].filter(Boolean) as WorkflowStepMetadata[]
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPermissionStepResponse = async (authenticationType: AuthenticationType, credentialType: CredentialType, dataSourceType: DataSourceType, permissionType: Permission, projectId: string, meta: MetaRequestObject) => {
  const isEveryoneFieldConfig = {
    defaultValue: true,
    fieldType: FieldType.hidden,
    id: 'isEveryone',
    label: '',
    path: 'isEveryone',
  }

  const baseStep: Pick<WorkflowStep, 'dependencies' | 'layout'> = {
    dependencies: ['credentialType', 'permissionType'],
    layout: {
      elements: [
        {
          fieldType: FieldType.title,
          text: 'Domino Permissions',
        },
        {
          fieldType: FieldType.textblock,
          text: 'You can specify which users and organizations can view and use this data source in projects. Data access still requires valid individual or service account credentials.'
        },
      ]
    }
  }

  try {
    const user = await getCurrentUser({});

    const ownerInfo = {
      ownerId: user.id,
      ownerName: user.userName,
    }

    if (meta.isAdminUser) {
      const defaultValue = credentialType === CredentialType.Individual ? Permission.Everyone : Permission.Specific;

      if (permissionType === Permission.Everyone) {
        return {
          ...baseStep,
          layout: {
            elements: baseStep.layout.elements.concat([
              {
                ...PermissionTypeFieldConfig,
                defaultValue,
                options: [
                  PermissionTypeOptionEveryone,
                  PermissionTypeOptionSpecific,
                ]
              },
              isEveryoneFieldConfig,
            ])
          }
        }
      }

      return {
        ...baseStep,
        layout: {
          elements: baseStep.layout.elements.concat([
            {
              ...PermissionTypeFieldConfig,
              defaultValue,
              options: [
                PermissionTypeOptionEveryone,
                PermissionTypeOptionSpecific,
              ]
            },
            {
              ...UserAndOrgsFieldConfig,
              ...ownerInfo
            },
            {
              ...isEveryoneFieldConfig,
              defaultValue: false,
            }
          ])
        }
      }
    }

    return {
      ...baseStep,
      layout: {
        elements: baseStep.layout.elements.concat([
          PermissionTypeHiddenIndividualFieldConfig,
          {
            ...UserAndOrgsFieldConfig,
            ...ownerInfo
          },
          {
            ...isEveryoneFieldConfig,
            defaultValue: false,
          },
        ])
      }
    };
  } catch (e) {
    console.warn('uanble to fetch data');
  }

  return baseStep;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWorkflowStep = async (workflowId: string, stepId: string, requestData: RequestDataObject, meta: MetaRequestObject): Promise<WorkflowStep> => {
  const authenticationType = requestData?.authType as AuthenticationType;
  const credentialType = requestData?.credentialType as CredentialType;
  const dataSourceType = requestData?.dataSourceType as DataSourceType;
  const engineType = requestData?.engineType as EngineType;
  const permissionType = requestData?.permissionType as Permission;
  const projectId = requestData?.projectId as string;

  if (stepId === CREATE_DATASOURCE_STEP.authentication) {
    const authResp = await getAuthenticationStepResponse(authenticationType, credentialType, dataSourceType, meta);
    return authResp;
  }

  if (stepId === CREATE_DATASOURCE_STEP.configure) {
    return await getConfigureStepResponse(dataSourceType, meta);
  }

  if (stepId === CREATE_DATASOURCE_STEP.credentials) {
    return await getCredentialStepResponse(dataSourceType, engineType, meta);
  }

  if (stepId === CREATE_DATASOURCE_STEP.dataplanes) {
    return await getDataplaneStepResponse(dataSourceType, credentialType, engineType, requestData, meta);
  }

  if (stepId === CREATE_DATASOURCE_STEP.permissions) {
    const permissionResp =  await getPermissionStepResponse(authenticationType, credentialType, dataSourceType, permissionType, projectId, meta);
    return permissionResp;
  }

  throw new Error('No step found');
}

export const CreateDatasource = {
  getWorkflowMetadata,
  getWorkflowStep,
};
