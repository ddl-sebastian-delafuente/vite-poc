import {  
  DominoCommonModelsEnvironmentVariables as EnvironmentVariables
} from '@domino/api/dist/types';
import moment from 'moment';

import {
  OFFLINE_ENV_FIELD_NAMES,
  ONLINE_ENV_FIELD_NAMES,
} from '../../components/DynamicWizard/ProxiedRequestClientSideStaticData/AddFeatureStoreCredentials';
import { 
  OfflineStoreType, 
  OnlineStoreType,
} from '../../proxied-api/types';

export const getOffineStoreName = (offlineStoreType: OfflineStoreType) => {
  switch( offlineStoreType ) {
    case OfflineStoreType.BigQuery:
      return 'Big Query';
    case OfflineStoreType.File:
      return 'File';
    case OfflineStoreType.Redshift:
      return 'Redshift';
    case OfflineStoreType.Snowflake:
      return 'Snowflake';
    default:
      return '--';
  }
}

interface ExtractFeatureStoreEnvVarsReturn {
  offlineStoreEnvVars: { [key: string]: string };
  onlineStoreEnvVars: { [key: string]: string };
}
export const extractFeatureStoreEnvVars = (env: EnvironmentVariables, offlineStoreType: OfflineStoreType, onlineStoreType?: OnlineStoreType): ExtractFeatureStoreEnvVarsReturn => {
  const offlineStoreEnvVars = OFFLINE_ENV_FIELD_NAMES[offlineStoreType] || {};
  const onlineStoreEnvVars = ONLINE_ENV_FIELD_NAMES[onlineStoreType as OnlineStoreType] || {};

  const fieldNames = {
    offlineStoreEnvVars,
    onlineStoreEnvVars,
  }

  const hasFields =
    Object.keys(fieldNames.offlineStoreEnvVars).length > 0 ||
    Object.keys(fieldNames.onlineStoreEnvVars).length > 0;

  
  if (!hasFields) {
    return {
      offlineStoreEnvVars: {},
      onlineStoreEnvVars: {}
    };
  }

  const offlineStoreFieldNameArray = Object.values(fieldNames.offlineStoreEnvVars);
  const onlineStoreFieldNameArray = Object.values(fieldNames.onlineStoreEnvVars);
  return env.vars.reduce((memo, obj) => {
    if (offlineStoreFieldNameArray.indexOf(obj.name) > -1) {
      memo.offlineStoreEnvVars[obj.name] = obj.value;
      return memo;
    }

    if (onlineStoreFieldNameArray.indexOf(obj.name) > -1) {
      memo.onlineStoreEnvVars[obj.name] = obj.value;
      return memo;
    }

    return memo;
  }, {
    offlineStoreEnvVars: {},
    onlineStoreEnvVars: {}
  });
}

export const humanizeDurationTimestamp = (timestamp: number) => {
  const curTime = new Date();
  const duration = curTime.valueOf() - timestamp;
  return `${moment.duration(duration).humanize()} ago`;
}
