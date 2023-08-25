import {
  DominoDatasourceApiDataSourceDto as DataSourceDto,
} from '@domino/api/dist/types';
import * as React from 'react';

import {
  DynamicFieldDisplay,
  Layout,
  LayoutFieldFactoryProps,
} from '../../components/DynamicField';
import {
  AccountNameFieldConfig,
  AccountIDFieldConfig,
  BucketFieldConfig,
  CatalogCodeFieldConfig,
  CatalogFieldConfig,
  DatabaseFieldConfig,
  HostFieldConfig,
  PortFieldConfig,
  PortRedshiftFieldConfig,
  ProjectFieldConfig,
  RegionFieldConfig,
  RoleFieldConfig,
  SQLFieldGroup,
  SchemaFieldConfig,
  WarehouseFieldConfig,
} from '../../components/DynamicWizard/ProxiedRequestClientSideStaticData/datasourceSharedFields';
import { DataSourceType } from './CommonData';


export interface DataSourceConfigDetailsProps extends
  Pick<DataSourceDto, 'config' | 'dataSourceType'>,
  Pick<LayoutFieldFactoryProps, 'editable' | 'onChange'>  {}

type DatasourceConfigLayouts = {
  [key: string]: Layout;
}

const JDBC_LAYOUT: Layout = {
  elements: [
    {
      elements: [
        CatalogCodeFieldConfig
      ]
    },
  ]
};

const SQL_LAYOUT: Layout = {
  elements: [
    {
      elements: SQLFieldGroup
    },
  ]
};
// TODO move pull this from backend

/* istanbul ignore next */
const DATASOURCE_CONFIG_LAYOUTS: Readonly<DatasourceConfigLayouts> = {
  [DataSourceType.ADLSConfig]: {
    elements: [
      {
        elements: [
          AccountNameFieldConfig,
          BucketFieldConfig,
        ]
      },
    ]
  },
  [DataSourceType.BigQueryConfig]: {
    elements: [
      {
        elements: [
          ProjectFieldConfig,
        ]
      },
    ]
  },
  [DataSourceType.ClickHouseConfig]: JDBC_LAYOUT,
  [DataSourceType.DB2Config]: JDBC_LAYOUT,
  [DataSourceType.DruidConfig]: JDBC_LAYOUT,
  [DataSourceType.GCSConfig]: {
    elements: [
      {
        elements: [
          BucketFieldConfig,
        ]
      },
    ]
  },
  [DataSourceType.GenericJDBCConfig]: JDBC_LAYOUT,
  [DataSourceType.GenericS3Config]: {
    elements: [
      {
        elements: [
          BucketFieldConfig,
          HostFieldConfig,
        ]
      },
    ]
  },
  [DataSourceType.GreenplumConfig]: JDBC_LAYOUT,
  [DataSourceType.IgniteConfig]: JDBC_LAYOUT,
  [DataSourceType.MariaDBConfig]: JDBC_LAYOUT,
  [DataSourceType.MongoDBConfig]: {
    elements: [
      {
        elements: [
          HostFieldConfig,
          PortFieldConfig,
        ]
      },
    ]
  },
  [DataSourceType.MySQLConfig]: SQL_LAYOUT,
  [DataSourceType.NetezzaConfig]: JDBC_LAYOUT,
  [DataSourceType.OracleConfig]: SQL_LAYOUT,
  [DataSourceType.PalantirConfig]: {
    elements: [
      {
        elements: [
          HostFieldConfig,
          PortFieldConfig,
        ]
      },
    ]
  },
  [DataSourceType.PostgreSQLConfig]: SQL_LAYOUT,
  [DataSourceType.RedshiftConfig]: {
    elements: [
      {
        elements: [
          HostFieldConfig,
          PortRedshiftFieldConfig,
          DatabaseFieldConfig,
        ]
      },
    ]
  },
  [DataSourceType.S3Config]: {
    elements: [
      {
        elements: [
          BucketFieldConfig,
          RegionFieldConfig,
        ]
      },
    ]
  },
  [DataSourceType.SAPHanaConfig]: JDBC_LAYOUT,
  [DataSourceType.SingleStoreConfig]: JDBC_LAYOUT,
  [DataSourceType.SnowflakeConfig]: {
    elements: [
      {
        elements: [
          AccountNameFieldConfig,
          DatabaseFieldConfig,
          SchemaFieldConfig,
        ]
      },
      {
        elements: [
          WarehouseFieldConfig,
          RoleFieldConfig,
        ]
      },
    ]
  },
  [DataSourceType.SQLServerConfig]: SQL_LAYOUT,
  [DataSourceType.SynapseConfig]: JDBC_LAYOUT,
  [DataSourceType.TabularS3GlueConfig]: {
    elements: [
      {
        elements: [
          AccountIDFieldConfig,
          DatabaseFieldConfig,
          RegionFieldConfig,
        ]
      },
    ]
},
  [DataSourceType.TeradataConfig]: {
    elements: [
      {
        elements: [
          HostFieldConfig,
        ]
      },
    ]
  },
  [DataSourceType.TrinoConfig]: {
    elements: [
      {
        elements: [
          HostFieldConfig,
          PortFieldConfig,
        ]
      },
      {
        elements: [
          CatalogFieldConfig,
          SchemaFieldConfig,
        ]
      },
    ]
  },
  [DataSourceType.VerticaConfig]: JDBC_LAYOUT,
};

export const DataSourceConfigDetails = (props: DataSourceConfigDetailsProps) => {
  const { config, dataSourceType, editable, onChange } = props;
  const layout: Layout = DATASOURCE_CONFIG_LAYOUTS[dataSourceType] || { elements: [] };

  return (
    <DynamicFieldDisplay
      data={config}
      editable={editable}
      layout={layout}
      onChange={onChange}
      testIdPrefix="datasource"
    />
  )
};
