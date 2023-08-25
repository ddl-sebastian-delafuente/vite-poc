import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { Form } from '@ant-design/compatible';
// eslint-disable-next-line no-restricted-imports
import { Divider, Input } from 'antd';
import Select from '@domino/ui/dist/components/Select/Select';
import Checkbox from './Checkbox/Checkbox';
import { themeHelper } from '../styled/themeUtils';
import Button, { ExtendedButtonProps } from './Button/Button';
import tooltipRenderer from '../components/renderers/TooltipRenderer';
import ModalFooter from './ModalFooter';
import ValidatedForm, {
  BootstrappedInputProps,
  DefaultProps as ValidatedDefaultProps,
  FormChildPropTypes,
  getDefaultState,
  InputValues,
  OnSubmitHandler,
  Props as ValidatedFormProps,
  State as ValidatedFormState,
} from './ValidatedForm';
import DominoLogoOnSubmitButton from './DominoLogoOnSubmitButton';
import WarningBox from './WarningBox';
import DangerBox from './Callout/DangerBox';
import InfoBox from './Callout/InfoBox';

const FormattedFormAsModalFooter = styled(ModalFooter)`
  padding: 10px 16px 0px 16px;
  border-top: 1px solid #e8e8e8;
`;

interface FieldsContainerProps {
  asModal?: boolean;
}
const FieldsContainer = styled.div<FieldsContainerProps>`
  padding-left: ${({ asModal }) => asModal ? '24px' : 'inherit'};
  padding-right: ${({ asModal }) => asModal ? '24px' : 'inherit'};
`;

export type FormattedFormInputValues = InputValues;

export type InputType = 'error' | 'custom' | 'input' | 'checkbox' | 'select' | 'textarea' | 'text' | 'info' | 'warning';

const FormFooter = styled.div`
  display: flex;
`;

const ButtonContainer = styled.span`
  margin-left: ${themeHelper('margins.tiny')};
`;

const LabelSublabelContainer = styled.div`
  line-height: 16px;
`;

const Sublabel = styled.div`
  white-space: normal;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
`;

const Link = styled.a`
  font-size: 13px;
`;

const LabelGroup = styled.span`
  text-align: left;
  display: inline-flex;
  flex-direction: column;
`;

const OnSubmitError = styled.div`
  flex-grow: 1;
  color: #f5222d;
`;

const nonInputGroups = [
  'error',
  'text',
  'info',
  'warning',
];

export function renderLink(link: string, linklabel: string): JSX.Element {
  return (
    <Link key={linklabel} href={link} target="blank">
      {' '}{linklabel}
    </Link>
  );
}

export const getNonCheckboxLabelGroup: (details: TitleDetails) => any = ({ label, sublabel, link, linklabel }) => {
  return !R.isNil(label) || !R.isNil(sublabel) || !R.isNil(link) ? (
      <LabelGroup>
        <LabelSublabelContainer>
          <div>
            {label}
          </div>
          {!!sublabel && <Sublabel key="sublabel">
            {sublabel}
          </Sublabel>}
        </LabelSublabelContainer>
        {!!link && renderLink(link, linklabel || '')}
      </LabelGroup>
    ) :
    undefined;
};

const getValueFromEvent = (event: any) => event.target.value;
const getCheckboxValueFromEvent = (event: any) => event.target.checked;

export type CheckboxBootstrappedInputProps = {
  value: any;
  onFieldChange: (data: any) => void;
  label?: React.ReactNode;
};

export const ValidatedCheckbox: React.FC<CheckboxBootstrappedInputProps & CheckBoxOptions> = ({
  value,
  onFieldChange,
  label,
  key,
  name,
  disabled,
}) => (
  <Checkbox
    disabled={disabled}
    defaultChecked={value}
    onChange={onFieldChange}
  >
    <input type="hidden" id={key} name={name || key} value={value} />
    {label}
  </Checkbox>
);

const TextArea = styled(Input.TextArea)`
  margin-top: 3px;
`;
export const ValidatedTextArea: React.FC<BootstrappedInputProps & TextAreaOptions> = ({
  className,
  name,
  value,
  onFieldChange,
  disabled,
  placeholder,
  maxLength,
  ariaLabel,
  id
}) => (
  <TextArea
    name={name}
    disabled={disabled}
    value={value}
    rows={4}
    onChange={onFieldChange}
    onKeyUp={onFieldChange}
    defaultValue={value}
    placeholder={placeholder}
    maxLength={maxLength}
    className={className}
    data-test={className + '-field'}
    aria-label={ariaLabel}
    id={id}
  />
);

