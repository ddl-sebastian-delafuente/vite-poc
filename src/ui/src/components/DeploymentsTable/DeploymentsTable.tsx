import * as React from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import DeploymentsDeployment from './DeploymentsDeployment';
import DeploymentsProject from './DeploymentsProject';
import DeploymentsPredictions from './DeploymentsPredictions';
import DeploymentsHosted from './DeploymentsHosted';
import { colors } from '../../styled';
import Table from 'antd/lib/table';
import styled from 'styled-components';
import moment from 'moment';

const Icon = styled.div`
  left: 0;
  right: 0;
  margin: auto;
  min-height: 1.4rem;
  max-width: 1.4rem;
  border-radius: 2rem;
  text-align: center;
`;

interface DeploymentType {
  name: string;
  url: string;
}

interface HostedType {
  name: string;
  description?: string;
}

interface ParametersTableData {
  deployment?: DeploymentType;
  project?: DeploymentType;
  predictions: string | number;
  drift?: number | string | undefined;
  quality?: number | string | undefined;
  hosted: HostedType;
  lastModified?: Date;
}
export interface DeploymentsTableProps {
  data: ParametersTableData[];
}

const selectLogo = (phase?: number | string | undefined) => {
  let logo;
  switch (phase) {
    case 0:
      logo = (
        <Icon>
          <CheckCircleFilled style={{ fontSize: '22px', color: colors.mantis }}/>
        </Icon>
      );
      break;
    case undefined:
    case null:
    case '-':
    case '--':
      logo = <Icon style={{ background: `${colors.silverGrayLighter}`, color: `${colors.silverGrayLighter}` }}>.</Icon>;
      break;
    default:
      logo = <Icon style={{ background: `${colors.error}`, color: `${colors.white}` }}>{phase}</Icon>;
  }
  return logo;
};

const columns = [
  {
    key: 'deployment',
    title: 'Deployment',
    dataIndex: 'deployment',
    render: (deployment: DeploymentType) => <DeploymentsDeployment deployment={deployment} />
  },
  {
    key: 'project',
    title: 'Project',
    dataIndex: 'project',
    render: (project: DeploymentType) => <DeploymentsProject project={project} />
  },
  {
    key: 'predictions',
    title: 'Predictions / Last 7 days',
    dataIndex: 'predictions',
    width: '14rem',
    render: (predictions: string | number) => <DeploymentsPredictions predictions={predictions} />
  },
  {
    key: 'drift',
    title: 'Drift',
    dataIndex: 'drift',
    width: '4rem',
    render: (drift: number | string | undefined) => <div>{selectLogo(drift)}</div>
  },
  {
    key: 'quality',
    title: 'Model Quality',
    dataIndex: 'quality',
    width: '8rem',
    render: (quality: number | string | undefined) => <div>{selectLogo(quality)}</div>
  },
  {
    key: 'hosted',
    title: 'Hosted By',
    dataIndex: 'hosted',
    render: (hosted: HostedType) => <DeploymentsHosted hosted={hosted} />
  },
  {
    key: 'lastModified',
    title: 'Modified',
    dataIndex: 'lastModified',
    render: (lastModified: Date) => <span>{moment(lastModified).fromNow()}</span>
  }
];

const DeploymentsTable: React.FC<DeploymentsTableProps> = ({ data }) => {
  const paginationConfig = {
    total: data?.length,
    defaultPageSize: 10
  };

  return (
    <Table<ParametersTableData>
      size="small"
      columns={columns}
      dataSource={data}
      pagination={paginationConfig}
      rowKey="predictions"
    />
  );
};

export default DeploymentsTable;
