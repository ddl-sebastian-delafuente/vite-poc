import { getPrincipal } from '@domino/api/dist/Auth';
import {
  DominoCommonUserPerson as User,
} from '@domino/api/dist/types';
import { getCurrentUser } from '@domino/api/dist/Users';
import { DeleteOutlined } from '@ant-design/icons';
import * as R from 'ramda';
import * as React from 'react';
import styled from 'styled-components';

import { HELP_PREFIX, SUPPORT_ARTICLE } from '../core/supportUtil';
import PersonIcon from '../icons/Person';
import GroupIcon from '../icons/Group';
import { initialPrincipal } from '../proxied-api/initializers';
import { Role } from '../proxied-api/types';
import { themeHelper } from '../styled/themeUtils';
import { usePrevious } from '../utils/CustomHooks';
import { useRemoteData } from '../utils/useRemoteData';
import Button from './Button/Button';
import InfoBox from './Callout/InfoBox';
import Link from './Link/Link';
import tooltipRenderer from './renderers/TooltipRenderer';
import Select, { SelectProps } from './Select';
import { CompactTable } from './Table/CompactTable';
import { ColumnConfiguration } from './Table/Table';
import UsersAndOrgsDropdown from './UsersAndOrgsDropdown';

export interface RoleOption {
  /**
   * Additional text to help users understand
   * the roles capabilities
   */
  helpText: string;

  label: string;
  value: string;
}

export interface RoleOptions {
  [key: string]: RoleOption;
}

const DEFAULT_AVAILABLE_ROLES: Role[] = [
  Role.DatasetRwReader,
  Role.DatasetRwEditor,
  Role.DatasetRwOwner,
];

const ROLE_OPTIONS = {
  [Role.DatasetRwEditor]: {
    helpText: 'Read and Edit dataset, View metadata',
    label: 'Editor',
    value: Role.DatasetRwEditor,
  },
  [Role.DatasetRwOwner]: {
    helpText: 'Read and Edit dataset, View metadata, Edit permissions',
    label: 'Owner',
    value: Role.DatasetRwOwner,
  },
  [Role.DatasetRwReader]: {
    helpText: 'Read dataset, View metadata',
    label: 'Reader',
    value: Role.DatasetRwReader,
  }
};

const getRoleOption = (role: Role): RoleOption => {
  const roleOption = ROLE_OPTIONS[role];

  if (!roleOption) {
    throw new ReferenceError(`Missing role option for role ${role}`);
  }

  return roleOption;
}

const AddAllProjectMembersWrapper = styled.span`
  color: blue;
  cursor: pointer;
`

const AddUserRoleWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  width: 100%;

  & > div:not(:last-child) {
    margin-right: 16px;
  }

  // User Input
  & > div:nth-child(1) {
    flex: 1;
  }

  // Role Selector
  & > div:nth-child(2) {
    flex: 0;
    width: 100px;
  }

  // Add Button
  & > div:nth-child(3) {
    flex: 0;

    // Last element is somehow overflowing bounds
    // of the container this is to compensate for
    // the overflow.
    margin-right: 10px;
    width: 50px
  }
`;

const ColumnNameWrapper = styled.div`
  align-items: center;
  display: flex;
  font-size: ${themeHelper('fontSizes.small')};

  & > svg {
    margin-right: 5px;
  }
`

const InfoboxCalloutText = styled.span`
  margin-right: 0.25em;
`;

const StyledInfoBox = styled(InfoBox)`
  margin: 0;
`;

const StyledLink = styled(Link)`
  font-size: 0.75em;
`

const UserRoleEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > div:not(:last-child) {
    margin-bottom: ${themeHelper('margins.large')};
  }
`;

interface UserAndId {
  targetId: string;
  targetName: string;
}

interface UserAndIdValues {
  allUsers: UserAndId[];
  usersInProject: UserAndId[];
}

interface UseRoleEditorContextValue extends UserAndIdValues {
  availableRoles: Role[];
  currentUserId?: string;
  setUsers: (allUsers: UserAndId[], usersInProject: UserAndId[]) => void;
}

