import * as React from 'react';
import * as R from 'ramda';
import moment from 'moment';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { getCurrentExecutions } from '@domino/api/dist/Admin';
import {
  DominoAdminInterfaceExecutionOverview as ExecutionOverview,
  DominoCommonProjectId as ProjectIdentifier,
  DominoComputegridExecutionUnitOverview as ExecutionUnitOverview,
  DominoDataplaneDataPlaneDto
} from '@domino/api/dist/types';
import Link from '../../components/Link/Link';
import Table from '../../components/Table/Table';
import { error as errorToast } from '../../components/toastr';
import {
  deploymentLogsCsvDownload,
  deploymentLogsDownload,
  describeComputeCluster,
  describeNode,
  describePod,
  describeRun,
  executionTroubleshootingBundleDownload,
  projectOverviewPage,
  userBase
} from '../../core/routes';
import { defaultDeploymentLogsDownloadParams, filterExecutionOverviewRows, makeExecutionRows } from './util';
import { numberComparer, stringComparer } from '../../utils/dataManipulation/utils';
import StopAndCommitModal from '../../runs/StopAndCommitModal';
import { getAllHardwareTiers } from '@domino/api/dist/HardwareTier';
import { listDataPlanes } from '@domino/api/dist/Dataplanes';

export type State = {
  loading: boolean;
  error: boolean;
  executionOverviewRows: ExecutionOverviewRow[];
};

export type Props = {
  propDrivenExecutionOverviewRows?: ExecutionOverview[];
  hybridEnabled?: boolean;
};

export type ExecutionOverviewRow = {
  workloadType: string;
  hardwareTier: ExecutionHardwareTier;
  executionIdAndDomainUrl: ExecutionIdAndDomainUrl;
  computeGridType: string;
  projectId: string;
  projectIdentifier: ProjectIdentifier;
  startingUserId?: string;
  startingUsername?: string;
  status: string;
  executionUnits: ExecutionUnitOverview[];
  started: string;
  title?: string;
  clusterName?: string;
  clusterType?: string;
  isClusterPod: boolean;
  dataPlane?: DominoDataplaneDataPlaneDto;
  key?: string;
};

export type ExecutionIdAndDomainUrl = {
  executionId: string;
  url: string;
};

export type ExecutionHardwareTier = {
  hardwareTierId: string;
  hardwareTierCores: number;
  hardwareTierMemoryInGiB: number;
  hardwareTierIsArchived: boolean;
};