export const ValidatedInput: React.FC<BootstrappedInputProps & InputOptions> = ({
  className,
  value,
  onFieldChange,
  placeholder,
  maxLength,
  disabled,
  autoFocus,
  name,
  type,
  ariaLabel,
}) => (
  <Input
    type={type}
    name={name}
    autoFocus={autoFocus}
    disabled={disabled}
    value={value}
    onChange={onFieldChange}
    onKeyUp={onFieldChange}
    defaultValue={value}
    placeholder={placeholder}
    maxLength={maxLength}
    className={className}
    data-test={className + '-field'}
    aria-label={ariaLabel}
  />
);

const defaultSelectStyle = { zIndex: 2100 };

export const ValidatedSelect: React.FC<BootstrappedInputProps & SelectOptions> = ({
    value,
    onFieldChange,
    key,
    className,
    options,
    disabled,
    getContainer,
    ariaLabel,
    id
  }) => (
  <Select
    getPopupContainer={getContainer}
    disabled={disabled}
    key={key}
    className={className}
    defaultValue={value}
    value={value}
    onChange={onFieldChange}
    dropdownStyle={defaultSelectStyle}
    data-test={className + '-field'}
    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.stopPropagation()}
    aria-label={ariaLabel}
    id={id}
  >
    {options.map(({
      itemType,
      value: optionValue,
      label: optionLabel,
      ...rest
    }) => (
      itemType === 'divider' ?
      <Divider key={rest.key || optionLabel} /> :
      <Select.Option value={optionValue} key={rest.key || optionLabel}>
        {optionLabel}
      </Select.Option>
    ))}
  </Select>
);

export type InputOptionBasic = {
  Component?: any;
  className?: string;
  validators?: Validator[];
  content?: string;
  link?: string;
  linklabel?: string;
  key: string;
};

export type SpecBase = { key: string , className?: string, ariaLabel?: string, id?: string };

export type LinkDetails = {
  link?: string;
  linklabel?: string;
};

export type Validator = {
  checker: (value: string, props: Props, values: FormattedFormInputValues) => boolean;
  errorCreator: (value: string, props: Props, values: FormattedFormInputValues) => string;
};

export type ValidationGroup = {
  validated?: boolean;
  validators?: Validator[];
};

export type TitleDetails = {
  label?: string;
  sublabel?: string;
} & LinkDetails & SpecBase;

export type InteractiveInputDetails = {
  key: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  onValuesUpdate?: (value: string, context: any, values: FormattedFormInputValues) =>
    any; // returns props for the input for which this executes
} & TitleDetails & ValidationGroup & SpecBase;

export type SelectOptions = {
  options: {
    itemType: 'option' | 'divider';
    value: string;
    label: string;
    key?: string;
  }[];
  getContainer?: (triggerNode: Element) => HTMLElement;
} & InteractiveInputDetails & SpecBase;

export type InputOptions = {
  type?: string;
  placeholder?: string;
  autoFocus?: boolean;
  maxLength?: number;
  ignoreEnter?: boolean;
} & InteractiveInputDetails & SpecBase;

export type TextAreaOptions = InputOptions & SpecBase;

export type CheckBoxOptions = {
  checked: boolean;
} & InteractiveInputDetails & SpecBase;

export type PlainText = (string | number | JSX.Element) & SpecBase;

export type Info = {
  content: React.ReactNode;
  alternativeIcon?: boolean;
  fullWidth?: boolean;
  testId?: string;
} & LinkDetails & SpecBase;

export type Warning = Info & SpecBase;

export type CustomOption = {
  key: string;
  className?: string;
  Component: any;
} & ValidationGroup;

export type InputOption = Info | Warning | PlainText | SelectOptions | InputOptions | TextAreaOptions |
  CheckBoxOptions | CustomOption;

export type InputSpec = {
  inputType: InputType;
  inputOptions: InputOption;
};

export type DefaultProps = {
  cancelLabel?: string;
  submitLabel?: string;
  asModal?: boolean;
  onlyFields?: boolean; // asModal should be false to enable this field
  csrfToken?: string;
  fieldMatrix?: InputSpec[][];
  submitOnEnter?: boolean;
  onChange?: () => void;
  onSubmit?: (values: FormattedFormInputValues, props: Props) => Promise<any> | void;
  onCancel?: () => void;
  dataTest?: string;
  CustomSubmitButton?: React.FunctionComponent<ExtendedButtonProps> | React.ComponentClass<ExtendedButtonProps>;
  submitErrors?: InputValues;
  shouldDisableSubmitUntilChangesMade?: boolean;
} & ValidatedDefaultProps;

