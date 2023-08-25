import { FormProps } from 'antd/lib/form/Form';
import { Form } from 'antd';
import * as R from 'ramda';
import * as React from 'react';
import styled from 'styled-components';

import { usePrevious } from '../../utils/CustomHooks';
import FlexLayout, { FlexLayoutProps } from '../../components/Layouts/FlexLayout';
import { 
  ValidationState,
  ValidationStatus 
} from '../DynamicWizard/useValidationState';
import { 
  FieldStyle,
  FieldData,
  LayoutDirection, 
  Layout, 
  LayoutField,
  RecursiveLayout,
} from './DynamicField.types';
import { LayoutFieldFactoryProps, LayoutFieldFactory } from './DynamicFieldFactory';

type FieldFactoryPickedProps = 
  'editable' | 
  'fullWidthInput' | 
  'isAdminPage' |
  'isAdminUser' |
  'onButtonAction' | 
  'onChange' | 
  'testIdPrefix' |
  'userId';
export type DynamicFieldDisplayRecursiveProps<T extends FieldData> = 
  Pick<LayoutFieldFactoryProps, FieldFactoryPickedProps> & 
  Pick<Partial<LayoutFieldFactoryProps>, 'fieldStyle'> & {
  data: T,

  /**
   * Layouts are recursive `depth` is a internal property to
   * track how deep the recursion goes. This is used to help
   * determine the automatic layout. By default layouts 
   * alternate between row or column flex direction.
   */
  depth?: number,

  layout: Layout,

  /**
   * Layouts are recursive `maxElements` is a internal property
   * used to calculate that maximum number of elements at a given
   * recursion depth. 
   */
  maxElements?: number,
}

export type DynamicFieldDisplayProps<T extends FieldData = {}> = 
  Partial<ValidationState> &
  DynamicFieldDisplayRecursiveProps<T> & {
  antFormProps?: Omit<FormProps, 'form'>,
  onValidateComplete?: () => void,
  onValidateFailed?: (validationError?: string) => void,
  setValidationStatus?: (validationStatus: ValidationStatus) => void,
}

const COLUMN_LAYOUT_PROPS: FlexLayoutProps = Object.freeze({
  alignItems: 'flex-start',
  flexDirection: 'column',
});

const ROW_LAYOUT_PROPS: FlexLayoutProps = Object.freeze({
  alignItems: 'flex-start',
  flexDirection: 'row',
  style: {
    margin: 0,
    width: '100%',
  }
});

const getArrangement = (depth: number, layout?: LayoutDirection) => {
  if (layout) {
    return layout;
  }

  return (depth % 2 === 1) ? LayoutDirection.row : LayoutDirection.column;
}

const getDefaultLayoutProps = (layout?: LayoutDirection): FlexLayoutProps => {
  return layout == LayoutDirection.row ? ROW_LAYOUT_PROPS : COLUMN_LAYOUT_PROPS;
}

const StyledFlexLayout = styled(FlexLayout)`
  margin: 0;
  width: 100%;

  &.group {
    border: 1px solid;
    margin: 10px 0;
    padding: 10px;
  }

  > .ant-row,
  > .ant-checkbox-wrapper,
  > .ant-select {
    margin-left: 0;
    margin-right: 0;
  }
`;

