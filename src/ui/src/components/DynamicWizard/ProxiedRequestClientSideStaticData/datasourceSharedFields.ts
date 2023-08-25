import {
  AuthenticationType,
  CredentialType,
  Permission
} from '../../../data/data-sources/CommonData';
import {
  BannerType,
  ButtonAction,
  FieldType,
  LayoutField,
  Orientation,
  Option,
} from '../../DynamicField';

export const AccountNameFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Account Name',
  path: 'accountName',
}

export const AccountIDFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Account ID',
  path: 'accountID',
}

export const AccessKeyIDFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Access Key ID',
  path: 'accessKeyID',
};

export const AccessKeyFieldConfig: Readonly<LayoutField> = {
  fieldType: FieldType.textarea,
  isRequired: true,
  label: 'Access Key',
  path: 'accessKey',
};

export const AuthenticationTypeFieldConfig: Readonly<LayoutField> = {
  defaultValue: AuthenticationType.OAuth,
  fieldType: FieldType.radio,
  label: '',
  id: 'authType',
  path: 'authType',
}

export const AuthenticationTypeHiddenFieldConfig: Readonly<LayoutField> = {
  fieldType: FieldType.hidden,
  label: '',
  id: 'authType',
  path: 'authType',
}

export const AuthBannerAWSIRole: Readonly<LayoutField> = {
  bannerType: BannerType.Success,
  fieldType: FieldType.banner,
  id: 'iam-credentials-configured',
  message: 'Your IAM credentials are already configured with Domino. You can choose the AWS role at the time of execution',
}

export const AuthBannerCredentialsHidden: Readonly<LayoutField> = {
  bannerType: BannerType.Warning,
  fieldType: FieldType.banner,
  id: 'credentials-stored-securely-hidden',
  message: 'These credentials are stored securely and cannot be viewed or copied by users.'
}

export const AuthBannerCredentialsSecure: Readonly<LayoutField> = {
  bannerType: BannerType.Info,
  fieldType: FieldType.banner,
  id: 'credentials-stored-securely',
  message: 'These credentials are securely stored and can only be used by you.'
}

export const AuthBannerCredentialsValidated: Readonly<LayoutField> = {
  bannerType: BannerType.Success,
  fieldType: FieldType.banner,
  id: 'credentials-validated',
  message: 'Your Data Source was successfully authenticated and set up.'
}

export const AuthBannerOAuth: Readonly<LayoutField> = {
  bannerType: BannerType.Success,
  fieldType: FieldType.banner,
  id: 'oauth-credentials-configured',
  message: 'Authentication is already configured with Domino.'
}

export const AuthTextblockAuthSelector: Readonly<LayoutField> = {
  fieldType: FieldType.textblock,
  text: 'Please choose the method you\'d like to use for authentication'
}

export const AuthTextblockIndividualAccountsAdmins: Readonly<LayoutField> = {
  fieldType: FieldType.textblock,
  text: 'Valid credentials are required to retrieve data through this data source. Credentials can be added later.'
}

export const AuthTextblockIndividualAccounts: Readonly<LayoutField> = {
  fieldType: FieldType.textblock,
  text: 'Please enter your credentials to verify that the connector is set up successfully. Valid credentials are required to retrieve data through this data source.'
}

export const AuthTextblockServiceAccounts: Readonly<LayoutField> = {
  fieldType: FieldType.textblock,
  text: 'Please enter the service account credentials that users with Domino permissions to this data source will use for authentication.'
}

export const CredentialTypeHiddenFieldConfig: Readonly<LayoutField> = {
  defaultValue: CredentialType.Individual,
  fieldType: FieldType.hidden,
  label: '',
  path: 'credentialType',

}

export const BucketFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Bucket',
  path: 'bucket',
}

export const CatalogCodeFieldConfig: Readonly<LayoutField> = {
  fieldType: FieldType.textarea,
  isRequired: true,
  label: 'Configuration Properties',
  path: 'catalogCode',
}

export const CatalogFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Catalog',
  path: 'catalog',
}

export const CredentialTypeFieldConfig: Readonly<LayoutField> = {
  defaultValue: CredentialType.Individual,
  fieldType: FieldType.radio,
  id: 'credentialType',
  label: '',
  orientation: Orientation.vertical,
  path: 'credentialType',
}

export const DatabaseFieldConfig: Readonly<LayoutField> = {
  label: 'Database',
  path: 'database',
}

export const DataplanesSelectorFieldConfig: Readonly<LayoutField> = {
  fieldType: FieldType.dataplane,
  id: 'dataPlanes',
  label: 'Dataplanes Label',
  path: 'dataPlanes',
}

export const DataplanesUseAllHiddenFieldConfig: Readonly<LayoutField> = {
  defaultValue: false,
  fieldType: FieldType.hidden,
  label: '',
  path: 'useAllDataPlanes',
}

