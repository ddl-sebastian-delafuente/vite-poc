import React from 'react'
import { Col, Row } from 'antd'
import type { RegisteredModelVersionDetailsV1 } from '../types'
import { StyledTable, metricsNoDatasource, parametersNoDatasource, metricTableColumns, parameterTableColumns } from '../experiments-shim'
import { getExperimentRunDetailsPath } from '../../core/routes'
import { useGetRun } from '../experimentsHooks'
import { Link } from 'react-router-dom'
import ModelVersionDatasetsAndDataSources from './ModelVersionDatasetsAndDataSources'

type Props = {
  modelVersion: RegisteredModelVersionDetailsV1
}
const ModelCardVersionDetails: React.FC<Props> = ({ modelVersion }) => (
  <div className="ModelCardVersionDetails">
    <VersionNotes modelVersion={modelVersion} />
    <VersionPerformance modelVersion={modelVersion} />
    <ModelVersionDatasetsAndDataSources modelVersion={modelVersion} />
  </div>
)

const VersionNotes: React.FC<Props> = ({ modelVersion }) => (
  <div className="VersionNotes">
    <h3>Version Notes</h3>
    <div>
      {modelVersion.modelVersionDescription}
    </div>
  </div>
)

const VersionPerformance: React.FC<Props> = ({ modelVersion }) => { 
  const { isLoading, error, data: run } = useGetRun({ runId: modelVersion.experimentRunId })

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.status} - {error.name}</p>
  if (!run) return <p>No data!</p>

  const experimentsDataSource = run.data.params?.length ? run.data.params : parametersNoDatasource
  const metricsDataSource = run.data.metrics?.length ? run.data.metrics : metricsNoDatasource

  const runUrl = getExperimentRunDetailsPath(modelVersion.project.ownerUsername, modelVersion.project.name, run.info.experiment_id, run.info.run_id)

  return (
    <>
      <Row justify="space-between" style={{alignItems: 'baseline', marginTop: '30px'}}>
        <Col><h3>Version Performance</h3></Col>
        <Col>Experiment run <Link to={runUrl}>{run.info.run_name}</Link></Col>
      </Row>

      {/* experiments table */}
      <StyledTable style={{marginTop: 35}}
        columns={parameterTableColumns}
        dataSource={experimentsDataSource}
        hideRowSelection={true}
        hideColumnFilter={true}
        showSearch={false}
        showPageSizeSelector={false}
        showPagination={false}
        resizable={false}
      />

      {/* metrics table */}
      <StyledTable style={{marginTop: 40}}
        columns={metricTableColumns}
        dataSource={metricsDataSource}
        hideRowSelection={true}
        hideColumnFilter={true}
        showSearch={false}
        showPageSizeSelector={false}
        showPagination={false}
        resizable={false}
      />
    </>
  )
}

export default ModelCardVersionDetails
