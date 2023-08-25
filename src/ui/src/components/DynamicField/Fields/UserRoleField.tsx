import * as R from 'ramda';
import * as React from 'react';

import { usePrevious } from '../../../utils/CustomHooks';
import { UserRoleEditor, UserRole } from '../../UserRoleEditor';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { LayoutFieldMutable } from '../DynamicField.types';

export const UserRoleField = ({
  data,
  editable,
  onChange,
  value,
  ...props
}: LayoutFieldFactoryProps) => {
  const field = props.field as LayoutFieldMutable;
  const defaultValue = React.useMemo(() => field.defaultValue || [], [field.defaultValue]);
  const prevDefaulValue = usePrevious(defaultValue);
  const isValueUndefined = typeof value === 'undefined';
  const projectId = data.projectId as string;
  const [inputValue, setInputValue] = React.useState<UserRole[]>(!isValueUndefined ? value : defaultValue);

  const handleChange = React.useCallback((userList: React.SetStateAction<UserRole[]>) => {
    setInputValue(userList);

    if (field.path && onChange ) {
      onChange(field.path, userList);
    }
  }, [field.path, onChange, setInputValue]);

  React.useEffect(() => {
    if (!R.equals(defaultValue, prevDefaulValue)) {
      if (field.path && onChange ) {
        onChange(field.path, defaultValue);
      }
    }
  }, [ 
    defaultValue, 
    field.path,
    onChange, 
    prevDefaulValue, 
  ]);

  const inputElementProps = {
    editable,
    onChange: handleChange,
    projectId,
    userList: inputValue,
  }

  return (
    <UserRoleEditor {...inputElementProps}/>
  )
}
