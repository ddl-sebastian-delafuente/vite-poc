/* istanbul ignore file */
import { FormLayout } from 'antd/lib/form/Form';
import { RadioGroupOptionType } from 'antd/lib/radio';
import { UnionToMap } from '../../utils/typescriptUtils';
import { componentType as ButtonType } from '../Button/Button';

export type AntFormLayout = FormLayout;
export const AntFormLayout: UnionToMap<AntFormLayout> = {
  horizontal: 'horizontal',
  inline: 'inline',
  vertical: 'vertical',
}

export type BannerType = 'Success' | 'Info' | 'Warning' | 'Error';
export const BannerType: UnionToMap<BannerType> = {
  Error: 'Error',
  Info: 'Info',
  Success: 'Success',
  Warning: 'Warning'
};

export type ButtonAction = 'validateStep'
export const ButtonAction: UnionToMap<ButtonAction> = {
  validateStep: 'validateStep'
}

export type FieldStyle = 'LabelAndValue' | 'FormItem';
export const FieldStyle: UnionToMap<FieldStyle> = {
  LabelAndValue: 'LabelAndValue',
  FormItem: 'FormItem',
}

export type FieldType = 
  'banner' | 
  'button' | 
  'checkbox' |
  'dataplane' | 
  'date' | 
  'hidden' |
  'horizontalSeperator' |
  'hostPort' |
  'inputNumber' |
  'link' |
  'multiSelect' |
  'password' |
  'radio' | 
  'select' | 
  'textarea' |
  'textblock' |
  'title' | 
  'unknown' |
  'usersAndOrgs' |
  'userRoles';
export const FieldType: UnionToMap<FieldType> = {
  banner: 'banner',
  button: 'button',
  checkbox: 'checkbox',
  dataplane: 'dataplane',
  date: 'date',
  hidden: 'hidden',
  horizontalSeperator: 'horizontalSeperator',
  hostPort: 'hostPort',
  inputNumber: 'inputNumber',
  link: 'link',
  multiSelect: 'multiSelect',
  password: 'password',
  radio: 'radio',
  select: 'select',
  textarea: 'textarea',
  textblock: 'textblock',
  title: 'title',
  unknown: 'unknown',
  usersAndOrgs: 'usersAndOrgs',
  userRoles: 'userRoles',
}

export type FieldValue = 
  boolean |
  boolean[] |
  number |
  number[] |
  string |
  string [] |
  Option | 
  undefined;

export type FieldValueNormalized = Exclude<FieldValue, Option>;

export interface FieldData {
  [key: string]: FieldValue | FieldData;
}

export type Orientation = 'horizontal' | 'vertical';
export const Orientation: UnionToMap<Orientation> = {
  horizontal: 'horizontal',
  vertical: 'vertical',
}


export type LayoutDirection = 'column' | 'row';
export const LayoutDirection: UnionToMap<LayoutDirection> = {
  column: 'column',
  row: 'row'
}

export type LayoutJustify = 
  'center' |
  'flex-end' |
  'flex-start' | 
  'space-around' | 
  'space-between' | 
  'space-evenly' | 
  'unset';
export const LayoutJustify = {
  center: 'center',
  'flex-end': 'flex-end',
  'flex-start': 'flex-end',
  'space-around': 'space-around',
  'space-between': 'space-between',
  'space-evenly': 'space-evently',
  unset: 'unset'
};


export interface BaseOption {
  disabled?: boolean;
  label: string;
  subLabel?: React.ReactNode;
  value: string | boolean;
  disabledReason?: string;
}

export interface Option extends BaseOption {
  options?: BaseOption[];
}


export type validateStatusType =  '' | 'success' | 'warning' | 'error' | 'validating';
export interface LayoutFieldGeneric {
  fieldType?: string;
  helpText?: React.ReactNode;
  key?: string;
  id?: string;
  label: string;
  path: string;
  error?: validateStatusType;
}

export interface LayoutFieldMutable extends LayoutFieldGeneric {
  canEdit?: boolean,
  defaultValue?: boolean | boolean[] | number | number[] | string | string[];
  disabled?: boolean;
  isRequired?: boolean;
  isRequiredErrorMessage?: string;
  placeholder?: string;
  regexpError?: string;
  regexp?: string;
}

