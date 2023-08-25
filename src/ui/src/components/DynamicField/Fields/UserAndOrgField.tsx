import {
  DominoCommonUserPerson as UserPerson,
} from '@domino/api/dist/types';
import * as R from 'ramda';
import * as React from 'react';
import styled from 'styled-components';

import { themeHelper } from '../../../styled';
import LabelAndValue, { LabelAndValueProps } from '../../LabelAndValue';
import Link from '../../Link/Link';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { FieldStyle, LayoutFieldUsersAndOrgs } from '../DynamicField.types';
import { 
  getLabelAndValueProps 
} from '../DynamicField.utils';
import UsersAndOrgsDropdown from '../../UsersAndOrgsDropdown';

export const StyledLink = styled(Link)`
  align-items: center;
  font-size: ${themeHelper('fontSizes.tiny')};
  margin-top: ${themeHelper('margins.tiny')};
`;

export const UserAndOrgField = ({ 
  data,
  editable,
  fieldStyle,
  fullWidthInput,
  isAdminUser,
  testIdPrefix,
  onChange,
  value,
  width,
  ...props
}: LayoutFieldFactoryProps) => {
  const field = props.field as LayoutFieldUsersAndOrgs;
  const [inputValue, setInputValue] = React.useState<string[]>([]);
  const [usersAndOrganizationsByProject, setUsersAndOrganizationsByProject] = React.useState<string[]>([]);
  const projectId = data.projectId as string;

  const areAllUsersAndOrgsSelected = React.useMemo(() => 
    inputValue.some(userId => usersAndOrganizationsByProject.includes(userId)), 
    [inputValue, usersAndOrganizationsByProject]
  );

  const shouldShowAddAllFromProjectLink = React.useMemo(() => {
    const hasProjectId = Boolean(projectId);

    return editable && hasProjectId && !areAllUsersAndOrgsSelected && !R.isEmpty(usersAndOrganizationsByProject);
  }, [
    areAllUsersAndOrgsSelected,
    editable,
    projectId,
    usersAndOrganizationsByProject,
  ]);

  const handleChangeUsers = React.useCallback((selected: string[]) => {
    setInputValue(selected);
    
    if (field.path && onChange ) {
      onChange(field.path, selected);
    }
  }, [field.path, onChange, setInputValue]);

  const handleAddAllUsersAndOrganizations = React.useCallback(() => {
    handleChangeUsers(R.uniq([...inputValue, ...usersAndOrganizationsByProject]))
  }, [handleChangeUsers, inputValue, usersAndOrganizationsByProject]);

  const disabledUsers = React.useMemo(() => {
    if (field.allowOwnerToBeRemoved || !field.ownerId || !field.ownerName) {
      return undefined;
    }

    return {
      groupTitle: 'Owner',
      list: [{
        id: field.ownerId,
        name: field.ownerName,
      }],
      formatter: (value: string) => (`${value} (Owner)`),
      tooltip: 'Owner is a required user and cannot be removed',
    }
  }, [field]);

  
  const labelProps = getLabelAndValueProps(field, testIdPrefix, width, fullWidthInput);

  const displayValue = React.useMemo(() => {
    if (!Array.isArray(inputValue) || inputValue.length === 0) {
      return 'No User or groups';
    }

    return inputValue.join(', ');
  }, [inputValue]);

  const handleFetchData = React.useCallback((
    _: string[],
    userObjs: UserPerson[],
    organizationObjs: UserPerson[],
    userObjsByProject: UserPerson[],
    organizationObjsByProject: UserPerson[],
  ) => {
    const mapping = R.map(item => R.prop('id', item), [
      ...userObjsByProject,
      ...organizationObjsByProject,
    ]);

    setUsersAndOrganizationsByProject(mapping);
  }, []);

  React.useEffect(() => {
    // if value hasn't been initialized do it
    if (!value) {
      handleChangeUsers([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputElement = (
    <>
      <UsersAndOrgsDropdown
        defaultValues={inputValue}
        disabledUsers={disabledUsers}
        multiSelectStyle={{ width: width ? width : '100%' }}
        isAdmin={isAdminUser}
        onChangeUsers={handleChangeUsers}
        onFetchData={handleFetchData}
        projectId={projectId}
      />
      {shouldShowAddAllFromProjectLink && (
        <StyledLink
          onClick={handleAddAllUsersAndOrganizations}
          dataTest={`${testIdPrefix}-add-all-project-members-link`}
        >
          Add all project members
        </StyledLink>
      )}
    </>
  );
  
  if (fieldStyle === FieldStyle.FormItem) {
    return inputElement;
  }

  return (
    <LabelAndValue
      {...labelProps as LabelAndValueProps}
      value={!editable ? displayValue : inputElement}
    />
  );
}
