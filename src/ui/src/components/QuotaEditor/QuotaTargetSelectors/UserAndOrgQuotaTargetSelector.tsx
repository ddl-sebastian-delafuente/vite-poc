import {
  DominoCommonUserPerson as User,
} from '@domino/api/dist/types';
import * as React from 'react';

import UsersAndOrgsDropdown, { Props as UsersAndOrgsDropdownProps } from '../../UsersAndOrgsDropdown';
import { 
  BaseQuota,
  QuotaTargetSelectorProps,
  QuotaTarget 
} from '../QuotaEditor.types';

interface SelectTarget extends QuotaTarget {
  isOrganization: boolean;
}

type UserAndOrgQuotaTargetSelectorProps<T> =
  QuotaTargetSelectorProps<T> &
  Pick<UsersAndOrgsDropdownProps, 'aria-label' | 'data-test' | 'omitOrgs' | 'omitUsers' | 'placeholder'>

export const UserAndOrgQuotaTargetSelector = <T extends BaseQuota>({ 
  existingRecords,
  omitOrgs,
  omitUsers,
  onChange,
  placeholder,
  ...rest
  }: UserAndOrgQuotaTargetSelectorProps<T>) => {
  const [possibleTargets, setPossibleTargets] = React.useState<SelectTarget[]>([]);
  const handleChangeUsers = React.useCallback((selectedValues: string[]) => {
    const selectedTargets = possibleTargets.filter((possibleTarget) => {
      return possibleTarget?.targetId && selectedValues.indexOf(possibleTarget.targetId) > -1;
    })

    onChange(selectedTargets);
  }, [onChange, possibleTargets]);

  const excludeUsers = React.useMemo(() => {
    return existingRecords?.map(({ targetId }) => targetId as string) || [];
  }, [existingRecords]);

  const handleFetchData = React.useCallback((_: any,
    allUsers: User[], allOrganizations: User[],
  ) => {
    const orgs = allOrganizations;

    const mergedAllUsers: SelectTarget[] = [
      ...orgs.map(obj => {
        return {
          targetId: obj.id,
          targetName: obj.userName,
          isOrganization: true,
        }
      }),
      ...allUsers.map(({ id, userName, firstName, lastName }) => ({ targetId: id, targetName: userName, isOrganization: !firstName && !lastName })),
    ];

    setPossibleTargets(mergedAllUsers);
  }, []);

  return (
    <UsersAndOrgsDropdown
      {...rest}
      defaultValues={[]}
      excludeUsers={excludeUsers}
      isAdmin
      omitOrgs={omitOrgs}
      omitUsers={omitUsers}
      onChangeUsers={handleChangeUsers}
      onFetchData={handleFetchData}
      placeholder={placeholder}
    />
  )
}
