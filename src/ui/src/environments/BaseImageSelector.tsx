import * as React from 'react';
import * as R from 'ramda';
// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import styled, { withTheme, css } from 'styled-components';
import { DominoEnvironmentsApiEnvironmentDetails as EnvironmentDetails } from '@domino/api/dist/types';
import { getDefaultEnvironment, getCurrentUserEnvironments } from '@domino/api/dist/Environments';
import { Checkbox } from '@domino/ui/dist/components';
import EnvironmentSelector from '@domino/ui/dist/components/ComputeEnvironmentSelector';
import { DDFormItem } from '@domino/ui/dist/components/ValidatedForm';
import { getEnvironmentById } from '@domino/api/dist/Environments';
import StyledHeading from '../components/styled/elements/FormHeader';
import FlexLayout from '../components/Layouts/FlexLayout';
import { error as errorToast, warning as warningToast } from '../components/toastr';
import Select, { SelectProps } from '../components/Select/Select';
import { themeHelper, colors } from '../styled';
import { CreateEnvironmentFormSection } from './styled/CreateEnvironmentFormSection';
import { CreateEnvironmentInputRow } from './styled/CreateEnvironmentInputRow';
import { ViewEditEnvironmentInputRow } from "./styled/ViewEditEnvironmentInputRow";
import { ErrorEnvironmentType } from './CreateEnvironment';
import { useState } from 'react';
import { ThemeType } from '../utils';
import useStore from '../globalStore/useStore';
import { getAppName } from '../utils/whiteLabelUtil';

const placeholder = "nvcr.io/nvidia/pytorch:21.10-py3"
const excludeCurrentEnvironment = (environments: EnvironmentDetails[], environmentId?: string) =>
  R.isNil(environmentId) ? environments : R.filter((env: EnvironmentDetails) => env.id !== environmentId, environments);

export enum EnvironmentBaseType {
  BASEIMAGE = 'Environment',
  CUSTOMIMAGE = 'CustomImage',
  DEFAULTIMAGE = 'DefaultImage'
}

export type ImageType = `${EnvironmentBaseType}`;

export interface BaseSelectorProps {
  theme?: {};
  error?: ErrorEnvironmentType;
  isDefaultEnvironment: boolean;
  latestDefaultEnvironmentImage?: string;
  baseEnvironmentId?: string;
  baseEnvironmentRevisionId?: string;
  missingValueErrorMessages: string[];
  dockerImage?: string;
  imageType: ImageType;
  environmentId?: string;
  onDockerImageChange?: (uri: string, shouldValidateImageReference?: boolean) => void;
  setImageType?: (imageType: ImageType) => void;
  isEditMode: boolean;
  isClusterImage: boolean;
  disabled: boolean;
  standalone?: boolean;
  defaultEnvironmentImage?: string
}

export type StateHandlers = {
  setImageType: (imageType: ImageType) => void;
  setEnvironmentViewId: (id: string) => void;
  setEnvironmentRevisionId: (id: string) => void;
  setLoadingBaseEnvironments: (loading: boolean) => void;
  setEnvironments?: (envDetails: EnvironmentDetails[]) => void;
  setDefaultEnvironment?: (env: EnvironmentDetails) => void;
  onChangeEnvironment?: (env: EnvironmentDetails) => void;
};

export type InnerProps = {
  environments: EnvironmentDetails[];
  loadingBaseEnvironments: boolean;
  environmentViewId: string | undefined;
  environmentRevisionId: string;
  environment?: EnvironmentDetails;
  defaultEnvironment?: EnvironmentDetails;
} & StateHandlers & BaseSelectorProps;

const DisplayDiv = styled.div<{ display: boolean }>`
  display: ${(props) => (props.display ? 'block' : 'none')};
`;

export const StyledInput = styled<any>(Input)`
  width: auto;
`;

const StyledDefaultImageInput = styled(Input)`
  height: auto;
  border-radius: ${themeHelper('borderRadius.standard')};
`;

const ModalStyledInput = styled(Input)<InputProps>`
  flex-basis: 95%;
  padding-top: 8px;
  padding-bottom: 12px;
  .ant-input::placeholder {
    font-style: normal;
    font-family: 'Roboto';
    font-size: 14px;
  }
`;

