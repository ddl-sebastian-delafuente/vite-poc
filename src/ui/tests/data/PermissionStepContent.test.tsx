import * as React from 'react';

import { Permission } from '../../src/data/data-sources/CommonData';
import PermissionStepContent, { PermissionStepContentProps } from '../../src/data/data-sources/create-data-source/PermissionStepContent';
import {
  AdminProfile,
  makeMocks,
  MakeMocksReturn,
} from '@domino/test-utils/dist/mock-manager';
import {
  adminInterfaceWhitelabelConfigurations,
  projectSummary, 
  user 
} from '@domino/test-utils/dist/mocks';
import {
  render, 
  screen, 
  waitFor 
} from '@domino/test-utils/dist/testing-library';

let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();

  mocks.loadProfile(AdminProfile);

  mocks.api.users.listUsers.mockResolvedValue([
    { ...user },
    { 
      ...user,
      id: 'test-user-id-2'
    }
  ]);

  mocks.api.projects.getProjectSummary.mockResolvedValue({ 
    ...projectSummary,
    ownerId: 'test-user-id'
  });

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

describe('PermissionStepContent', () => {
  let props: PermissionStepContentProps;

  beforeEach(() => {
    props = {
      currentUserUserId: 'test-user-id',
      currentUserUserName: 'testUserName',
      isAdminUser: false,
      isAdminOwner: false,
      permission: Permission.OnlyMe,
      projectId: 'test-project-id',
      setPermissionDescription: jest.fn(),
      setPermission: jest.fn(),
      setUsers: jest.fn(),
      users: []
    }
  });

  describe('Only Me Permissions', () => {
    it('should not show Add all project members link if project users only contains the owner', async () => {
      const view = render(<PermissionStepContent {...props}/>);

      await waitFor(() => expect(screen.getByText('Domino Permissions')).not.toBeNull());
      expect(screen.queryByText('Add all project members')).toBeNull();
      expect(view.queryByDominoTestId('data-source-permission-radio-group')).toBeNull();
    });
  });

  describe('Everyone Permissions', () => {
    it('should not show Add all project members link if project users only contains the owner', async () => {
      render(
        <PermissionStepContent 
          {...props}
          permission={Permission.Everyone}
        />
      );

      await waitFor(() => expect(screen.getByText('Domino Permissions')).not.toBeNull());
      expect(screen.queryByText('Add all project members')).toBeNull();
    });
  });

  describe('Specific Permissions', () => {
    it('should not show Add all project members link if project users only contains the owner', async () => {
      const view = render(
        <PermissionStepContent 
          {...props}
          permission={Permission.Specific}
        />
      );

      await waitFor(() => expect(view.getByText('Domino Permissions')).not.toBeNull());
      expect(view.queryByText('Add all project members')).toBeNull();
    });
  });
});
