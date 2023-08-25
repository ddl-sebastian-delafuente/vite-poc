import * as React from 'react';
import { useState } from 'react';
import { updateUsers } from '@domino/api/dist/Datasource';
import {
  DominoDatasourceApiDataSourceDto as DataSource,
} from '@domino/api/dist/types';
import Modal from '../../components/Modal';
import { colors } from '../../styled';
import Button from '../../components/Button/Button';
import { error, success } from '../../components/toastr';
import DataIcon from '../../icons/DataIcon';
import PermissionStepContent from './create-data-source/PermissionStepContent';
import { Permission } from './CommonData';
import { CancelButton, ModalFooter, ModalTitle, PermissionContent, Title } from './CommonStyles';
import { mixpanel, types as mixpanelTypes } from '../../mixpanel';
import useStore from '../../globalStore/useStore';
import { getAppName } from '../../utils/whiteLabelUtil';

// @ts-ignore
const PAGE_DESCRIPTION = 'Please add or remove the users and organizations that will be able to view the data source within Domino. For individual type credential, users will need to add their credentials to access the data source in their project.';

export interface UpdatePermissionsProps {
  currentUserId?: string;
  currentUserName?: string;
  dataSource: DataSource;
  initPermission: Permission;
  initialUsers: string[];
  isAdminOwner: boolean;
  isAdminUser: boolean;
  onUpdateUsers: () => void;
  projectId?: string;
  setIsUpdatePermissionModalVisible: (value: boolean) => void;
}

export const UpdatePermissionModal = (
  {
    currentUserId,
    currentUserName,
    dataSource,
    initPermission,
    initialUsers,
    isAdminOwner,
    isAdminUser,
    onUpdateUsers,
    projectId,
    setIsUpdatePermissionModalVisible,
  }: UpdatePermissionsProps) => {
  const { whiteLabelSettings } = useStore()
  const [permission, setPermission] = useState<Permission>(initPermission);
  const [users, setUsers] = useState<string[]>(initialUsers);

  const handleUpdatePermissions = async () => {
    try {
      await updateUsers({
        dataSourceId: dataSource.id,
        body: {
          isEveryone: permission === Permission.Everyone ? true : false,
          userIds: permission === Permission.Specific ? users : [],
        }
      });
      success('Data Source permission has been successfully updated.');
        mixpanel.track(() =>
            new mixpanelTypes.AddedUserToDataSource({
                dataSourceId: dataSource.id,
                location: mixpanelTypes.Locations.AddedUserToDataSource
            })
        )
      onUpdateUsers();
    } catch (err) {
      const errorBody = await err.body?.json();
      error(errorBody?.message);
      console.warn(errorBody?.message);
    } finally {
      setIsUpdatePermissionModalVisible(false);
    }
  };

  const handleCloseModal = React.useCallback(() => {
    setIsUpdatePermissionModalVisible(false);
  }, [setIsUpdatePermissionModalVisible])

  return (
    <Modal
      data-test="update-permission-modal"
      visible={true}
      onCancel={handleCloseModal}
      headerBackground={colors.alabaster}
      title={<ModalTitle justifyContent={'flex-start'}>
        <DataIcon height={21} width={18}/>
        <Title>Update {getAppName(whiteLabelSettings)} Permissions</Title>
      </ModalTitle>}
      bodyStyle={{padding: '0px'}}
      width={800}
      closable={true}
      noFooter={true}
    >
      <PermissionContent>
        <PermissionStepContent
          currentUserUserId={currentUserId}
          currentUserUserName={currentUserName}
          dataSource={dataSource}
          description={PAGE_DESCRIPTION}
          isAdminOwner={isAdminOwner}
          isAdminUser={isAdminUser}
          permission={permission}
          projectId={projectId}
          setPermission={setPermission}
          setUsers={setUsers}
          users={users}
        />
      </PermissionContent>
      <ModalFooter justifyContent="flex-end">
        <CancelButton 
          btnType="secondary"
          data-test="cancel-update-permissions"
          onClick={handleCloseModal} 
        >
          Cancel
        </CancelButton>
        <Button
          btnType="primary"
          testId="update-permissions"
          onClick={handleUpdatePermissions}
        >
          Update
        </Button>
      </ModalFooter>
    </Modal>
  );
};
