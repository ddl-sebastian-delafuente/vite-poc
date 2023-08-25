import React from 'react'
import { Col, Row } from 'antd'
import { useGetDataSources, useGetDatasets } from '../datasetHooks'
import { Table } from '../../components'
import styled from 'styled-components'
import DataIcon from '../../icons/DataIcon'
import { RegisteredModelVersionDetailsV1 } from '../types'
import { getDataSourceIcon16 } from '../../data/data-sources/CommonData'
import { DominoDatasourceApiDataSourceDto } from '@domino/api/dist/types'
import { colors } from '../../styled'
import { Link } from 'react-router-dom'
import { projectBase } from '../../core/routes'

type Props = {
  modelVersion: RegisteredModelVersionDetailsV1
}

const ModelVersionDatasetsAndDataSources: React.FC<Props> = ({ modelVersion }) => (
  <Row justify="space-between" wrap={false} style={{marginTop: '30px', gap: '25px'}}>
    <Col flex={1}>
      <DataSourcesTable modelVersion={modelVersion}/>
    </Col>
    <Col flex={1}>
      <DatasetsTable modelVersion={modelVersion}/>
    </Col>
  </Row>
)

const DataSourcesTable: React.FC<Props> = ({ modelVersion }) => {
  const dataSourceIds = parseDatasources(modelVersion)
  const { isLoading, error, data: dataSources } = useGetDataSources(dataSourceIds)

  if (isLoading) return (
    <>
      <h3>Data Sources</h3>
      <p>Loading...</p>
    </>
  )
  if (error) return (
    <>
      <h3>Data Sources</h3>
      <p>Error {error.status} - {error.name}</p>
    </>
  )
  if (!dataSources) return (
    <>
      <h3>Data Sources (0)</h3>
      <p>No data!</p>
    </>
  )

  return (
    <>
      <h3>Data Sources ({dataSources.length})</h3>
      <BorderlessTable
        dataSource={dataSources}
        showHeader={false}
        showPagination={false}
        showSearch={false}
        hideColumnFilter={true}
        hideRowSelection={true}
        isStriped={false}
        emptyMessage="This model version has no associated data sources."
        rowKey="id"
        columns={[{
          title: 'Dataset',
          dataIndex: 'name',
          render: (name, record: DominoDatasourceApiDataSourceDto) => {
            const icon = getDataSourceIcon16(record.dataSourceType)
            const { ownerUsername: ownerName, name: projectName } = modelVersion.project
            const linkUrl = `${projectBase(ownerName, projectName)}/data/${record.id}`

            return (
              <NameWrapper>
                {icon}
                <Link style={{color: 'inherit'}} to={linkUrl}>{name}</Link>
              </NameWrapper>
            )
          }
        }]}
      />
    </>
  )
}

const DatasetsTable: React.FC<Props> = ({ modelVersion }) => {
  // turn DatasetInfo[] into a string[] of datasetIds
  const datasetAndSnapshotInfos = parseDatasets(modelVersion)
  const datasetIds = datasetAndSnapshotInfos.map(({ datasetId }) => datasetId)

  const { isLoading, error, data: datasets } = useGetDatasets(datasetIds)

  if (isLoading) return (
    <>
      <h3>Datasets</h3>
      <p>Loading...</p>
    </>
  )
  if (error) return (
    <>
      <h3>Datasets</h3>
      <p>Error {error.status} - {error.name}</p>
    </>
  )
  if (!datasets) return (
    <>
      <h3>Datasets (0)</h3>
      <p>No data!</p>
    </>
  )

  return (
    <>
      <h3>Datasets ({datasets.length})</h3>
      <BorderlessTable
        dataSource={datasetAndSnapshotInfos}
        showHeader={false}
        showPagination={false}
        showSearch={false}
        hideColumnFilter={true}
        hideRowSelection={true}
        isStriped={false}
        emptyMessage="This model version has no associated datasets."
        rowKey="id"
        columns={[{
          title: 'Dataset',
          dataIndex: 'datasetId',
          render: (datasetId: string, record: DatasetInfo) => {
            const dataset = datasets.find(ds => ds.id === datasetId)!
            const datasetName = dataset.name
            const snapshotId = record.snapshotId
            const { ownerUsername: ownerName, name: projectName } = modelVersion.project
            const linkUrl = `${projectBase(ownerName, projectName)}/data/rw/upload/${dataset.name}/${datasetId}/${snapshotId}`

            return (
              <NameWrapper>
              <DataIcon />
              <Link style={{color: 'inherit'}} to={linkUrl}>{datasetName}</Link>
              </NameWrapper>
            )
          },
        }]}
      />
    </>
  )
}

type DatasetInfo = {
  datasetId: string
  snapshotId: string
}
  
/**
 * dataset lineage is represented in a modelVersion in the tag "mlflow.domino.dataset_info"
 * It is a comma-separated list of {datasetId}-{snapshotId}
 * This method parses that tag, if it exists, into an array of DatasetInfo objects
 * If the tag does not exist, returns an empty list
 *
 */
function parseDatasets(modelVersion: RegisteredModelVersionDetailsV1): DatasetInfo[] {
  const datasetInfoTag: string | undefined = modelVersion.tags['mlflow.domino.dataset_info']
  if (typeof datasetInfoTag === 'undefined') return []

  return datasetInfoTag.split(',').map(datasetSnapshotCombo => {
    const [datasetId, snapshotId] = datasetSnapshotCombo.split('-', 2)
    return { datasetId, snapshotId }
  })
}

/**
 * datasource lineage is represented in a modelVersion in the tag "mlflow.domino.data_sources"
 * It is a comma-separated list of data source ids.
 * This method parses that tag, if it exists, into an array of strings representing datasource ids.
 * If the tag does not exist, returns an empty list
 *
 */
function parseDatasources(modelVersion: RegisteredModelVersionDetailsV1): string[] {
  const datasourceTag: string | undefined = modelVersion.tags['mlflow.domino.data_sources']
  if (!Boolean(datasourceTag) || datasourceTag === 'unknown') return []

  return datasourceTag.split(',')
}

const BorderlessTable = styled(Table)`
  table {
    border: none;
  }

  .ant-table-cell {
    padding-left: 4px;
  }

  tr.striped {
    background-color: ${colors.backgroundWhite};
  }

  .ant-table-row:hover {
    background-color: unset;
  }

  .ant-table-tbody > tr > td.ant-table-cell-row-hover {
    background-color: unset;
  }

  .ant-table-tbody > tr.striped > td.ant-table-cell-row-hover {
    background-color: ${colors.backgroundWhite};
  }

  .ant-table-tbody > tr > td {
    border: none;
  }
`

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export default ModelVersionDatasetsAndDataSources
