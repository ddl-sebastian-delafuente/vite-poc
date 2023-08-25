import {
  dataSourceDtoADLS,
  dataSourceDtoBigQuery,
  dataSourceDtoGCS,
  dataSourceDtoGenericS3,
  dataSourceDtoIndividualSnowflake,
  dataSourceDtoMySQL,
  dataSourceDtoOracle,
  dataSourceDtoPostgreSQL,
  dataSourceDtoRedshift,
  dataSourceDtoS3,
  dataSourceDtoSQLServer,
} from '@domino/mocks/dist/mock-usecases/datasources'
import * as React from 'react';

import { DataSourceType } from '../../../src/data/data-sources/CommonData';
import { DataSourceConfigDetailsProps, DataSourceConfigDetails } from '../../../src/data/data-sources/DataSourceConfigDetails';
import { getDevStoryPath } from '../../../src/utils/storybookUtil';

const DataSources = {
  [DataSourceType.ADLSConfig]: dataSourceDtoADLS,
  [DataSourceType.BigQueryConfig]: dataSourceDtoBigQuery,
  [DataSourceType.GCSConfig]: dataSourceDtoGCS,
  [DataSourceType.GenericS3Config]: dataSourceDtoGenericS3,
  [DataSourceType.MySQLConfig]: dataSourceDtoMySQL,
  [DataSourceType.OracleConfig]: dataSourceDtoOracle,
  [DataSourceType.PostgreSQLConfig]: dataSourceDtoPostgreSQL,
  [DataSourceType.RedshiftConfig]: dataSourceDtoRedshift,
  [DataSourceType.S3Config]: dataSourceDtoS3,
  [DataSourceType.SQLServerConfig]: dataSourceDtoSQLServer,
  [DataSourceType.SnowflakeConfig]: dataSourceDtoIndividualSnowflake,
}


export default {
  title: getDevStoryPath('Develop/Data/Datasource/DataSourceConfigDetails'),
  component: DataSourceConfigDetails,
  argTypes: {
    config: { control: false },
    dataSourceType: { control: false },
    datasource: {
      options: Object.keys(DataSources),
      mapping: DataSources,
      control: {
        type: 'select'
      }
    },
    onChange: { control: false },
  },
  args: {
    editable: false,
  },
  parameters: {
    actions: { argTypesRegex: '^on.*' }
  }
};

interface TemplateProps extends DataSourceConfigDetailsProps {
  datasource: typeof dataSourceDtoS3,
} 

const Template = ({datasource, ...args}: TemplateProps) => {
  if (!datasource) {
    return <div/>;
  }

  return (
    <DataSourceConfigDetails {...args} config={datasource.config} dataSourceType={datasource.dataSourceType} />
  )
};

export const Interactive = Template.bind({});