const defaultColumns = [
  {
    key: 'workloadType',
    title: 'Workload',
    dataIndex: 'workloadType',
    render: (workloadType: string, row: ExecutionOverviewRow) => (
      <Link openInNewTab={true} href={row.executionIdAndDomainUrl.url}>{workloadType}</Link>
    ),
    width: 50
  },
  {
    key: 'executionIdAndDomainUrl',
    title: 'Execution ID',
    dataIndex: 'executionIdAndDomainUrl',
    render: ({executionId}: any) => executionId,
    sorterDataIndex: ['executionIdAndDomainUrl', 'executionId'],
    width: 50
  },
  {
    key: 'hardwareTier',
    title: (
      <div>
        Hardware Tier
      </div>
    ),
    dataIndex: 'hardwareTier',
    sorterDataIndex: ['hardwareTier', 'hardwareTierId'],
    render: (executionHardwareTier: ExecutionHardwareTier) => (
      executionHardwareTier.hardwareTierIsArchived ? `${executionHardwareTier.hardwareTierId} (archived)` :
      <span>
          <Link href={`hwtiers/edit/${executionHardwareTier.hardwareTierId}`} openInNewTab={true}>
            {executionHardwareTier.hardwareTierId}
          </Link>:&nbsp;
        {executionHardwareTier.hardwareTierCores} cores, {executionHardwareTier.hardwareTierMemoryInGiB} GiB
      </span>
    ),
    width: 175
  },
  {
    key: 'startingUsername',
    title: 'User',
    dataIndex: 'startingUsername',
    render: (username: string) => (
      <Link href={userBase(username)} openInNewTab={true}>
        {username}
      </Link>
    ),
    width: 100
  },
  {
    key: 'projectIdentifier',
    title: 'Project',
    dataIndex: 'projectIdentifier',
    sorter: stringComparer<ExecutionOverviewRow>(
      executionOverview => `${executionOverview.projectIdentifier.ownerUsername}/
                            ${executionOverview.projectIdentifier.projectName}`
    ),
    render: ({ownerUsername, projectName}: ProjectIdentifier) => (
      <Link href={projectOverviewPage(ownerUsername, projectName)} openInNewTab={true}>
        {`${ownerUsername}/${projectName}`}
      </Link>
    ),
    width: 150
  },
  {
    key: 'title',
    title: 'Title',
    dataIndex: 'title',
    render: (title: string) => title,
    width: 100
  },
  {
    key: 'started',
    title: 'Started',
    dataIndex: 'started',
    sorter: numberComparer<ExecutionOverviewRow>(executionOverview => moment(executionOverview.started).unix()),
    render: (started: string) => moment(started).format('YYYY-MM-DD HH:mm:ss'),
    width: 150
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
    render: (status: string) => status ,
    width: 25
  },
  {
    key: 'infrastructureDetails',
    title: 'Infrastructure Details',
    dataIndex: 'executionUnits',
    sorter: false,
    render: (executionUnitOverviews: ExecutionUnitOverview[], row: ExecutionOverviewRow) => {
      const definedComputeNodeIds: string[] =
        R.uniq(R.reject(R.isNil, executionUnitOverviews.map(f => f.computeNodeId)));

      const dataPlaneId: string = row.dataPlane ? row.dataPlane.id : "000000000000000000000000";

      return (
        <>
          {!row.isClusterPod && <div>
            <span key={row.executionIdAndDomainUrl.executionId}>
              <Tooltip placement="left" title={row.status}>
                <Link href={`${describeRun(dataPlaneId, row.executionIdAndDomainUrl.executionId)}`} openInNewTab={true}>
                 Resources
                </Link>
              </Tooltip>
            </span>
          </div>}
          <div>
            {executionUnitOverviews.slice(0, 1).map(euo => (
              <span key={euo.deployableObjectId}>
                <Tooltip placement="left" title={euo.status}>
                  <Link href={`${describePod(dataPlaneId, euo.deployableObjectId)}`} openInNewTab={true}>
                   Pod
                  </Link>
                </Tooltip>
              </span>
            ))}
          </div>
          {row.isClusterPod && <div>
            <span key={row.clusterName}>
              <Tooltip placement="left" title={row.status}>
                <Link href={`${describeComputeCluster(dataPlaneId, row.clusterType!, row.clusterName!)}`} openInNewTab={true}>
                 Cluster Spec
                </Link>
              </Tooltip>
            </span>
          </div>}
          <div>
            {definedComputeNodeIds.slice(0, 1).map(computeNodeId => (
              <span key={computeNodeId}>
              <Link href={describeNode(dataPlaneId, computeNodeId)} openInNewTab={true}>
                Node
              </Link>
              <br/>
            </span>
            ))}
          </div>
          {!row.isClusterPod && <div>
            <Link
              openInNewTab={true}
              href={deploymentLogsDownload(
                row.executionIdAndDomainUrl.executionId,
                defaultDeploymentLogsDownloadParams,
                true
              )}
              onClick={event => event && event.stopPropagation()}
            >
              Logs
            </Link>
            {'  '}
            <Link
              href={deploymentLogsDownload(
                row.executionIdAndDomainUrl.executionId,
                defaultDeploymentLogsDownloadParams,
                false
              )}
            >
              <DownloadOutlined style={{fontSize: '15px'}}/>
            </Link>
            {'  '}
            <Link
              href={deploymentLogsCsvDownload(
                row.executionIdAndDomainUrl.executionId,
                defaultDeploymentLogsDownloadParams,
                false
              )}
            >
              (CSV)
            </Link>
          </div>}
          {!row.isClusterPod && <div>
            {executionUnitOverviews.slice(0, 1).map(euo => (
              <span key={euo.deployableObjectId}>
                <Tooltip placement="left" title={euo.status}>
                  <Link href={`${executionTroubleshootingBundleDownload(row.executionIdAndDomainUrl.executionId)}`}>
                   Support Bundle
                  </Link>
                </Tooltip>
              </span>
            ))}
          </div>}
        </>
      );
    },
    width: 50
  },
  {
    key: 'actions',
    title: 'Actions',
    dataIndex: ['executionIdAndDomainUrl', 'executionId'],
    sorter: false,
    render: (executionId: string, executionOverview: ExecutionOverviewRow) => {
      return (
        <>
          {!executionOverview.isClusterPod && <StopAndCommitModal
            runId={executionId}
            ownerUsername={executionOverview.projectIdentifier.ownerUsername}
            projectName={executionOverview.projectIdentifier.projectName}
            workloadType={executionOverview.workloadType}
            projectId={executionOverview.projectId}
            urlToExecution={executionOverview.executionIdAndDomainUrl.url}
          />}
        </>
      );
    },
    width: 75
  }
];

