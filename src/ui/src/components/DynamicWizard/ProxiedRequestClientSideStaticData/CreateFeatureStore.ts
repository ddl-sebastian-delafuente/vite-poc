import * as Account from '@domino/api/dist/Accounts';
import {
  getOfflineStoreConfigByType,
  getOnlineStoreConfigByType,
} from '@domino/api/dist/Featurestore';
import {
  OfflineStoreType,
  OnlineStoreType,
} from '../../../proxied-api/types';
import {
  applyKeys,
  BannerType,
  FieldType,
  LayoutFieldMutable,
  mergeLayoutAndFieldMap,
  Option,
} from '../../DynamicField';
import { WorkflowMetadata, WorkflowStep } from '../DynamicWizard.types';
import { WORKFLOW } from '../proxiedDynamicWizardApiCalls';
import {
  RequestDataObject,
  MetaRequestObject,
} from '../proxiedDynamicWizardApiCalls.types';

const STEP_ID = {
  step1: 'Configure',
  step2: 'ConfigureOnlineStore',
  step3: 'step3',
}

export const OFFLINE_STORE_SPECIFIC_FIELDS = {
  [OfflineStoreType.BigQuery]: [],
  [OfflineStoreType.File]: [],
  [OfflineStoreType.Redshift]: [
    {
      isRequired: true,
      label: 'Database',
      path: 'database',
    },
    {
      isRequired: true,
      label: 'S3 Staging Location',
      path: 's3StagingLocation',
    },
    {
      isRequired: true,
      label: 'IAM Role',
      path: 'iamRole',
    },
    {
      isRequired: true,
      label: 'Cluster ID',
      path: 'clusterId',
    },
    {
      isRequired: true,
      label: 'Region',
      path: 'region'
    }
  ],
  [OfflineStoreType.Snowflake]: [
    {
      isRequired: true,
      label: 'Account Name',
      path: 'accountId',
    },
    {
      isRequired: true,
      label: 'Database',
      path: 'database',
    },
    {
      isRequired: true,
      label: 'Warehouse',
      path: 'warehouse',
    },
    {
      isRequired: true,
      label: 'Role',
      path: 'role',
    },
  ],
}

export const getOnlineSpecificFields = ({
  onlineStoreType,
  redisType,
}: {
  onlineStoreType?: OnlineStoreType,
  redisType?: string,
}) => {
  const isRedisCluster = redisType === 'redis_cluster';
  const FIELDS = {
    [OnlineStoreType.Bigtable]: [
      {
        isRequired: true,
        label: 'Instance',
        path: 'instance',
      }
    ],
    [OnlineStoreType.Datastore]: [],
    [OnlineStoreType.DynamoDB]: [
      {
        isRequired: true,
        label: 'Region',
        path: 'region',
      }
    ],
    [OnlineStoreType.Redis]: [
      {
        defaultValue: 'redis',
        fieldType: FieldType.radio,
        isRequired: true,
        label: 'Redis Type',
        options: [
          { label: 'Redis', value: 'redis' },
          { label: 'Redis Cluster', value: 'redis_cluster' },
        ],
        path: 'redisType',
      },
      {
        fieldType: FieldType.hostPort,
        multiple: isRedisCluster,
        label: isRedisCluster ? 'Hosts' : 'Host',
        path: 'redis'
      },
      {
        defaultValue: true,
        fieldType: FieldType.checkbox,
        label: 'Enable SSL',
        path: 'sslEnabled',
      }
    ],
    [OnlineStoreType.SQLite]: [],
    [OnlineStoreType.Snowflake]: [
      {
        isRequired: true,
        label: 'Account Name',
        path: 'accountId',
      },
      {
        isRequired: true,
        label: 'Database',
        path: 'database',
      },
      {
        isRequired: true,
        label: 'Warehouse',
        path: 'warehouse',
      },
      {
        isRequired: true,
        label: 'Role',
        path: 'role',
      },
    ],
  }

 return (FIELDS[onlineStoreType as OnlineStoreType] || []) as LayoutFieldMutable[];
}

const getWorkflowMetadata = () => {
  return new Promise<WorkflowMetadata>((resolve) => resolve({
    completeButtonText: 'Set Up Feature Store',
    dependencies: [],
    id: WORKFLOW.createFeatureStore,
    title: '',
    steps: [
      {
        id: STEP_ID.step1,
        title: 'Offline Data Store',
        descriptionValues: ['offlineStoreType'],
        remoteValidate: true,
      },
      {
        id: STEP_ID.step2,
        title: 'Online Data Store',
        descriptionValues: ['onlineStoreType'],
        remoteValidate: true,
      },
      {
        id: STEP_ID.step3,
        title: 'Git Repo'
      },
    ]
  }));
}

