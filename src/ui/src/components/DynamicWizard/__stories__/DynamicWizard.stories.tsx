import {
  completeWorkflow,
  getAllOrganizations,
  getAuthConfigByType,
  getDataSourceConfigByType,
  getDataSourceConfigsNew,
  listUsers,
  validateStep,
} from '@domino/mocks/dist/mockStories';
import fetchMock from 'fetch-mock';
import * as React from 'react';

// @TODO refactor
import {
  getAllDataSourcesResponse,
} from '../../../data/data-sources/testUtil';
import { getDevStoryPath } from '../../../utils/storybookUtil';
import { FieldStyle } from '../../DynamicField';
import { DynamicWizard, DynamicWizardProps } from '../DynamicWizard';
import { WORKFLOW } from '../proxiedDynamicWizardApiCalls';

const [
  SnowflakeOAuth,
  SnowflakeBasic,
  RedshiftIAM,
  RedshiftBasic,
  S3IAM,
  S3Basic,
  MySQLIAM,
  MySQLBasic,
] = getAllDataSourcesResponse.map((dataSource) => {
  return {
    updateDataSourceConfiguration: {
      ...dataSource.config,
    },
    updateDataSourcePermissions: {
      ...dataSource.dataSourcePermissions,
    },
  }
});
const dataSources = {
  SnowflakeOAuth,
  SnowflakeBasic,
  RedshiftIAM,
  RedshiftBasic,
  S3IAM,
  S3Basic,
  MySQLIAM,
  MySQLBasic
};

type RequiredMark = boolean | 'optional';
const RequiredMarkOptions: RequiredMark[] = [ true, false, 'optional' ];

export default {
  title: getDevStoryPath('Components/Dynamic Wizard'),
  component: DynamicWizard,
  argTypes: {
    adminPage: { control: { type: 'boolean' } },
    apiFailCompleteWorkflow: { control: { type: 'boolean' } },
    apiFailValidation: { control: { type: 'boolean' } },
    antFormProps: { control: false },
    fieldStyle: {
      control: {
        type: 'select',
      },
      options: Object.values(FieldStyle),
    },
    initialData: {
      options: Object.keys(dataSources),
      mapping: dataSources,
      control: {
        type: 'select',
        labels: {
          SnowflakeOAuth: 'Snowflake (OAuth)',
          SnowflakeBasic: 'Snowflake (Basic)',
          RedshiftIAM: 'Redshift (IAM)',
          RedshiftBasic: 'Redshift (Basic)',
          S3IAM: 'S3 (IAM)',
          S3Basic: 'S3 (Basic)',
          MySQLIAM: 'MySQL (IAM)',
          MySQLBasic: 'MySQL (Basic)'
        },
      }
    },
    requiredMark: {
      control: { type: 'select' },
      options: RequiredMarkOptions,
    },
    workflowId: {
      control: {
        type: 'select',
      },
      options: Object.values(WORKFLOW)
    }
  },
  args: {
    adminPage: true,
    apiFailCompleteWorkflow: false,
    apiFailValidation: false,
    fieldStyle: FieldStyle.FormItem,
    initialData: {},
    workflowId: WORKFLOW.createDataSource,
    requiredMark: 'optional',
  },
}

interface TemplateProps extends DynamicWizardProps {
  apiFailCompleteWorkflow: boolean,
  apiFailValidation: boolean,
  requiredMark: RequiredMark,
}

const Template = ({
  apiFailCompleteWorkflow,
  apiFailValidation,
  requiredMark,
  initialData = {},
  workflowId,
  ...args
}: TemplateProps) => {
  const [reload, setReload] = React.useState<boolean>(false);

  React.useEffect(() => {
        fetchMock.restore()
          .mock(...completeWorkflow(!apiFailCompleteWorkflow))
          .mock(...getAllOrganizations())
          .mock(...getAuthConfigByType())
          .mock(...getDataSourceConfigByType())
          .mock(...getDataSourceConfigsNew())
          .mock(...listUsers())
          .mock(...validateStep(!apiFailValidation));

    if (reload) {
      setReload(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, setReload]);

  React.useEffect(() => {
    setReload(true);
  }, [apiFailCompleteWorkflow, apiFailValidation]);

  if (reload) {
    return <></>;
  }

  return (
    <DynamicWizard
      {...args}
      antFormProps={{
        requiredMark,
      }}
      initialData={initialData}
      workflowId={workflowId}
    />
  )
};

export const InteractiveExample = Template.bind({});
