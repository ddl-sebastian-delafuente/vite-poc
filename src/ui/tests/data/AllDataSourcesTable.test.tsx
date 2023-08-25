import * as React from 'react';
import * as R from 'ramda';

import * as TableColumns from '../../src/components/renderers/tableColumns';
import AllDataSourcesTable from '../../src/data/data-sources/all-data-sources/AllDataSourcesTable';
import {
  AdminProfile,
  makeMocks,
  MakeMocksReturn,
} from '@domino/test-utils/dist/mock-manager';
import { 
  getAllDataSourcesResponse,
  getDataSourcesByUserResponse
} from '@domino/test-utils/dist/mockResponses';
import {
  delayResponse,
  fullClick,
  render, 
  screen, 
  waitFor 
} from '@domino/test-utils/dist/testing-library';

let mocks: MakeMocksReturn;
let mockStageTimeRenderer: jest.SpyInstance;
beforeAll(() => {
  mocks = makeMocks();

  mocks.loadProfile(AdminProfile);

  // Additional Mocks
  mockStageTimeRenderer = jest.spyOn(TableColumns, 'stageTimeRenderer').mockReturnValue(<span>{'Jun 13th, 2019 @ 04:15:00 PM'}</span>);
});

afterAll(() => {
  mocks.unmock();
  mockStageTimeRenderer.mockRestore();
});

// @ts-ignore
global.mixpanel = Object.create({})
// @ts-ignore
global.mixpanel.track = jest.fn()

describe('AllDataSourcesTable', () => {
  it('should show spinner while fetching data sources', async () => {
    const { datasource } = mocks.api;
    datasource.getAllDataSources.mockImplementation(delayResponse(getAllDataSourcesResponse));
    
    const view = render(<AllDataSourcesTable userId="userId" />);
    expect(view.queryByDominoTestId('wait-spinner')).not.toBeNull();
  });

  it('should show data sources in the table', async () => {
    const { datasource } = mocks.api;
    datasource.getAllDataSources.mockImplementation(delayResponse(getAllDataSourcesResponse));
    
    const view = render(<AllDataSourcesTable userId="userId" />);
    expect(view.queryByDominoTestId('wait-spinner')).not.toBeNull();
    await waitFor(() => expect(view.queryByDominoTestId('wait-spinner')).toBeNull());
    expect(view.getAllByDominoTestId('DataSourcesTable')).not.toBeNull();
  });

  it('should show empty state if there are no data sources', async () => {
    const { datasource } = mocks.api;
    datasource.getAllDataSources.mockResolvedValue([]);
    
    render(<AllDataSourcesTable userId="userId" />);
    await waitFor(() => expect(screen.getByText('You can connect to external data sources', { exact: false })).not.toBeNull());
  });

  it.skip('should raise datasource create modal', async () => {
    const { datasource } = mocks.api;
    datasource.getAllDataSources.mockResolvedValue(getAllDataSourcesResponse);
    datasource.getDataSourcesByUser.mockResolvedValue(getDataSourcesByUserResponse.map((dataSource) => R.mergeDeepRight(dataSource, {projectIds: ['projectId']})));
    
    const view = render(<AllDataSourcesTable userId="userId" />);
    await waitFor(() => expect(view.queryByDominoTestId('wait-spinner')).toBeNull());
    const button = screen.getByText('Create a Data Source');

    expect(button).not.toBeNull();

    fullClick(button);
    await waitFor(() => expect(screen.getByText('New Data Source')).not.toBeNull());
    expect(mocks.api.datasource.getDataSourceConfigsNew).toHaveBeenCalledTimes(1);
  });
});
