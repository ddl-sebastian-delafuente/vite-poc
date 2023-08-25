import {
  getDatasetGrants,
  updateDatasetGrants
} from '@domino/api/dist/Datasetrw';
import { getCurrentUser } from '@domino/api/dist/Users';
import { DrawerProps } from 'antd/lib/drawer';
/**
 * The Domino drawer wrapper has limitations that I am trying to avoid
 * namely contents don't unmount when the drawer is hidden and also a 
 * button is pre integrated to show/hide the drawer
 */
// eslint-disable-next-line no-restricted-imports
import { Drawer } from 'antd';
import * as R from 'ramda';
import * as React from 'react';
import styled from 'styled-components';

import XIcon from '../icons/X';
import Button from '../components/Button/Button';
import Modal from '../components/Modal';
import {
  error as raiseErrorToast,
  success as raiseSuccessToast,
} from '../components/toastr';
import { 
  UserRoleEditor,
  UserRole,
} from '../components/UserRoleEditor';
import { initialUser } from '../proxied-api/initializers';
import { Role } from '../proxied-api/types';
import { borderGrey } from '../styled/colors';
import { themeHelper } from '../styled/themeUtils';
import { useRemoteData } from '../utils/useRemoteData';

const PermissionDrawerContentHeader = styled.header`
  align-items: center;
  border-bottom: 1px solid ${borderGrey};
  display: flex;
  font-size: ${themeHelper('fontSizes.large')};
  justify-content: space-between;
  padding: 10px;
`;

const PermissionDrawerContentFooter = styled.footer`
  border-top: 1px solid ${borderGrey};
  display: flex;
  justify-content: flex-end;
  padding: 10px;

  & > .button:not(:last-child) {
    margin-right: 10px;
  }
`;

const PermissionDrawerContentBody = styled.section`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`;

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    display: flex;
    flex-direction: column;
    padding: 0;
  }
`;

const StyledXIcon = styled(XIcon)`
  color: grey;
  cursor: pointer;

  path {
    fill: grey;
  }
`

export interface PermissionsDrawerProps extends DrawerProps {
  adminPage?: boolean;
  datasetId: string;
  editable?: boolean;
  projectId: string;
  onClose?: () => void;
}

export const PermissionDrawer = ({
  adminPage,
  datasetId,
  editable,
  placement = 'right',
  projectId,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose = () => {},
  visible,
}: PermissionsDrawerProps) => {
  const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
  const [contentVisible, setContentVisible] = React.useState(visible);
  const [users, setUsers] = React.useState<UserRole[]>([]);

  const {
    data: existingUsers,
  } = useRemoteData({
    canFetch: !!visible,
    fetcher: () => getDatasetGrants({ datasetId }),
    initialValue: []
  });

  const {
    data: currentUser
  } = useRemoteData({
    canFetch: !!visible,
    fetcher: () => getCurrentUser({}),
    initialValue: initialUser,
  })

  const closeButtonText = React.useMemo(() => {
    return editable ? 'Cancel' : 'Close'
  }, [editable]);
  const drawerTitle = React.useMemo(() => {
    return editable ? 'Edit Dataset Permissions' : 'Dataset Permissions'
  }, [editable]);

  const handleAfterVisible = React.useCallback((newVisible: boolean) => {
    setContentVisible(newVisible);
  }, [setContentVisible]);

  const handleCloseCancel= React.useCallback(() => {
    setConfirmModalVisible(false);
  }, [setConfirmModalVisible])
  
  const handleCloseConfirm = React.useCallback(() => {
    setConfirmModalVisible(false);
    onClose();
  }, [onClose, setConfirmModalVisible]);


  const existingIds = React.useMemo(() => existingUsers.map(({ targetId, targetRole }) => `${targetId}-${targetRole}`).sort(), [existingUsers])

  const hasChanges = React.useMemo(() => {
    const newIds = users.map(({targetId, targetRole}) => `${targetId}-${targetRole}`).sort();

    return !R.equals(existingIds, newIds);
  }, [existingIds, users]);

  const didOwnPermissionsChange = React.useMemo(() => {
    // check if current permissions include current user
    const currentUserRole = existingUsers.find((u) => u.targetId === currentUser.id);

    if (!currentUserRole) {
      return false;
    }

    const newUserRole = users.find((u) => u.targetId === currentUser.id);

    if (!newUserRole) {
      return false;
    }

    return currentUserRole.targetRole !== newUserRole.targetRole;
  }, [currentUser, existingUsers, users]);

  const handleClose = React.useCallback(() => {
    // if content is editable and changes have been made display a 
    // confirmation modal too
    if (editable && hasChanges) {
      setConfirmModalVisible(true);
      return;
    }

    onClose();
  }, [editable, hasChanges, onClose, setConfirmModalVisible]);

  const handleSavePermissions = React.useCallback(async () => {
    try {
      await updateDatasetGrants({
        datasetId,
        body: {
          grants: users.map(({ targetId, targetRole}) => ({
            targetId,
            targetRole: targetRole as Role,
          })),
        }
      })

      raiseSuccessToast('Permissions updated.');

      if (didOwnPermissionsChange) {
        window.location.reload();
      }
    } catch (e) {
      if (e.status === 400) {
        raiseErrorToast('Failed to update permissions. Note that a dataset must have at least one owner.');
        return;
      }
      raiseErrorToast('Failed to update permissions.');
    }
    
    onClose();
  }, [datasetId, didOwnPermissionsChange, onClose, users]);

  const handleUserChange = React.useCallback((newUsers: UserRole[]) => {
    setUsers(newUsers);
  }, [setUsers]);

  React.useEffect(() => {
    setUsers(existingUsers);
  }, [existingUsers, setUsers]);

  return (
    <>
      <StyledDrawer 
        closable={false}
        afterVisibleChange={handleAfterVisible}
        placement={placement} 
        visible={visible}
        width="550px"
      >
        <PermissionDrawerContentHeader style={{paddingTop: adminPage ? '50px' : '10px' }}>
          {drawerTitle}
          <StyledXIcon onClick={handleClose} height="22" width="22" />
        </PermissionDrawerContentHeader>
        <PermissionDrawerContentBody>
          {contentVisible && (
            <UserRoleEditor
              canRemoveSelf
              editable={editable}
              projectId={projectId}
              onChange={handleUserChange}
              userList={users}
            />
          )}
        </PermissionDrawerContentBody>
        <PermissionDrawerContentFooter>
          <Button btnType="secondary" onClick={handleClose}>{closeButtonText}</Button>
          {editable && (
            <Button 
              disabled={!hasChanges} 
              onClick={handleSavePermissions}
            >
              Save Permissions
            </Button>
          )}
        </PermissionDrawerContentFooter>
      </StyledDrawer>
      <Modal
        closable
        isDanger
        maskClosable
        okText="Discard Changes"
        onOk={handleCloseConfirm}
        onCancel={handleCloseCancel}
        title="Discard Changes?"
        visible={confirmModalVisible}
      >
        You have unsaved changes, closing this component will discard any permissions changes you may have made.
      </Modal>
    </>
  );
}