/**
 * Immutable Field Types
 * These fields are used purely for layout/display purposes. As a result
 * these fields are not impacted by certain properties like `editable`
 */

export interface LayoutFieldBanner extends Partial<LayoutFieldGeneric> {
  fieldType: typeof FieldType.banner;
  bannerType?: keyof typeof BannerType;
  message: string;
}

export interface LayoutFieldButton extends Partial<LayoutFieldGeneric> {
  action: keyof typeof ButtonAction;
  buttonType?: ButtonType;
  fieldType: typeof FieldType.button;
}

export interface LayoutFieldTitle extends Partial<LayoutFieldGeneric> {
  fieldType: typeof FieldType.title;
  hasIcon?: boolean;
  text: string;
  value?: string;
}

export interface LayoutFieldInputNumber extends LayoutFieldMutable {
  fieldType: typeof FieldType.inputNumber;
  value?: string;
  min?: any;
  max?: any;
  disabled?: boolean;
}

export interface LayoutFieldTextBlock extends Partial<LayoutFieldGeneric> {
  fieldType: typeof FieldType.textblock;
  text: string;
}

/**
 * Mutable Field Types
 * These fields are contents that con be modified and when `editable`
 * is set they can replace their static contents with some form of 
 * input element
 */
export interface LayoutFieldCheckbox extends LayoutFieldMutable {
  fieldType: typeof FieldType.checkbox;
}

export interface LayoutFieldDataplane extends LayoutFieldMutable {
  fieldType: typeof FieldType.dataplane;
  options?: Option[];
  selectAllByDefault?: boolean;
  useAllDataplanes?: boolean;
}

export interface LayoutFieldDate extends LayoutFieldMutable {
  fieldType: typeof FieldType.date;
  dateFormat?: string;
}

export interface LayoutFieldHidden extends LayoutFieldMutable {
  fieldType: typeof FieldType.hidden;
  hasFieldOptions?: boolean;
}

export interface LayoutFieldHostPort extends LayoutFieldMutable {
  fieldType: typeof FieldType.hostPort;
  hostRegexp?: string;
  hostRegexpError?: string;
  multiple?: boolean;
  portRegexp?: string;
  portRegexpError?: string;
}

export interface LayoutFieldRadio extends LayoutFieldMutable {
  fieldType: typeof FieldType.radio;
  orientation?: keyof typeof Orientation;
  options?: Option[];
  optionType?: RadioGroupOptionType;
}

export interface LayoutFieldSelect extends LayoutFieldMutable {
  clearable?: boolean;
  fieldType: typeof FieldType.select;
  hasIcon?: boolean;
  options?: Option[];
  showSearch?: boolean;
  mode?: 'multiple' | 'tags'
}

export interface LayoutFieldTextArea extends LayoutFieldMutable {
  canCopy?: boolean;
  height?: number;
}

export interface LayoutFieldUsersAndOrgs extends LayoutFieldMutable {
  allowOwnerToBeRemoved?: boolean;
  fieldType: typeof FieldType.usersAndOrgs;
  ownerId?: string;
  ownerName?: string;
}

export type LayoutFieldEnumberable =
  LayoutFieldDataplane |
  LayoutFieldRadio | 
  LayoutFieldSelect;

export type ImmutableFields = 
  LayoutFieldBanner |
  LayoutFieldTextBlock |
  LayoutFieldTitle;

export type MutableFields = 
  LayoutFieldCheckbox | 
  LayoutFieldDate |
  LayoutFieldHidden |
  LayoutFieldMutable |
  LayoutFieldRadio | 
  LayoutFieldSelect |
  LayoutFieldTextArea |
  LayoutFieldUsersAndOrgs |
  LayoutFieldInputNumber;

export type LayoutField = LayoutFieldGeneric | 
  ImmutableFields |
  MutableFields |
  LayoutFieldButton;

export type LayoutElements = Array<LayoutField | RecursiveLayout>;

export type RecursiveLayout = {
  displayAsGroup?: boolean,
  fieldStyle?: FieldStyle,
  arrange?: LayoutDirection,
  immutable?: boolean,
  justify?: LayoutJustify,
  maxElements?: number,
  elements: LayoutElements,
}

export type Layout = RecursiveLayout;
