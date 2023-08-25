import { MoreOutlined } from '@ant-design/icons';
import { 
  cancelRequestToDeleteDataset, 
  isAllowedToCancelDeleteDataset,
} from '@domino/api/dist/Datasetrw';
import { DominoDatasetrwApiDatasetRwSummaryDto as DatasetSummary, } from '@domino/api/dist/types';
import * as React from 'react';
import { useEffect, useState } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';

import Table from '../../components/Table/Table';
import Link from '../../components/Link/Link';
import { ActionDropdown } from '../../components';
import { datasetUploadViewPathDef, projectBase } from '../../core/routes';
import InvisibleButton from '../../components/InvisibleButton';
import { success, warning } from '../../components/toastr';
import FlexLayout from '../../components/Layouts/FlexLayout';
import { NoMarginLink, ProjectTextDiv, SeparatorSpan } from '../../data/data-sources/CommonStyles';
import { 
  getMonthyCostColumn,
  getOwnernamesColumn,
  getSizeColumn,
} from '../../data/dataset/datasetSharedColumns';
import { fontSizes } from '../../styled';
import DeleteRwDatasetModalWithButton from '../DeleteRwDatasetModalWithButton';
import MarkDatasetAsActiveModal from '../MarkDatasetAsActiveModal';
import { PermissionDrawer } from '../PermissionDrawer';
import ProjectMoreLinkAndModal from './ProjectMoreLinkAndModal';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PROJECT_COUNT = 3;

