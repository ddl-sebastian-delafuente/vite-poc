import * as React from 'react';
import { map } from 'ramda';
import styled from 'styled-components';
import Table from 'antd/lib/table';
import { Tooltip } from 'antd';
import { colors } from '../../styled';

const ContentTooltipContainer = styled.ul`
  width: 10rem;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  list-style-type: none;
`;

const ContentButton = styled.button`
  text-align: left;
  cursor: pointer;
  padding: 0.4rem 1rem;
  border: none;
  color: ${colors.lightGrey};
  background-color: transparent;
`;
interface ParametersTableData {
  version: DeploymentType;
  commitId: DeploymentType;
  note: string;
  deployed?: string;
  author: string;
  actions: ActionProps[];
}

interface DeploymentType {
  name: string;
  url: string;
}

interface LinkProps {
  link: DeploymentType;
}

interface ContentToolTipProps {
  data: ActionProps[];
}
export interface VersionTableProps {
  data: ParametersTableData[];
}

interface ActionProps {
  name: string;
  cta: () => void;
  disabled?: boolean;
}

const Link: React.FC<LinkProps> = ({ link }) => (
  <div>
    <a href={link.url}>{link.name}</a>
  </div>
);

const VersionsContentTooltip: React.FC<ContentToolTipProps> = ({ data }) => (
  <ContentTooltipContainer>
    {data &&
      map(
        ({ name, cta }) => (
          <ListItem key={`id_${name}`}>
            <ContentButton type="button" onClick={cta}>
              {name}
            </ContentButton>
          </ListItem>
        ),
        data
      )}
  </ContentTooltipContainer>
);

const columns = [
  {
    key: 'version',
    title: 'Version',
    dataIndex: 'version',
    render: (version: DeploymentType) => <Link link={version} />
  },
  {
    key: 'commitId',
    title: 'Commit ID',
    dataIndex: 'commitId',
    render: (commitId: DeploymentType) => <Link link={commitId} />
  },
  {
    key: 'note',
    title: 'Note',
    dataIndex: 'note'
  },
  {
    key: 'deployed',
    title: 'Deployed',
    dataIndex: 'deployed'
  },
  {
    key: 'author',
    title: 'Author',
    dataIndex: 'author'
  },
  {
    key: 'actions',
    title: '',
    dataIndex: 'actions',
    width: '4rem',
    render: (actions: ActionProps[]) => (
      <Tooltip
        arrowPointAtCenter
        placement="bottomRight"
        trigger="click"
        title={<VersionsContentTooltip data={actions} />}
        key="id">
        •••
      </Tooltip>
    )
  }
];

const VersionTable: React.FC<VersionTableProps> = ({ data }) => {
  const paginationConfig = {
    total: data?.length,
    defaultPageSize: 10
  };

  return <Table<ParametersTableData> columns={columns} dataSource={data} pagination={paginationConfig} rowKey="note" />;
};

export default VersionTable;
