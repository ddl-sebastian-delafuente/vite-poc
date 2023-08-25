import React, { ReactElement } from 'react'
import { stageTimeRenderer } from '@domino/ui/dist/components/renderers/tableColumns'
import { ColumnConfiguration } from '@domino/ui/dist/components/Table/Table'
import { projectOverviewPage } from '@domino/ui/dist/core/routes'
import { Link } from 'react-router-dom'
import type { RegisteredModelProjectSummaryV1, RegisteredModelV1 } from './types'
import type { ModelRegistryRouteProvider } from './routes'
import styled from 'styled-components'
import { colors } from '../styled'
import { GlobalOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

export enum ColumnKeys {
  ModelName = 'MODEL_NAME',
  ProjectName = 'PROJECTNAME',
  LatestVersion = 'LATESTVERSION',
  Tags = 'TAGS',
  Owner = 'OWNER',
  Created = 'CREATED',
}

type GetColumnsProps = {
  showProject?: boolean
  routes: ModelRegistryRouteProvider
}

export function getColumns({
  showProject = true,
  routes,
}: GetColumnsProps): ColumnConfiguration<RegisteredModelV1>[] {

  type ColumnConfigurationWithEnabled<T> = ColumnConfiguration<T> & { enabled: boolean }
  const columns: ColumnConfigurationWithEnabled<RegisteredModelV1>[] = [
    {
      title: 'Model',
      dataIndex: 'name',
      key: ColumnKeys.ModelName,
      render: renderName,
      sorter: true,
      width: 125,
      enabled: true,
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: ColumnKeys.ProjectName,
      render: renderProjectName,
      sorter: false,
      width: 125,
      enabled: showProject,
    },
    {
      title: 'Latest Version',
      dataIndex: 'latestVersion',
      key: ColumnKeys.LatestVersion,
      // render: renderProjectName,
      sorter: false,
      width: 20,
      enabled: true,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: ColumnKeys.Tags,
      width: 100,
      render: renderTags,
      sorter: false,
      enabled: true,
    },
    {
      title: 'Owner',
      dataIndex: 'ownerUsername',
      key: ColumnKeys.Owner,
      // render: renderActions,
      width: 20,
      align: 'right',
      sorter: false,
      enabled: true,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: ColumnKeys.Created,
      render: stageTimeRenderer,
      width: 50,
      enabled: true,
    },
  ]

  return columns.filter(col => col.enabled)

  function renderName(name: string, record: RegisteredModelV1): ReactElement {
    return (
      <>
        <Link to={routes.detailsPage(record.name)} title={name} style={{display: 'unset'}}>
          {name}
        </Link>
        {record.discoverable && 
          <Tooltip title="All users in this Domino deployment can find this model">
            <span style={{fontSize: 14, marginLeft: 6}}><GlobalOutlined /></span>
          </Tooltip>
        }
      </>
    )
  }
}


const renderProjectName = (project: RegisteredModelProjectSummaryV1): ReactElement => (
  <Link to={projectOverviewPage(project.ownerUsername, project.name)} title={project.name}>
    {project.name}
  </Link>
)

const renderTags = (tags: {[key: string]: string}) => {
  //drop tags that start with mlflow., mlflow.domino., and domino.
  const userTags = Object.entries(tags)
    .filter(([key]) => !/^(mlflow(\.domino)?|domino)?\./.test(key))
  
  return userTags.length === 0 ? '-' :
    <StyledDl>
      {userTags.map(([key, value]) => (
        <Pill key={key}>
          <dt>{key}</dt>
          <dd>{value}</dd>
        </Pill>
      ))}
    </StyledDl>
}

const StyledDl = styled.dl`
  display: flex;
  column-gap: 8px;
  row-gap: 9px;
  flex-wrap: wrap;
  font-size: 12px;

  dt, dd {
    display: inline;
  }
`

const Pill = styled.div.attrs({className: 'Pill'})`
  background-color: ${colors.neutral300};
  padding: 3px 8px;

  dt::after {
    content: ':';
    margin-right: 0.25em;
  }
`
