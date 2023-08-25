import * as React from 'react';

import RemoveUserFromDataSource, { RemoveUserFromDataSourceProps } from '../../src/data/data-sources/RemoveUserFromDataSource';
import {
  AdminProfile,
  makeMocks,
  MakeMocksReturn,
} from '@domino/test-utils/dist/mock-manager';
import {
  fullClick,
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

describe('RemoveUserFromDataSource', () => {
  let defaultProps: RemoveUserFromDataSourceProps;

  beforeEach(() => {
    defaultProps = {
      dataSourceId: 'dataSourceId',
      userId: 'userId',
      userName: 'userName',
      onRemoveUser: jest.fn()
    };
  });

  it('should render', async () => {
    expect(mocks).not.toBeNull();
    const view = render(<RemoveUserFromDataSource {...defaultProps} />);
    expect(view.getByDominoTestId('raise-remove-user-from-datasource-modal')).not.toBeNull();
  });

  it('should call onRemoveUser on removing user', async () => {
    const view = render(<RemoveUserFromDataSource {...defaultProps} />);
    expect(view.getByDominoTestId('raise-remove-user-from-datasource-modal')).not.toBeNull();

    const button = view.getByDominoTestId('raise-remove-user-from-datasource-modal');
    fullClick(button);

    await waitFor(() => expect(view.getByDominoTestId('remove-user-from-ds-submit')).not.toBeNull());
    const confirmButton = view.getByDominoTestId('remove-user-from-ds-submit');
    fullClick(confirmButton);

    await waitFor(() => expect(screen.queryByText('User \'userName\' was removed from this data source.')).not.toBeNull());

    expect(defaultProps.onRemoveUser).toHaveBeenCalledTimes(1);
  });

  it('should not call onRemoveUser if cancelling', async () => {
    const view = render(<RemoveUserFromDataSource {...defaultProps} />);
    expect(view.getByDominoTestId('raise-remove-user-from-datasource-modal')).not.toBeNull();

    const button = view.getByDominoTestId('raise-remove-user-from-datasource-modal');
    fullClick(button);

    await waitFor(() => expect(view.getByDominoTestId('remove-user-from-ds-submit')).not.toBeNull());
    const cancelButton = view.getByDominoTestId('cancel-remove-user-from-datasource');
    fullClick(cancelButton);

    expect(defaultProps.onRemoveUser).toHaveBeenCalledTimes(0);
  });
  
  it('should handle errors when removing users', async () => {
    mocks.api.datasource.removeUsers.mockRejectedValue(new Error('Test Async Error'));
    const view = render(<RemoveUserFromDataSource {...defaultProps} />);
    expect(view.getByDominoTestId('raise-remove-user-from-datasource-modal')).not.toBeNull();

    const button = view.getByDominoTestId('raise-remove-user-from-datasource-modal');
    fullClick(button);

    await waitFor(() => expect(view.getByDominoTestId('remove-user-from-ds-submit')).not.toBeNull());
    const confirmButton = view.getByDominoTestId('remove-user-from-ds-submit');
    fullClick(confirmButton);

    await waitFor(() => expect(screen.getByText('There was an error removing the user', { exact: false })).not.toBeNull());
  });
});
