import * as React from 'react';

import { 
  DATA_SOURCE_FOR_EVERYONE_TEXT,
  UserPermissionsProps, 
  UserPermissions 
} from '../../src/data/data-sources/UserPermissions';
import {
  AdminProfile,
  makeMocks,
  MakeMocksReturn,
} from '@domino/test-utils/dist/mock-manager';
import { 
  dataSourceDtoIndividualSnowflake,
  dataSourceDtoIndividualSnowflakeEveryone,
} from '@domino/test-utils/dist/mock-usecases';
import {
  render, 
  screen, 
  waitFor 
} from '@domino/test-utils/dist/testing-library';
import { adminInterfaceWhitelabelConfigurations } from '@domino/test-utils/dist/mocks';
import { replaceWithWhiteLabelling } from '../../src/utils/whiteLabelUtil';

const appName = 'Domino';
let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();
  mocks.loadProfile(AdminProfile);

  mocks.api.admin.getWhiteLabelConfigurations.mockResolvedValue({
    ...adminInterfaceWhitelabelConfigurations,
    appName
  });
});

afterAll(() => {
  mocks.unmock();
});

describe('UserPermissions', () => {
  let props: UserPermissionsProps;
  
  describe('For admins', () => {
    beforeEach(() => {
      props = {
        dataSource: dataSourceDtoIndividualSnowflake,
        isAdmin: true,
        onUpdateUsers: jest.fn(),
      }
    });

    it('should display delete users and update owner when the current user', async () => {
      const view = render(<UserPermissions {...props} />);

      await waitFor(() => expect(screen.getByText('Users with permissions can view and use this data source in projects.', {exact: false})).not.toBeNull());
      await waitFor(() => expect(view.queryAllByDominoTestId('raise-remove-user-from-datasource-modal')).not.toHaveLength(0));
      expect(view.queryByDominoTestId('edit-permissions')).not.toBeNull();
    });

    it('should display delete users and update owner when the current user is owner', async () => {
      const view = render(<UserPermissions {...props} dataSource={dataSourceDtoIndividualSnowflake} currentUserName="ownerName" />);

      await waitFor(() => expect(screen.getByText('Users with permissions can view and use this data source in projects.', {exact: false})).not.toBeNull());
      await waitFor(() => expect(view.queryAllByDominoTestId('raise-remove-user-from-datasource-modal')).not.toHaveLength(0));
      expect(view.queryByDominoTestId('edit-permissions')).not.toBeNull();
    });

    it('should display text description when data source isEveryone is true', async () => {
      const view = render(<UserPermissions {...props} dataSource={dataSourceDtoIndividualSnowflakeEveryone} currentUserName="ownerName" />);

      await waitFor(() => expect(screen.getByText('Users with permissions can view and use this data source in projects.', {exact: false})).not.toBeNull());
      expect(view.queryAllByDominoTestId('raise-remove-user-from-datasource-modal')).toHaveLength(0);
      expect(view.queryByDominoTestId('edit-permissions')).not.toBeNull();
      expect(screen.queryByText(replaceWithWhiteLabelling(appName)(DATA_SOURCE_FOR_EVERYONE_TEXT))).not.toBeNull();
    });
  });

  describe('Not owners or admins', () => {
    beforeEach(() => {
      props = {
        dataSource: dataSourceDtoIndividualSnowflake,
        isAdmin: false,
        onUpdateUsers: jest.fn(),
      }
    });

    it('should display users when userIds array has some values', async () => {
      const view = render(<UserPermissions {...props} />);

      await waitFor(() => expect(screen.getByText('Users with permissions can view and use this data source in projects.', {exact: false})).not.toBeNull());
      expect(view.queryByDominoTestId('raise-remove-user-from-datasource-modal')).toBeNull();
      expect(view.queryByDominoTestId('edit-permissions')).toBeNull();
    });
  });
});
