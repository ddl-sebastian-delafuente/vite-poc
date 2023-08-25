import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  DominoCommonUserPerson as User,
  DominoDatasourceApiDataSourceDto as DataSource,
} from '@domino/api/dist/types';
import { getAllOrganizations, getCurrentUserOrganizations } from '@domino/api/dist/Organizations';
import { listUsers } from '@domino/api/dist/Users';
import FlexLayout from '../../components/Layouts/FlexLayout';
import Button from '../../components/Button/Button';
import { colors, themeHelper } from '../../styled';
import Person from '../../icons/Person';
import Group from '../../icons/Group';
import FlagManagerProvider, { FlagManagerProviderProps } from '../../core/FlagManagerProvider';
import { error } from '../../components/toastr';
import SecondaryButton from '../../components/SecondaryButton';
import ActionDropdown from '../../components/ActionDropdown';
import { mixpanel, types as mixpanelTypes } from '../../mixpanel';
import { Permission } from './CommonData';
import RemoveUserFromDataSource from './RemoveUserFromDataSource';
import TransferOwnership from './TransferOwnership';
import { UpdatePermissionModal } from './UpdatePermissionModal';
import {
  getDataSourcePermissions,
} from './utils';
import useStore from '../../globalStore/useStore';
import { getAppName, replaceWithWhiteLabelling } from '../../utils/whiteLabelUtil';

export const DATA_SOURCE_FOR_EVERYONE_TEXT =
  'This data source is accessible to all authenticated users (‘Everyone’) for this Domino deployment.';

const Wrapper = styled.div`
  border: 1px solid ${colors.btnGrey};
  border-radius: ${themeHelper('borderRadius.standard')};
  background: ${colors.white};
  min-height: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
`;
const Content = styled.div`
  margin-top: ${themeHelper('margins.small')};
  margin-left: ${themeHelper('margins.medium')};
  margin-right: ${themeHelper('margins.medium')};
`;
const Title = styled(FlexLayout)`
  color: ${colors.greyishBrown};
  font-size: ${themeHelper('fontSizes.medium')};
  font-weight: ${themeHelper('fontWeights.bold')};
  margin-bottom: ${themeHelper('margins.tiny')};
  div:nth-child(2) {
    width: 100px !important;
  }
`;
const Description = styled.div`
  color: ${colors.brownishGrey};
  font-size: ${themeHelper('fontSizes.tiny')};
  margin-bottom: ${themeHelper('margins.medium')};
`;
const UserWrapper = styled(FlexLayout)`
  padding-bottom: ${themeHelper('paddings.small')};
`;
const IconWrapper = styled.div`
  display: inline-flex;
  svg {
    margin-right: ${themeHelper('paddings.small')};
  }
`;
const UserName = styled.div`
  color: ${colors.warmGrey};
`;
const OwnerText = styled.div`
  font-style: italic;
  font-size: 14px;
  color: ${colors.brownishGrey};
`;
const ActionWithoutBorder = styled(ActionDropdown)`
  border: none;
  font-size: ${themeHelper('fontSizes.small')};
`;
const EveryonePermissionDescription = styled.div`
  margin-top: ${themeHelper('paddings.medium')};
  border-top: 1px solid  ${colors.borderTableGrey};
  padding: ${themeHelper('paddings.small')} 0;
`;
const UserComponentContainer = styled.div`
  padding: 0 ${themeHelper('margins.medium')};
  overflow: auto;
`;

interface UserComponentProps {
  userId: string;
  userName: string;
  dataSourceId: string;
  isOwner: boolean;
  onRemoveUser: () => void;
  isOrg: boolean;
  isCurrentUserAdminOrOwner: boolean;
}

const UserComponent = (props: UserComponentProps) => (
  <UserWrapper justifyContent="space-between">
    <FlexLayout justifyContent="flex-start" alignItems="center">
      <IconWrapper>
        {props.isOrg ? <Group width={24} height={24} /> : <Person width={24} height={24} />}
      </IconWrapper>
      <UserName>{props.userName}</UserName>
    </FlexLayout>
    {props.isOwner ?
      <OwnerText>Owner</OwnerText> :
      props.isCurrentUserAdminOrOwner && <RemoveUserFromDataSource
        dataSourceId={props.dataSourceId}
        userId={props.userId}
        userName={props.userName}
        onRemoveUser={props.onRemoveUser}
      />}
  </UserWrapper>
);

interface UserWithIsOrg extends User {
  isOrg: boolean;
}
export interface UserPermissionsProps {
  dataSource: DataSource;
  isAdmin: boolean;
  onUpdateUsers: () => void;
  currentUserName?: string;
  currentUserId?: string;
  projectId?: string;
}

