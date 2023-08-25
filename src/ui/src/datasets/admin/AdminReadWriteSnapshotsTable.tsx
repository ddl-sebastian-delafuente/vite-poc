import * as React from 'react';
import { useState, useEffect } from 'react';
import * as R from 'ramda';
import { MoreOutlined } from '@ant-design/icons';
import {
  DominoDatasetrwApiDatasetRwSnapshotAdminSummaryDto as SnapshotSummary
} from '@domino/api/dist/types';
import Table from '../../components/Table/Table';
import { unixTimestampFormatter } from './util';
import { ActionDropdown } from '../../components';
import { prettyBytes } from '../../utils/prettyBytes';
import MarkSnapshotAsActiveModal from '../MarkSnapshotAsActiveModal';
import DeleteRwSnapshotsModalWithButton from '../DeleteRwSnapshotsModalWithButton';
import { cancelRequestToDeleteSnapshot, isAllowedToCancelDeleteSnapshot } from '@domino/api/dist/Datasetrw';
import { success, warning } from '../../components/toastr';
import InvisibleButton from '../../components/InvisibleButton';
import Link from '../../components/Link/Link';
import { userBase, datasetUploadViewPathDef } from '../../core/routes';
import { fontSizes } from '../../styled';

const DEFAULT_PAGE_SIZE = 20;

export type CancelDatasetDeletionProps = {
  snapshot: SnapshotSummary;
  onUpdate: () => void;
}

type DeletableSnapshotsStatusData = {
  id: string;
  status : boolean;
}

const findById = (deletableSnapshot: DeletableSnapshotsStatusData[]) =>
  (selectedId: string) => deletableSnapshot ? deletableSnapshot.find(e => e.id === selectedId) : undefined;

const CancelSnapshotDeletion: React.FC<CancelDatasetDeletionProps> = ({ snapshot, onUpdate }) => {
  const cancelDeletion = async () => {
    try {
      const isDeletable = await isAllowedToCancelDeleteSnapshot({ snapshotId: snapshot.snapshot.id });
      if (isDeletable) {
        await cancelRequestToDeleteSnapshot({ snapshotId: snapshot.snapshot.id }).then(() => {
          onUpdate();
          success('Your Cancel Snapshot Deletion operation was successful.');
        });
      } else {
        // TODO: Have to change UX for this
        warning(`Snapshot Deletion cancellation was unsuccessful because the grace period for cancelling has passed.`);
      }
    } catch (err) {
      success('Failed to Cancel Snapshot Deletion.');
      console.warn(err);
    }
  }

  return (
    <InvisibleButton onClick={() => cancelDeletion()}>
      Cancel
    </InvisibleButton>
  );
}
const columns = (onUpdate: () => void,deletableSnapshotsStatusArray: DeletableSnapshotsStatusData[]) => [
  {
    title: 'Project',
    key: 'project',
    dataIndex: 'projectName',
    width: 250,
  },
  {
    title: 'Dataset',
    key: 'dataset',
    dataIndex: 'datasetName',
    width: 100,
  },
  {
    title: 'Snapshot',
    key: 'snapshot',
    dataIndex: ['snapshot', 'version'],
    render: (version: number, row: SnapshotSummary) =>
      <Link
        href={datasetUploadViewPathDef(row.ownerUsername, row.projectName, row.snapshot.datasetId, row.datasetName, row.snapshot.id)}
        openInNewTab={true}
      >
        {`Snapshot-${version}`}
      </Link>,
    width: 150,
  },
  {
    title: 'Size',
    key: 'size',
    dataIndex: ['snapshot', 'storageSize'],
    render: prettyBytes,
    width: 100,
  },
  {
    title: 'Created Time',
    key: 'createdTime',
    dataIndex: ['snapshot', 'creationTime'],
    render: (createdTime: number) => unixTimestampFormatter(createdTime),
  },
  {
    title: 'Last Used Time',
    key: 'lastUsedTime',
    dataIndex: ['snapshot', 'lastUsedTime'],
    render: (lastUsedTime: number) => unixTimestampFormatter(lastUsedTime) || '--',
  },
  {
    title: 'Owner',
    key: 'owner',
    dataIndex: 'ownerUsername',
    render: (ownerUsername: string) => (
      <div>
        <Link
            key={ownerUsername}
            href={userBase(ownerUsername)}
        >
            {ownerUsername}
        </Link>
      </div>
    ),
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: ['snapshot', 'lifecycleStatus'],
    width: 100,
  },
  {
    key: 'actions',
    dataIndex: ['snapshot', 'lifecycleStatus'],
    hideFilter: true,
    width: 50,
    sorter: false,
    render: (status: string, row: SnapshotSummary) => {
      const activeDatasetMenuActions = [{
        key: 'delete',
        content: (
          <DeleteRwSnapshotsModalWithButton
            rwSnapshots={[row]}
            onUpdate={onUpdate}
          />
        )
      }];
      const deletedDatasetMenuActions = [{
        key: 'cancel',
        content: (
          <CancelSnapshotDeletion snapshot={row} onUpdate={onUpdate} />
        )
      }];
      const markedDatasetActions = [{
        key: 'delete',
        content: (
          <DeleteRwSnapshotsModalWithButton
            rwSnapshots={[row]}
            onUpdate={onUpdate}
          />
        )
      }, {
        key: 'markAsActive',
        content: (
          <MarkSnapshotAsActiveModal
            rwSnapshot={row}
            onUpdate={onUpdate}
          />
        )
      }];
      const menuItems = R.equals(status, 'MarkedForDeletion') ? markedDatasetActions :
        R.equals(status, 'DeletionInProgress') ? deletedDatasetMenuActions : activeDatasetMenuActions;
        const deletableSnapshot = findById(deletableSnapshotsStatusArray)(row.snapshot.id);
        return deletableSnapshot && !deletableSnapshot.status ? '' : <ActionDropdown icon={<MoreOutlined style={{ fontSize: fontSizes.SMALL }} />} menuItems={menuItems} />;
    }
  }
];

export type Props = {
  rwSnapshots: SnapshotSummary[];
  onUpdate: () => void;
};

const AdminReadWriteSnapshotsTable: React.FC<Props> = ({ rwSnapshots, onUpdate }) => {

  const [deletableSnapshotsStatus, setDeletableSnapshotsStatus] = useState<DeletableSnapshotsStatusData[]>([]);

  useEffect(() => {
    const deletableSnapshots = rwSnapshots.filter(e => e.snapshot.lifecycleStatus === 'DeletionInProgress');
    const deletableSnapshotsPromisesArray: object[] = [];
    try {
      deletableSnapshots.forEach(snapshot => {
        deletableSnapshotsPromisesArray.push(isAllowedToCancelDeleteSnapshot({ snapshotId: snapshot.snapshot.id }).then(res => ({ status: res, id: snapshot.snapshot.id })));
      });
    } catch (err) {
      console.warn(err);
    }
    Promise.all(deletableSnapshotsPromisesArray).then((data: DeletableSnapshotsStatusData[]) => {
      setDeletableSnapshotsStatus(data)
    });
  }, [rwSnapshots]);

  return (
    <Table
      columns={columns(onUpdate,deletableSnapshotsStatus)}
      showPagination={true}
      dataSource={rwSnapshots}
      showSearch={true}
      hideRowSelection={true}
      defaultPageSize={DEFAULT_PAGE_SIZE}
    />
  )
};

export default AdminReadWriteSnapshotsTable;
