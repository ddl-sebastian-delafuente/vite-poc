import {
  dataSourceDtoS3Tabular,
} from '@domino/mocks/dist/mock-usecases';
import { 
  makeMocks,
  MakeMocksReturn
} from '@domino/test-utils/dist/mock-manager';
import { 
  fullClick,
  render, 
  screen, 
  waitFor 
} from '@domino/test-utils/dist/testing-library';
import * as React from 'react';

import { ClusterRestartBanner } from '../ClusterRestartBanner';

let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();

  mocks.api.datasource.getDataSourcesByEngineType.mockResolvedValue([
    dataSourceDtoS3Tabular, 
  ]);
  mocks.api.datasource.restartStarburst.mockResolvedValue(true);
})
afterAll(() => mocks.unmock());


describe('Custer restart banner', () => {
  it('Should not display a banner if cluster does not require a restart', async () => {
    mocks.api.datasource.shouldRestartStarburst.mockResolvedValue(false);

    render(<ClusterRestartBanner/>);

    expect(screen.queryByText('There are one or more', { exact: false })).toBe(null);
  });

  it('Should display banner if cluster does require a restart', async () => {
    mocks.api.datasource.shouldRestartStarburst.mockResolvedValue(true);

    render(<ClusterRestartBanner/>);

    await waitFor(() => expect(screen.queryByText('There are one or more', { exact: false })).not.toBe(null));
  });


  it('Should hide the banner after user presses the restart cluster button', async () => {
    mocks.api.datasource.shouldRestartStarburst.mockResolvedValue(true);

    render(<ClusterRestartBanner/>);

    await waitFor(() => expect(screen.queryByText('There are one or more', { exact: false })).not.toBe(null));

    const rasieModalLink = screen.getByText('Click here to trigger a restart', { exact: false });
    fullClick(rasieModalLink);

    await waitFor(() => expect(screen.queryByText('Confirm Cluster Restart', { exact: false })).not.toBe(null));
    const restartClusterButton = screen.getByText('Restart Cluster');
    fullClick(restartClusterButton);

    await waitFor(() => expect(screen.queryByText('There are one or more', { exact: false })).toBe(null));
  });
})