const UserRoleEditorContext = React.createContext<UseRoleEditorContextValue>({
  allUsers: [],
  availableRoles: [],
  usersInProject: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUsers: () => {},
});

export interface RoleSelectorProps extends Pick<SelectProps, 'style'> {
  availableRoles?: Role[];
  disabled?: boolean;
  initialRole?: Role;
  onRoleChange: (newRole: string) => void;
  orgSelected?: boolean;
  userSelected?: boolean;
}

export const RoleSelector = ({
  availableRoles = DEFAULT_AVAILABLE_ROLES,
  disabled,
  onRoleChange,
  ...props
}: RoleSelectorProps) => {
  const [initialRole, setInitialRole] = React.useState(props.initialRole);

  const resolvedAvailableRoles = React.useMemo(() => {
    return availableRoles;
  }, [availableRoles]);

  const [selectedRole, setSelectedRole] = React.useState(
    getRoleOption(initialRole || resolvedAvailableRoles[0]).value
  );
  const prevSelectedRole = usePrevious(selectedRole);

  React.useEffect(() => {
    setInitialRole(props.initialRole);
  }, [props.initialRole]);

  React.useEffect(() => {
    if (!initialRole && !prevSelectedRole && selectedRole !== prevSelectedRole) {
      onRoleChange(selectedRole);
    }
  }, [initialRole, onRoleChange, prevSelectedRole, selectedRole]);

  const handleSelectRole = React.useCallback((newRole: string) => {
    setSelectedRole(newRole);
    onRoleChange(newRole);
  }, [onRoleChange, setSelectedRole]);

  const roleOptions = React.useMemo(() => {
    return resolvedAvailableRoles.reduce((memo, role) => {
      try {
        const roleOption = getRoleOption(role);

        memo.push(
          <Select.Option
            key={role}
            role="option"
            value={roleOption.value}
          >
            <div>{roleOption.label}</div>
            { roleOption.helpText ? <div>{roleOption.helpText}</div> : null }
          </Select.Option>
        );
        return memo;
      } catch (e) {
        console.warn(e);
      }

      return memo;
    }, [] as JSX.Element[]);
  }, [resolvedAvailableRoles]);

  return (
    <Select
      disabled={disabled}
      dropdownMatchSelectWidth={false}
      getPopupContainer={() => document.body}
      onChange={handleSelectRole}
      style={props.style || { width: undefined }}
      value={selectedRole}
    >
      {roleOptions}
    </Select>
  );
};

export interface UserRole extends UserAndId {
  isOrganization?: boolean;
  targetRole?: Role;
}

export interface AddUserRoleProps extends
  Pick<UserRoleEditorProps, 'availableRoles'> {
  defaultValues: string[],
  isAdmin: boolean,
  list: UserRole[],
  onAddUserRole: (list: UserRole[]) => void;
  onAddProjectMembers: () => void;
  projectId?: string;
}

const mergeUserData = (selectedValues: string[], users: UserRole[], selectedRole?: Role) => {
  return  selectedValues.map((targetId) => {
    const user = users.find(obj => obj.targetId === targetId);

    return {
      ...user,
      targetId,
      targetName: user?.targetName || '',
      targetRole: selectedRole,
    }
  });
}

