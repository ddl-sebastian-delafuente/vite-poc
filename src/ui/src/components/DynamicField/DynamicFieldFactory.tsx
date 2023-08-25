import * as React from 'react';
import styled from 'styled-components';

import { 
  ButtonAction,
  FieldStyle,
  FieldType,
  FieldData,
  LayoutField,
} from './DynamicField.types';
import {
  BannerField,
  ButtonField,
  CheckboxField,
  DataplaneField,
  DateField,
  HiddenField,
  HostPortField,
  InputNumberField,
  LinkField,
  MultiSelectField,
  PasswordField,
  RadioField,
  SelectField,
  TextAreaField,
  TextBlock,
  TextField,
  TitleField,
  UserAndOrgField,
  UserRoleField,
} from './Fields';

const HorizontalSeperator = styled.hr`
  margin-left 0;
  margin-right: 0;
  width: 100%;
`

export type LayoutFieldFactoryProps = {
  data: FieldData,
  editable?: boolean,

  /**
   * There are two different supported styles here that are used 
   * different situations. LabelAndValue is best used in situations
   * where you want to have a inplace edit workflow for an existing
   * object. FormItem is best for when you're in a create workflow.
   */
  fieldStyle: keyof typeof FieldStyle,

  field: LayoutField,

  /**
   * Toggles if inputs are full width or auto
   */
  fullWidthInput?: boolean,

  isAdminPage?: boolean,
  isAdminUser?: boolean,

  onChange?: (fieldName: string, value: any) => void,
  onButtonAction?: (action: keyof typeof ButtonAction) => void;
  
  /**
   * By default fields will have their testId match the field path
   * if you want to namespace your testIds you add define a prefix
   * which will then be prepended to the path in the following 
   * format: {testIdPrefix}-{fieldPath}
   */
  testIdPrefix?: string,
  userId?: string,
  value?: any,
  width?: string,
}


export const LayoutFieldFactory = (props: LayoutFieldFactoryProps) => {
  switch (props.field?.fieldType) {
    case FieldType.banner:
      return <BannerField {...props} />;
    case FieldType.button:
      return <ButtonField {...props} />;
    case FieldType.checkbox:
      return <CheckboxField {...props} />;
    case FieldType.dataplane:
      return <DataplaneField {...props} />;
    case FieldType.date:
      return <DateField {...props} />;
    case FieldType.hidden:
      return <HiddenField {...props} />;
    case FieldType.horizontalSeperator:
      return <HorizontalSeperator />;
    case FieldType.hostPort:
      return <HostPortField {...props} />;
    case FieldType.inputNumber:
      return <InputNumberField {...props}/>
    case FieldType.link:
      return <LinkField {...props} />;
    case FieldType.multiSelect:
      return <MultiSelectField {...props} />;
    case FieldType.password:
      return <PasswordField {...props} />;
    case FieldType.radio:
      return <RadioField {...props} />;
    case FieldType.select:
      return <SelectField {...props} />;
    case FieldType.textarea:
      return <TextAreaField {...props}/>;
    case FieldType.textblock:
      return <TextBlock {...props}/>;
    case FieldType.title:
      return <TitleField {...props}/>;
    case FieldType.usersAndOrgs:
      return <UserAndOrgField {...props} />;
    case FieldType.userRoles:
      return <UserRoleField {...props} />;
    default:
      return <TextField {...props}/>;
  }
};