const dataPlaneColumn = {
  key: 'dataPlane',
  title: 'Data plane',
  dataIndex: 'dataPlane',
  sorter: false,
  render: (dataPlane: DominoDataplaneDataPlaneDto) => <>{dataPlane.name}</>,
  width: 100
}

const executionOverviewRowKey = (record: ExecutionOverviewRow) => {
  if (record.executionUnits.length > 0) {
    return `${record.executionUnits[0].deployableObjectId}-${record.key}`;
  } else {
    return `${record.executionIdAndDomainUrl.executionId}-${record.key}`;
  }
};

class ComputeGridExecutionsTable extends React.Component<Props, State> {
  state = {
    loading: true,
    error: false,
    executionOverviewRows: []
  };

  async componentDidMount() {
    const {propDrivenExecutionOverviewRows} = this.props;
    const defaultDataPlaneId = "000000000000000000000000";
    try {
      let result: ExecutionOverview[];
      if (propDrivenExecutionOverviewRows) {
        result = propDrivenExecutionOverviewRows;
      } else {
        result = await getCurrentExecutions({});
      }
      const defaultRows = makeExecutionRows(result);


      if(this.props.hybridEnabled){
        const rowsWDataPlanes = [];
        const allDataPlanesList = await listDataPlanes({showArchived: true});
        const hardwareTiersEnvelope = await getAllHardwareTiers({showArchived: true});
        const hardwareTierMap = (hardwareTiersEnvelope.hardwareTiers || []).reduce((map, hardwareTier) => (map[hardwareTier.id] = hardwareTier, map), {})
        for(const row of defaultRows){
          const hardwareTier = hardwareTierMap[row.hardwareTier.hardwareTierId]
          const dataPlaneId = (hardwareTier && hardwareTier.dataPlaneId) ?? defaultDataPlaneId;
          const dataPlane = (allDataPlanesList.find(dataplane => {
            return dataplane.id === dataPlaneId
          }))
          rowsWDataPlanes.push({...row, dataPlane});
        }
        this.setState({
          executionOverviewRows: rowsWDataPlanes,
          loading: false
        });
      }else{
        this.setState({
          executionOverviewRows: defaultRows,
          loading: false
        });
      }
    } catch (err) {
      errorToast(`Error fetching executions: ${err.status} ${err.name}`);
      this.setState({
        loading: false,
        error: true
      });
      console.warn(err);
    }
  }
  columns = this.props.hybridEnabled ? [...defaultColumns, dataPlaneColumn] : defaultColumns;
  render() {
    return (
      <Table
        // @ts-ignore
        columns={this.columns}
        dataSource={this.state.executionOverviewRows}
        onFilter={filterExecutionOverviewRows}
        emptyMessage={this.state.error ?
          <>
            An error occurred while fetching active jobs, workspaces, and apps.
            <Link href={window.location.href}>Refresh the page</Link>?
          </>
          : 'Active jobs, workspaces, and apps will appear here'}
        rowKey={executionOverviewRowKey}
        loading={this.state.loading}
        hideRowSelection={true}
      />
    );
  }
}

export default ComputeGridExecutionsTable;