export const AddUserRole = ({
  availableRoles,
  defaultValues,
  isAdmin,
  list,
  onAddProjectMembers,
  onAddUserRole,
  projectId,
}: AddUserRoleProps) => {
  const [userRoles, setUserRoles] = React.useState<UserRole[]>([]);
  const [selectedRole, setSelectedRole] = React.useState<Role>();
  const context = React.useContext(UserRoleEditorContext);

  const prevDefaultValues = usePrevious(defaultValues);

  const userRoleIds = React.useMemo(() => {
    return userRoles.map(({ targetId }) => targetId);
  }, [userRoles]);

  const disableAddButton = userRoles.length === 0 || !selectedRole;

  const hasOrgSelected = React.useMemo(() => {
    return userRoles.findIndex((user) => user.isOrganization) > -1;
  }, [userRoles]);

  const hasUserSelected = React.useMemo(() => {
    return userRoles.findIndex((user) => !user.isOrganization) > -1;
  }, [userRoles]);

  const handleAddUserRole = React.useCallback(() => {
    onAddUserRole(userRoles);
    setUserRoles([]);
  }, [onAddUserRole, userRoles]);

  const handleChangeUsers = React.useCallback((selectedValues: string[]) => {
    const newUsers = mergeUserData(selectedValues, context.allUsers, selectedRole);
    setUserRoles(newUsers);
  }, [context.allUsers, selectedRole, setUserRoles]);

  const handleFetchData = React.useCallback((_: any,
    allUsers: User[], allOrganizations: User[],
    usersByProject: User[], organizationsByProject: User[]
  ) => {
    const orgs = allOrganizations;
    const orgsByProject= organizationsByProject;

    const mergedAllUsers = [
      ...orgs.map(obj => {
        return {
          targetId: obj.id,
          targetName: obj.userName,
          isOrganization: true,
        }
      }),
      ...allUsers.map(({ id, userName, firstName, lastName }) => ({ targetId: id, targetName: userName, isOrganization: !firstName && !lastName })),
    ];

    const mergedProjectUsers = [
      ...orgsByProject.map(obj => {
        return {
          targetId: obj.id,
          targetName: obj.userName,
          isOrganization: true,
        }
      }),
      ...usersByProject.map(({ id, userName, firstName, lastName }) => ({ targetId: id, targetName: userName, isOrganization: !firstName && !lastName })),
    ];

    context.setUsers(mergedAllUsers, mergedProjectUsers);
  }, [context]);

  const handleRoleChange = React.useCallback((newRole: Role) => {
    setUserRoles(userRoles.map((userRole) => ({
      ...userRole,
      targetRole: newRole,
    })));
    setSelectedRole(newRole);
  }, [setUserRoles, userRoles]);

  React.useEffect(() => {
    if (prevDefaultValues && prevDefaultValues.length < defaultValues.length) {
      handleChangeUsers(R.union(userRoleIds, defaultValues));
      onAddProjectMembers();
    }
  }, [defaultValues, handleChangeUsers, onAddProjectMembers, prevDefaultValues, userRoleIds]);

  return (
    <AddUserRoleWrapper>
      <div>
        <UsersAndOrgsDropdown
          defaultValues={userRoleIds}
          excludeUsers={list.map(({ targetId }) => targetId)}
          isAdmin={isAdmin}
          multiSelectStyle={{ width: '100%' }}
          onChangeUsers={handleChangeUsers}
          onFetchData={handleFetchData}
          projectId={projectId}
        />
      </div>
      <RoleSelector
        availableRoles={availableRoles}
        onRoleChange={handleRoleChange}
        orgSelected={hasOrgSelected}
        userSelected={hasUserSelected}
      />
      <Button
        btnType="secondary"
        disabled={disableAddButton}
        onClick={handleAddUserRole}
        size="small"
      >Add</Button>
    </AddUserRoleWrapper>
  )
}

export interface UserRoleListProps {
  canRemoveSelf?: boolean;
  editable?: boolean;
  list: UserRole[],
  onUpdate: (newList: UserRole[]) => void;
}

