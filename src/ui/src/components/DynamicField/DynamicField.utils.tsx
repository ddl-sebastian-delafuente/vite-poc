import { DominoDatasourceModelField as DatasourceModelField } from '@domino/api/dist/types';
import { Rule } from 'antd/lib/form';
import { Form } from 'antd';
import { kebabCase } from 'lodash';
import * as R from 'ramda';
import * as React from 'react';

import { usePrevious } from '../../utils/CustomHooks';
import { useRemoteData } from '../../utils/useRemoteData';
import { MetaRequestObject } from '../DynamicWizard/proxiedDynamicWizardApiCalls.types';
import { getFieldOptions } from '../DynamicWizard/proxiedDynamicWizardApiCalls';
import { LabelAndValueProps } from '../LabelAndValue';
import * as IconMappers from './Fields/Icons';
import { LayoutFieldFactoryProps } from './DynamicFieldFactory';
import {
  FieldData,
  FieldType,
  FieldValue,
  FieldValueNormalized,
  Layout,
  LayoutElements,
  LayoutField,
  LayoutFieldEnumberable,
  MutableFields,
  Option,
  RecursiveLayout,
} from './DynamicField.types';

interface FieldMap {
  [key: string]: DatasourceModelField;
}

export const applyKeys = (elements: LayoutElements, prefix?: string): LayoutElements => {
  return elements.reduce((memo, element) => {
    const layoutRecursive = element as RecursiveLayout;
    if (layoutRecursive.elements) {
      memo.push({
        ...layoutRecursive,
        elements: applyKeys(layoutRecursive.elements, prefix)
      });
      return memo;
    }

    const layoutElement = element as LayoutField;

    memo.push({
      ...layoutElement,
      key: kebabCase([prefix, layoutElement.path].filter(Boolean).join('-'))
    });
    return memo;
  }, [] as LayoutElements);
}

export const serializeBools = (value: string | boolean) => {
  if (typeof value !== 'boolean') {
    return value;
  }

  return value ? 'true' : 'false';
}

export const flattenLayoutElements = (elements: LayoutElements): LayoutField[] => {
  return elements.reduce((memo, element) => {
    // check if nested
    if ((element as RecursiveLayout).elements) {
      return memo.concat(flattenLayoutElements((element as RecursiveLayout).elements));
    }

    memo.push(element as LayoutField);
    return memo;
  }, [] as LayoutField[]);
}

export const getFieldIcon = (fieldName: string, fieldValue: FieldValue) => {
  if (IconMappers[fieldName]) {
    return IconMappers[fieldName](fieldValue);
  }

  return null;
}

