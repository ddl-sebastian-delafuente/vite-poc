import React, { ReactElement } from 'react'
import { stageTimeRenderer } from '@domino/ui/dist/components/renderers/tableColumns'
import { ColumnConfiguration } from '@domino/ui/dist/components/Table/Table'
import { getPublishNewVersionUri, modelsOverviewPage, projectOverviewPage } from '@domino/ui/dist/core/routes'
import Link from '@domino/ui/dist/components/Link/Link'
import ModelAlertsBadge from '@domino/ui/dist/modelmanager/ModelAlertsBadge'
import { ModelVersionSummary } from '@domino/api/dist/dmm-api-client'
import { AlertType } from '@domino/ui/dist/modelmanager/constants'
import * as hydrator from '@domino/ui/dist/modelmanager/ModelListingTableHydrator'
import Predictions from '@domino/ui/dist/modelmanager/Predictions'
import type { DominoDataplaneDataPlaneDto as DataplaneData, DominoModelmanagerApiModel as ModelData } from '@domino/api/dist/types'
import LinkGoalWrap from '../goals/LinkGoalWrap'
import { ActionDropdown } from '../components'
import { MoreOutlined } from '@ant-design/icons'
import { colors, fontSizes } from '../styled'
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'antd'
import InvisibleButton from '../components/InvisibleButton'

const DEPLOYMENT_RUNNING = "Running"
const SYNC = "Sync";
const ASYNC = "Async";

export type MonitoringDataWrapper = {
  isLoading: boolean;
  data?: ModelVersionSummary;
}

/**
 * This comes from the API, but swagger types it as {}
 */
export type ModelAccess = {
  canSetName: boolean;
  canPublishModel: boolean;
  canDeployVersion: boolean;
  canDestroyVersion: boolean;
  canPromoteVersion: boolean;
  canWriteVolumes: boolean;
  canArchiveModel: boolean;
}

export type ModelWithAccessAndMonitoringData = ModelData & { access: ModelAccess, dataplane: DataplaneData | undefined, monitoringData: MonitoringDataWrapper }

export enum ColumnKeys {
  Name = 'NAME',
  ProjectName = 'PROJECTNAME',
  Modified = 'MODIFIED',
  Drift = 'DRIFT',
  ModelQuality = 'MODEL_QUALITY',
  Predictions = 'PREDICTIONS',
  Status = 'STATUS',
  RequestType = 'REQUEST',
  DataPlane = 'DATA_PLANE',
  Actions = '_actions',
}

type GetColumnsProps = {
  modelMonitoringEnabled?: boolean;
  asyncModelsEnabled?: boolean;
  showStatus?: boolean;
  showProject?: boolean;
  showActions?: boolean;
  showMonitoring?: boolean;
  showDataPlane?: boolean;
  appName?: string;
}

