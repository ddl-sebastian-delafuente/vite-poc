import {
  OfflineStoreType,
  OnlineStoreType,
} from '../../../proxied-api/types';
import {
  FieldType,
  LayoutDirection,
} from '../../DynamicField';

const DESCRIPTION_FIELD = {
  fieldType: FieldType.textblock,
  text: 'Feature store requires a data store where your features are stored. To enable feature store, please provide your credentials for the following store.',
};

const OFFLINE_DATASTORE_FIELD = {
  fieldType: FieldType.select,
  hasIcon: true,
  id: 'offlineStoreType',
  label: 'Offline Data Store',
  path: 'offlineStoreType',
}

const ONLINE_DATASTORE_FIELD = {
  fieldType: FieldType.select,
  hasIcon: true,
  id: 'onlineStoreType',
  label: 'Online Data Store',
  path: 'onlineStoreType',
}

export const OFFLINE_CONFIG_FIELDS = {
  [OfflineStoreType.BigQuery]: {
    elements: [
      DESCRIPTION_FIELD,
      {
        arrange: LayoutDirection.row,
        elements: [
          OFFLINE_DATASTORE_FIELD,
        ]
      }
    ]
  },
  [OfflineStoreType.File]: {
    elements: [
      DESCRIPTION_FIELD,
      {
        arrange: LayoutDirection.row,
        elements: [
          OFFLINE_DATASTORE_FIELD,
        ]
      }
    ]
  },
  [OfflineStoreType.Redshift]: {
    elements: [
      DESCRIPTION_FIELD,
      {
        arrange: LayoutDirection.row,
        elements: [
          OFFLINE_DATASTORE_FIELD,
          {
            label: 'Region',
            path: 'offlineStoreConfig.region'
          },
          {
            label: 'Cluster ID',
            path: 'offlineStoreConfig.clusterId'
          },
          {
            label: 'Database',
            path: 'offlineStoreConfig.database'
          },
        ]
      }
    ]
  },
  [OfflineStoreType.Snowflake]: {
    elements: [
      DESCRIPTION_FIELD,
      {
        arrange: LayoutDirection.row,
        elements: [
          OFFLINE_DATASTORE_FIELD,
          {
            label: 'Account Name',
            path: 'offlineStoreConfig.accountId'
          },
          {
            label: 'Database',
            path: 'offlineStoreConfig.database'
          }
        ]
      }
    ]
  },
};

export const getOnlineStoreConfig = (onlineStoreType: OnlineStoreType, redisType?: string) => {
  const CONFIGS = {
    [OnlineStoreType.Bigtable]: {
      elements: [
        DESCRIPTION_FIELD,
        {
          arrange: LayoutDirection.row,
          elements: [
            ONLINE_DATASTORE_FIELD,
            {
              label: 'Instance',
              path: 'onlineStoreConfig.instance'
            }
          ]
        }
      ]
    },
    [OnlineStoreType.Datastore]: {
      elements: [
        DESCRIPTION_FIELD,
        {
          arrange: LayoutDirection.row,
          elements: [
            ONLINE_DATASTORE_FIELD,
          ]
        }
      ]
    },
    [OnlineStoreType.DynamoDB]: {
      elements: [
        DESCRIPTION_FIELD,
        {
          arrange: LayoutDirection.row,
          elements: [
            ONLINE_DATASTORE_FIELD,
            {
              label: 'Region',
              path: 'onlineStoreConfig.region'
            }
          ]
        }
      ]
    },
    [OnlineStoreType.Redis]: {
      elements: [
        DESCRIPTION_FIELD,
        {
          arrange: LayoutDirection.row,
          elements: [
            ONLINE_DATASTORE_FIELD,
            {
              label: 'Redis Type',
              path: 'onlineStoreConfig.redisType',
            },
            {
              fieldType: FieldType.hostPort,
              multiple: redisType === 'redis_custer',
              label: redisType === 'redis_custer' ? 'Hosts' : 'Host',
              path: 'onlineStoreConfig.redis',
              
            }
          ]
        }
      ]
    },
    [OnlineStoreType.SQLite]: {
      elements: [
        DESCRIPTION_FIELD,
        {
          arrange: LayoutDirection.row,
          elements: [
            ONLINE_DATASTORE_FIELD,
          ]
        }
      ]
    },
    [OnlineStoreType.Snowflake]: {
      elements: [
        DESCRIPTION_FIELD,
        {
          arrange: LayoutDirection.row,
          elements: [
            ONLINE_DATASTORE_FIELD,
            {
              label: 'Account Name',
              path: 'onlineStoreConfig.accountId'
            },
            {
              label: 'Database',
              path: 'onlineStoreConfig.database'
            }
          ]
        }
      ]
    },
  }

  return CONFIGS[onlineStoreType];
}
