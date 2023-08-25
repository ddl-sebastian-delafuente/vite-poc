import * as React from 'react';
import { omit, isNil } from 'ramda';
import { getErrorMessage } from '../utils/errorUtil';
import SuccessButton, { ExtendedButtonProps } from './SuccessButton';
import SpinningDominoLogo from '../icons/SpinningDominoLogo';
import { LoadingOutlined } from '@ant-design/icons';
import useStore from '../globalStore/useStore';

export type Props = {
  CustomSubmitButton?: React.FunctionComponent<ExtendedButtonProps> | React.ComponentClass<ExtendedButtonProps>;
  submitError?: string;
  submitted: boolean;
  onSubmit?: (event?: any) => void;
  label?: string;
  htmlType?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
};

export type SubmitButtonProps = Props & ExtendedButtonProps;

const DominoLogoOnSubmitButton: React.FC<SubmitButtonProps> = ({
  disabled,
  submitError,
  submitted,
  onSubmit,
  htmlType,
  label = 'Submit',
  CustomSubmitButton,
  ...props
}) => {
  const logoSize = 15;
  const SubmitButton = CustomSubmitButton || SuccessButton;
  const { whiteLabelSettings } = useStore();

  return (
    <SubmitButton
      onClick={onSubmit}
      htmlType={htmlType}
      {...props}
      disabled={disabled || (!submitError && submitted)}
      aria-busy={(!submitError && submitted) ? true : false}
    >
      {!submitError && submitted ? (
        isNil(whiteLabelSettings) ? <div /> : isNil(whiteLabelSettings?.appLogo) ?
          <SpinningDominoLogo height={logoSize} width={logoSize} testId="spinning-logo" />
          : <LoadingOutlined style={{ fontSize: logoSize }} data-test="spinning-logo" />)
        : label}
    </SubmitButton>
  );
}

export type WithStateProps<ReturnType> = {
  onClick: () => Promise<ReturnType>;
  onFailure?: (error: any) => void;
  onSuccess?: (submitResult: ReturnType) => void;
  CustomSubmitButton?: React.FunctionComponent<ExtendedButtonProps> | React.ComponentClass<ExtendedButtonProps>;
  label?: string;
  htmlType?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
  disabled?: boolean;
};
export type State = {
  submitError?: string;
  submitted: boolean;
};
export class WithState<ReturnType> extends React.PureComponent<WithStateProps<ReturnType>, State> {
  state = {
    submitted: false,
  };

  onSubmit = () => {
    const {
      onClick,
      onFailure,
      onSuccess,
    } = this.props;
    this.setState({ submitted: true }, () => {
      onClick().then((result: ReturnType) => {
        if (onSuccess) {
          onSuccess(result);
        }
        this.setState({ submitted: false, submitError: undefined });
      }).catch((error: any) => {
        if (onFailure) {
          onFailure(error);
        }

        getErrorMessage(error)
        .catch(() => Promise.resolve(JSON.stringify(error)))
        .then((errorMessage: string) => {
          this.setState({ submitted: false, submitError: errorMessage });
        });
      });
    });
  }

  render() {
    return (
      <DominoLogoOnSubmitButton
        {...omit(['onClick', 'onFailure', 'onSuccess'], this.props)}
        {...this.state}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export default DominoLogoOnSubmitButton;