export const getFormItemProps = (field: MutableFields, width?: string) => ({
  help: field.helpText,
  label: field.label,
  name: field.key || (field.path || '').split('.'),
  rules: [
    field.isRequired ? {
      required: true,
      message: field.isRequiredErrorMessage ?? `${field.label} is required`,
    } : null,
    field.regexp ? {
      pattern: new RegExp(field.regexp),
      message: field.regexpError,
    } : null,
  ].filter(Boolean) as Rule[],
  style: {
    width: width ?? '100%',
  },
  validateStatus: field.error
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getLabelAndValueProps = (field: LayoutField, testIdPrefix?: string, width?: string, fullWidthInput?: boolean): Partial<LabelAndValueProps> => ({
  className: 'layout-field',
  label: field.label,
  wrapperStyles: {
    marginLeft: 0,
    marginRight: 0,
    width: width ?? '100%',
  },
  valueStyles: {
    width: '100%',
    wordBreak: 'break-all',
  },

  ...(field?.path ? {
    testId: kebabCase(testIdPrefix ? `${testIdPrefix}-${field.path}` : field.path),
  } : {})
});

export const getSelectedOption = (options: Option[], value: Option['value'], allowEmpty?: boolean) => {
  const option = options.find((option) => {
    if (option.options) {
      return  option.options.findIndex(opt => opt.value === value) !== -1;
    }
    return option.value === value
  });

  if (!option && allowEmpty) {
    return { label: '', value: '' };
  }

  if (option && option.options) {
    return option.options.find(opt => opt.value === value);
  }

  return option;
}

export const getValue = (value?: any, defaultValue: any = '--') => value || defaultValue;

export const mergeLayoutElementAndField = (
  layoutElement: MutableFields,
  {
    initialValue,
    isOptional,
    placeholder,
    regexp,
    regexpErrorMessage,
  }: DatasourceModelField
): MutableFields => ({
  defaultValue: typeof initialValue !== 'undefined' ? initialValue : undefined,
  placeholder: typeof placeholder !== 'undefined' ? placeholder : undefined,
  ...layoutElement,
  isRequired: !isOptional,
  regexpError: regexpErrorMessage,
  regexp,
});

export const mergeLayoutAndFieldMap = (layout: Layout, fieldMap: FieldMap): Layout => {
  return {
    ...layout,
    elements: layout.elements.map((element) => {
      if ((element as RecursiveLayout).elements) {
        return mergeLayoutAndFieldMap(element as RecursiveLayout, fieldMap);
      }

      // get the field that matches the corresponding layout element
      const layoutElement = element as MutableFields;
      const field = fieldMap[layoutElement.path || ''];
      if (!field) {
        return element;
      }

      return mergeLayoutElementAndField(layoutElement, field);
    }),
  }
}

export const isUndefinedOrNull = (value: unknown): boolean => value === null || typeof value === 'undefined'

export const transformFieldValue = (fieldValue: FieldData): FieldValueNormalized => {
  if (!Array.isArray(fieldValue) && typeof fieldValue === 'object' && fieldValue.label) {
    return (fieldValue as unknown as Option).value;
  }

  return fieldValue as unknown as FieldValueNormalized;
}

interface UseAntFormSyncProps extends
  Pick<LayoutFieldFactoryProps, 'field' | 'onChange' | 'value'> {
  name: string | string[]
}

/**
 * Since we're managing parts of the form outside of AntD's form context
 * there are changes it will get out of sync this hook's goal is keep
 * what ant is managing and what we are managing in sync
 */
export const useAntFormSync = ({
  name,
  onChange,
  value,
  ...props
}: UseAntFormSyncProps) => {
  const field = props.field as MutableFields;
  const { defaultValue } = field;
  const form = Form.useFormInstance();
  const prevValue = usePrevious(value);
  const prevDefaultValue = usePrevious(defaultValue);
  const prevKey = usePrevious(field.key);

  const isEnumerable = React.useMemo(() =>
    [FieldType.checkbox, FieldType.radio, FieldType.select].indexOf(field.fieldType as FieldType) > -1, [field.fieldType])

  const syncValues = React.useCallback((value: FieldValue) => {
    if (onChange && field.path) {
      form.setFieldsValue({
        [name as string]: value
      });
      onChange(field.path, value);
    }
  }, [onChange, field.path, form, name]);

  React.useEffect(() => {
    if (field.key !== prevKey) {
      syncValues(defaultValue);
    }
  }, [field.key, prevKey, defaultValue, syncValues]);

  React.useEffect(() => {
    if (isEnumerable && defaultValue !== prevDefaultValue) {
      syncValues(defaultValue);
    }
  }, [defaultValue, isEnumerable, prevDefaultValue, syncValues, value]);

  React.useEffect(() => {
    if (typeof value === 'undefined' && defaultValue) {
      syncValues(defaultValue);
    }
  }, [defaultValue, syncValues, value])

  // Handle the case where part of the form is reset 
  // this looks like the value changes from something to 
  // undefined. This happens outside of AntD so we need to
  // sync the AntD value here. Handle cases where a default
  // value is defined as well
  React.useEffect(() => {
    if (typeof value === 'undefined' && prevValue !== value) {
      if (defaultValue) {
        syncValues(defaultValue);
        return;
      }
      form.setFieldsValue({
        [name as string]: undefined
      })
    }
  }, [
    defaultValue,
    field,
    form,
    name,
    prevKey,
    prevValue,
    syncValues,
    value,
  ]);

  React.useEffect(() => {
    if (field.disabled && defaultValue && defaultValue !== value) {
      syncValues(defaultValue);
    }
  }, [defaultValue, field.disabled, syncValues, value]);
}

const ENUMERABLE_FIELDS = [
  FieldType.checkbox,
  FieldType.dataplane,
  FieldType.radio,
  FieldType.select,
  FieldType.multiSelect
];

export const useRemoteFieldOptions = (field: LayoutField, meta: MetaRequestObject): [
  Option[],
  boolean,
  Error | undefined,
] => {
  const [options, setOptions] = React.useState<Option[]>([]);

  const isEnumerable = ENUMERABLE_FIELDS.indexOf(field.fieldType as FieldType) !== -1;
  const canFetchRemoteFields = isEnumerable && !(field as LayoutFieldEnumberable).options;
  const prevMeta = usePrevious(meta);

  const {
    data: remoteOptions,
    error,
    hasLoaded,
    loading,
    refetch,
  } = useRemoteData({
    canFetch: canFetchRemoteFields,
    fetcher: () => getFieldOptions(field.id || '', meta),
    initialValue: []
  });

  React.useEffect(() => {
    if (remoteOptions.length > 0) {
      setOptions(remoteOptions);
    }
  }, [remoteOptions, setOptions]);

  React.useEffect(() => {
    if (hasLoaded && !R.equals(meta, prevMeta)) {
      refetch();
    }
  }, [meta, prevMeta, refetch, hasLoaded])

  React.useEffect(() => {
    if (isEnumerable) {
      const enumField = field as LayoutFieldEnumberable;

      if (enumField.options) {
        setOptions(enumField.options);
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field]);

  return [options, loading, error];
};
