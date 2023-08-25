import {
  DominoFeaturestoreApiCredentialConfigItem as CredentialConfigItem,
  DominoLayoutWebCompleteWorkflowRequest as CompleteWorkflowRequest,
} from '@domino/api/dist/types';
import {
  getCredentialConfigs,
} from '@domino/api/dist/Featurestore';
import { setUserEnvironmentVariables } from '@domino/api/dist/Users';

//import { WorkflowMetadata, WorkflowStep } from '../DynamicWizard.types';
import {
  OfflineStoreType,
  OnlineStoreType,
} from '../../../proxied-api/types';
import {
  BannerType,
  FieldStyle,
  FieldType,
  LayoutDirection,
} from '../../DynamicField';
import { WORKFLOW } from '../proxiedDynamicWizardApiCalls';
import {
  RequestDataObject
} from '../proxiedDynamicWizardApiCalls.types';
import { 
  OFFLINE_CONFIG_FIELDS,
  getOnlineStoreConfig,
} from './featureStoreSharedFields';

const STEP = {
  step1: 'step1',
  step2: 'step2',
}

const BANNER_FIELD = {
  fieldType: FieldType.banner,
  bannerType: BannerType.Info,
  message: 'These credentials will not be shared or used by anyone else'
};

export const OFFLINE_ENV_FIELD_NAMES = {
  [OfflineStoreType.BigQuery]: {
    gcpKeyJson: 'FEAST_BIGQUERY_KEY_JSON'
  },
  [OfflineStoreType.Redshift]: {
    user: 'FEAST_REDSHIFT_USER',
    awsAccessKey: 'AWS_ACCESS_KEY_ID',
    awsSecretKey: 'AWS_SECRET_ACCESS_KEY',
  },
  [OfflineStoreType.Snowflake]: {
    user: 'FEAST_SNOWFLAKE_USER',
    password: 'FEAST_SNOWFLAKE_PASSWORD'
  }
}

export const ONLINE_ENV_FIELD_NAMES = {
  [OnlineStoreType.Bigtable]: {
    gcpKeyJson: 'FEAST_BIGQUERY_KEY_JSON'
  },
  [OnlineStoreType.Datastore]: {
    gcpKeyJson: 'FEAST_BIGQUERY_KEY_JSON'
  },
  [OnlineStoreType.DynamoDB]: {
    awsAccessKey: 'AWS_ACCESS_KEY_ID',
    awsSecretKey: 'AWS_SECRET_ACCESS_KEY',
  },
  [OnlineStoreType.Redis]: {
    password: 'FEAST_REDIS_PASSWORD',
  },
  [OnlineStoreType.Snowflake]: {
    user: 'FEAST_SNOWFLAKE_ONLINE_USER',
    password: 'FEAST_SNOWFLAKE_ONLINE_PASSWORD'
  }
}

export const OFFLINE_ENV_FIELD = {
  [OfflineStoreType.BigQuery]: {
    gcpKeyJson: {
      fieldType: FieldType.textarea,
      label: 'json',
      isRequired: true,
    },
  },
  [OfflineStoreType.Redshift]: {
    user: {
      label: 'User',
      isRequired: true,
    },
    awsAccessKey: {
      label: 'Access Key',
      isRequired: true,
    },
    awsSecretKey: {
      label: 'Secret Access Key',
      isRequired: true,
    },
  },
  [OfflineStoreType.Snowflake]: {
    user: {
      label: 'Username',
      isRequired: true,
    },
    password: {
      fieldType: FieldType.password,
      label: 'Password',
      isRequired: true,
    },
  },
}

export const ONLINE_ENV_FIELD = {
  [OnlineStoreType.Bigtable]: {
    gcpKeyJson: {
      fieldType: FieldType.textarea,
      label: 'json',
      isRequired: true,
    }
  },
  [OnlineStoreType.Datastore]: {
    gcpKeyJson: {
      fieldType: FieldType.textarea,
      label: 'json',
      isRequired: true,
    },
  },
  [OnlineStoreType.DynamoDB]: {
    awsAccessKey: {
      label: 'Access Key',
      isRequired: true,
    },
    awsSecretKey: {
      label: 'Secret Access Key',
      isRequired: true,
    }
  },
  [OnlineStoreType.Redis]: {
    password: {
      fieldType: FieldType.password,
      label: 'Password',
      isRequired: true,
    },
  },
  [OnlineStoreType.Snowflake]: {
    user: {
      label: 'Username',
      isRequired: true,
    },
    password: {
      fieldType: FieldType.password,
      label: 'Password',
      isRequired: true,
    },
  }
};

const ENV_VAR_REGEX = new RegExp('^[A-Z_]+$');
const JSON_ENV_VAR_REGEX = new RegExp('_JSON$');

