import * as React from 'react';
import withStore, { StoreProps } from '@domino/ui/dist/globalStore/withStore';
import { getEnableDatasets } from '@domino/ui/dist/util';
import ReadWriteSnapshotsView from './ReadWriteSnapshotsView';
import { AdminPageTitle } from '../../data/data-sources/CommonStyles';

export type AdminSnapshotsViewWithStateProps = StoreProps;

export const AdminSnapshotsViewWithState = (props: AdminSnapshotsViewWithStateProps) => {
  const enableDataSets = getEnableDatasets(props.formattedPrincipal);
  return (
    enableDataSets ? <div>
      <AdminPageTitle>Datasets</AdminPageTitle>
      <ReadWriteSnapshotsView />
    </div> : <div>Please configure datasets</div>
  );
}

export default withStore(AdminSnapshotsViewWithState);