export const UserRoleList = ({
  canRemoveSelf,
  editable,
  list,
  onUpdate,
}: UserRoleListProps) => {
  const context = React.useContext(UserRoleEditorContext);

  const handleDeleteRecord = React.useCallback((selectedIndex: number, disabled: boolean) => () => {
    if (disabled) {
      return;
    }
    const newList = list.filter((elem, index) => index !== selectedIndex);
    onUpdate(newList);
  }, [list, onUpdate]);

  const handleRoleChange = React.useCallback((selectedIndex: number) => (newRole: Role) => {
    const newList = list.map((userRole, index) => {
      if (index !== selectedIndex) {
        return userRole;
      }

      return {
        ...userRole,
        targetRole: newRole
      };
    });

    onUpdate(newList);
  }, [list, onUpdate]);


  const columns = React.useMemo(() => {
    const baseColumns: ColumnConfiguration<UserRole>[] = [
      {
        dataIndex: 'targetName',
        title: 'Users and Organizations',
        render: (value: string, record: UserRole) => {
          const Icon = record.isOrganization ? GroupIcon : PersonIcon;
          return <ColumnNameWrapper><Icon/> {value}</ColumnNameWrapper>;
        },
        sorter: false,
      },
      {
        title: <span>Role <StyledLink openInNewTab href={`${HELP_PREFIX}${SUPPORT_ARTICLE.DATASET_ROLES}`}>(READ DOCS)</StyledLink></span>,
        dataIndex: 'targetRole',
        render: (value: Role, record: UserRole, index: number) => {
          return (
            <RoleSelector
              disabled={!editable}
              availableRoles={context.availableRoles}
              initialRole={record.targetRole}
              onRoleChange={handleRoleChange(index)}
              orgSelected={record.isOrganization}
              userSelected={!record.isOrganization}
              style={{ width: '100%' }}
            />
          )
        },
        sorter: false,
        width: 126,
      },
    ];

    if (!editable) {
      return baseColumns;
    }

    const deleteDisabled = list.length === 1;

    baseColumns.push({
      title: '',
      render: (value: Role, record: UserRole, index: number) => {
        const shouldShowDelete = canRemoveSelf || (!canRemoveSelf && record.targetId !== context.currentUserId);


        // Using the icon only instead of a button because the button component
        // creates a invisible button that shows it's borders when interacting
        // with it. There seems to be a lot of different styles that being used
        // for the situation that are not easy to override
        return shouldShowDelete && (
          tooltipRenderer(
            deleteDisabled ? 'A dataset needs to have at least one user. Please add a different user before removing this one.' : null,
            <DeleteOutlined 
              disabled={deleteDisabled} 
              style={{
                color: 'red', 
                cursor: deleteDisabled ? 'not-allowed' : 'pointer',
                fontSize: '16px', 
                opacity: deleteDisabled ? 0.5 : 1,
              }} 
              onClick={handleDeleteRecord(index, deleteDisabled)}
            />,
            'top'
          )
        )
      },
      width: 24
    })
    return baseColumns;
  }, [canRemoveSelf, context.availableRoles, context.currentUserId, editable, handleDeleteRecord, handleRoleChange, list]);

  return (
    <CompactTable
      hideColumnFilter={true}
      hideRowSelection={true}
      columns={columns}
      dataSource={list}
      rowKey={(record: UserRole) => record.targetId}
      showPagination={false}
      showSearch={false}
    />
  )
}

export interface AddAllProjectMembersButtonProps {
  list: UserRole[];
  onUpdate: (newList: UserRole[]) => void;
  projectId: string;
}

export const AddAllProjectMembersButton = ({
  list,
  onUpdate,
  // projectId,
}: AddAllProjectMembersButtonProps) => {
  const context = React.useContext(UserRoleEditorContext);
  const handleAddAllProjectMemebers = React.useCallback(() => {
    const newList = context.usersInProject.reduce((memo, target) => {
      // Check if target alrady exists in list
      const found = memo.find((obj: UserAndId) => obj.targetId === target.targetId);

      if (found) {
        return memo;
      }

      memo.push({
        ...target,
        targetRole: context.availableRoles[0],
      });

      return memo;
    }, [...list]);

    onUpdate(newList);
  }, [context.availableRoles, context.usersInProject, list, onUpdate]);

  const allMemebersAlreadyAdded = React.useMemo(() => {
    const listIds = list.map(({targetId}) => targetId).sort();
    const idsToAdd = context.usersInProject.map(({targetId}) => targetId).sort();

    const idsAdded = R.intersection(listIds, idsToAdd);

    return R.equals(idsToAdd, idsAdded);
  }, [context.usersInProject, list]);

  if (allMemebersAlreadyAdded) {
    return null;
  }

  return (
    <AddAllProjectMembersWrapper onClick={handleAddAllProjectMemebers}>Add all project members</AddAllProjectMembersWrapper>
  );
}