export const DynamicFieldDisplayRecursive = <T extends FieldData>({
  data,
  depth = 0,
  fieldStyle = FieldStyle.LabelAndValue,
  fullWidthInput,
  editable,
  layout,
  isAdminPage,
  isAdminUser,
  maxElements = 0,
  onButtonAction,
  onChange,
  testIdPrefix,
  userId,
}: DynamicFieldDisplayRecursiveProps<T>) => {
  // if there is a nested array calculate the max elements
  const maxNestedElements = React.useMemo(() => {
    if (!layout || !layout.elements) {
      return 0;
    }

    return layout.elements.reduce((memo, field) => {
      if ('elements' in field) {
        return R.max(memo, field.elements.length);
      }
        
      return memo;
    }, 0);
  }, [layout]);
  
  const arrangement = getArrangement(depth, layout.arrange);

  const renderField = React.useCallback((field: LayoutField, index: number) => {
    if ('elements' in field) {
      const recursiveLayout = field as RecursiveLayout;
      return (
        <DynamicFieldDisplayRecursive<T> 
          data={data} 
          depth={depth + 1}
          editable={recursiveLayout.immutable ? false : editable}
          fieldStyle={recursiveLayout.fieldStyle || fieldStyle}
          fullWidthInput={fullWidthInput}
          key={`${depth}-${index}-recursive`}
          layout={field} 
          isAdminPage={isAdminPage}
          isAdminUser={isAdminUser}
          maxElements={maxNestedElements}
          onButtonAction={onButtonAction}
          onChange={onChange}
          testIdPrefix={testIdPrefix}
          userId={userId}
        />
      );
    }

    const fieldProps: LayoutFieldFactoryProps = {
      data,
      fieldStyle,
      field,
      value: field.path ? R.path(field.path.split('.'), data) : null,
    };

    const resolvedMaxElements = layout.maxElements || maxElements;
    if (resolvedMaxElements > 0 && arrangement === LayoutDirection.row) {
      fieldProps.width = `${(1/resolvedMaxElements) * 100 -  1}%`;
    }

    return (
      <LayoutFieldFactory
        {...fieldProps}
        editable={editable}
        fullWidthInput={fullWidthInput}
        isAdminPage={isAdminPage}
        isAdminUser={isAdminUser}
        key={`${depth}-${index}-${field.key || field.path}`}
        onButtonAction={onButtonAction}
        onChange={onChange}
        testIdPrefix={testIdPrefix}
        userId={userId}
      />
    );
  }, [
    arrangement, 
    data, 
    depth, 
    editable, 
    fieldStyle,
    fullWidthInput, 
    isAdminPage,
    isAdminUser,
    layout.maxElements,
    maxElements, 
    maxNestedElements, 
    onButtonAction,
    onChange, 
    testIdPrefix,
    userId,
  ]);

  const classNames = ['dynamic-field-layout'];

  if (layout.displayAsGroup) {
    classNames.push('group');
  }

  return (
    <StyledFlexLayout {...getDefaultLayoutProps(arrangement)} justifyContent={layout.justify || 'space-between'} className={classNames.join(' ')}>
      {layout.elements.map(renderField)}
    </StyledFlexLayout>
  )
}

export const DynamicFieldDisplay = <T extends FieldData>({ 
  antFormProps = {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onValidateComplete = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onValidateFailed = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setValidationStatus = () => {},
  validationStatus,
  ...props 
}: DynamicFieldDisplayProps<T>) => {
  const [form] = Form.useForm();
  const previousValidationStatus = usePrevious(validationStatus);

  const validateFields = React.useCallback(async (isMultiphase: boolean) => {
    setValidationStatus(ValidationStatus.pending);
    try {
      await form.validateFields();
      setValidationStatus(isMultiphase ? ValidationStatus.waitingNext : ValidationStatus.success);
      onValidateComplete();
    } catch (e) {
      setValidationStatus(ValidationStatus.failed);
      onValidateFailed();
    }
  }, [form, onValidateFailed, onValidateComplete, setValidationStatus]);

  React.useEffect(() => {
    const isInitialized = [
      ValidationStatus.initialized, 
      ValidationStatus.initializedMultiphase
    ].indexOf(validationStatus as ValidationStatus) > -1;

    if (previousValidationStatus !== validationStatus && isInitialized) {
      validateFields(validationStatus === ValidationStatus.initializedMultiphase);
    }
  }, [previousValidationStatus, validationStatus, validateFields]);

  return (
    <Form form={form} {...antFormProps}>
      <DynamicFieldDisplayRecursive {...props} />
    </Form>
  );
} 
