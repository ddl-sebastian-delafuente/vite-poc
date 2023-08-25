import * as Datasetrw from '@domino/api/dist/Datasetrw';
import {
  getPrincipalResponse,
} from '@domino/mocks/dist/mockResponses';
import {
  MakeMocksReturn,
  makeMocks,
} from '@domino/test-utils/dist/mock-manager';

import { EntityType, Permission } from '../../proxied-api/Auth';
import { resolvePermissionsForResource } from '../AccessControlProvider';

import { UnionToMap } from '../../utils/typescriptUtils';

type Role = 'Admin' | 'Editor' | 'Owner' | 'Reader';
const Role: UnionToMap<Role> = {
  Admin: 'Admin',
  Editor: 'Editor',
  Owner: 'Owner',
  Reader: 'Reader',
};

const PERMISSIONS = {
  [Role.Admin]: [Permission.ListDatasetRwV2, Permission.EditSecurityDatasetRwV2, Permission.PermanentDeleteDatasetRwV2, Permission.DeleteDatasetRwV2],
  [Role.Editor]: [Permission.ListDatasetRwV2, Permission.ReadDatasetRwV2, Permission.UpdateDatasetRwV2, Permission.DeleteDatasetRwV2],
  [Role.Owner]: [Permission.ListDatasetRwV2, Permission.ReadDatasetRwV2, Permission.UpdateDatasetRwV2, Permission.DeleteDatasetRwV2, Permission.EditSecurityDatasetRwV2],
  [Role.Reader]: [Permission.ListDatasetRwV2, Permission.ReadDatasetRwV2],
};

let mocks: MakeMocksReturn;
let getDatasetPermissions: jest.SpyInstance;

beforeAll(() => {
  mocks = makeMocks();

  mocks.api.auth.getPrincipal.mockResolvedValue(getPrincipalResponse);
  mocks.api.users.isDataAnalystUser.mockResolvedValue(false);

  getDatasetPermissions = jest.spyOn(Datasetrw, 'getDatasetPermissions');
});

afterEach(() => {
  getDatasetPermissions.mockReset();
});

afterAll(() => {
  mocks.unmock();

  getDatasetPermissions.mockRestore();
});

interface RoleExpected {
  [key: string]: boolean;
}

export const runAccessControlTests = (testGroupDescription: string, resourceId: string, roleExpected: RoleExpected) => {
  describe(testGroupDescription, () => {
    Object.keys(roleExpected).forEach((role) => {
      const testName = roleExpected[role] ?
        `${role} should have access`:
        `${role} should not have access`;

      it(testName, async () => {
        getDatasetPermissions.mockResolvedValue(PERMISSIONS[role]);
        const result = await resolvePermissionsForResource(resourceId, { [EntityType.DatasetInstance]: `test-id-${role}` }, jest.fn());
        expect(result).toEqual(roleExpected[role]);
      });
    });
  });
}

