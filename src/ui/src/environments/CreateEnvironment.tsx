import * as React from 'react';
import * as R from 'ramda';
import Input from '@domino/ui/dist/components/TextInput/Input';
import styled from 'styled-components';
import { DDFormItem } from '@domino/ui/dist/components/ValidatedForm';
import { Validators } from '@domino/ui/dist/utils/validators/oci';
import StyledHeading from '../components/styled/elements/FormHeader';
import EnvironmentSharingFields, { UserForEnvironment } from './EnvironmentSharingFields';
import FlexLayout from '../components/Layouts/FlexLayout';
import BaseImageSelector, { BaseSelectorProps, EnvironmentBaseType, ImageType } from './BaseImageSelector';
import SupportedClusterTypesInput from './SupportedClusterTypesInput';
import { themeHelper } from '../styled';
import ModalWithButton from '../components/ModalWithButton';
import Button from '../components/Button/Button';
import { ComputeClusterType } from '@domino/api/dist/types';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export const selectFormFieldWidth = '100%';

export enum ErrorMessage {
  EnvironmentNameEmpty = `Please give this environment a name.`,
  DockerImageEmpty = `Custom Image URI cannot be empty.`,
  DockerImageInvalid = `Custom Image URI is not a well-formed URI.`
}

const StyledInput = styled(Input)`
  height: auto;
`;

const StyledTextArea = styled(TextArea)`
  border-radius: ${themeHelper('borderRadius.standard')};
`;

const StyledDiv = styled.div`
  width: 98%;
  margin-top: ${themeHelper('margins.small')};
`;

const StyledFlexLayout = styled(FlexLayout)`
  margin-top: ${themeHelper('margins.tiny')};
`;

const StyledForm = styled.div`
  width: 100%;
  overflow: auto;
  padding: 0 ${themeHelper('margins.large')};
`;

export interface CreateEnvironmentProps {
  cancelUrl: string;
  csrfFormToken: string;
  createAction: string;
  canTransferOwnership: boolean;
  canCreateGlobalEnvironment: boolean;
  visibility: string;
  usersForEnvironment: UserForEnvironment[];
  isUsersForEnvironmentEmpty: boolean;
  viewerId: string;
  viewerUserName: string;
  defaultOpen: boolean;
}

export enum EnvironmentErrors {
  EnvironmentNameError = 'envNameError',
  DockerImageError = 'dockerImgError'
}

export type EnvironmentErrorsType = `${EnvironmentErrors}`;

export type ErrorsType = {
  message?: string,
  isError: boolean,
  element: Element | null,
  errorType: Partial<EnvironmentErrorsType>
};

export interface ErrorEnvironmentType {
  isEnvironmentNameInvalid: boolean;
  dockerImageError: {
    isError: boolean;
    message: string;
  };
}

export const defaultEnvironmentError: ErrorEnvironmentType = {
  isEnvironmentNameInvalid: false,
  dockerImageError: { isError: false, message: '' }
};

export type ValidationMethodSignature<T> = (errors: T) => void;

export interface CreateEnvironmentState {
  environmentName: string;
  skipFirstBuild: boolean;
  dockerImage: string;
  imageType: ImageType;
  error: ErrorEnvironmentType;
  isClusterImage: boolean;
  createClicked: boolean;
}

export type Props = CreateEnvironmentProps & BaseSelectorProps;

class CreateEnvironment extends React.PureComponent<Props, CreateEnvironmentState> {
  form: React.RefObject<HTMLFormElement>;
  constructor(props: Props) {
    super(props);
    this.form = React.createRef();
    this.state = {
      environmentName: '',
      skipFirstBuild: false,
      dockerImage: '',
      imageType: props.imageType,
      error: defaultEnvironmentError,
      isClusterImage: false,
      createClicked: false
    };
  }

  resetError = () => this.setState({ error: defaultEnvironmentError });

  onChange = (e: any) => {
    const { value } = e.target;
    this.setState({ environmentName: value });
  };


  onEnvironmentNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    this.setState({
      environmentName: value,
      error: { ...(this.state.error), isEnvironmentNameInvalid: R.isEmpty(value) }
    });
  }

  getDockerImageInputStatus = (shouldValidateImageReference?: boolean) => {
    const { dockerImage } = this.state;
    const { DockerImageError } = EnvironmentErrors;
    const { DockerImageEmpty, DockerImageInvalid } = ErrorMessage;
    const noEnvironmentError = { errorType: DockerImageError, isError: false, message: '' };
    const environmentError = { ...noEnvironmentError, isError: true };
    const validate = shouldValidateImageReference ? (str: string) => R.pipe(Validators.isReference, R.not)(str) : () => false;
    return R.cond([
      [R.isEmpty, R.always({ ...environmentError, message: DockerImageEmpty })],
      [validate, R.always({ ...environmentError, message: DockerImageInvalid })],
      [R.T, R.always(noEnvironmentError)]
    ])(dockerImage) as ErrorsType;
  }

  onDockerImageChange = (uri: string, shouldValidateImageReference = false) => {
    this.setState({ dockerImage: uri }, () => {
      const { error } = this.state;
      const { isError, message } = this.getDockerImageInputStatus(shouldValidateImageReference);
      this.setState({ error: { ...error, dockerImageError: { isError, message: message ?? '' } } });
    });
  }

  onClusterTypeChange = (clusterType: ComputeClusterType | undefined) => {
    if (clusterType != undefined) {
      this.setState({ ...this.state, isClusterImage: true });
    } else {
      this.setState({ ...this.state, isClusterImage: false });
    }
  }

  getQueriedElement = <T extends HTMLElement | null>(query: string): T => R.cond([
    [R.pipe(R.isNil, R.not), R.always(this.form.current!.querySelector(query))],
    [R.T, R.always(null)]
  ])(this.form.current) as T;

  validateEnvironmentNameAndUpdateErrorState: ValidationMethodSignature<Array<ErrorsType>> = errors => R.cond([
    [R.pipe(R.isEmpty), () => {
      errors.push({
        isError: true,
        errorType: EnvironmentErrors.EnvironmentNameError,
        element: this.getQueriedElement<HTMLInputElement>('input#name')
      });
      this.setState({ ...this.state, skipFirstBuild: false });
    }]
  ])(this.state.environmentName);

  validateCustomImageUriAndUpdateErrorState: ValidationMethodSignature<Array<ErrorsType>> = errors => R.cond([
    [R.equals(EnvironmentBaseType.CUSTOMIMAGE), () => {
      const dockerImageErrorStatus = this.getDockerImageInputStatus(true);
      if (dockerImageErrorStatus.isError) {
        errors.push({
          ...(dockerImageErrorStatus),
          element: this.getQueriedElement<HTMLInputElement>('input#dockerImageInput')
        });
      }
    }]
  ])(this.state.imageType);

  getInlineErrorState = (): Array<ErrorsType> => {
    const inlineErrors: Array<ErrorsType> = []; // maintains dynamic inline error state
    this.validateEnvironmentNameAndUpdateErrorState(inlineErrors);
    this.validateCustomImageUriAndUpdateErrorState(inlineErrors);
    return inlineErrors;
  }

  convertErrorsTypeToErrorState = (allInlineErrors: Array<ErrorsType>) => {
    const { EnvironmentNameError, DockerImageError } = EnvironmentErrors;
    return allInlineErrors.reduce((acc, error) => {
      const { errorType, isError, message } = error;
      return R.cond([
        [R.equals(EnvironmentNameError), R.always({ ...acc, isEnvironmentNameInvalid: isError })],
        [R.equals(DockerImageError), R.always({ ...acc, dockerImageError: { isError, message: message ?? '' } })],
        [R.T, R.always(acc)]
      ])(errorType) as ErrorEnvironmentType;
    }, {} as ErrorEnvironmentType);
  };

  handleInlineErrors = (allInlineErrors: Array<ErrorsType>): void => {
    this.setState({ error: this.convertErrorsTypeToErrorState(allInlineErrors) }, () => {
      const [firstErrorNode] = allInlineErrors;
      const { element: firstErrorNodeElement } = firstErrorNode;
      if (firstErrorNodeElement && ('focus' in firstErrorNodeElement)) {
        (firstErrorNodeElement as HTMLInputElement).focus();
      }
    });
  }

  handleFormSubmit = () => {
    if (this.state.createClicked) {
      return;
    }
    const allInlineErrors = this.getInlineErrorState();
    const doesInlineErrorExist = !R.isEmpty(allInlineErrors);
    R.cond([
      [R.equals(true), () => this.handleInlineErrors(allInlineErrors)],
      [R.T, () => {
        this.resetError();
        this.setState({
          createClicked: true,
        });
        this.form.current!.submit();
      }]
    ])(doesInlineErrorExist);
  };

  handleSkipFirstBuild = () => {
    this.setState({ ...this.state, skipFirstBuild: true }, () => this.handleFormSubmit());
  };

  render() {
    const {
      csrfFormToken,
      createAction,
      isDefaultEnvironment,
      baseEnvironmentRevisionId,
      missingValueErrorMessages,
      imageType,
      canTransferOwnership,
      canCreateGlobalEnvironment,
      visibility,
      usersForEnvironment,
      isUsersForEnvironmentEmpty,
      viewerId,
      viewerUserName,
      defaultOpen,
    } = this.props;
    const csrfField = <input type="hidden" name="csrfToken" value={csrfFormToken} />;
    const skipFirstBuildInput = <input type="hidden" name="skipFirstBuild" value={`${this.state.skipFirstBuild}`} />;
    const shouldDisableSubmitButton = this.state.error.isEnvironmentNameInvalid || this.state.error.dockerImageError?.isError;
    return (
      <ModalWithButton
        testId="create-environment-modal-"
        ModalButton={(buttonProps: any) => (
          <Button btnType="btn-with-icon" onClick={buttonProps.onClick} icon={<PlusOutlined />} title="Create Environment">
            Create Environment
          </Button>
        )}
        showFooter={false}
        modalSubmitButtonLabel={'Create Environment'}
        handleSubmit={() => this.handleFormSubmit()}
        visibility={defaultOpen}
        modalProps={{
          titleIconName: 'CreateEnvironmentIcon',
          titleIconProps: {
            width: 32,
            height: 32,
          },
          titleText: 'New Environment',
          width: 735,
          style: { top: 12 },
          bodyStyle: { paddingTop: 0 },
          closable: true,
        }}>
        {(modalContext: ModalWithButton) => (
          <FlexLayout flexDirection="column">
            <StyledForm>
              <form action={createAction} method="POST" ref={this.form}>
                {csrfField}
                <div style={{ width: '98%' }}>
                  <StyledHeading>Name</StyledHeading>
                  <DDFormItem
                    error={this.state.error.isEnvironmentNameInvalid && ErrorMessage.EnvironmentNameEmpty}
                  >
                    <StyledInput
                      id="name"
                      name="name"
                      onChange={this.onEnvironmentNameChange}
                      className="form-control"
                    />
                  </DDFormItem>
                </div>
                <StyledDiv>
                  <StyledHeading>Description</StyledHeading>
                  <StyledTextArea rows={4} id="description" name="description" placeholder="Optional" />
                </StyledDiv>
                <FlexLayout justifyContent="space-around" flexDirection="column" alignItems="flex-start">
                  <BaseImageSelector
                    error={this.state.error}
                    isDefaultEnvironment={isDefaultEnvironment}
                    baseEnvironmentRevisionId={baseEnvironmentRevisionId}
                    missingValueErrorMessages={missingValueErrorMessages}
                    imageType={imageType}
                    onDockerImageChange={this.onDockerImageChange}
                    setImageType={(imgType: ImageType) => this.setState({ imageType: imgType })}
                    isEditMode={false}
                    disabled={false}
                    standalone={false}
                    isClusterImage={this.state.isClusterImage}
                  />
                  <SupportedClusterTypesInput disabled={false} onClusterChange={this.onClusterTypeChange} />
                  <EnvironmentSharingFields
                    canTransferOwnership={canTransferOwnership}
                    canCreateGlobalEnvironment={canCreateGlobalEnvironment}
                    visibility={visibility}
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    selected={R.map((user) => false, usersForEnvironment)}
                    usersForEnvironment={usersForEnvironment}
                    isUsersForEnvironmentEmpty={isUsersForEnvironmentEmpty}
                    ownerOrViewerId={viewerId}
                    ownerOrViewerUserName={viewerUserName}
                  />
                  {skipFirstBuildInput}
                </FlexLayout>
                <StyledFlexLayout justifyContent="flex-end">
                  <Button btnType="link" onClick={modalContext.handleCancel}>
                    Cancel
                  </Button>
                  <Button btnType="secondary" data-test="customize_environment_btn" onClick={this.handleSkipFirstBuild}>
                    Customize before building
                  </Button>
                  <Button data-test="create_environment_btn" onClick={this.handleFormSubmit} disabled={this.state.createClicked || shouldDisableSubmitButton}>
                    Create Environment
                  </Button>
                </StyledFlexLayout>
              </form>
            </StyledForm>
          </FlexLayout>
        )}
      </ModalWithButton>
    );
  }
}

export default CreateEnvironment;