export function getColumns({
  modelMonitoringEnabled = false,
  asyncModelsEnabled = false,
  showStatus = false,
  showProject = true,
  showActions = false,
  showMonitoring = true,
  showDataPlane = false,
  appName = ''
}: GetColumnsProps): ColumnConfiguration<ModelWithAccessAndMonitoringData>[] {
  // the prediction columns are "disabled" if the model monitoring feature flag is off
  const PredictionColumnHeader: React.FC<{columnTitle: string}> = ({columnTitle}) => {
    if (modelMonitoringEnabled) return <>{columnTitle}</>
    return (
      <Tooltip title={`To get monitoring results, enable the ${appName} Model Monitoring feature`}>
        <span style={{color: colors.disabledText}}>{columnTitle}</span>
      </Tooltip>
    )
  }

  type ColumnConfigurationWithEnabled<T> = ColumnConfiguration<T> & { enabled: boolean }
  const columns: ColumnConfigurationWithEnabled<ModelWithAccessAndMonitoringData>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: ColumnKeys.Name,
      render: renderName,
      sorter: true,
      width: 125,
      enabled: true,
    },
    {
      title: 'Project',
      dataIndex: 'projectName',
      key: ColumnKeys.ProjectName,
      render: renderProjectName,
      sorter: false,
      width: 125,
      enabled: showProject,
    },
    {
      title: 'Status',
      dataIndex: 'activeVersionStatus',
      key: 'activeVersionStatus',
      render: renderStatus,
      sorter: false,
      width: 125,
      enabled: showStatus,
    },
    {
      title: <PredictionColumnHeader columnTitle="Drift" />,
      key: ColumnKeys.Drift,
      render: (_, { id: modelId, monitoringData: { isLoading, data: summary} }: ModelWithAccessAndMonitoringData) => {
        const count = summary?.driftedVariablesCount
        return modelMonitoringEnabled ? (
          <ModelAlertsBadge
            loading={isLoading}
            count={count !== undefined && !isNaN(count) ? count : null}
            toolTipMessage={hydrator.getTooltipMessageForDriftAndQuality(AlertType.Drift, summary)}
            modelId={modelId}
            showTooltip={!isLoading}
            clickable={!isLoading}
          />
        ) : <></>
      },
      sorter: false,
      width: 50,
      enabled: showMonitoring,
    },
    {
      title: <PredictionColumnHeader columnTitle="Model Quality" />,
      key: 'MODEL_QUALITY',
      render: (_, { id: modelId, monitoringData: { isLoading, data: summary} }: ModelWithAccessAndMonitoringData) => {
        const count = summary?.failedMetricsCount
        return modelMonitoringEnabled ? (
          <ModelAlertsBadge
            loading={isLoading}
            count={count && !isNaN(count) ? count : null}
            toolTipMessage={hydrator.getTooltipMessageForDriftAndQuality(AlertType.Quality, summary)}
            modelId={modelId}
            showTooltip={!isLoading}
            clickable={!isLoading}
          />
        ) : <></>
      },
      sorter: false,
      width: 85,
      enabled: showMonitoring
    },
    {
      title: <PredictionColumnHeader columnTitle="Predictions (last 7 days)" />,
      key: ColumnKeys.Predictions,
      render: (_, { id: modelId, monitoringData: { isLoading, data: summary} }: ModelWithAccessAndMonitoringData) => (
        modelMonitoringEnabled ? <Predictions
          modelId={modelId}
          loading={isLoading}
          predictionsCount={summary?.predictionTrafficCount || null }
        /> : <></>
      ),
      sorter: false,
      width: 150,
      enabled: showMonitoring,
    },
    {
      title: 'Request Type',
      dataIndex: 'isAsync',
      key: ColumnKeys.RequestType,
      width: 50,
      render: (isAsync: boolean) => isAsync ? ASYNC : SYNC,
      sorter: false,
      enabled: asyncModelsEnabled
    },
    {
      title: 'Data Plane',
      dataIndex: 'activeVersionDataPlaneId',
      key: ColumnKeys.DataPlane,
      render: (_, { dataplane: dataplane }: ModelWithAccessAndMonitoringData) => dataplane?.name,
      sorter: false,
      width: 50,
      enabled: showDataPlane,
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModified',
      key: ColumnKeys.Modified,
      render: stageTimeRenderer,
      width: 50,
      enabled: true,
    },
    {
      title: 'Actions',
      key: ColumnKeys.Actions,
      render: renderActions,
      width: 20,
      align: 'right',
      sorter: false,
      enabled: showActions,
    }
  ]

  return columns.filter(col => col.enabled);
}

const renderName = (name: string, record: ModelWithAccessAndMonitoringData): ReactElement => (

  <Link href={modelsOverviewPage(record.id)} title={name}>
    {name}
  </Link>
)

const renderProjectName = (projectName: string, record: ModelWithAccessAndMonitoringData): ReactElement => (
  <Link href={projectOverviewPage(record.projectOwnerUsername, record.projectName)} title={projectName}>
    {projectName}
  </Link>
)

const renderActions = (_: any, record: ModelWithAccessAndMonitoringData): ReactElement | undefined => {
  const CAN_PUBLISH_MODEL = record.access.canPublishModel

  if (!(record.projectId && record.activeVersionNumber && record.activeModelVersionId)) return

  const linkGoal = {
    key: 'linkToGoal',
    content: <LinkGoalWrap
      modelId={record.id}
      projectId={record.projectId}
      modelVersion={record.activeVersionNumber}
      modelVersionId={record.activeModelVersionId}
    />
  }
  const publishModel = {
    key: 'publishNewVersion',
    content: (
      <InvisibleButton href={getPublishNewVersionUri(record.id, record.projectId)}>
        Publish New Version
      </InvisibleButton>
    )
  }
  const menuItems = CAN_PUBLISH_MODEL ? [publishModel, linkGoal] : [linkGoal]

  return <ActionDropdown
    menuItems={menuItems}
    icon={<MoreOutlined style={{ fontSize: fontSizes.SMALL }} />}
  />
}

const renderStatus = (value: string) => {
  const labelStyle = value === DEPLOYMENT_RUNNING ? colors.success : colors.vikingBlue;
  return (
    <span style={{
        backgroundColor: labelStyle,
        color: colors.white,
        padding: '0.2em 0.6em 0.3em',
        fontSize: '75%',
        fontWeight: 700,
        lineHeight: 1
      }} data-test="modelStatus">
      {value}
    </span>
  );
};
