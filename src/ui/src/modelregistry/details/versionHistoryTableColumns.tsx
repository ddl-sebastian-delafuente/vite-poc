import React, { ReactElement } from 'react'
import { stageTimeRenderer } from '@domino/ui/dist/components/renderers/tableColumns'
import { ColumnConfiguration } from '@domino/ui/dist/components/Table/Table'
import { Link } from 'react-router-dom'
import { getExperimentRunDetailsPath } from '../../core/routes'
import type { RegisteredModelVersionOverviewV1 } from '../types'
import type { ModelRegistryRouteProvider } from '../routes'
import { useGetRun } from '../experimentsHooks'

export enum ColumnKeys {
  Version = 'VERSION',
  Created = 'CREATED',
  User = 'USER',
  ExperimentRun = 'EXPERIMENT_RUN',
  Metric1 = 'METRIC1',
  M2 = 'M2',
  M3 = 'M3',
}

export type GetColumnsProps = {
  modelName: string
  routes: ModelRegistryRouteProvider
}
export function getColumns({
  modelName,
  routes,
}: GetColumnsProps): ColumnConfiguration<RegisteredModelVersionOverviewV1>[] {

  const columns: ColumnConfiguration<RegisteredModelVersionOverviewV1>[] = [
    {
      title: 'Version',
      dataIndex: 'modelVersion',
      key: ColumnKeys.Version,
      render: (modelVersion: number) => renderVersionNumber(modelVersion, modelName),
      sorter: true,
      width: 125,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: ColumnKeys.Created,
      render: stageTimeRenderer,
      sorter: false,
      width: 125,
    },
    {
      title: 'User',
      dataIndex: 'ownerUsername',
      key: ColumnKeys.User,
      sorter: false,
      width: 125,
    },
    {
      title: 'Experiment Run',
      dataIndex: 'experimentRunId',
      key: ColumnKeys.ExperimentRun,
      width: 50,
      render: (_, record: RegisteredModelVersionOverviewV1) => <RunLink record={record} />,
      sorter: false,
    },
  ]

  return columns

  function renderVersionNumber(version: number, modelName: string): ReactElement {
    return (
      <Link key={version} to={routes.modelCardTab(modelName, version)} title={String(version)}>
        {version}
      </Link>
    )
  }
}

/**
 * The `record` object alone doesn't have enough information to build a URL to experiment runs
 * This component looks up the run with an API call (via the useGetRun hook), and once resolved,
 * creates a clickable link to the run.
 * Before resolving, this component will appear as a not-clickable run ID (guid).
 * After resolving, the component will change to a clickable link that displays the run name that was retrieved by the API call.
 */
const RunLink: React.FC<{record: RegisteredModelVersionOverviewV1}> = ({record}) => {
  const runId = record.experimentRunId
  const {data: run} = useGetRun({ runId })

  if (!run) return <span>{record.experimentRunId}</span>
  const runName = run.info.run_name
  const href = getExperimentRunDetailsPath(record.project.ownerUsername, record.project.name, run.info.experiment_id, run.info.run_id)
  return <Link to={href} title={runName}>{runName}</Link>
}