export type Props = ValidatedFormProps & DefaultProps;

export type FormattedFormState = ValidatedFormState;

/**
 * FormattedForm is a prevalidated, preformatted form creator. The idea is that creation of this kind of component
 * is exactly the same 90% of the time. The basic structure is completely automatable.
 * The `fieldsMatrix` provides a data structure through which you can specify what elements you want to show
 * and where they should show.
 *
 * The rows of the `fieldsMatrix` are literally the rows of the form. Elements that you want to show up next to each
 * other go on the same row. If you want one to show on to of the other, put it in the row before the other one.
 *
 * [[x], [y]] -> x is on top of y
 * [[x, y]] -> y is on the right side of x
 *
 * The columns of the `fieldsMatrix` specify position of the element on the row
 *
 * Extra UI tweaks can be done through css.
 */
class FormattedForm<OuterProps = {}> extends ValidatedForm<Props & OuterProps, FormattedFormState> {

  static defaultProps: DefaultProps = {
    formProps: {},
    defaultValues: {},
    cancelLabel: 'Cancel',
    submitLabel: 'Submit',
    asModal: false,
    csrfToken: '',
    fieldMatrix: [[]],
    onChange: () => undefined,
    onCancel: () => undefined,
    submitErrors: {},
  };

  userHasModifiedInput = false;
  defaultValidatedInputValue: string | undefined = undefined;

  constructor(props: Props & OuterProps) {
    super(props);
    this.state = getDefaultState(props);
    // Reset variables related to input field.
    this.userHasModifiedInput = false;
    this.defaultValidatedInputValue = undefined;
  }

  afterFormMessage(): React.ReactNode | undefined {
    return;
  }

  getOptions = (fieldName: string) => {
    const inputSpec = this.props.fieldMatrix!.reduce((found: undefined | InputSpec, fields: InputSpec[]) => {
      const foundSpec = fields.find(({ inputOptions }) => inputOptions.key === fieldName);
      return foundSpec || found;
    }, undefined) || {} as InputSpec;
    const options = inputSpec.inputOptions;
    return options || {};
  }

  handleOnChangeValidatedInput = (onFieldChange: (data: any) => void, value: string) => {
    // onChange event triggers when default value is set, but only after user has modified field should userHasModifiedInput be true.
    if (this.defaultValidatedInputValue !== undefined && this.defaultValidatedInputValue !== value) {
      this.userHasModifiedInput = true;
    }

    return onFieldChange;
  }

  handleDefaultValueValidatedInput = (value: string) => {
    if (this.defaultValidatedInputValue === undefined) {
      this.defaultValidatedInputValue = value;
    }
    return value;
  }

  validatedInput: React.FC<BootstrappedInputProps & InputOptions> = ({
      className,
      value,
      onFieldChange,
      placeholder,
      maxLength,
      disabled,
      autoFocus,
      name,
      type,
      id,
      ignoreEnter,
    }) => (
    <Input
      type={type}
      name={name}
      autoFocus={autoFocus}
      disabled={disabled}
      value={value}
      onChange={this.handleOnChangeValidatedInput(onFieldChange, value)}
      onKeyUp={onFieldChange}
      defaultValue={this.handleDefaultValueValidatedInput(value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={className}
      data-test={className + '-field'}
      id={id}
      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation();
        if (ignoreEnter && e.key === 'Enter') {
          e.preventDefault();
        }
      }}
    />
  );

  shouldDisableSubmit(): boolean {
    const {
      shouldDisableSubmitUntilChangesMade
    } = this.props;
    const {
      errors,
      submitError,
    } = this.state;
    if (shouldDisableSubmitUntilChangesMade && !this.userHasModifiedInput) {
      return true;
    }
    return (!R.isNil(this.props.submitErrors) && !R.isEmpty(this.props.submitErrors)) || !!submitError ||
      !!this.props.fieldMatrix!.find((fields: InputSpec[]) => !!fields.find(({
        inputOptions,
      }: InputSpec) => {
      // @ts-ignore
      if (inputOptions.validated) {
        const fieldName = inputOptions.key;
        return !!errors[fieldName];
      }
      return false;
    }));
  }

