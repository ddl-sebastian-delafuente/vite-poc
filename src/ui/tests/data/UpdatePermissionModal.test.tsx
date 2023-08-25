import * as React from 'react';

import { UpdatePermissionsProps, UpdatePermissionModal } from '../../src/data/data-sources/UpdatePermissionModal';
import { Permission } from '../../src/data/data-sources/CommonData';
import {
  AdminProfile,
  makeMocks,
  MakeMocksReturn,
} from '@domino/test-utils/dist/mock-manager';
import { adminInterfaceWhitelabelConfigurations } from '@domino/mocks/dist/mocks';
import { dataSourceDtoIndividualSnowflake } from '@domino/test-utils/dist/mock-usecases';
import {
  render, 
  screen, 
  waitFor,
  fullClick
} from '@domino/test-utils/dist/testing-library';

let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();
  mocks.loadProfile(AdminProfile);

  mocks.api.admin.getWhiteLabelConfigurations.mockResolvedValue({
    ...adminInterfaceWhitelabelConfigurations,
    appName: 'Domino'
  });
});

afterAll(() => {
  mocks.unmock();
});

// @ts-ignore
global.mixpanel = Object.create({})
// @ts-ignore
global.mixpanel.track = jest.fn()

describe('UpdatePermissionModal', () => {
  let props: UpdatePermissionsProps;

  beforeEach(() => {
    props = {
      dataSource: { ...dataSourceDtoIndividualSnowflake },
      initPermission: Permission.OnlyMe,
      initialUsers: [],
      isAdminOwner: true,
      isAdminUser: true,
      setIsUpdatePermissionModalVisible: jest.fn(),
      onUpdateUsers: jest.fn()
    }
  });

  it('should update datasource permssions', async () => {
    const view = render(<UpdatePermissionModal {...props}/>);

    await waitFor(() => expect(screen.getByText('Domino Permissions')).not.toBeNull());

    const updateButton = view.getByDominoTestId('update-permissions');
    fullClick(updateButton);

    await waitFor(() => expect(props.onUpdateUsers).toHaveBeenCalledTimes(1));
  });

  it('should handle failures when updating', async () => {
    mocks.api.datasource.updateUsers.mockRejectedValue('Async Error');
    const view = render(<UpdatePermissionModal {...props}/>);

    await waitFor(() => expect(screen.getByText('Domino Permissions')).not.toBeNull());

    const updateButton = view.getByDominoTestId('update-permissions');
    fullClick(updateButton);

    expect(props.onUpdateUsers).toHaveBeenCalledTimes(0);
    await waitFor(() => expect(props.setIsUpdatePermissionModalVisible).toHaveBeenCalledTimes(1));
  })

  it('should handle closing the modal', async () => {
    const view = render(<UpdatePermissionModal {...props}/>);

    await waitFor(() => expect(screen.getByText('Domino Permissions')).not.toBeNull());
    const cancelButton = view.getByDominoTestId('cancel-update-permissions');
    fullClick(cancelButton);
    expect(props.setIsUpdatePermissionModalVisible).toHaveBeenCalledTimes(1);
  })
});
