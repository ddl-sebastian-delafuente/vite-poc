import { DownloadOutlined } from '@ant-design/icons';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import * as R from 'ramda';
import {
  DominoDatasetrwApiDatasetRwSummaryDto as DatasetSummary,
  DominoDatasetrwApiDatasetRwSnapshotAdminSummaryDto as SnapshotSummary
} from '@domino/api/dist/types';
import {
  getDatasetSummaries,
  getDatasetUnitCost,
  getSnapshotAdminSummaries,
} from '@domino/api/dist/Datasetrw';
import { appendToQuery, updateQuery, getField } from '@domino/ui/dist/utils/searchUtils';
import Button from '../../components/Button/Button';
import { error as errorToast } from '../../components/toastr';
import NavTabs, { NavTabPane } from '../../components/NavTabs/NavTabs';
import DeleteRwDatasetModalWithButton from '../DeleteRwDatasetModalWithButton';
import tooltipRenderer from '../../components/renderers/TooltipRenderer';
import DangerButton from '../../components/DangerButton';
import { DatasetAdminQuotaSection } from '../../data/dataset/admin/DatasetAdminQuotaSection';
import { BigValue, UnitPosition } from '../../data/BigValue';
import { mixpanel } from '../../mixpanel';
import { DatasetsTabEvent, Locations } from '../../mixpanel/types';
import { themeHelper } from '../../styled';
import { BYTE_MULTPLIER, normalizeBytes, prettyBytes } from '../../utils/prettyBytes';
import { useRemoteData } from '../../utils/useRemoteData';
import AdminReadWriteDatasetsTable from './AdminReadWriteDatasetsTable';
import DeleteRwSnapshotsModalWithButton from '../DeleteRwSnapshotsModalWithButton';
import AdminReadWriteSnapshotsTable from './AdminReadWriteSnapshotsTable';

const StyledNavTabs = styled(NavTabs)`
  &&.ant-tabs-small > .ant-tabs-bar .ant-tabs-nav {
    width: 100%;
  }
`;

const StatWrapper = styled.div`
  align-items: end;
  display: flex;
  margin-bottom ${themeHelper('margins.small')};

  & > *:not(:last-child) {
    margin-right: 50px;
  }

  & > .button {
    margin-left: auto;
  }
`

const StorageSizeSection = styled.div`
    margin-bottom: 25px;
    `;

