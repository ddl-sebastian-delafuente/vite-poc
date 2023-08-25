import { 
  getDatasetSummaries, 
  getDatasetUnitCost,
  getSnapshotAdminSummaries 
} from '@domino/mocks/dist/mock-stories/Datasetrw';
import fetchMock from 'fetch-mock';
import { MemoryRouter as Router } from 'react-router-dom';
import * as React from 'react';

import { FormattedPrincipal, formattedPrincipalInitialState } from '../../../globalStore/util';
import { getDevStoryPath } from '../../../utils/storybookUtil'
import {
  AdminSnapshotsViewWithStateProps,
  AdminSnapshotsViewWithState,
} from '../AdminSnapshotsViewWithState';

export default {
  title: getDevStoryPath('Develop/Data/Datasets/Admin'),
  component: AdminSnapshotsViewWithState,
  argTypes: {
    principal: { table: { disable: true } },
    formattedPrincipal: { table: { disable: true } },
    whiteLabelSettings: { table: { disable: true } },
    frontendConfig: { table: { disable: true } },
    formattedFrontendConfig: { table: { disable: true } },
  },
  args: {
    cost: 0.01,
    enableDatasets: true,
  }
}

interface TemplateProps extends AdminSnapshotsViewWithStateProps {
  /**
   * Cost of storage in GB/$
   */
  cost: number;
  enableDatasets?: boolean;
}

const Template = ({
  cost,
  enableDatasets,
  ...args
}: TemplateProps) => {
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getDatasetSummaries())
      .mock(...getDatasetUnitCost(cost))
      .mock(...getSnapshotAdminSummaries())
  }, [cost]);

  const formattedPrincipal: FormattedPrincipal = React.useMemo(() => {
    return {
      ...formattedPrincipalInitialState,
      enableDatasets,
    }
  }, [enableDatasets]);

  return (
    <Router>
      <AdminSnapshotsViewWithState {...args} formattedPrincipal={formattedPrincipal} />
    </Router>
  );
}

export const DatasetAdmin = Template.bind({})