export const DataplanesUseAllFieldConfig: Readonly<LayoutField> = {
  defaultValue: true,
  label: '',
  fieldType: FieldType.radio,
  options: [
    { label: 'Use All Dataplanes', value: true },
    { label: 'Select specific data planes', value: false },
  ],
  path: 'useAllDataPlanes'
}

export const DataSourceDescriptionFieldConfig: Readonly<LayoutField> = {
  fieldType: FieldType.textarea,
  height: 2,
  label: 'Data Source Description',
  path: 'description',
  placeholder: 'A clear description helps others understand the purpose of this data source',
}

export const DataSourceNameFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Data Source Name',
  path: 'name',
  placeholder: 'The name you will use to refer to your data source within Domino',
  regexp: '^[a-zA-Z0-9_.-]+$',
  regexpError: 'Please input a valid Data Source Name. Only letter, numbers, underscore, period and hyphens are allowed.',
}

export const DataSourceTypeFieldConfig: Readonly<LayoutField> = {
  fieldType: FieldType.select,
  hasIcon: true,
  id: 'dataSourceType',
  isRequired: true,
  label: 'Select Data Store',
  path: 'dataSourceType',
  placeholder: 'Select a data store',
  showSearch: true
}

export const EngineTypeHiddenFieldConfig: Readonly<LayoutField> = {
  fieldType: FieldType.hidden,
  label: '',
  id: 'engineType',
  path: 'engineType',
}

export const HostFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Host',
  path: 'host',
}

export const PasswordFieldConfig: Readonly<LayoutField> = {
  fieldType: FieldType.password,
  isRequired: true,
  label: 'Password',
  path: 'password',
};

export const PermissionTypeHiddenIndividualFieldConfig: Readonly<LayoutField> = {
  defaultValue: Permission.Specific,
  fieldType: FieldType.hidden,
  label: '',
  hasFieldOptions: true,
  path: 'permissionType',
}

export const PermissionTypeFieldConfig: Readonly<LayoutField> = {
  defaultValue: Permission.Specific,
  fieldType: FieldType.radio,
  id: 'permissionType',
  label: '',
  orientation: Orientation.vertical,
  path: 'permissionType',
}

export const PortFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Port',
  path: 'port',
}

export const PortRedshiftFieldConfig: Readonly<LayoutField> = {
  ...PortFieldConfig,
  defaultValue: '5439',
  isRequired: true,
  label: 'Port',
  path: 'port',
}

export const PrivateKeyFieldConfig: Readonly<LayoutField> = {
  fieldType: FieldType.textarea,
  isRequired: true,
  label: 'Private Key (JSON format)',
  regexpError: 'Please input a valid private key (JSON format)',
  path: 'privateKey',
};

export const ProjectFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Project',
  path: 'project',
  placeholder: 'The project will be inferred from the private key if left empty',
}

export const RegionFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Region',
  path: 'region',
}

export const RoleFieldConfig: Readonly<LayoutField> = {
  label: 'Role',
  path: 'role',
}

export const SchemaFieldConfig: Readonly<LayoutField> = {
  label: 'Schema',
  path: 'schema',
}

export const SecretAccessKeyFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Secret Access Key',
  path: 'secretAccessKey',
};

export const TestCredentialsButtonFieldConfig: Readonly<LayoutField> = {
  action: ButtonAction.validateStep,
  fieldType: FieldType.button,
  label: 'Test Credentials',
}

export const TokenFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Token',
  path: 'token',
};

export const UserAndOrgsFieldConfig: Readonly<LayoutField> = {
  fieldType: FieldType.usersAndOrgs,
  label: 'User Permissions',
  path: 'userIds',
}

export const UsernameFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Username',
  path: 'username',
};

export const WarehouseFieldConfig: Readonly<LayoutField> = {
  label: 'Warehouse',
  path: 'warehouse',
}

export const ClientIdFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  label: 'Client ID',
  path: 'clientId',
};

export const ClientSecretFieldConfig: Readonly<LayoutField> = {
  isRequired: true,
  fieldType: FieldType.password,
  label: 'Client Secret',
  path: 'clientSecret',
};

export const SQLFieldGroup = [
  HostFieldConfig,
  PortFieldConfig,
  DatabaseFieldConfig,
]

export const CredentialTypeOptionIndividual: Readonly<Option> = {
  label: 'Individual',
  subLabel: 'Each user will authenticate with individual credentials provided by them.',
  value: CredentialType.Individual
}

export const CredentialTypeOptionShared: Readonly<Option> = {
  label: 'Service Account',
  subLabel: 'Each user will authenticate with shared credentials provided by you. Users cannot view the actual credentials.',
  value: CredentialType.Shared
};

export const PermissionTypeOptionEveryone: Readonly<Option> = {
  label: Permission.Everyone,
  value: Permission.Everyone,
}

export const PermissionTypeOptionOnlyMe: Readonly<Option> = {
  label: Permission.OnlyMe,
  value: Permission.OnlyMe,
}

export const PermissionTypeOptionSpecific: Readonly<Option> = {
  label: 'Specific users or organizations',
  value: Permission.Specific
}