describe('AccessControlProivder', () => {
  describe('Global', () => {
    describe('Data', () => {
      describe('Datasets Tab', () => {
        runAccessControlTests('View tab', 'dataset.global.tab', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });

        describe('List of datasets', () => {
          runAccessControlTests('View list of data sets', 'dataset.global.tab.table', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
          runAccessControlTests('Can use entry count selector', 'dataset.global.tab.table.entry-count', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
          runAccessControlTests('Can use file search', 'dataset.global.tab.table.search', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
          runAccessControlTests('Can use view column filter selector', 'dataset.global.tab.table.column-filter', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
          runAccessControlTests('View project name column', 'dataset.global.tab.table.project-name', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
          runAccessControlTests('View dataset name column', 'dataset.global.tab.table.name', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
          runAccessControlTests('View description column', 'dataset.global.tab.table.description', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
          runAccessControlTests('View snapshot count column', 'dataset.global.tab.table.snapshot-count', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
          runAccessControlTests('Can use pagination controls', 'dataset.global.tab.table.pagination', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
          runAccessControlTests('Can navigate a dataset', 'dataset.global.tab.table.row.navigation', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
        });
      });
    });
  });
  describe('Dataset Details', () => {
    runAccessControlTests('View breadcurmbs', 'dataset.breadcrumbs', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
    runAccessControlTests('Navigate to ancestors in breadcrumbs', 'dataset.breadcrumbs.navigate', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
    // runAccessControlTests('Can use actions dropdown', 'dataset.actions', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
    runAccessControlTests('Can use rename option in actions dropdown', 'dataset.actions.rename', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
    runAccessControlTests('Can use edit permissions option in actions dropdown', 'dataset.actions.edit-permissions', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: false, [Role.Reader]: false });
    runAccessControlTests('Can use view permissions option in actions dropdown', 'dataset.actions.view-permissions', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
    runAccessControlTests('Can use delete dataset option in actions dropdown', 'dataset.actions.delete', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
    runAccessControlTests('Can use upload files button', 'dataset.upload-files', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
    runAccessControlTests('Can use take snapshot button dropdown', 'dataset.take-snapshot', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
    runAccessControlTests('Can use Include all file option in take snapshot button dropdown', 'dataset.take-snapshot.all-files', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
    runAccessControlTests('Can use Include only selected files option in take snapshot button dropdown', 'dataset.take-snapshot.selected-files', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
    runAccessControlTests('Can use cancel button after take snapshot action has been queued', 'dataset.take-snapshot.queued.cancel', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
    runAccessControlTests('Can use cancel button while snapshot is being created', 'dataset.take-snapshot.processing.cancel', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
    runAccessControlTests('View Dataset description section', 'dataset.description', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
    runAccessControlTests('Can use edit description icon button', 'dataset.description.edit', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
    runAccessControlTests('View snapshot selection', 'dataset.snapshots', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
    runAccessControlTests('Navigate to a snapshot', 'dataset.snapshots.navigate', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });

    describe('Permissions Drawer', () => {
      // runAccessControlTests('View Permissions Drawer', 'dataset.permissions-drawer', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: false, [Role.Reader]: false });
      runAccessControlTests('Can use add users and role input', 'dataset.permissions-drawer.add-users', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: false, [Role.Reader]: false });
      runAccessControlTests('View list of users and their roles', 'dataset.permissions-drawer.list-users', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: false, [Role.Reader]: false });
      runAccessControlTests('Can use role dropdown on each user listed', 'dataset.permissions-drawer.edit-role', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: false, [Role.Reader]: false });
      runAccessControlTests('Can use delete user button', 'dataset.permissions-drawer.delete-user', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: false, [Role.Reader]: false });
      runAccessControlTests('Can apply editor role', 'dataset.permissions-drawer.edit-role.editor', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: false, [Role.Reader]: false });
      runAccessControlTests('Can apply reader role', 'dataset.permissions-drawer.edit-role.reader', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: false, [Role.Reader]: false });
      runAccessControlTests('Can use cancel button', 'dataset.permissions-drawer.cancel-edit', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: false, [Role.Reader]: false });
      runAccessControlTests('Can use save permissions button', 'dataset.permissions-drawer.save', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: false, [Role.Reader]: false });
    });

    describe('Files Table', () => {
      runAccessControlTests('View list of files in dataset', 'dataset.file-table', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('Can use entry count selector', 'dataset.file-table.entry-count', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('Can use file search', 'dataset.file-table.search', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('Can use view column filter selector', 'dataset.file-table.column-filter', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('View name column', 'dataset.file-table.column.name', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('View size column', 'dataset.file-table.column.size', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('View list modified column', 'dataset.file-table.column.last-modified', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('View actions column', 'dataset.file-table.column.actions', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('Can use download action in actions column', 'dataset.file-table.column.actions.download', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('Can use rename action in actions column', 'dataset.file-table.column.actions.rename', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
      runAccessControlTests('Can use pagination controls', 'dataset.file-table.pagination', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
    });

    describe('Snapshot Details', () => {
      runAccessControlTests('Can use copy to new dataset button', 'dataset.snapshot-instance.copy', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('Can use restore snapshot button', 'dataset.snapshot-instance.restore', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
      runAccessControlTests('View description', 'dataset.snapshot-instance.description', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('Vew older snapshot banner', 'dataset.snapshot-instance.older-snapshot.banner', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('Navigate to latest using link in old snapshot banner', 'dataset.snapshot-instance.older-snapshot.banner.navigate', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('View list of snapshots', 'dataset.snapshot-instance.snapshots', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('View list of tags', 'dataset.snapshot-instance.tags', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      runAccessControlTests('Can use delete mark on a tag', 'dataset.snapshot-instance.tags.tag.delete', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
      runAccessControlTests('Can use tag snapshot button', 'dataset.snapshot-instance.tags.add', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });
      runAccessControlTests('Can use mark snapshot for deletion button', 'dataset.snapshot-instance.delete', { [Role.Admin]: true, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: false });

      describe('Files Table', () => {
        runAccessControlTests('View list of files in a snapshot', 'dataset.snapshot-instance.file-table', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
        runAccessControlTests('Can use entry count selector', 'dataset.snapshot-instance.file-table.entry-count', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
        runAccessControlTests('Can use file search', 'dataset.snapshot-instance.file-table.search', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
        runAccessControlTests('Can use view column filter selector', 'dataset.snapshot-instance.file-table.column-filter', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
        runAccessControlTests('View name column', 'dataset.snapshot-instance.file-table.column.name', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
        runAccessControlTests('View size column', 'dataset.snapshot-instance.file-table.column.size', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
        runAccessControlTests('View list modified column', 'dataset.snapshot-instance.file-table.column.last-modified', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
        runAccessControlTests('Can use pagination controls', 'dataset.snapshot-instance.file-table.pagination', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
        // runAccessControlTests('View snapshot metadata', 'dataset.snapshot-instance.file-table.metadata', { [Role.Admin]: false, [Role.Owner]: true, [Role.Editor]: true, [Role.Reader]: true });
      });
    });
  });
})