const TableWrapper = styled.div`
  td > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

interface EditPermissionProps {
  datasetId: string,
  projectId: string,
  visible: boolean,
}

export type CancelDatasetDeletionProps = {
  dataset: DatasetSummary;
  onUpdate: () => void;
}

type DeletableDatasetsStatusData = {
  id: string;
  status : boolean;
}
const findById = (deletableDataset: DeletableDatasetsStatusData[]) =>
  (selectedId: string) => deletableDataset ? deletableDataset.find(e => e.id === selectedId) : undefined;

const CancelDatasetDeletion: React.FC<CancelDatasetDeletionProps> = ({ dataset, onUpdate }) => {
  const cancelDeletion = async () => {
    try {
      const isDeletable = await isAllowedToCancelDeleteDataset({ datasetId: dataset.id });
      if (isDeletable) {
        await cancelRequestToDeleteDataset({ datasetId: dataset.id }).then(() => {
          onUpdate();
          success('Your Cancel Dataset Deletion operation was successful.');
        })
      } else {
        // TODO: Have to change UX for this
        warning(`Dataset Deletion cancellation was unsuccessful because the grace period for cancelling has passed.`);
      }
    } catch (err) {
      success('Failed to Cancel Dataset Deletion.');
      console.warn(err);
    }
  }

  return (
    <InvisibleButton onClick={() => cancelDeletion()}>
      Cancel
    </InvisibleButton>
  );
}

interface ColumnProps {
cost: number,
deletableDatasetsStatus: DeletableDatasetsStatusData[];
onUpdate: () => void;
setEditPermissionProps: (props: EditPermissionProps) => void;
}
const columns = ({
  cost,
  deletableDatasetsStatus,
  onUpdate,
  setEditPermissionProps,
}: ColumnProps) => [
  {
    title: 'Name',
    key: 'name',
    dataIndex: 'name',
    render: (name: string, row: DatasetSummary) =>
      <Link
       href={datasetUploadViewPathDef(row.projects.sourceProjectOwnerUsername, row.projects.sourceProjectName, row.id, row.name)}
       openInNewTab={true}
      >
       {name}
      </Link>,
    width: 250,
  },
  {
    title: 'Description',
    key: 'description',
    dataIndex: 'description',
    render: (description: string) => description,
    width: 300,
  },
  {
    title: 'Projects',
    key: 'projects',
    render: (row: DatasetSummary) => {
      const projects = R.concat([row.projects.sourceProjectName], row.projects.sharedProjectNames);
      const projectOwners = R.concat([row.projects.sourceProjectOwnerUsername], row.projects.sharedProjectOwnerUsernames);
      const mapIndexed = R.addIndex(R.map);
      return (
        <FlexLayout justifyContent="flex-start" alignItems="center">
          {R.intersperse(<SeparatorSpan>,</SeparatorSpan>, mapIndexed((project: string, idx: number) =>
            <NoMarginLink
              href={projectBase(projectOwners[idx], project)}
              openInNewTab={true}
              key={project}
            >
              {project}
            </NoMarginLink>, projects.slice(0, MAX_PROJECT_COUNT))) as React.ReactNode
          }
          {projects.length > MAX_PROJECT_COUNT &&
          <>
            <ProjectTextDiv>and</ProjectTextDiv>
            <ProjectMoreLinkAndModal
              count={projects.length - MAX_PROJECT_COUNT}
              {
                ...R.pick([
                'sourceProjectName',
                'sharedProjectNames',
                'sourceProjectOwnerUsername',
                'sharedProjectOwnerUsernames'
              ], row.projects)}
            />
          </>
          }
        </FlexLayout>
      );
    },
    sorterDataIndex: ['projects', 'sourceProjectName'],
    width: 300,
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'lifecycleStatus',
    render: (status: string) => status,
    width: 100,
  },
  getSizeColumn(),
  getMonthyCostColumn(cost),
  getOwnernamesColumn(),
  {
    key: 'actions',
    dataIndex: 'lifecycleStatus',
    hideFilter: true,
    width: 50,
    sorter: false,
    render: (status: string, row: DatasetSummary) => {
      const activeDatasetMenuActions = [{
        key: 'delete',
        content: (
          <DeleteRwDatasetModalWithButton
            rwDatasets={[row]}
            onUpdate={onUpdate}
          />
        )
      }];
      const deletedDatasetMenuActions = [{
        key: 'cancel',
        content: (
          <CancelDatasetDeletion dataset={row} onUpdate={onUpdate} />
        )
      }];
      const markedDatasetActions = [{
        key: 'delete',
        content: (
          <DeleteRwDatasetModalWithButton
            rwDatasets={[row]}
            onUpdate={onUpdate}
          />
        )
      }, {
        key: 'markAsActive',
        content: (
          <MarkDatasetAsActiveModal
            rwDataset={row}
            onUpdate={onUpdate}
          />
        )
      }];

      const baseMenuItems = [{
        key: 'edit-permissions',
        content: (
          <span onClick={() => setEditPermissionProps({
            datasetId: row.id,
            projectId: row.projects.sourceProjectId,
            visible: true,
          })}>Edit Permissions</span>
        )
      }];

      const deleteMenuItems = R.equals(status, 'MarkedForDeletion') ? markedDatasetActions :
        R.equals(status, 'DeletionInProgress') ? deletedDatasetMenuActions : activeDatasetMenuActions;

      const deletableDataset = findById(deletableDatasetsStatus)(row.id);
      const hasNoStatus = deletableDataset && !deletableDataset.status;
      return <ActionDropdown icon={<MoreOutlined style={{ fontSize: fontSizes.SMALL }} />} menuItems={hasNoStatus ? baseMenuItems : baseMenuItems.concat(deleteMenuItems)} />;
    }
  }
];

export type Props = {
  cost: number;
  rwDatasets: DatasetSummary[];
  onUpdate: () => void;
};

const DEFAULT_EDIT_PERMISSION_PROPS: EditPermissionProps = {
  datasetId: '',
  projectId: '',
  visible: false,
}

const AdminReadWriteDatasetsTable: React.FC<Props> = ({ cost, rwDatasets, onUpdate }) => {
  const [deletableDatasetsStatus, setDeletableDatasetsStatus] = useState<DeletableDatasetsStatusData[]>([]);
  const [editPermissionProps, setEditPermissionProps] = useState<EditPermissionProps>({
    ...DEFAULT_EDIT_PERMISSION_PROPS
  });

  useEffect(() => {
    const deletableDatasets = rwDatasets.filter(e => e.lifecycleStatus === 'DeletionInProgress');
    const deleteDatasetsPromisesArray: Promise<DeletableDatasetsStatusData>[] = [];
    try {
      deletableDatasets.forEach(dataset => {
        deleteDatasetsPromisesArray.push(isAllowedToCancelDeleteDataset({ datasetId: dataset.id }).then(res => ({ status: res, id: dataset.id })));
      });
    } catch (err) {
      console.warn(err);
    }
    Promise.all(deleteDatasetsPromisesArray).then((data: DeletableDatasetsStatusData[]) => {
      setDeletableDatasetsStatus(data)
    });
  }, [rwDatasets]);

  const handleClosePermissionDrawer = React.useCallback(() => {
    setEditPermissionProps({
      ...DEFAULT_EDIT_PERMISSION_PROPS
    })
  }, []);

  return (
    <TableWrapper>
      {editPermissionProps.visible && (
        <PermissionDrawer
          {...editPermissionProps}
          adminPage
          editable
          onClose={handleClosePermissionDrawer}
        />
      )}
      <Table
        columns={columns({
          cost,
          deletableDatasetsStatus,
          onUpdate,
          setEditPermissionProps,
        })}
        showPagination={true}
        dataSource={rwDatasets}
        showSearch={true}
        hideRowSelection={true}
        defaultPageSize={DEFAULT_PAGE_SIZE}
      />
    </TableWrapper>
  );
};

export default AdminReadWriteDatasetsTable;