  /**
   * Runs validation callbacks for all inputs that specify that they are validated
   *
   * @function
   * @memberof FormattedForm
   * @name validateAll
   * @param {Object} values - mapping from input key to user inputted value (undefined if no default value
   * or user input specified)
   * @return {Object} - found errors, computed by validators provided by user
   */
  validateAll = (values: FormattedFormInputValues, ignoreNils = true) => {
    const errors = Object.keys(values).reduce((acc, key) => {
      acc[key] = undefined;
      return acc;
    }, {});
    this.props.fieldMatrix!.forEach(row => {
      row.forEach(({ inputOptions }) => {
        const {
          // @ts-ignore
          validators = [],
          key,
        } = inputOptions;
        // @ts-ignore
        const shouldValidate = ignoreNils && !R.isNil(values[key]) && inputOptions.validated ||
          // @ts-ignore
          !ignoreNils && inputOptions.validated;
        if (shouldValidate) {
          const errorArgs = [values[key], this.props, values];
          // eslint-disable-next-line prefer-spread
          const foundError = validators.find(({ checker }: Validator) => checker.apply(null, errorArgs));
          if (foundError) {
            errors[key] = foundError.errorCreator.apply(null, errorArgs);
          }
        }
      });
    });
    return errors;
  }

  /**
   * Passed to react-form by `ValidatedForm` as validate prop. Triggers when values managed by react-form
   * update and runs validation on those values
   *
   * @function
   * @memberof FormattedForm
   * @name validate
   * @param {Object} values - values managed by react-form, mapping from input key to user inputted value
   * @return {Object} - mapping from input key to error messages
   */
  validate = (values: FormattedFormInputValues, ignoreNils = true) => {
    return this.validateAll(values, ignoreNils);
  }

  /**
   * Triggers user provided onSubmit Promise. Triggered by ValidatedForm
   *
   * @function
   * @memberof FormattedForm
   * @name onSubmit
   * @param {Object} values - values managed by react-form
   * @param {Object} state - state managed by react-form
   * @param {Object} props - props managed by react-form
   * @param {Object} instance - instance methods managed by react-form
   * @return {Promise} - whatever you want to have happen onSubmit
   */
  onSubmit: OnSubmitHandler = (values) => {
    const {
      onSubmit,
    } = this.props;

    if (onSubmit) {
      return onSubmit(values, this.props);
    }
    return;
  }

  /**
   * Assembles a drop down specified by the SelectOptions prop type in the InputSpec prop type
   *
   * @function
   * @memberof FormattedForm
   * @name getSelect
   * @param {Object} values - values managed by react-form
   * @param {Object} options - see the SelectOptions prop type
   * @return {Function} - callback managed by react-form, which returns a drop down
   */
  getSelect(formProps: FormChildPropTypes, options: SelectOptions) {
    const label = getNonCheckboxLabelGroup(options);
    return (
      <div className={options.className || options.key}>
        {this.inputBootstrapper(options.key, x => x, label)(ValidatedSelect)}
      </div>
    );
  }

  /**
   * Assembles a validateable input or a textarea
   *
   * @function
   * @memberof FormattedForm
   * @name getInputUI
   * @param {Object} values - values managed by react-form
   * @param {Object} options - see the InputOptions prop type
   * @param {string} componentType - either "input" or "textarea"
   * @return {Function} - callback managed by react-form which returns a text input or a text area
   */
  getInputUI(formProps: FormChildPropTypes, options: InputOptions, componentType: InputType) {
    const {
      key,
      className,
    } = options;

    const renderableLabel = getNonCheckboxLabelGroup(options);
    if (componentType === 'input') {
      return (
        <div className={className || key}>
          {this.inputBootstrapper(options.key, getValueFromEvent, renderableLabel)(this.validatedInput)}
        </div>
      );
    }
    return (
      <div className={className || key}>
          {this.inputBootstrapper(options.key, getValueFromEvent, renderableLabel)(ValidatedTextArea)}
      </div>
    );
  }

 /**
  * Converts a long string within submitError into a toolTip such that long urls/directories/etc don't break
  * the UI.
  *
  * @function
  * @memberof FormattedForm
  * @name convertLongString
  * @param {string} submitErrorWord - specific word within submitError string
  */
  convertLongString(submitErrorWord: string) {
   if (submitErrorWord.length > 40) {
    const c = submitErrorWord.substring(0, 36).concat('... ');
    return tooltipRenderer(submitErrorWord, c);
   }
   return submitErrorWord.concat(' ');
  }

