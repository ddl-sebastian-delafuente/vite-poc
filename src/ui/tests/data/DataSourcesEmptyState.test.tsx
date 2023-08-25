import * as React from 'react';

import DataSourcesEmptyState, { DataSourcesEmptyStateProps } from '../../src/data/data-sources/DataSourcesEmptyState';
import {
  AdminProfile,
  makeMocks,
  MakeMocksReturn,
} from '@domino/test-utils/dist/mock-manager';
import { 
  getDataSourcesByUserResponse
} from '@domino/test-utils/dist/mockResponses';
import {
  delayResponse,
  render, 
  screen, 
  waitFor 
} from '@domino/test-utils/dist/testing-library';

let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();

  mocks.loadProfile(AdminProfile);
});

afterAll(() => {
  mocks.unmock();
});

describe('DataSourcesEmptyState', () => {
  let props: DataSourcesEmptyStateProps;

  beforeEach(() => {
    props = {
      onCreate: jest.fn(),
      projectId: 'projectId',
      userId: 'userId',
    }
  });

  it('should show create data source button if project id is not passed', async () => {
    render(<DataSourcesEmptyState {...props} projectId={undefined} />);

    await waitFor(() => expect(screen.getByText('Connect to External Data')).not.toBeNull());
  });

  it('should show add data source button if project id is passed and there are data sources', async () => {
    render(<DataSourcesEmptyState {...props} />);

    await waitFor(() => expect(screen.getByText('Add a Data Source')).not.toBeNull());
  });

  it('should show create data source button if project id is passed and no data sources', async () => {
    mocks.api.datasource.getDataSourcesByUser.mockResolvedValue([])
    render(<DataSourcesEmptyState {...props} />);

    await waitFor(() => expect(screen.getByText('Connect to External Data')).not.toBeNull());
  });

  it('should show wait spinner on mount', async () =>{
    mocks.api.datasource.getDataSourcesByUser.mockImplementation(delayResponse(getDataSourcesByUserResponse));
    const view = render(<DataSourcesEmptyState {...props} />);

    expect(view.getAllByDominoTestId('wait-spinner')).not.toBeNull()
    expect(mocks.api.datasource.getDataSourcesByUser).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(view.queryByDominoTestId('wait-spinner')).toBeNull());
  });

  it('should handle errors in loading datasources', async () => {
    mocks.api.datasource.getDataSourcesByUser.mockRejectedValue(new Error('Test Async Error'));
    const view = render(<DataSourcesEmptyState {...props} />);

    expect(mocks.api.datasource.getDataSourcesByUser).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(view.queryByDominoTestId('wait-spinner')).toBeNull());
  });

  it('should handle errors in checking is allowed to manage data source projects', async () => {
    mocks.api.datasource.isAllowedToManageDataSourceProjectOnlyData.mockRejectedValue(new Error('Test Async Error'));
    const view = render(<DataSourcesEmptyState {...props} />);

    expect(mocks.api.datasource.getDataSourcesByUser).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(view.queryByDominoTestId('wait-spinner')).toBeNull());
  });
});
