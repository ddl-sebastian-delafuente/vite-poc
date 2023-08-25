import * as React from 'react';
import Table from '../../components/Table/Table';
import { DominoDataplaneDataPlaneDto, DominoDataplaneDataPlaneStatus } from '@domino/api/dist/types';
import Link from '@domino/ui/dist/components/Link/Link';
import { ActionDropdown } from '../../components';
import { MoreOutlined } from '@ant-design/icons';
import ArchiveDataplane from './ArchiveDataplane';
import { ColumnWidth } from '@domino/ui/dist/components/Table/Table';
import RegisterDataPlaneModal from './RegisterDataPlaneModal';
import DataplaneSetupModal from './DataplaneSetupModal';
import DataplaneStatus from './DataplaneStatus';
import { AlignType } from 'rc-table/lib/interface';
import { stringComparer } from '@domino/ui/dist/utils/dataManipulation/utils';
import { ColumnConfiguration } from '@domino/ui/dist/components/Table/Table';
import RestartAgent from "./RestartAgent";
import UpgradeAgent from "./UpgradeAgent";
import { getField } from '@domino/ui/dist/utils/searchUtils';
import Select from '@domino/ui/dist/components/Select';

const ARCHIVED_QUERY_PARAM_NAME = 'archived'

export type Props = {
  dataplanes: DominoDataplaneDataPlaneDto[];
  onDataplaneChange: () => void;
};