  /**
   * Handles creating link and sublabel elements for inputs, if either exist
   *
   * @function
   * @memberof FormattedForm
   * @name renderLinkAndSublabel
   * @param {Object} details - link and sublabel details
   * @param {string} details.sublabel - copy to be used as a sublabel
   * @param {string} details.linklabel - copy to be used as the label for the specified link
   * @param {string} details.link - href for the link
   * @return {Array} - the link and the sublabel, or neither!
   */
  renderLinkAndSublabel({ sublabel, link, linklabel }: TitleDetails) {
    const contents: React.ReactNodeArray = [];
    if (sublabel) {
      // @ts-ignore
      contents.push(
        <Sublabel key="sublabel">
          {sublabel}
        </Sublabel>
      );
    }

    if (link) {
      // @ts-ignore
      contents.push(
        renderLink(link, linklabel || '')
      );
    }

    if (contents.length) {
      return contents;
    }
    return;
  }

  getInput(
    formProps: FormChildPropTypes,
    options: InputOptions,
    inputType: InputType) {
    return this.getInputUI(formProps, options, inputType);
  }

  /**
   * Assembles a validateable checkbox
   *
   * @function
   * @memberof FormattedForm
   * @name getCheckBox
   * @param {Object} values - values managed by react-form
   * @param {Object} options - see the CheckBoxOptions prop type
   * @return {Function} - callback managed by react-form which returns a checkbox
   */
  getCheckBox(formProps: FormChildPropTypes, options: CheckBoxOptions) {
    const {
      key,
      className,
    } = options;

    // eslint-disable-next-line
    const sublabel = this.renderLinkAndSublabel(options);
    const renderableSubLabel = !R.isNil(sublabel) ? (
      <span>
        {sublabel}
      </span>
      ) :
      undefined;
    return (
      <div className={className || key} data-test={`${className}-checkbox`}>
        {this.inputBootstrapper(options.key, getCheckboxValueFromEvent, renderableSubLabel)(ValidatedCheckbox)}
      </div>
    );
  }

  getTextArea(formProps: FormChildPropTypes, options: TextAreaOptions) {
    return this.getInputUI(formProps, options, 'textarea');
  }

  /**
   * Handles rendering interactive form components
   *
   * @function
   * @memberof FormattedForm
   * @name renderInput
   * @param {Object} values - values managed by react-form
   * @param {string} inputType - type of input to create
   * @param {Object} options - see the `inputOptions` field of the InputSpec prop type
   * @return {Function} - callback managed by react-form which returns specified input
   */
  renderInput(formProps: FormChildPropTypes, inputType: InputType, options: InputOption) {
    switch (inputType) {
      case 'input':
        return this.getInput(formProps, options as InputOptions, inputType);

      case 'select':
        return this.getSelect(formProps, options as SelectOptions);

      case 'checkbox':
        return this.getCheckBox(formProps, options as CheckBoxOptions);

      case 'textarea':
        return this.getTextArea(formProps, options as TextAreaOptions);

      case 'custom':
        // eslint-disable-next-line no-case-declarations
        const customOptions = options as CustomOption;
        // eslint-disable-next-line no-case-declarations
        const renderableLabel = getNonCheckboxLabelGroup(customOptions);
        return (
          <div className={customOptions.className || options.key}>
            {this.inputBootstrapper(options.key, x => x, renderableLabel)(customOptions.Component)}
          </div>
        );

      default:
        return this.getInput(formProps, options as InputOptions, inputType);
    }
  }

  /**
   * Delegates to proper node creation logic based on inputType
   *
   * @function
   * @memberof FormattedForm
   * @name renderInputGroup
   * @param {Object} values - values managed by react-form
   * @param {string} inputType - type of input to create
   * @param {Object} options - see the `inputOptions` field of the InputSpec prop type
   * @return {Object} - node, renderable by React
   */
  renderInputGroup(formProps: FormChildPropTypes, inputType: InputType, options: InputOption) {
    if (nonInputGroups.indexOf(inputType) === -1) {
      return this.renderInput(formProps, inputType, options);
    }

    if (inputType === 'text') {
      return (
        <div className="text-bloc">
          {options as string}
        </div>
      );
    }
    const infoOptions = options as Info;

    const infoLikeContent = (
      <>
        {infoOptions.content}
        {infoOptions.link && renderLink(infoOptions.link, infoOptions.linklabel!)}
      </>
    );

    if (inputType === 'info') {
      return (
        <InfoBox className="info-box"
          fullWidth={infoOptions.fullWidth}
          alternativeIcon={infoOptions.alternativeIcon}
          data-test={infoOptions.testId}
        >
          {infoLikeContent}
        </InfoBox>
      );
    }

    if (inputType === 'warning') {
      return (
        <WarningBox className="warning-box">
          {infoLikeContent}
        </WarningBox>
      );
    }

    if (inputType === 'error') {
      return (
        <DangerBox>
          {infoLikeContent}
        </DangerBox>
      );
    }

    return <span/>;
  }

