import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { Form } from '@ant-design/compatible';
import { Tooltip } from 'antd';
import { getErrorMessage as getFetchErrorMessage } from '../utils/errorUtil';
import {
  getErrorMessage,
} from '../utils/sharedComponentUtil';
import FormItem from './DominoFormItem';
import { colors } from '../styled';

const HelpText = styled.div`
  color: rgba(0, 0, 0, 0.45) !important;
`;

export interface LabelProps {
  dashedUnderline: boolean;
  children: React.ReactNode;
}

export const StyledLabelWrapper = styled.span`
  cursor: pointer;
  display: inline;
  margin-bottom: 0;
  margin-right: 5px;
  position: relative;
  padding-bottom: 2px;
  border-bottom: 1px dashed ${colors.dustyGray};
`;

const StyledSpan = styled.span`
  margin-bottom: 0;
  position: relative;
`;

const clearStateItemsExists = R.compose(R.not, R.isNil, R.prop('clearStateItems'), R.defaultTo({}));

export const LabelWrapper = ({ dashedUnderline = false, children }: LabelProps) => {
  return dashedUnderline ? <StyledLabelWrapper>{children}</StyledLabelWrapper> : <StyledSpan>{children}</StyledSpan>;
};

export enum LabelAlign {
  LEFT = 'left',
  RIGHT = 'right'
}

export interface FormItemOverrides {
  formGroupStyle?: {};
  label?: any;
  help?: any;
}

export interface DDFormItemProps {
  error?: any;
  help?: any;
  label?: any;
  formItemOverrides?: FormItemOverrides;
  children?: any;
  className?: string;
  tooltip?: React.ReactNode;
  dashedUnderline?: boolean;
  dataDenyDataAnalyst?: boolean;
  colon?: boolean;
  labelAlign?: `${LabelAlign}`;
  htmlFor?: string;
  ariaLabel?: string;
}

export const DDFormItem: React.FC<DDFormItemProps> = ({
  error,
  help,
  label,
  children,
  formItemOverrides = {},
  className,
  tooltip,
  dashedUnderline = false,
  colon = false,
  labelAlign = LabelAlign.LEFT,
  htmlFor,
  ariaLabel
}) => {
  const {
    formGroupStyle = {},
    ...rest
  } = formItemOverrides;
  return (
    // @ts-ignore
    <FormItem dashedUnderline={dashedUnderline}
      labelAlign={labelAlign}
      hasFeedback={!!error}
      validateStatus={error ? 'error' : undefined}
      help={
        error || help ? (
          <div>
            {!!help && <HelpText>{help}</HelpText>}
            {!!error && <div>{error}</div>}
          </div>
        ) : undefined
      }
      className={className}
      label={!R.isNil(label) ?
        (
          <LabelWrapper dashedUnderline={dashedUnderline}>
            {tooltip ?
              <Tooltip placement="topLeft" title={tooltip}>
                {label}
              </Tooltip> : label}
          </LabelWrapper>
        ) : label}
      style={formGroupStyle}
      colon={colon}
      htmlFor={htmlFor}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </FormItem>
  );
};

const propsForFormItem = [
  'formGroupStyle',
  'label',
  'help',
];

export type OnSubmitHandler =
  (values: InputValues, state: State, props: Props, instance: any) => Promise<any> | void;

export type InputBootstrapper = (fieldName: string) => (uninstantiatedInput: any) => JSX.Element;

export interface FormChildPropTypes {
  values: InputValues;
  submitError: string;
  submitted: boolean;
  errors: InputValues;
  submitForm: OnSubmitHandler;
  inputBootstrapper: InputBootstrapper;
}

export type FormRenderProp = (props: FormChildPropTypes) => FormChildren;

export type FormChildren = JSX.Element | JSX.Element[];

export type InputValues = { [fieldName: string]: any };

export type DefaultProps = {
  action?: string;
  defaultErrors?: InputValues;
  defaultValues?: InputValues;
  formProps?: {};
  submitErrors?: InputValues;

  /**
   * Determines whether to reset the component level state to defaults on submit success. Defaults to true.
   * Set to false if redirecting to another page on submit success, in order to avoid weird states which allow the
   * user to press submit multiple times if logic depends on the `submitted` state value in order to enable/disable
   * buttons, for example
   */
  resetStateOnSuccess?: boolean;
};

export interface BootstrappedInputProps<P = any> {
  value: P;
  onFieldChange: (data: P) => void;
}