const getConfigureStepResponse = async (requestData: RequestDataObject) => {
  const offlineStoreType = requestData?.offlineStoreType as OfflineStoreType;

  const baseStep: WorkflowStep = {
    dependencies: ['offlineStoreType'],
    layout: {
      elements: [
        {
          fieldType: FieldType.title,
          text: 'Offline Data Store Details',
        },
        {
          fieldType: FieldType.textblock,
          text: 'Offline stores are where you store your features. They contain historical features that you can use for analysis or training.'
        },
        {
          fieldType: FieldType.select,
          hasIcon: true,
          id: 'offlineStoreType',
          isRequired: true,
          label: 'Offline Data Source',
          path: 'offlineStoreType',
        },
      ]
    }
  };

  if (!offlineStoreType) {
    return baseStep;
  }

  // Fetch the config
  const config = await getOfflineStoreConfigByType({ offlineStoreType });
  const configSpecificFields = applyKeys(OFFLINE_STORE_SPECIFIC_FIELDS[offlineStoreType] || [], offlineStoreType);
  const configSpecificFieldsMerged = mergeLayoutAndFieldMap({ elements: configSpecificFields }, config?.fields || {});

  return {
    ...baseStep,
    layout: {
      ...baseStep.layout,
      elements: baseStep.layout.elements.concat(configSpecificFieldsMerged.elements, []),
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getGitConfigureStepResponse = async (requestData: RequestDataObject, meta: MetaRequestObject) => {
  const { gitServiceProvider }  = requestData;
  const step: WorkflowStep = {
    dependencies: ['gitServiceProvider'],
    layout: {
      elements: []
    }
  };

  const baseStep = {
    ...step,
    layout: {
      ...step.layout,
      elements: [
        {
          fieldType: FieldType.title,
          text: 'Git Repository Details',
        },
        {
          fieldType: FieldType.textblock,
          text: 'The Git repository is the centralized repository that contains all of the feature development code and feature store metadata.'
        },
      ],
    }
  }

  try {
    const credentials = gitServiceProvider ? await Account.getGitCredentials({ userId: meta.userId || '' }) : [];

    const options = credentials.reduce((memo, { id, name, ...rest }) => {
      if (gitServiceProvider !== rest.gitServiceProvider) {
        return memo;
      }

      memo.push({
        label: name,
        value: id,
      })

      return memo;
    }, [] as Option[]);

    const gitOptions = {
      elements: [
        {
          fieldType: FieldType.select,
          hasIcon: true,
          id: 'gitProvider',
          isRequired: true,
          label: 'Git Service Provider',
          path: 'gitServiceProvider'
        },
        {
          fieldType: FieldType.select,
          isRequired: true,
          label: 'Git Credentials',
          options,
          path: 'gitCredentialId'
        },
      ]
    };

    return {
      ...baseStep,
      layout: {
        ...baseStep.layout,
        elements: [
          ...baseStep.layout.elements,
          gitOptions,
          options.length === 0 ? {
            bannerType: BannerType.Warning,
            fieldType: FieldType.banner,
            id: 'featureStoreMissingCredentialsMessage',
            message: ''
          } : {
            isRequired: true,
            label: 'Git Repository URL',
            path: 'gitRepo',
          }
        ]
      }
    }
  } catch (e) {
    console.warn(e);

    return baseStep;
  }
}

const getOnlineStoreConfig = (onlineStoreType?: OnlineStoreType, redisType?: string) => {
  return getOnlineSpecificFields({ onlineStoreType, redisType });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getOnlineStoreStepResponse = async (requestData: RequestDataObject) => {
  const onlineStoreType = requestData?.onlineStoreType as OnlineStoreType;
  const redisTypeOnline = requestData?.redisTypeOnline as string;

  const baseStep: WorkflowStep = {
    dependencies: ['onlineStoreType', 'redisTypeOnline'],
    layout: {
      elements: [
        {
          fieldType: FieldType.title,
          text: 'Online Data Store Details',
        },
        {
          defaultValue: OnlineStoreType.SQLite,
          fieldType: FieldType.select,
          id: 'onlineStoreType',
          isRequired: true,
          label: 'Online Data Source',
          path: 'onlineStoreType',
        },
      ]
    }
  };

  const hasNoAdditionalConfig =
    !onlineStoreType ||
    onlineStoreType === OnlineStoreType.Datastore ||
    onlineStoreType === OnlineStoreType.SQLite;

  if (hasNoAdditionalConfig) {
    return baseStep;
  }

  try {
    const config = await getOnlineStoreConfigByType({ onlineStoreType });
    const additionalConfig = getOnlineStoreConfig(onlineStoreType, redisTypeOnline);
    const configSpecificFieldsMerged = mergeLayoutAndFieldMap({ elements: additionalConfig }, config?.fields || {});

    return {
      ...baseStep,
      layout: {
        ...baseStep.layout,
        elements: [
          ...baseStep.layout.elements,
          ...configSpecificFieldsMerged.elements.map((field) => {
            return {
              ...field,
              path: `${(field as LayoutFieldMutable).path}Online`,
            };
          }),
        ]
      }
    };
  } catch (e) {
    console.warn('Failed to fetch online store fields', e);
    return baseStep;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWorkflowStep = async (workflowId: string, stepId: string, requestData: RequestDataObject, meta: MetaRequestObject) => {
  switch (stepId) {
    case STEP_ID.step1:
      return getConfigureStepResponse(requestData);
    case STEP_ID.step2:
      return getOnlineStoreStepResponse(requestData);
    case STEP_ID.step3:
      return getGitConfigureStepResponse(requestData, meta);
    default:
      break;
  }

  throw new Error('No step found');
}

export const CreateFeatureStore = {
  getWorkflowMetadata,
  getWorkflowStep,
}