export interface UserRoleEditorProps extends
  Pick<RoleSelectorProps, 'availableRoles'> {
  addAllProjectMemebersCalloutText?: string;
  canRemoveSelf?: boolean;
  disableAddAllProjectMembers?: boolean;
  editable?: boolean;
  onChange: (users: UserRole[]) => void;
  projectId?: string;
  userList?: UserRole[];
}

export const UserRoleEditor = ({
  addAllProjectMemebersCalloutText = 'You will need to restart any running executions for the permissions you update here. Project permissions will no longer directly apply to new datasets. You will need to add users to each dataset individually.',
  availableRoles = DEFAULT_AVAILABLE_ROLES,
  canRemoveSelf,
  disableAddAllProjectMembers,
  editable,
  onChange,
  projectId,
  userList = [],
}: UserRoleEditorProps) => {
  const prevUserList = usePrevious(userList);
  const [list, setList] = React.useState<UserRole[]>(userList);
  const [initialAddUsers, setInitialAddUsers] = React.useState<string[]>([]);
  const [contextState, setContextState] = React.useState<UserAndIdValues>({
    allUsers: [],
    usersInProject: [],
  });

  const { data: principal } = useRemoteData({
    canFetch: true,
    fetcher: () => getPrincipal({}),
    initialValue: initialPrincipal,
  });

  const { data: currentUser } = useRemoteData({
    canFetch: true,
    fetcher: () => getCurrentUser({}),
    initialValue: {
      avatarUrl: '',
      firstName: '',
      fullName: '',
      id: '',
      lastName: '',
      userName: '',
    }
  });

  const handleAddUserRole = React.useCallback((userRoles: UserRole[]) => {
    const newList = userRoles.reduce((memo, value) => {
      const found = memo.find(({ targetId }) => value.targetId === targetId);
      if (found) {
        return memo;
      }

      memo.push(value);
      return memo;
    }, [...list]);
    setList(newList);
    onChange(newList);
    setInitialAddUsers([]);
  }, [list, onChange, setInitialAddUsers, setList]);

  const handleUpdateList = React.useCallback((newList: UserRole[]) => {
    setList(newList);
    onChange(newList);
  }, [onChange, setList]);

  const handleSetInitialAddUsers = React.useCallback((selected: UserRole[]) => {
    const existingIds = list.map(user => user.targetId);
    const selectedIds = selected.map((user) => user.targetId);

    const resolved = selectedIds.filter((id) => existingIds.indexOf(id) === -1);
    setInitialAddUsers(resolved);
  }, [setInitialAddUsers, list]);

  const canShowAddAllProjectMembers = projectId && !disableAddAllProjectMembers;

  const handleSetContextState = React.useCallback((allUsers: UserAndId[], usersInProject: UserAndId[]) => {
    setContextState({ allUsers, usersInProject });
  }, [setContextState]);

  React.useEffect(() => {
    if (!R.equals(userList, prevUserList)) {
      setList(userList)
    }
  }, [prevUserList, setList, userList])

  return (
    <UserRoleEditorContext.Provider
      value={{
        ...contextState,
        availableRoles,
        currentUserId: currentUser.id,
        setUsers: handleSetContextState
      }}
    >
      <UserRoleEditorWrapper>
        {editable && (
          <AddUserRole
            availableRoles={availableRoles}
            defaultValues={initialAddUsers}
            isAdmin={principal.isAdmin}
            list={list}
            onAddProjectMembers={() => setInitialAddUsers([])}
            onAddUserRole={handleAddUserRole}
            projectId={projectId || ''}
          />
        )}
        {canShowAddAllProjectMembers && editable && (
          <StyledInfoBox>
            <InfoboxCalloutText>
              {addAllProjectMemebersCalloutText} <AddAllProjectMembersButton
                list={list}
                onUpdate={handleSetInitialAddUsers}
                projectId={projectId as string}
              />
            </InfoboxCalloutText>
          </StyledInfoBox>
        )}
        <UserRoleList
          canRemoveSelf={canRemoveSelf}
          editable={editable}
          list={list}
          onUpdate={handleUpdateList}
        />
      </UserRoleEditorWrapper>
    </UserRoleEditorContext.Provider>
  )
};