export const UserPermissions = (props: UserPermissionsProps) => {
  const { whiteLabelSettings } = useStore();
  const { ownerId, ownerInfo } = props.dataSource;
  const { isEveryone, userIds } = getDataSourcePermissions(props.dataSource);
  const [filteredUsers, setFilteredUsers] = React.useState<UserWithIsOrg[]>([]);
  const [isTransferOwnershipVisible, setIsTransferOwnershipVisible] = React.useState<boolean>(false);
  const [isUpdatePermissionModalVisible, setIsUpdatePermissionModalVisible] = React.useState<boolean>(false);

  const fetchData = async () => {
    if (!R.isEmpty(userIds)) {
      try {
        const [allUsers, allOrganizations] = await Promise.all([
          listUsers({}),
          props.isAdmin ? getAllOrganizations({}) : getCurrentUserOrganizations({})
        ]);
        const usersList = R.compose(
          R.sortBy(R.compose(R.toLower, R.prop('userName'))),
          R.map<User, UserWithIsOrg>((user: User) => {
            const isOrg = R.findIndex(R.propEq('organizationUserId', user.id))(allOrganizations) > -1;
            return R.assoc('isOrg', isOrg, user);
          }
        ))(allUsers.filter(user => userIds.includes(user.id)));
        setFilteredUsers(usersList);
      } catch (e) {
        console.warn(e);
        error('Failed to fetch users and organizations.');
      }
    } else {
      setFilteredUsers([]);
    }
  };

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dataSource]);

  const isAdminOrOwner = props.isAdmin || R.equals(props.currentUserName, ownerInfo.ownerName);
  const menuItems = [
    {
      key: 'updatePermissions',
      dataTest: 'update-permissions-li',
      content: 'Update Permissions',
      disabled: !isAdminOrOwner,
    },
    {
      key: 'updateOwner',
      dataTest: 'update-owner-li',
      content: 'Update Owner',
      disabled: !isAdminOrOwner,
    },
  ];
  const initPermission = R.cond([
    [R.always(isEveryone), R.always(Permission.Everyone)],
    [R.T, R.always(Permission.Specific)],
  ])();

  const trackMenuClick = () => {
    mixpanel.track(() =>
      new mixpanelTypes.DataSourceEditPermissionClick({
        dataSourceId: props.dataSource.id,
        location: mixpanelTypes.Locations.DataSourceEditPermissionClick
      })
    );
    mixpanel.track(() =>
      new mixpanelTypes.DataSourceEditPermissionPanelView({
        dataSourceId: props.dataSource.id,
        location: mixpanelTypes.Locations.DataSourceEditPermissionPanelView
      })
    );
  };

  return (
    <Wrapper>
      {isTransferOwnershipVisible && <TransferOwnership
        dataSource={props.dataSource}
        onUpdateUsers={props.onUpdateUsers}
        setIsTransferOwnershipVisible={setIsTransferOwnershipVisible}
      />}
      {isUpdatePermissionModalVisible && <UpdatePermissionModal
        dataSource={props.dataSource}
        initPermission={initPermission}
        projectId={props.projectId}
        isAdminUser={props.isAdmin}
        isAdminOwner={ownerInfo.isOwnerAdmin}
        currentUserId={props.currentUserId}
        currentUserName={props.currentUserName}
        setIsUpdatePermissionModalVisible={setIsUpdatePermissionModalVisible}
        initialUsers={userIds}
        onUpdateUsers={props.onUpdateUsers}
      />}
      <Content>
        <Title justifyContent="space-between" alignContent="center">
          User Permissions
          {isAdminOrOwner &&
          <ActionWithoutBorder
            label="edit"
            showCaret={false}
            menuItems={menuItems}
            placement="bottomLeft"
            CustomTrigger={SecondaryButton}
            dataTest="edit-permissions"
            className={'edit-permissions'}
            onMenuClick={(selectedMenu: { key: string }) => {
              if (selectedMenu.key === 'updateOwner') {
                setIsTransferOwnershipVisible(true);
              } else {
                setIsUpdatePermissionModalVisible(true);
                trackMenuClick();
              }
            }}
          />}
        </Title>
        <Description>
          Users with permissions can view and use this data source in projects. Data access still
          requires valid individual or service account credentials.
        </Description>
      </Content>
      <UserComponentContainer>
        <UserComponent
          key={ownerId}
          userId={ownerId}
          userName={ownerInfo.ownerName}
          dataSourceId={props.dataSource.id}
          isOwner={true}
          onRemoveUser={props.onUpdateUsers}
          isOrg={false}
          isCurrentUserAdminOrOwner={isAdminOrOwner}
        />
        {isEveryone ?
          <>
            <EveryonePermissionDescription>
              {replaceWithWhiteLabelling(getAppName(whiteLabelSettings))(DATA_SOURCE_FOR_EVERYONE_TEXT)}
            </EveryonePermissionDescription>
            {isAdminOrOwner && <Button
              btnType="secondary"
              testId="update-permissions-button"
              onClick={() => setIsUpdatePermissionModalVisible(true)}
            >
              Update Permissions
            </Button>}
          </> :
          R.map((user: UserWithIsOrg) => (
              <UserComponent
                key={user.id}
                userId={user.id}
                userName={user.userName}
                dataSourceId={props.dataSource.id}
                isOwner={false}
                onRemoveUser={props.onUpdateUsers}
                isOrg={user.isOrg}
                isCurrentUserAdminOrOwner={isAdminOrOwner}
              />
            ),
            filteredUsers
          )}
      </UserComponentContainer>
    </Wrapper>
  );
};

export interface UserPermissionsContainerProps extends RouteComponentProps<void> {
  dataSource: DataSource;
  onUpdateUsers: () => void;
  projectId?: string;
}

const UserPermissionsContainer = (props: UserPermissionsContainerProps) => {
  return (
    <FlagManagerProvider {...props}>
      {(coreState: FlagManagerProviderProps) => {
        return (
          <UserPermissions
            {...props}
            isAdmin={coreState.showAdminMenu}
            currentUserName={coreState.currentUser?.userName}
            currentUserId={coreState.currentUser?.id}
          />
        );
      }}
    </FlagManagerProvider>
  );
};

export default withRouter(UserPermissionsContainer);
