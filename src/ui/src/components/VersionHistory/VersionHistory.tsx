import * as React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { T, always, cond, equals, indexOf } from 'ramda';
import { EyeOutlined, WarningFilled, ExclamationCircleFilled, MoreOutlined } from '@ant-design/icons';
import { getExportVersionLogs, getBuildLogs } from '@domino/api/dist/ModelManager';
import ActionDropdown from '../ActionDropdown';
import Table, { ColumnWidth, ColumnProps } from '../Table/Table';
import { themeHelper } from '../../styled/themeUtils';
import { cabaret, lightishBlue, tulipTree } from '../../styled/colors';
import { LARGE } from '../../styled/fontSizes';
import FlexLayout from '../Layouts/FlexLayout';
import { jobsDashboardBase } from '../../core/routes';
import { error as errorToast } from '../../components/toastr';
import { getErrorMessage } from '../../components/renderers/helpers';
import LogsComponent, { Log } from './Logs';
import { fontSizes } from '../../styled';

export type ExportStatus = 'failed' | 'complete' | 'exporting' | 'preparing' | 'not_triggered';

enum ExportStatuses {
  complete = 'complete',
  failed = 'failed',
  exporting = 'exporting',
  preparing = 'preparing',
  not_triggered = 'not_triggered'
}

const DownloadOption = styled.span`
  margin-left : 10px;
`;

const StatusText = styled.span`
  margin-left: ${themeHelper('margins.tiny')};
`;

const StyledLink = styled(Link)`
  &&, &&:hover {
    color: ${lightishBlue};
  }
`;

interface ExportStatusProps {
  status: ExportStatus;
  exportedAt: number;
}

const ExportStatus = ({status, exportedAt}: ExportStatusProps) => cond([
  [equals(ExportStatuses.complete), always(<span>{moment(exportedAt).fromNow()}</span>)],
  [equals(ExportStatuses.failed), always(
    <FlexLayout alignContent='center' justifyContent='flex-start'>
      <ExclamationCircleFilled style={{color: cabaret, fontSize: LARGE}} />
      <StatusText>Export failed</StatusText>
    </FlexLayout>)],
  [status => indexOf(status, [ExportStatuses.exporting, ExportStatuses.preparing]) > -1, always(
    <FlexLayout alignContent='center' justifyContent='flex-start'>
      <WarningFilled style={{color: tulipTree, fontSize: LARGE }} />
      <StatusText>Export in progress</StatusText>
    </FlexLayout>)],
  [T, always('Export not triggered')]
])(status)

export interface ParametersTableData {
  versionNumber?: number;
  author: string;
  exported: number;
  status: ExportStatus;
  exportTarget: string;
  exportVersionId: string;
  modelId: string;
  modelVersionId: string;
  snowflakeExportJobId?: string;
}

export interface VersionHistoryProps {
  data: ParametersTableData[];
  ownerName: string;
  projectName: string;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({ data, ownerName, projectName }) => {
  const columns: ColumnProps<ParametersTableData>[] = [
    {
      key: 'versionNumber',
      title: 'VERSION NUMBER',
      dataIndex: 'versionNumber',
      width: '200px',
      sorter: false
    },
    {
      key: 'author',
      title: 'AUTHOR',
      dataIndex: 'author',
      sorter: false
    },
    {
      key: 'exported',
      title: ' EXPORTED',
      dataIndex: 'exported',
      sorter: false,
      render: (exported: number, row: ParametersTableData) => (
        <ExportStatus
          exportedAt={exported}
          status={row.status}
        />
      )
    },
    {
      key: 'actions',
      title: '',
      width: ColumnWidth.SecondaryAction,
      sorter: false,
      render: (row: ParametersTableData) => {
        const exportPath = equals(row.exportTarget, 'Snowflake') ?
          `${jobsDashboardBase(ownerName, projectName)}/${row.snowflakeExportJobId}/logs` : undefined;

        const menuItems = [
          {
            key: `buildLogs-${row.exportVersionId}`,
            content: (
              <LogsComponent
                buttonLabel="View Model API Build logs"
                title="Model API Build logs"
                fetchLogs={(onSuccess: (val: Array<Log>) => void,  onComplete: () => void) =>
                  onBuildLogsClick(row.modelId, row.modelVersionId, onSuccess, onComplete)}
              />)
          },
          {
            key: `exportLogs-${row.exportVersionId}`,
            content: (
              exportPath ? (
                <StyledLink to={exportPath}>
                  <EyeOutlined style={{ fontSize: '15px'}} />
                  <DownloadOption>View export logs</DownloadOption>
                </StyledLink>) : (
                <LogsComponent
                  buttonLabel="View export logs"
                  title="Export logs"
                  fetchLogs={(onSuccess: (val: Array<Log>) => void,  onComplete: () => void) =>
                    onExportLogsClick(row.exportVersionId, onSuccess, onComplete)}
                />))
          }
        ];

        return (
          <ActionDropdown
            menuTestKey="exportVersionActions"
            dataTest="export-version-actions"
            closeOnClick={true}
            menuItems={menuItems}
            icon={<MoreOutlined style={{ fontSize: fontSizes.SMALL, color: lightishBlue }} />}
          />);
      }
    }
  ];

  const onExportLogsClick = async (
    exportVersionId: string,
    onSuccess: (val: Array<Log>) => void,
    onComplete: () => void) => {
    try {
      const response = await getExportVersionLogs({ exportVersionId: exportVersionId });
      const responseParsed = JSON.parse((response as any).logs);
      onSuccess(responseParsed.lines);
    } catch(err) {
      const errMsg = await getErrorMessage(err, 'Something went wrong while fetching export logs');
      errorToast(errMsg);
    } finally {
      onComplete();
    }
  };

  const onBuildLogsClick = async (
    modelId: string,
    modelVersionId: string,
    onSuccess: (val: Array<Log>) => void,
    onComplete: () => void) => {
    try {
      const response = await getBuildLogs({ modelId, modelVersionId });
      const responseParsed = JSON.parse((response as any).logs);
      onSuccess(responseParsed.lines);
    } catch(err) {
      const errMsg = await getErrorMessage(err, 'Something went wrong while fetching build logs');
      errorToast(errMsg);
    } finally {
      onComplete();
    }
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      alwaysShowColumns={['actions']}
      hideRowSelection={true}
      showSearch={false}
      hideColumnFilter={true}
      showPagination={false}
    />
  );
};

export default VersionHistory;
