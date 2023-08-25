import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DominoCommonUserPerson,
  DominoDatasourceApiDataSourceDto as DataSource,
} from '@domino/api/dist/types';
import { Form } from '@ant-design/compatible';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form/Form';
import { kebabCase } from 'lodash';
import { always, cond, defaultTo, isEmpty, map, prop, T, uniq } from 'ramda';

import useStore from '@domino/ui/dist/globalStore/useStore';
import { getAppName } from '@domino/ui/dist/utils/whiteLabelUtil';
import { RadioChangeEvent } from '@domino/ui/dist/components/Radio';
import UsersAndOrgsDropdown from '../../../components/UsersAndOrgsDropdown';
import {
  Container,
  MultiSelectArea,
  RadioLinkContent,
  SimpleModeTextContainer,
  StyledFormItem,
  StyledLink,
  StyledRadioContent,
  StyledRadioGroup,
  WizardContentTitle,
} from '../CommonStyles';
import { DataSourceType, getGeneralPermissionName, Permission } from '../CommonData';

// @ts-ignore
const PAGE_DESCRIPTION = 'You can specify which users and organizations can view and use this data source in projects. Data access still requires valid individual or service account credentials.';

interface UsersAndOrgsComponentProps {
  currentUserUserId: string;
  currentUserUserName: string;
  // DataSource is only used when this component is updating
  // user permissions. If this component is part of the create process it
  // assumes the current user userid/name will be the owner
  dataSource?: DataSource;
  hidden: boolean;
  isAdminUser: boolean
  projectId?: string;
  setUsersAndOrganizationsByProject: (value: string[]) => void;
  setUsers: (selectedValues: string[]) => void;
  showAddProjectLink: boolean;
  usersAndOrganizationsByProject: string[];
  users: string[];
  multiSelectStyle?: React.CSSProperties;
}

const UsersAndOrgsComponent = (
  {
    currentUserUserId,
    currentUserUserName,
    dataSource,
    hidden,
    isAdminUser,
    projectId,
    setUsersAndOrganizationsByProject,
    setUsers,
    showAddProjectLink,
    usersAndOrganizationsByProject,
    users,
    multiSelectStyle
  }: UsersAndOrgsComponentProps
) => (
  <MultiSelectArea hidden={hidden}>
    <UsersAndOrgsDropdown
      projectId={projectId}
      defaultValues={defaultTo([])(users)}
      disabledUsers={currentUserUserId ?
        {
          groupTitle: 'Owner',
          list: [
            dataSource ? {
              id: dataSource.ownerId,
              name: dataSource.ownerInfo.ownerName,
            } : {
              id: currentUserUserId,
              name: currentUserUserName,
            }
          ],
          formatter: (value: string) => `${value} (Owner)`,
          tooltip: 'Owner is a required user and cannot be removed',
        } : undefined
      }
      onChangeUsers={(newUsers) => setUsers(newUsers)}
      onFetchData={(
        _,
        userObjs: DominoCommonUserPerson[],
        organizationObjs: DominoCommonUserPerson[],
        userObjsByProject: DominoCommonUserPerson[],
        organizationObjsByProject: DominoCommonUserPerson[],
      ) => {
        setUsersAndOrganizationsByProject(map(item =>
          prop('id', item), [...userObjsByProject, ...organizationObjsByProject]));
      }}
      isAdmin={isAdminUser}
      multiSelectStyle={multiSelectStyle}
    />
    {showAddProjectLink &&
    <StyledLink
      onClick={() => setUsers(uniq([...users, ...usersAndOrganizationsByProject]))}
      dataTest="data-source-permission-add-all-project-members-link"
    >
      Add all project members
    </StyledLink>
    }
  </MultiSelectArea>
);

interface PermissionProps {
  key: string;
  text: string;
  value: string;
}

export interface PermissionStepContentProps {
  currentUserUserId?: string;
  currentUserUserName?: string;
  dataSource?: DataSource;
  dataType?: DataSourceType;
  isAdminUser: boolean;
  isAdminOwner: boolean;
  description?: string;
  projectId?: string;
  permission: Permission;
  setPermissionDescription?: (value: string) => void;
  setPermission: (value: Permission) => void;
  setUsers: (selectedValues: string[]) => void;
  users: string[];
}