  handleCancel = () => {
    this.updateAll({
        submitError: '',
        submitted: false,
        errors: {},
      },
      (this.props.defaultValues || {}) as FormattedFormInputValues,
      () => {
        this.props.onCancel!();
      },
    );
  }

  /**
   * Assembles the form specified by the user via the props of `FormattedForm`
   */
  renderForm = (formProps: FormChildPropTypes) => {
    const {
      cancelLabel,
      submitLabel,
      asModal,
      onlyFields,
      CustomSubmitButton,
      submitOnEnter,
      dataTest
    } = this.props;
    const {
      submitted,
      submitError,
    } = this.state;

    const fields = this.props.fieldMatrix!.map((row: InputSpec[], i: number) => {
      return (
        <div className="row-group" key={`row-${i}`}>
          {row.map(({ inputType, inputOptions }: InputSpec) => {
            return (
              <div
                className={`col-group ${inputOptions.className}`}
                key={inputOptions.key}
              >
                {this.renderInputGroup(formProps, inputType, inputOptions)}
              </div>
            );
          })}
        </div>
      );
    });

    return (
      !R.isNil(onlyFields) && Boolean(onlyFields) ? (
        <FieldsContainer asModal={asModal}>
          {fields}
        </FieldsContainer>
      ) : (
      <Form onSubmit={submitOnEnter && this.handleSubmit(formProps.submitForm)}>
        <div>
          <FieldsContainer asModal={asModal}>
            {fields}
          </FieldsContainer>
          {this.state.showAfterFormMessage ? this.afterFormMessage() : ''}
          {asModal ?
            <FormattedFormAsModalFooter
              ModalCustomFooter={
                <OnSubmitError
                  key="submiterror"
                  className="submit-error-field"
                >
                  {submitError.split(' ').map(this.convertLongString)}
                </OnSubmitError>
              }
              testId={dataTest}
              modalSubmitButtonLabel={submitLabel!}
              modalCancelButtonLabel={cancelLabel}
              handleCancel={this.handleCancel}
              handleOk={this.handleSubmit(formProps.submitForm)}
              CustomSubmitButton={DominoLogoOnSubmitButton}
              disableSubmit={this.shouldDisableSubmit()}
              submitButtonProps={{
                CustomSubmitButton,
                htmlType: 'submit',
                key: 'submitbutton',
                submitError: submitError,
                submitted: submitted,
                label: submitLabel!,
              }}
            /> :
            <FormFooter className="form-footer">
              <OnSubmitError
                key="submiterror"
                className="submit-error-field"
              >
                {submitError}
              </OnSubmitError>
              <ButtonContainer>
                <Button
                  btnType="secondary"
                  key="cancelbutton"
                  onClick={this.handleCancel}
                  data-test={dataTest + 'cancel-button'}
                >
                  {cancelLabel}
                </Button>
              </ButtonContainer>
              <ButtonContainer>
                <DominoLogoOnSubmitButton
                  CustomSubmitButton={CustomSubmitButton}
                  disabled={this.shouldDisableSubmit()}
                  htmlType="submit"
                  key="submitbutton"
                  submitError={submitError}
                  submitted={submitted}
                  onSubmit={this.handleSubmit(formProps.submitForm)}
                  label={submitLabel!}
                  testId={dataTest + 'submit-button'}
                />
              </ButtonContainer>
            </FormFooter>}
        </div>
      </Form>)
    );
  }

  handleSubmit = (submitForm: OnSubmitHandler) => async () => {
    const {
      values,
      submitted
    } = this.state;
    // This is to ensure that the form doesn't get submitted twice.
    if (!submitted) {
      await submitForm(values, this.state, this.props, this);
      this.updateAll({
        submitError: '',
        submitted: false,
        errors: {},
      },
      (this.props.defaultValues || {}) as FormattedFormInputValues
    );
    }
  }

  render() {
    return this.renderValidatedForm(this.renderForm);
  }
}

export default FormattedForm;
