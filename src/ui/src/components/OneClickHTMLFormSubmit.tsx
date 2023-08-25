import * as React from 'react';
import styled from 'styled-components';
import { isNil } from 'ramda';
import DominoButton, { ButtonProps, ExtendedButtonProps } from './Button/Button';
import RunsIcon from '../icons/RunsIcon';

const getButtonComponent = (
  btnType?: ExtendedButtonProps['btnType'],
  CustomButton?: Props['CustomButton'],
): React.FunctionComponent<ButtonProps> => {
  if (btnType) {
    return (props: ButtonProps) => <DominoButton btnType={btnType} {...props} />;
  }
  return CustomButton || ((props: ButtonProps) => <button {...props} />);
};

const getLabel = (fallbackLabel: string, builder?: () => void) => builder ? builder() : fallbackLabel;

const ButtonContainer = styled.span`
  span, button {
    display: inline-flex;
    align-items: center;
    svg {
      margin-right: 5px;
    }
  }
`;

const Spinner = styled(RunsIcon)`
  height: 1em;
  width: 1em;
  animation: rotating 1s linear infinite;
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export type ModifyFormCallback = (form: HTMLElement | null) => void;

export type SetSubmitMethod = (subscriber: (event: any) => void | null) => ModifyFormCallback;

/**
 * This is a form submitting button
 * which works with html forms not defined in React
 * in order to safely submit the form and have the `oneClickSubmit` behavior
 * of the legacy oneClickSubmit button: a spinner with submit text
 * with not fallback if the submit fails
 */

export type DefaultProps = {
  buttonProps?: any;
  className?: string;
  submitText?: string;
  preSubmitText?: string;
  disabled?: boolean;
  buildSubmitText?: () => string;
  buildPreSubmitText?: () => string;
};

export type Props = {
  btnType?: ExtendedButtonProps['btnType'];
  formSelector: string;
  CustomButton?: React.FunctionComponent<any>;
} & DefaultProps;

export type State = {
  disabled: boolean;
  submitted: boolean;
};

export default class OneClickHTMLFormSubmit extends React.PureComponent<Props, State> {
  static defaultProps: DefaultProps = {
    className: undefined,
    buttonProps: {},
    submitText: 'Submitting',
    preSubmitText: 'Submit',
    disabled: false,
  };

  addListener: ModifyFormCallback;

  removeListener: ModifyFormCallback;

  constructor(props: Props) {
    super(props);
    this.state = {
      disabled: props.disabled!,
      submitted: false,
    };
    this.addListener = this.getSetSubmitFuncitonality(this.onSubmit);
    this.removeListener = this.getSetSubmitFuncitonality(() => undefined);
  }

  getSetSubmitFuncitonality: SetSubmitMethod = subscriber => form =>
    isNil(form) ? form : form.onsubmit = subscriber

  componentDidMount() {
    this.addListener(this.getForm());
  }

  componentWillUnmount() {
    this.removeListener(this.getForm());
  }

  getLabel = (fallbackLabel: string, builder?: () => void, ) =>
    builder ? builder() : fallbackLabel

  buildSubmitText = () => getLabel(this.props.submitText!, this.props.buildSubmitText);

  buildPreSubmitText = () => getLabel(this.props.preSubmitText!, this.props.buildPreSubmitText);

  getForm(): HTMLElement | null {
    const { formSelector } = this.props;
    return document.querySelector(formSelector);
  }

  onSubmit = () => this.setState({ submitted: true, disabled: true });

  render() {
    const {
      className,
      buttonProps,
      CustomButton,
      btnType,
    } = this.props;
    const {
      disabled,
      submitted,
    } = this.state;
    const Button = getButtonComponent(btnType, CustomButton);
    return (
      <ButtonContainer>
        <Button
          {...buttonProps}
          htmlType="submit"
          className={className}
          disabled={disabled}
        >
          {submitted ?
            <span>
              <Spinner />
              {this.buildSubmitText() as React.ReactNode}
            </span> :
            this.buildPreSubmitText()}
        </Button>
      </ButtonContainer>
    );
  }
}