const PermissionStepContent = (
  {
    currentUserUserId = '',
    currentUserUserName = '',
    dataSource,
    dataType,
    description = PAGE_DESCRIPTION,
    form,
    isAdminOwner,
    isAdminUser,
    projectId,
    permission,
    setPermissionDescription = () => undefined,
    setPermission,
    setUsers,
    users,
  }: PermissionStepContentProps & FormComponentProps
) => {
  const { whiteLabelSettings } = useStore();
  const {getFieldDecorator, resetFields} = form;
  const [usersAndOrganizationsByProject, setUsersAndOrganizationsByProject] = useState<string[]>([]);

  useEffect(() => {
    if (dataType) {
      resetFields();
      setPermission(getGeneralPermissionName(isAdminUser));
      setPermissionDescription(getGeneralPermissionName(isAdminUser));
      setUsers([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataType, resetFields]);

  const permissionOptions: PermissionProps[] = useMemo(() => {
    return [
      {
        key: 'general',
        value: getGeneralPermissionName(isAdminUser),
        text: getGeneralPermissionName(isAdminUser),
      },
      {
        key: 'specific',
        value: 'Specific',
        text: 'Specific users or organizations',
      }
    ]
  }, [isAdminUser]);

  useEffect(() => {
    if (typeof setPermissionDescription === 'function') {
      const permissionDescription = cond([
        [always(permission !== Permission.Specific), always(permission)],
        [always(users.length === 1), always('1 user or organization')],
        [always(users.length > 1), always(`${users.length} users and organizations`)],
        [T, always(undefined)],
      ])();
      setPermissionDescription(permissionDescription);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission, users]);

  const allUsersAndOrgsSelected = useMemo(() => {
    return users.some((value) => usersAndOrganizationsByProject.includes(value));
  }, [users, usersAndOrganizationsByProject]);

  const getShowProjectLink = useCallback((permissionType?: PermissionProps) => {
    const showAddProjectLink = Boolean(projectId)
      && !allUsersAndOrgsSelected
      && !isEmpty(usersAndOrganizationsByProject);

    if (!permissionType) {
      return showAddProjectLink;
    }
    return showAddProjectLink
      && (permissionType.value === Permission.Specific)
      && (permission === Permission.Specific);
  }, [
    allUsersAndOrgsSelected,
    permission,
    projectId,
    usersAndOrganizationsByProject,
  ]);

  return (
    <Container>
      <Form
        layout="vertical"
        autoComplete="off"
        hideRequiredMark={true}
      >
        <StyledFormItem
          label={<WizardContentTitle>{getAppName(whiteLabelSettings)} Permissions</WizardContentTitle>}
        >
          <SimpleModeTextContainer data-test="data-source-permission-description">
            {description}
          </SimpleModeTextContainer>
          {getFieldDecorator('permission', {
            rules: [{
              required: true,
            }],
            initialValue: permission
          })(
            isAdminUser ?
              (
                <StyledRadioGroup
                  onChange={(e: RadioChangeEvent) => setPermission(e.target.value)}
                  dataTest="data-source-permission-radio-group"
                  items={map(
                    (permissionProps: PermissionProps) => {
                      const { key, text, value } = permissionProps;
                      const disabled = value === Permission.Everyone && !isAdminOwner;
                      const tooltipContent = disabled ? 'This option is only available for data sources owned by an admin' : '';
                      return {
                        key: key,
                        value: value,
                        disabled: disabled,
                        'data-test': `data-source-permission-radio-${kebabCase(text)}`,
                        label:
                          <StyledRadioContent>
                            <RadioLinkContent data-test={`data-source-permission-radio-${kebabCase(text)}-text`}>
                              <Tooltip title={tooltipContent}>
                                {text}
                              </Tooltip>
                            </RadioLinkContent>
                          </StyledRadioContent>
                      }
                    },
                    permissionOptions
                  )}
                />
            ) : <div/>
          )}
          {(permission === Permission.Specific) &&
            <UsersAndOrgsComponent
              currentUserUserId={currentUserUserId}
              currentUserUserName={currentUserUserName}
              dataSource={dataSource}
              hidden={permission !== Permission.Specific}
              isAdminUser={isAdminUser}
              projectId={projectId}
              setUsersAndOrganizationsByProject={setUsersAndOrganizationsByProject}
              setUsers={setUsers}
              showAddProjectLink={getShowProjectLink(permissionOptions[1])}
              usersAndOrganizationsByProject={usersAndOrganizationsByProject}
              users={users}
              multiSelectStyle={{ width: '100%' }}
            />}
        </StyledFormItem>
      </Form>
    </Container>
  );
};

export default Form.create<PermissionStepContentProps & FormComponentProps>()(PermissionStepContent);