const DataplanesTable: React.FC<Props> = (props) => {
  const archivedDefault = getField(window.location.search, ARCHIVED_QUERY_PARAM_NAME) === 'true'
	const [archived, setArchived] = React.useState<boolean>(archivedDefault)
	const onDataPlaneTypeSelect = (archiveSelected: boolean) => {
		setArchived(archiveSelected)
	}

  const defaultRowId = '000000000000000000000000';

  const editAction = (row: DominoDataplaneDataPlaneDto) => ({
    key: 'edit',
    content: (
      <RegisterDataPlaneModal register={false} dataplane={row} onDataplaneChange={onDataplaneChange} dataplanes={dataplanes} />
    )
  });

  const setupAction = (row: DominoDataplaneDataPlaneDto) => ({
    key: 'setup',
    content: (
      <DataplaneSetupModal initialView={false} status='healthy' trigger='actions' dataplane={row} />
    )
  });

  const archiveAction = (id: string) => ({
    key: 'Archive',
    content: (
      <ArchiveDataplane dataplaneId={id} onDataplaneChange={onDataplaneChange} />
    )
  });

  const restartAction = (id: string) => ({
    key: 'Restart',
    content: (
      <RestartAgent dataplaneId={id} onDataplaneChange={onDataplaneChange} />
    )
  });

  const upgradeAction = (id: string) => ({
    key: 'Upgrade',
    content: (
      <UpgradeAgent dataPlaneId={id} onDataplaneChange={onDataplaneChange} />
    )
  });

  const generateRowActions = (row: DominoDataplaneDataPlaneDto, id: string) => {
    if (row.isArchived) {
      return []
    }
    if (row.id == defaultRowId) {
      return [editAction(row), restartAction(id)]
    }
    const match = row.status.version.match(/^(\d+)\.(\d+)\.\d+(-.*)?$/)
    let supportsUpgradeRequest
    if (match != null) {
      const minor = parseInt(match[1])
      const major = parseInt(match[2])
      // Major version 5 indicates the old versioning schema, prior to 1.1.0 in the current notation.
      supportsUpgradeRequest = (major == 1) && (minor >= 3) || (major > 1) && (major != 5)
    } else {
      supportsUpgradeRequest = false
    }
    return row.status.requiresUpgrade && supportsUpgradeRequest
      ? [editAction(row), setupAction(row), archiveAction(id), restartAction(id), upgradeAction(id)]
      : [editAction(row), setupAction(row), archiveAction(id), restartAction(id)]
  }

  const { dataplanes, onDataplaneChange } = props;

  const statusMap = {
    local: 0,
    Disconnected: 0,
    Error: 1,
    Unhealthy: 2,
    Healthy: 3,
  }

  const columns: ColumnConfiguration<any>[] = [
    {
      key: 'name',
      title: 'Data Plane',
      dataIndex: 'name',
      sorter: {
        compare: stringComparer<DominoDataplaneDataPlaneDto>(row => row.isLocal ? "" : row.name),
        multiple: 1,
      },
      defaultSortOrder: 'ascend',
      render: (name: string, row: DominoDataplaneDataPlaneDto) => {
        const link = `/admin/kubernetes?dataplaneid=${row.id}`;
        return (
          row.isArchived ? <>{name}</> :
            <Link href={link} openInNewTab={true}>
              {name}
            </Link>
      )}
    },
    {
      key: 'version',
      title: 'Agent Version',
      dataIndex: ['status', 'version']
    },
    {
      key: 'message',
      title: 'Status Message',
      dataIndex: ['status', 'message']
    },
    {
      key: 'status',
      title: `${archived ? 'Final ' : ''}Cluster Status`,
      dataIndex: 'status',
      align: 'right' as AlignType,
      width: 300,
      sorter: {
        compare: (a: DominoDataplaneDataPlaneDto, b: DominoDataplaneDataPlaneDto) => {
          if (a.id === defaultRowId){
            return statusMap.local - statusMap[b.status.state]
          }
          if (b.id === defaultRowId) {
            return statusMap[b.status.state] - statusMap.local;
          }
          return statusMap[a.status.state] - statusMap[b.status.state];
        },
        multiple: 2,
      },
      defaultSortOrder: 'ascend',
      filters: [
        {
          text: 'Healthy',
          value: 'Healthy',
        },
        {
          text: 'Unhealthy',
          value: 'Unhealthy',
        },
        {
          text: 'Error',
          value: 'Error',
        },
        {
          text: 'Disconnected',
          value: 'Disconnected',
        },
      ],
      onFilter: (value: string, row: DominoDataplaneDataPlaneDto) => {
        return row.status.state == value
      },
      render: (status: DominoDataplaneDataPlaneStatus) => <DataplaneStatus status={status.state}/>
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      width: ColumnWidth.Count,
      align: 'center' as AlignType,
      render: (id: string, row: DominoDataplaneDataPlaneDto) => row.id !== defaultRowId && !row.isArchived && <DataplaneSetupModal initialView={false} status={row.status.state} trigger='button' dataplane={row} />
    },
    {
      key: 'dpActions',
      dataIndex: 'id',
      hideFilter: true,
      width: 50,
      render: (id: string, row: DominoDataplaneDataPlaneDto) => {
        if (archived) {
          return <></>
        }
        const menuItems = generateRowActions(row, id);
        return <ActionDropdown icon={<MoreOutlined style={{ fontSize: '14px' }} />} menuItems={menuItems}/>;
      }
    }
  ];

  // This makes sure that the local dataPlane, on initial render,
  // is always shown at the top of the dataPlanes table.
  const localDataPlaneIndex = dataplanes.findIndex(dataplane => dataplane.id === defaultRowId);
  if (localDataPlaneIndex > 0) {
    dataplanes.unshift(...((dataplanes as []).splice(localDataPlaneIndex, 1)));
  }

  const filteredDataPlanes = dataplanes.filter(dp => dp.isArchived === archived)

  const archiveFilterSelect = (
    <Select
      defaultValue={archivedDefault}
      onSelect={onDataPlaneTypeSelect}
      dropdownMatchSelectWidth={false}
      style={{ width: '210px'}}
    >
      <Select.Option value={false}>Active Data Planes</Select.Option>
      <Select.Option value={true}>Archived Data Planes</Select.Option>
    </Select>
  )

  return <>
    <Table
      tableName='dataplanes-table'
      dataSource={filteredDataPlanes}
      columns={columns}
      hideRowSelection={true}
      extraUtilities={() => archiveFilterSelect}
    />
  </>
}

export default DataplanesTable;
