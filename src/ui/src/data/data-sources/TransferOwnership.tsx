import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { UserOutlined } from '@ant-design/icons';
// eslint-disable-next-line no-restricted-imports
import { AutoComplete, Input } from 'antd';
import {
  DominoCommonUserPerson as User,
  DominoDatasourceApiDataSourceDto as DataSource,
} from '@domino/api/dist/types';
import { getAdminUsers, transferOwnership } from '@domino/api/dist/Datasource';
import { listUsers } from '@domino/api/dist/Users';
import { error, success } from '@domino/ui/dist/components/toastr';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal';
import { colors, themeHelper } from '../../styled';
import FlexLayout from '../../components/Layouts/FlexLayout';
import { DataSourceType } from './CommonData';
import { CancelButton, ModalFooter } from './CommonStyles';
import useStore from '../../globalStore/useStore';
import { getAppName } from '../../utils/whiteLabelUtil';

const Title = styled.div`
  color: ${colors.greyishBrown};
  font-size: ${themeHelper('fontSizes.large')};
  margin-left: ${themeHelper('margins.tiny')};
  font-weight: ${themeHelper('fontWeights.normal')};
`;
const Content = styled.div`
  padding: ${themeHelper('margins.medium')};
  background: ${colors.alabaster};
`;
const Description = styled.div`
  margin-bottom: ${themeHelper('margins.large')};
`;
const Label = styled.div`
  font-weight: ${themeHelper('fontWeights.bold')};
  margin-bottom: ${themeHelper('margins.tiny')};
`;
const inputStyle = { width: '100%' };

interface KeyValue {
  key: string;
  value: string;
}
interface FormattedUser extends KeyValue {
  fullName: string;
}

export interface TransferOwnershipProps {
  dataSource: DataSource;
  onUpdateUsers: () => void;
  setIsTransferOwnershipVisible: (visible: boolean) => void;
}

const needToBeAdmin = (datasource: DataSource) => {
  const { dataSourcePermissions } = datasource;
  
  return dataSourcePermissions?.isEveryone || 
    dataSourcePermissions?.credentialType=== 'Shared' ||
    datasource.dataSourceType === DataSourceType.TeradataConfig;
};

const TransferOwnership = (props: TransferOwnershipProps) => {
  const { whiteLabelSettings } = useStore();
  const [users, setUsers] = React.useState<FormattedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<FormattedUser[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<KeyValue|null>();

  const resetState = () => {
    setUsers([]);
    setFilteredUsers([]);
    setSelectedUser(undefined);
  };

  const handleTransferOwnership = async () => {
    try {
      if (selectedUser) {
        await transferOwnership({
          dataSourceId: props.dataSource.id,
          newOwner: selectedUser.key
        });
        success(`Data Source owner was successfully updated to ${selectedUser.value}`);
        resetState();
        props.onUpdateUsers();
      } else {
        error('Please select a User');
      }
    } catch (e) {
      console.warn(e);
      error('There was an error updating the data source owner. Please try again later.');
    }
  };

  const getUserList = async (dataSource: DataSource) => {
    try {
      let usersData = await listUsers({});
      if (usersData.length > 0 && needToBeAdmin(dataSource)) {
        const ids = R.map(item => R.prop('id', item), usersData);
        usersData = await getAdminUsers({body: {userIds: ids}});
      }
      const formattedUsers = usersData.map((user: User) => ({
        key: user.id,
        value: user.userName,
        fullName: user.fullName,
      }));
      setUsers(R.filter((user: FormattedUser) => user.value !== dataSource.ownerId, formattedUsers));
    } catch (e) {
      console.warn(e);
      error('There was an error getting the list of users.');
    }
  };

  React.useEffect(() => {
    getUserList(props.dataSource);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const fetchUser = async (searchString: string) => {
    const query = searchString.trim();
    if (R.isEmpty(query)) {
      setSelectedUser(null);
    }
    const usersByQuery = R.isEmpty(query) ? [] : R.filter((user: FormattedUser) =>
      R.contains(R.toLower(query), R.toLower(user.fullName)) ||
       R.contains(R.toLower(query), R.toLower(user.value)), users);
    return setFilteredUsers(usersByQuery);
  };

  const onSelect = (userId: string) => {
    const user = R.find(R.propEq('value', userId))(users);
    setSelectedUser(user);
  };

  return (
    <Modal
      data-test="transfer-ownership-modal"
      visible={true}
      onCancel={() => props.setIsTransferOwnershipVisible(false)}
      headerBackground={colors.alabaster}
      title={
        <FlexLayout justifyContent="flex-start" alignItems="center">
          <UserOutlined style={{fontSize: '18px'}} />
          <Title>Transfer Data Source Ownership</Title>
        </FlexLayout>
      }
      bodyStyle={{padding: '0px'}}
      width={800}
      closable={true}
      noFooter={true}
    >
      <Content>
        <Description>
          By transferring ownership, the previous owner will no longer be able to edit, delete or share
          the data source with other users. They will not lose access to the data sources.
          {getAppName(whiteLabelSettings)} admins are always able to edit the data source or re-assign an owner.
        </Description>
        <Label>
          New Data Source Owner
        </Label>
        <AutoComplete
          data-test="search-users"
          onSearch={fetchUser}
          onSelect={onSelect}
          options={filteredUsers}
          style={inputStyle}
        >
          <Input data-test="search-users-input" placeholder={'Search Users'}/>
        </AutoComplete>
      </Content>
      <ModalFooter justifyContent="flex-end">
        <CancelButton
            btnType="secondary"
            onClick={() => props.setIsTransferOwnershipVisible(false)}
            testId="cancel-transfer-datasource-ownership"
        >
          Cancel
        </CancelButton>
        <Button
          btnType="primary"
          onClick={() => {
            handleTransferOwnership();
            props.setIsTransferOwnershipVisible(false);
          }}
          disabled={selectedUser === undefined}
          testId="confirm-transfer-datasource-ownership"
        >
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TransferOwnership;