const StyledDDFormItem = styled(DDFormItem)`
  ${({ error }) => !error ? css`margin-bottom: 0;` : ''}
  & .ant-legacy-form-explain {
    line-height: 0.3;
  }
`;

const StandaloneStyledInput = styled<any>(Input)`
  flex-grow: 1;
  padding-bottom: 10px;
  .ant-input::placeholder {
    font-style: normal;
    font-family: 'Roboto';
    font-size: 14px;
  }
`;

const ModalStyledCustomImageDiv = styled.div`
  margin-right: 0;
  flex-basis: 95%;
`;

const StandaloneStyledCustomImageDiv = styled.div`
  flex-grow: 1;

  .disabled.styledLabel{
    color: ${colors.disabledText};
  }
`;

const StyledLabel = styled(FlexLayout)`
  margin-bottom: ${themeHelper('margins.tiny')};
`;

const ModalBaseSelectorContainer = styled(CreateEnvironmentFormSection)`
  p {
    opacity: 0.64;
    color: ${colors.warmGrey};
    font-size: ${themeHelper('fontSize.small')};
    line-height: 16px;
  }
`;

const StandaloneBaseSelectorContainer = styled.div`
  p {
    opacity: 0.64;
    color: ${colors.warmGrey};
    font-size: ${themeHelper('fontSize.small')};
    line-height: 16px;
  }

  .form-check{
    margin-bottom: ${themeHelper('margins.tiny')};
  }

  margin: 0;
  width: 100%;
`;

const ModalStyledBaseEnvironmentDiv = styled.div`
  margin-right: 0;
  flex-basis: 95%;
`;

const StandaloneStyledBaseEnvironmentDiv = styled.div`
  flex-grow: 1;
  .ant-select{
    margin-bottom: ${themeHelper('margins.small')};
  }
  .disabled.styledLabel{
    color: ${colors.disabledText};
  }
`;


const getStyledLabel = (label: string, disabled?: boolean) => {
  return (
    <StyledLabel justifyContent="flex-start" itemSpacing={16} className={disabled ? "disabled styledLabel" : "styledLabel"}>
      {label}
    </StyledLabel>
  );
};

export const FormSelect = (props: SelectProps & { name: string; inputValue: string }) => {
  const { name, inputValue, ...rest } = props;
  return (
    <>
      <Input type="hidden" name={name} value={inputValue} />
      <Select
        getPopupContainer={<T extends Element & { parentNode: any }>(trigger?: T) =>
          trigger ? trigger.parentNode : undefined
        }
        {...rest}
      />
    </>
  );
};

type EnvironmentIdSetterFunction = (env?: string) => void;

interface EnvironmentDropdownProps {
  name: string;
  canSelectEnvironment?: boolean;
  environment?: EnvironmentDetails;
  environments: EnvironmentDetails[];
  environmentId?: string;
  environmentViewId?: string;
  environmentRevisionId?: string;
  setEnvironmentViewId?: EnvironmentIdSetterFunction;
  setEnvironmentRevisionId?: EnvironmentIdSetterFunction;
  onChangeEnvironment?: (environmentDetails?: EnvironmentDetails) => void;
}