const ReadWriteSnapshotsView: React.FC<RouteComponentProps<any, any>> = (props) => {

  const [activeTab, setActiveTab] = useState<string>('');
  const [rwDatasets, setRwDatasets] = useState<DatasetSummary[]>([]);
  const [rwSnapshots, setRwSnapshots] = useState<SnapshotSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: cost } = useRemoteData({
    canFetch: true,
    fetcher: () => getDatasetUnitCost({}),
    initialValue: 0,
  });

  const fetchAdminSummaries = async () => {
    try {
      const [rwDatasets, rwSnapshots] = await Promise.all([
        getDatasetSummaries({}),
        getSnapshotAdminSummaries({})
      ]);
      const filteredDatasets = R.filter((dataset: DatasetSummary) =>
        !R.equals(dataset.lifecycleStatus, 'Deleted') && !R.equals(dataset.lifecycleStatus, 'Failed'), rwDatasets);
      const filteredSnapshots = R.filter((snapshotDto: SnapshotSummary) =>
        !R.equals(snapshotDto.snapshot.lifecycleStatus, 'Deleted') && !R.equals(snapshotDto.snapshot.lifecycleStatus, 'Failed') && !snapshotDto.snapshot.isReadWrite, rwSnapshots);
      setRwDatasets(filteredDatasets);
      setRwSnapshots(filteredSnapshots);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      errorToast('Failed to fetch Dataset details.');
    }
  }

  useEffect(() => {
    fetchAdminSummaries();
    const query = getField(props.location.search, 'activeTab');
    setActiveTab(query ? query : 'datasets');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateActiveTab = (key: string) => {
    mixpanel.track(() =>
      new DatasetsTabEvent({
        tab: key,
        location: Locations.Datasets
    }));

    setActiveTab(key);
    const query = appendToQuery(props.location.search, {'activeTab': key});
    props.history.push(updateQuery(props, query));
  }

  const getDatasetsMarkedForDeletion = (allDatasets: DatasetSummary[]) =>
    R.filter((dataset: DatasetSummary) => R.equals(dataset.lifecycleStatus, 'MarkedForDeletion'), allDatasets);

  const getSnapshotsMarkedForDeletion = (allSnapshots: SnapshotSummary[]) =>
    R.filter((dto: SnapshotSummary) => R.equals(dto.snapshot.lifecycleStatus, 'MarkedForDeletion'), allSnapshots);

  const totalDatasetsSize = R.length(rwDatasets) > 0 &&
    R.find(R.propEq('lifecycleStatus', ('Active' || 'DeletionInProgress')))(rwDatasets) ?
    R.reduce((acc, next: DatasetSummary) => acc + (next.sizeInBytes || 0), 0, rwDatasets) : 0;

  const markedDatasetsSize = R.length(rwDatasets) > 0 &&
    R.find(R.propEq('lifecycleStatus', 'MarkedForDeletion'))(rwDatasets) ?
    R.reduce((acc, next: DatasetSummary) => acc + (next.sizeInBytes || 0), 0, getDatasetsMarkedForDeletion(rwDatasets)) : 0;

  const totalSnapshotsSize = R.length(rwSnapshots) > 0 &&
    R.find((obj: SnapshotSummary) => R.equals(obj.snapshot.lifecycleStatus, 'Active' || 'DeletionInProgress'))(rwSnapshots) ?
    R.reduce((acc, next: SnapshotSummary) => acc + (next.snapshot.storageSize || 0), 0, rwSnapshots) : 0;

  const markedSnapshotsSize = R.length(rwSnapshots) > 0 &&
    R.find((obj: SnapshotSummary) => R.equals(obj.snapshot.lifecycleStatus, 'MarkedForDeletion'))(rwSnapshots) ?
    R.reduce((acc, next: SnapshotSummary) => acc + (next.snapshot.storageSize || 0), 0, getSnapshotsMarkedForDeletion(rwSnapshots)) : 0;

  const totalDatasetsSizeNormalized = normalizeBytes(totalDatasetsSize);
  const totalEstimatedCost = React.useMemo(() => {
    if (cost && totalDatasetsSize) {
      return (totalDatasetsSize/BYTE_MULTPLIER.GB * cost).toFixed(2);
    }

    return '--';
  }, [cost, totalDatasetsSize]);

  return (
    <StyledNavTabs
      onChange={(key: string) => updateActiveTab(key)}
      activeKey={activeTab}
      defaultActiveKey={activeTab}
    >
      <NavTabPane
        title="Datasets"
        key="datasets"
      >
        <StorageSizeSection>
          <StatWrapper>
            <BigValue
              {...totalDatasetsSizeNormalized}
              label="Total Storage Size"
            />
            <BigValue
              label="Total Monthly Cost Estimate"
              value={totalEstimatedCost}
              unitPosition={UnitPosition.prefix}
              unit="$"
            />
            <Button download="usage-report.csv" href="/v4/datasetrw/download-usage-report">Create Usage Report CSV <DownloadOutlined/></Button>
          </StatWrapper>
          <div>
            Total Size of Marked For Deletion Datasets and their Snapshots - {prettyBytes(markedDatasetsSize)}
          </div>
          {
            getDatasetsMarkedForDeletion(rwDatasets).length > 0 ?
              <DeleteRwDatasetModalWithButton
                rwDatasets={getDatasetsMarkedForDeletion(rwDatasets)}
                onUpdate={() => fetchAdminSummaries()}
                isDeleteAllMarkedDatasetsButton={true}
              /> :
              tooltipRenderer(
                'No Datasets marked for Deletion',
                <DangerButton disabled={true}>
                  Delete all marked Datasets
                                </DangerButton>,
                'bottom'
              )
          }
        </StorageSizeSection>
        {rwDatasets.length > 0 ?
          <AdminReadWriteDatasetsTable
            cost={cost}
            rwDatasets={rwDatasets}
            onUpdate={() => fetchAdminSummaries()}
          /> :
          <div>{isLoading ? 'Fetching the list of all datasets…' : 'No Datasets have been created'}</div>}
      </NavTabPane>
      <NavTabPane
        title="Snapshots"
        key="snapshots"
      >
        <StorageSizeSection>
          <div>
            Total Storage Size - {prettyBytes(totalSnapshotsSize)}
          </div>
          <div>
            Marked For Deletion Snapshots Size - {prettyBytes(markedSnapshotsSize)}
          </div>
          {
            getSnapshotsMarkedForDeletion(rwSnapshots).length > 0 ?
              <DeleteRwSnapshotsModalWithButton
                rwSnapshots={getSnapshotsMarkedForDeletion(rwSnapshots)}
                onUpdate={() => fetchAdminSummaries()}
                isDeleteAllMarkedSnapshotsButton={true}
              /> :
              tooltipRenderer(
                'No Snapshots marked for Deletion',
                <DangerButton disabled={true}>
                  Delete all marked Snapshots
                                </DangerButton>,
                'bottom'
              )
          }
        </StorageSizeSection>
        {rwSnapshots.length > 0 ?
          <AdminReadWriteSnapshotsTable
            onUpdate={() => fetchAdminSummaries()}
            rwSnapshots={rwSnapshots}
          /> :
          <div>{isLoading ? 'Fetching the list of all snapshots…' : 'No dataset snapshots have been created'}</div>}
      </NavTabPane>
      <NavTabPane
        title="Quotas"
        key="quotas"
      >
        <DatasetAdminQuotaSection
          storageUsage={totalDatasetsSize}
        />
      </NavTabPane>
    </StyledNavTabs>
  );
};

export default withRouter(ReadWriteSnapshotsView);