export interface Props extends DefaultProps {
  csrfToken?: string;
  getErrorMessage?: (error: any) => string;
  defaultSubmitError?: string;
}

export interface State {
  showAfterFormMessage: boolean;
  submitError: string;
  submitted: boolean;
  values: InputValues;
  errors: InputValues;
}

export type InputValueSetter = (value: string) => void;

export function getDefaultState(props: Props): State {
  return ({
    showAfterFormMessage: false,
    submitError: props.defaultSubmitError || '',
    submitted: false,
    values: props.defaultValues!,
    errors: props.defaultErrors || {},
  });
}

/**
 * passes validate cb to form
 * passes submit cb to form
 * handles errors thrown in submit cb
 * handles state consistency when errors thrown in submit cb
 */
class ValidatedForm<P extends (Props & DefaultProps), S extends (State & {})> extends React.PureComponent<P, S> {

  static defaultProps: DefaultProps = {
    resetStateOnSuccess: true,
    formProps: {},
    defaultValues: {},
    submitErrors: {}
  };

  constructor(props: P) {
    super(props);
    this.state = getDefaultState(props) as S;
  }

  componentDidUpdate(props: Props) {
    const defaultError = this.props.defaultSubmitError;
    if (props.defaultSubmitError !== defaultError && defaultError) {
      this.setState({ submitError: defaultError! });
    }
  }

  updateWithNewValues = (values: InputValues, submitted: boolean) => {
    // update values state so that all states are in sync and then
    // validate later when all values are insync
    return new Promise((resolve, reject) => {
      this.setState({
        submitError: '',
        submitted,
        values: Object.assign({}, this.state.values, values),
      }, () => {
        this.setState({
          errors: Object.assign({}, this.state.errors, this.validate(this.state.values, !submitted)),
        }, () => {
          const hasErrors = R.any(R.compose(R.not, R.isNil))(R.values(this.state.errors));
          if (hasErrors) {
            reject(this.state.errors);
          } else {
            resolve(this.state.values);
          }
        });
      });
    });
  }

  onInputChange = (fieldName: string, dataFormatter?: (data: any) => any) => (data: any) => {
    const formatter = dataFormatter || ((x: any) => x);
    const result = formatter(data);
    let nextState = { [fieldName]: result };
    if (clearStateItemsExists(result)) {
      nextState = result.clearStateItems.reduce((values: InputValues, valueKey: string) => {
        return { ...values, [valueKey]: undefined };
      }, { [fieldName]: result.value });
    }
    this.updateWithNewValues(nextState, false)
      // Since this is a promise and we are rejecting errors without handling them
      .catch((error) =>
        // The error is already being handled by antd-form to show inline error message
        // eslint-disable-next-line no-console
        console.debug(error)
      );
  }

  /**
   * overrideable prop which returns map from field names to errors
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate = (values: InputValues, ignoreNils = false) => {
    return R.map(() => undefined, values) as InputValues;
  }

  setAllValues(resetData: Partial<State>, cb?: () => void) {
    const {
      submitError,
      submitted,
      values,
      errors,
    } = resetData;
    this.setState({
      errors: R.defaultTo(this.state.errors)(errors),
      submitError: R.defaultTo(this.state.submitError)(submitError),
      submitted: R.defaultTo(this.state.submitted)(submitted),
      values: R.defaultTo(this.state.values)(values),
    }, () => {
      if (cb) {
        cb();
      }
    });
  }

  /**
   * Private callback used as react-form's onSubmit callback
   * Handles lifecycle for maintaining consistent state in react-form while also
   * handling errors thrown outside of react-form
   *
   * @name _onSubmit
   * @param {Object} values - all values in react-form, should be current state of form
   * @param {Object} state - see react-form docs
   * @param {Object} props - see react-form docs
   */
  _onSubmit: OnSubmitHandler = (values, state, props) => {
    // validate one last time in case that the user
    // clicked submit on start up and has silent errors
    return this.updateWithNewValues(values, true)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((finalValues: InputValues) => {
        const submitted = this.onSubmit(values, state, props, this); // user implemented submit
        if (submitted) {
          return Promise.resolve(submitted)
            .then((result: any) => {
                // finally, if successful, clear the state
                if (this.props.resetStateOnSuccess) {
                  this.updateAll(
                    { submitError: '', submitted: false },
                    this.props.defaultValues!
                  );
                }
                return result;
              })
              .catch((error: any) => {
                getFetchErrorMessage(error)
                .then((message: string) => {
                  this.handleSubmitError(message, values);
                })
                .catch((networkError) => {
                  // failed to deserialize message
                  this.handleSubmitError(this.getErrorMessage(networkError), values);
                });
              });
        }
        return;
      })
      .catch((error: InputValues) => {
        console.error(error);
        this.handleSubmitError('', values);
        return error;
      });
  }