export const EnvironmentDropdown = (props: EnvironmentDropdownProps) => (
  <>
    <Input type="hidden" name={props.name} value={props.environmentRevisionId} />
    <EnvironmentSelector
      testId="baseEnvironmentRevisionId"
      canEditEnvironments={false}
      canSelectEnvironment={props.canSelectEnvironment}
      environment={props.environment}
      userEnvironments={excludeCurrentEnvironment(props.environments, props.environmentId)}
      selectedEnvironmentId={props.environmentRevisionId}
      setSelectedEnvironmentId={props.setEnvironmentRevisionId}
      onChangeEnvironment={props.onChangeEnvironment}
    />
  </>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noop = (o?: any) => undefined;

export const BaseImageSelectorView = ({
  error,
  environmentViewId,
  environmentRevisionId,
  isDefaultEnvironment,
  latestDefaultEnvironmentImage = '',
  environment,
  environments,
  missingValueErrorMessages,
  dockerImage,
  imageType,
  loadingBaseEnvironments,
  setImageType,
  onDockerImageChange = noop,
  setEnvironmentViewId,
  setEnvironmentRevisionId,
  environmentId,
  isEditMode,
  disabled,
  standalone = false,
  defaultEnvironmentImage,
  isClusterImage
}: InnerProps) => {
  const { whiteLabelSettings } = useStore();
  const dockerImageError = R.path<string>(['dockerImageError', 'message'], error);
  const onImageTypeChange = R.pipe(R.path(['target', 'value']), setImageType);
  const [customImage, setCustomImage] = useState<string | undefined>(dockerImage);
  const [isDominoBaseImage, setIsDominoBaseImage] = useState<boolean>(false);
  const DynamicContainer = standalone ? StandaloneBaseSelectorContainer : ModalBaseSelectorContainer;
  const DynamicStyledRow = standalone ? ViewEditEnvironmentInputRow : CreateEnvironmentInputRow;
  const DynamicStyledInput = standalone ? StandaloneStyledInput : ModalStyledInput;
  const DynamicStyledCustomImageDiv = standalone ? StandaloneStyledCustomImageDiv : ModalStyledCustomImageDiv;
  const DynamicStyledBaseEnvironmentDiv = standalone ? StandaloneStyledBaseEnvironmentDiv : ModalStyledBaseEnvironmentDiv;

  let initialResolvedDockerImage;
  switch (imageType) {
    case EnvironmentBaseType.CUSTOMIMAGE:
      initialResolvedDockerImage = customImage!;
      break;
    case EnvironmentBaseType.DEFAULTIMAGE:
      initialResolvedDockerImage = defaultEnvironmentImage!;
      break;
  }

  const [resolvedDockerImage, setResolvedDockerImage] = useState<string|undefined>(initialResolvedDockerImage);

  const isImageTypeBase = (
    EnvironmentBaseType.CUSTOMIMAGE === imageType || EnvironmentBaseType.DEFAULTIMAGE === imageType
  );
const isBaseEnvSelectorDisabled = disabled || (isEditMode && imageType !== EnvironmentBaseType.BASEIMAGE);
const isCustomImgSelectorDisabled = disabled || (isEditMode && !isImageTypeBase);
  return (
    <DynamicContainer>
      {!standalone && (<StyledHeading>Base Environment / Image</StyledHeading>)}
      {isDefaultEnvironment ? (
        <div className="form-check">
          {/* Strictly speaking, should send back imageType DefaultImage if image value is the default.
              But it is safe to always send back as type CustomImage with the value in base.dockerImage.
          */}
          <Input name="base.imageType" type="hidden" value={EnvironmentBaseType.CUSTOMIMAGE} disabled={disabled} />
          <StyledDefaultImageInput
            className="form-control"
            type="text"
            name="base.dockerImage"
            defaultValue={resolvedDockerImage ? resolvedDockerImage : latestDefaultEnvironmentImage}
            disabled={disabled}
          />
          {!disabled && isEditMode && (
            <span className="help-block">
              The default environment cannot inherit from an existing environment. So, a base image must specified here.
            </span>
          )}
        </div>
      ) : (
        <React.Fragment>
          <DynamicStyledRow>
            <StyledInput
              id="environment-image"
              name="base.imageType"
              type="radio"
              value={EnvironmentBaseType.BASEIMAGE}
              checked={imageType === EnvironmentBaseType.BASEIMAGE}
              onClick={onImageTypeChange}
              // In edit mode, disable if imageType isn't BaseEnv. This prevents switching to this value
              // if value is Custom/Default Image but still submits this value with the form if the type is BaseEnv
              disabled={isBaseEnvSelectorDisabled}
            />
            <DynamicStyledBaseEnvironmentDiv>
              {getStyledLabel('Start from an existing Environment', isBaseEnvSelectorDisabled)}
              <p>{`Inherit a base image, Dockerfile instructions & scripts from a ${getAppName(whiteLabelSettings)} environment`}</p>
              <DisplayDiv display={imageType === EnvironmentBaseType.BASEIMAGE}>
                <EnvironmentDropdown
                  name="base.baseEnvironmentRevisionId"
                  // This property, if false, disables the underlying form component.
                  canSelectEnvironment={!loadingBaseEnvironments && !disabled && imageType === EnvironmentBaseType.BASEIMAGE}
                  environment={environment}
                  environments={environments}
                  environmentId={environmentId}
                  environmentViewId={environmentViewId}
                  environmentRevisionId={environmentRevisionId}
                  setEnvironmentViewId={setEnvironmentViewId}
                  setEnvironmentRevisionId={setEnvironmentRevisionId}
                />
              </DisplayDiv>
            </DynamicStyledBaseEnvironmentDiv>
          </DynamicStyledRow>
          <DynamicStyledRow>
            <StyledInput
              id="custom-image"
              name="base.imageType"
              type="radio"
              value={EnvironmentBaseType.CUSTOMIMAGE} // Safe to always send back the value as CustomImage
              checked={isImageTypeBase}
              onClick={onImageTypeChange}
              // In edit mode, disable if imageType isn't Custom/Default. This prevents switching from a BaseEnv to
              // to Custom/Default image but still submits this value with the form if it is currently selected.
              disabled={isCustomImgSelectorDisabled}
            />
            <DynamicStyledCustomImageDiv>
              {getStyledLabel('Start from a custom base image', isCustomImgSelectorDisabled)}
              <p>Use a custom Docker or container image URI from a registry like NGC</p>
              <DisplayDiv display={isImageTypeBase}>
                <StyledDDFormItem error={!R.isEmpty(dockerImageError) && dockerImageError}>
                  <DynamicStyledInput
                    id="dockerImageInput"
                    type="text"
                    name="base.dockerImage"
                    disabled={disabled || !isImageTypeBase}
                    addonBefore="FROM"
                    placeholder={placeholder}
                    value={resolvedDockerImage ? resolvedDockerImage : undefined}
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                      const { value: uri } = e.currentTarget;

                      // Strip "docker pull" directive when copied from NGC / other registries
                      let trimmedUri = uri.trim();
                      if (trimmedUri.startsWith("docker pull ")) {
                        trimmedUri = trimmedUri.slice(12);
                      }

                      setIsDominoBaseImage(trimmedUri.startsWith("quay.io/domino"))

                      setCustomImage(trimmedUri);
                      setResolvedDockerImage(trimmedUri);
                      onDockerImageChange(trimmedUri);
                    }}
                    // temporary fix: Custom Image URI Validation only done when `onBlur` is called, until the actual issue's cause
                    // (documented in [DOM-37177](https://dominodatalab.atlassian.net/browse/DOM-37177)) is mitigated.
                    onBlur={() => onDockerImageChange(customImage ?? '', true)}
                  />
                </StyledDDFormItem>
                <DisplayDiv display={!isEditMode && !isClusterImage && !isDominoBaseImage}>
                  <Checkbox
                    id="addBaseDependencies"
                    name="addBaseDependencies"
                    value="true"
                    defaultChecked={true}
                    // disabled in edit mode so that the default true value isn't sent
                    // when the field isn't displayed.
                    disabled={disabled || isEditMode || isClusterImage || !isImageTypeBase || isDominoBaseImage}>
                    Automatically make compatible with Domino
                  </Checkbox>
                  <p>{'You can review and update this configuration later'}</p>
                </DisplayDiv>
              </DisplayDiv>
            </DynamicStyledCustomImageDiv>
            <dl className="error">
              {!R.isEmpty(missingValueErrorMessages) &&
                missingValueErrorMessages.map((m) => (
                  <dd key={m} className="error">
                    {m}
                  </dd>
                ))}
            </dl>
          </DynamicStyledRow>
        </React.Fragment>
      )}
    </DynamicContainer>
  );
};

