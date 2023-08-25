import * as React from 'react';
import TransferOwnership, { TransferOwnershipProps } from '../../src/data/data-sources/TransferOwnership';

import {
  AdminProfile,
  makeMocks,
  MakeMocksReturn,
} from '@domino/test-utils/dist/mock-manager';
import { 
  getAllDataSourcesResponse,
} from '@domino/test-utils/dist/mockResponses';
import {
  fullClick,
  render, 
  screen, 
  waitFor,
} from '@domino/test-utils/dist/testing-library';
import userEvent from '@testing-library/user-event';

let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();

  mocks.loadProfile(AdminProfile);
});

afterAll(() => {
  mocks.unmock();
});

describe('TransferOwnership', () => {
  let props: TransferOwnershipProps;

  beforeEach(() => {
    props = {
      dataSource: getAllDataSourcesResponse[0],
      onUpdateUsers: jest.fn(),
      setIsTransferOwnershipVisible: jest.fn(),
    }
  })

  it('should render', async () => {
    render(<TransferOwnership {...props} />);

    await waitFor(() => expect(screen.getByText('Transfer Data Source Ownership')).not.toBeNull())
  });

  it('should call transferOwnership endpoint on modal submit', async () => {
    const view = render(<TransferOwnership {...props} />);

    await waitFor(() => expect(screen.getByText('Transfer Data Source Ownership')).not.toBeNull());
    
    const input = view.getByDominoTestId('search-users-input');
    await userEvent.type(input, 'User 1');

    await waitFor(() => expect(view.container.querySelector(`.ant-select-dropdown-hidden`)).toBeNull());

    const menuItems = screen.getAllByText('user1');
    fullClick(menuItems[1]);

    const submitButton = screen.getByText('Submit');
    fullClick(submitButton);

    expect(mocks.api.datasource.transferOwnership).toHaveBeenCalledTimes(1);
    expect(props.setIsTransferOwnershipVisible).toHaveBeenCalledWith(false);
  });

  it('should not call transferOwnership when cancel button is pressed', async () => {
    const view = render(<TransferOwnership {...props} />);

    await waitFor(() => expect(screen.getByText('Transfer Data Source Ownership')).not.toBeNull());
    
    const input = view.getByDominoTestId('search-users-input');
    await userEvent.type(input, 'User 1');

    await waitFor(() => expect(view.container.querySelector('.ant-select-dropdown-hidden')).toBeNull());

    const menuItems = screen.getAllByText('user1');
    fullClick(menuItems[1]);

    const cancelButton = screen.getByText('Cancel');
    fullClick(cancelButton);

    expect(mocks.api.datasource.transferOwnership).toHaveBeenCalledTimes(0);
    expect(props.setIsTransferOwnershipVisible).toHaveBeenCalledWith(false);
  });

  it('should handle failures when transferring ownership', async () => {
    mocks.api.datasource.transferOwnership.mockRejectedValue(new Error('Async Error'));
    const view = render(<TransferOwnership {...props} />);

    await waitFor(() => expect(screen.getByText('Transfer Data Source Ownership')).not.toBeNull());
    
    const input = view.getByDominoTestId('search-users-input');
    await userEvent.type(input, 'User 1');

    await waitFor(() => expect(view.container.querySelector(`.ant-select-dropdown-hidden`)).toBeNull());

    const menuItems = screen.getAllByText('user1');
    fullClick(menuItems[1]);

    const submitButton = screen.getByText('Submit');
    fullClick(submitButton);

    expect(mocks.api.datasource.transferOwnership).toHaveBeenCalledTimes(1);
    expect(props.setIsTransferOwnershipVisible).toHaveBeenCalledWith(false);
  })
});