const transformData = (internalData: CompleteWorkflowRequest['data']): CompleteWorkflowRequest['data'] => {
  return Object.keys(internalData).reduce((memo, keyName) => {
    if (!ENV_VAR_REGEX.test(keyName)) {
      return memo;
    }

    const data = internalData[keyName];

    if (!JSON_ENV_VAR_REGEX.test(keyName)) {
      memo[keyName] = data;
      return memo;
    }

    memo[keyName] = JSON.stringify(JSON.parse(data as string || '{}'))
    return memo

  }, {}) as {};
};

const completeWorkflow = async (args: { body:  CompleteWorkflowRequest }) => {
  try {
    const data = transformData(args.body.data);
    await setUserEnvironmentVariables({
      body: data as {},
    });

    return {
      errors: [],
      success: true,
    };
  } catch (e) {
    return {
      errors: [e],
      success: false,
    };
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWorkflowMetadata = async (workflowId: string, requestData: RequestDataObject) => {
  const featureStoreId = requestData?.featureStoreId as string;

  try {
    const configs = await getCredentialConfigs({ featureStoreId });
    const hasOfflineStoreConfig = configs.offlineStoreCredentials.length >0;
    const hasOnlineStoreConfig = configs.onlineStoreCredentials.length > 0;

    return {
      dependencies: ['offlineStoreType', 'onlineStoreType'],
      id: WORKFLOW.addFeatureStoreCredentials,
      title: '',
      steps: [
        hasOfflineStoreConfig && {
          id: STEP.step1,
          title: 'Offline Data Store',
          descriptionValues: ['offlineStoreType']
        },
        hasOnlineStoreConfig && {
          id: STEP.step2,
          title: 'Online Data Store',
          descriptionValues: ['onlineStoreType']
        },
      ].filter(Boolean),
    }
  } catch (e) {
    console.warn(`Error fetching credential configs`, e);
    throw e;
  }
};

const getOfflineStoreEnvVars = (offlineStoreType?: OfflineStoreType, config?: CredentialConfigItem[]) => {
  const configFields = offlineStoreType ? OFFLINE_CONFIG_FIELDS[offlineStoreType]?.elements : [];

  const envFields = (config || []).map((configField) => {
    const offlineEnvField = OFFLINE_ENV_FIELD[offlineStoreType as OfflineStoreType]
    
    if (!offlineEnvField) {
      throw new Error(`Missing Offline Store config mapping for ${offlineStoreType}`)
    }
    const field = offlineEnvField[configField.name];

    if (!field) {
      throw new Error(`Missing field in ${offlineStoreType} ${configField.name}`);
    }

    return {
      ...field,
      path: configField.envVarKey,
    }
  });

  return {
    dependencies: ['offlineStoreType'],
    layout: {
      elements: [
        {
          arrange: LayoutDirection.row,
          fieldStyle: FieldStyle.LabelAndValue,
          immutable: true,
          elements: [
            ...(configFields || [])
          ]
        },
        ...envFields,
        BANNER_FIELD,
      ]
    }
  }
};

const getOnlineStoreEnvVars = (onlineStoreType?: OnlineStoreType, config?: CredentialConfigItem[], redisType?: string) => {
  const configFields = onlineStoreType ? getOnlineStoreConfig(onlineStoreType, redisType)?.elements : [];

  const envFields = (config || []).map((configField) => {
    const onlineEnvField = ONLINE_ENV_FIELD[onlineStoreType as OnlineStoreType];

    if (!onlineEnvField) {
      throw new Error(`Missing Online Store config mapping for ${onlineStoreType}`)
    }

    const field = onlineEnvField[configField.name];
    if (!field) {
      throw new Error(`Missing online field in ${onlineStoreType} for ${configField.name}`);
    }

    return {
      ...field,
      path: configField.envVarKey,
    }
  });

  return {
    dependencies: ['onlineStoreType'],
    layout: {
      elements: [
        {
          arrange: LayoutDirection.row,
          fieldStyle: FieldStyle.LabelAndValue,
          immutable: true,
          elements: [
            ...(configFields || [])
          ]
        },
        ...envFields,
        BANNER_FIELD,
      ]
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getWorkflowStep = async (workflowId: string, stepId: string, requestData: RequestDataObject) => {
  const featureStoreId = requestData?.featureStoreId as string;
  const offlineStoreType = requestData?.offlineStoreType as OfflineStoreType;
  const onlineStoreType = requestData?.onlineStoreType as OnlineStoreType;

  const onlineStoreConfig = requestData?.onlineStoreConfig as any;
  
  try {
    const configs = await getCredentialConfigs({ featureStoreId });

    switch (stepId) {
      case STEP.step1:
        return getOfflineStoreEnvVars(offlineStoreType, configs.offlineStoreCredentials);
      case STEP.step2:
        return getOnlineStoreEnvVars(onlineStoreType, configs.onlineStoreCredentials, onlineStoreConfig?.redisType);
      default:
        break;
    }

    throw new Error(`No Step found with id of ${stepId}`);
  } catch (e) {
    console.warn('Error getting workflow step', e);
    throw e;
  }
};

export const AddFeatureStoreCredentials = {
  completeWorkflow,
  getWorkflowMetadata,
  getWorkflowStep,
};