export const ThemedBaseImageSelector: ThemeType<InnerProps> = withTheme(BaseImageSelectorView);

export const BaseImageSelectorWithState = (props: BaseSelectorProps) => {
  const [imageType, setImageType] = React.useState(props.imageType);
  const [environmentViewId, setEnvironmentViewId] = React.useState<string>();
  const [environmentRevisionId, setEnvironmentRevisionId] = React.useState<string>('');
  const [loadingBaseEnvironments, setLoadingBaseEnvironments] = React.useState<boolean>(true);
  const [environments, setEnvironments] = React.useState<EnvironmentDetails[]>([]);
  const [environment, setEnvironment] = React.useState<EnvironmentDetails>();
  const [defaultEnvironment, setDefaultEnvironment] = React.useState<EnvironmentDetails>();

  // Fetchers
  async function fetchEnvironmentDetails() {
    try {
      const { baseEnvironmentRevisionId, baseEnvironmentId } = props;
      const [userEnvironments, defaultEnvironment] = await Promise.all([
        getCurrentUserEnvironments({}),
        getDefaultEnvironment({})
      ]);
      const baseEnvironment = userEnvironments.find(userEnvironment => userEnvironment.id === baseEnvironmentId);
      const isBaseEnvOnLatestRevision = R.equals(baseEnvironmentRevisionId, baseEnvironment?.latestRevision?.id);
      if (!isBaseEnvOnLatestRevision) {
        if (!R.isNil(baseEnvironment) && baseEnvironmentRevisionId) {
          const { selectedRevision } = baseEnvironment;
          // selected value in the base environment dropdown is identified
          // either by it's latest revision or by it's selected revision
          if (selectedRevision) {
            selectedRevision.id = baseEnvironmentRevisionId;
          }
        } else if (!R.isNil(baseEnvironmentId) && R.isNil(baseEnvironment)) {
          // checking if environment is archived
          const archivedEnv = await getEnvironmentById({ environmentId: baseEnvironmentId });
          if (!R.isNil(archivedEnv) && baseEnvironmentRevisionId) {
            const { selectedRevision } = archivedEnv;
            // selected value in the base environment dropdown is identified
            // either by it's latest revision or by it's selected revision
            if (selectedRevision) {
              selectedRevision.id = baseEnvironmentRevisionId;
            }
            userEnvironments.push(archivedEnv);
          }
        }
      }
      setEnvironmentRevisionId(baseEnvironmentRevisionId || defaultEnvironment.selectedRevision!.id);
      setEnvironmentViewId(props.baseEnvironmentId || defaultEnvironment.id);
      setEnvironments(userEnvironments);
      setDefaultEnvironment(defaultEnvironment);
    } catch (error) {
      console.error(error);
      errorToast(error);
    } finally {
      setLoadingBaseEnvironments(false);
    }
  }

  // Effects
  React.useEffect(() => {
    fetchEnvironmentDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (props.setImageType) {
      props.setImageType(imageType);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageType]);

  // Helpers
  const onChangeEnvironment = (environmentDetails?: EnvironmentDetails) => {
    if (!R.isNil(environmentDetails)) {
      setEnvironment(environmentDetails);
    }
  };

  const setEnvironmentRevId = (id: string) => {
    const baseEnvRevId = props.baseEnvironmentRevisionId || defaultEnvironment!.selectedRevision!.id;
    setEnvironmentRevisionId(id);
    if (props.isEditMode && baseEnvRevId != id) {
      warningToast('If you change the base image, you will need to do a full rebuild to refresh the cache');
    }
  }

  return (
    <ThemedBaseImageSelector
      {...props}
      error={props.error}
      imageType={imageType}
      environment={environment}
      environmentViewId={environmentViewId}
      environmentRevisionId={environmentRevisionId}
      loadingBaseEnvironments={loadingBaseEnvironments}
      environments={environments}
      defaultEnvironment={defaultEnvironment}
      setImageType={setImageType}
      setEnvironmentViewId={setEnvironmentViewId}
      setEnvironmentRevisionId={setEnvironmentRevId}
      setLoadingBaseEnvironments={setLoadingBaseEnvironments}
      setEnvironments={setEnvironments}
      setDefaultEnvironment={setDefaultEnvironment}
      onChangeEnvironment={onChangeEnvironment}
    />
  );
};

export default BaseImageSelectorWithState;