  getErrorMessage(error: any) {
    const customErrorFormatter = this.props.getErrorMessage;
    if (customErrorFormatter) {
      return customErrorFormatter(error);
    }
    return getErrorMessage(error);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSubmit: OnSubmitHandler = (values, state, props) => Promise.resolve();

  /**
   * handles hiding any submitErrors, which are generated outside of react-form
   * and maintains react-form's inner state and subsequently updates value of this
   * form input
   * @name formatInputData
   * @param {Function} setValue - react-form callback for setting value for this form field
   * @param {Object} values - all values in react-form fields
   */
  formatInputData = (fieldName: string) => (values: InputValues) => (data: any) => {
    const value = (typeof data === 'object' ?
      data.target.value :
      data).trim();
    if (this.state.submitError) {
      this.updateAll({ submitError: '' }, values, () => {
        this.setState({ values: Object.assign({}, this.state.values, { [fieldName]: value })});
      });
    } else {
      this.setState({ values: Object.assign({}, this.state.values, {[fieldName]: value })});
    }
  }

  /**
   * Updates ValidatedForm state to reflect errors thrown in react-form's
   * onSubmit callback
   * @name handleSubmitError
   * @param {String} errorMessage - error message
   * @param {Object} resetData - values for all field in react-form, should be the current form's
   * state
   * @param {Function} setAllValues - react-form callback for updating all values in form
   */
  handleSubmitError(errorMessage: string, resetData: InputValues) {
    this.updateAll({
      submitError: errorMessage,
      submitted: false,
    }, resetData);
  }

  updateAll(newState: Partial<State>, resetData: InputValues, cb?: () => void) {
    this.setAllValues({...newState, values: resetData}, cb);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getOptions: (fieldName: string) => any = fieldName => ({});

  inputBootstrapper = (
    fieldName: string,
    dataFormatter?: (data: any) => any,
    label?: string | JSX.Element
  ) => (uninstantiatedInput: any) => {
    const {
      values,
      errors,
    } = this.state;

    const { submitErrors } = this.props;
    const error = errors[fieldName] ||
      (!R.isEmpty(submitErrors) && !R.isNil(submitErrors) && submitErrors[fieldName]) || '';

    const value = values[fieldName];
    const options = this.getOptions(fieldName);
    // @ts-ignore
    const { onValuesUpdate = () => ({}) } = options;
    const overrides = onValuesUpdate(value, this, values);
    const formItemOverrides = propsForFormItem.reduce((os: {}, key: string) => {
      if (overrides[key]) {
        return {...os, [key]: overrides[key]};
      }
      return os;
    }, {});
    const inputOverrides = R.omit(propsForFormItem, overrides);
    return (
      <DDFormItem
        error={error}
        help={options.help}
        label={label}
        formItemOverrides={formItemOverrides}
        htmlFor={options.name}
        ariaLabel={options.ariaLabel}
      >
        {uninstantiatedInput({
          ...options,
          value,
          onFieldChange: this.onInputChange(fieldName, dataFormatter),
          ...inputOverrides,
          id: options.name
        })}
      </DDFormItem>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderForm: (formProps: FormChildPropTypes) => JSX.Element = formProps => <div />;

  /**
   * This funnels the react-form functionality into
   * whatever form you want to bootstrap
   *
   * @name renderValidatedForm
   * @param {Function} children - an unexecuted function that returns
   * the form for react-form to bootstrap
   */
  renderValidatedForm(children: FormRenderProp) { // TODO make this more obvious that it has to be a certain element
    const {
      values,
      submitError,
      submitted,
      errors,
    } = this.state;
    const {
      action,
      formProps,
      csrfToken,

    } = this.props;

    // expose the key data and methods via a function prop
    // since sometimes people like to follow the concatenateiv inheritance pattern
    // rather that OOP inheritance
    return (
      <Form action={action} {...formProps}>
        {csrfToken && <input type="hidden" name="csrfToken" value={csrfToken} />}
        {children({
          values,
          submitError,
          submitted,
          errors,
          submitForm: this._onSubmit,
          inputBootstrapper: this.inputBootstrapper,
        })}
      </Form>
    );
  }

  render() {
    return this.renderValidatedForm(this.renderForm);
  }

}

export default ValidatedForm;
