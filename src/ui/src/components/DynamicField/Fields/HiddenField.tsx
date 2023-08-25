import * as React from 'react';

import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { LayoutFieldHidden } from '../DynamicField.types';
import { useRemoteFieldOptions } from '../DynamicField.utils';

export const HiddenField = ({
  onChange,
  isAdminPage,
  isAdminUser,
  value,
  ...props
}: LayoutFieldFactoryProps) => {
  const field = props.field as LayoutFieldHidden;
  const [options] = useRemoteFieldOptions(field, { isAdminPage, isAdminUser });

  React.useEffect(() => {
    const noValueDefined = typeof value === 'undefined';
    if (noValueDefined && field.hasFieldOptions) {
      const option = options.find((option) => option.value === field.defaultValue);

      if (option && onChange && field.path) {
        onChange(field.path, option);
        return;
      }
    }

    if (noValueDefined && onChange && field.path) {
      onChange(field.path, field.defaultValue);
      return;
    }

    if (onChange && value !== field.defaultValue) {
      onChange(field.path, field.defaultValue);
    }
  }, [field, onChange, options, value]);

  return null;
};
