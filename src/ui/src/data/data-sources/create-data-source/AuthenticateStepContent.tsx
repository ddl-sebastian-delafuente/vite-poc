import { checkDataSourceConnection } from '@domino/api/dist/Datasource';
import { Form } from '@ant-design/compatible';
import { FormComponentProps } from '@ant-design/compatible/lib/form/Form';
import * as R from 'ramda';
import * as React from 'react';
import styled from 'styled-components';

import useStore from '@domino/ui/dist/globalStore/useStore';
import { RadioChangeEvent } from '@domino/ui/dist/components/Radio';
import { error } from '../../../components/toastr';
import { getErrorMessage } from '../../../components/renderers/helpers';
import * as mixpanelTypes from '../../../mixpanel/types';
import { mixpanel } from '../../../mixpanel';
import { themeHelper } from '../../../styled';
import { usePrevious } from '../../../utils/CustomHooks';
import { AuthenticationTypeSelector } from '../AuthenticationTypeSelector';
import {
  DataSourceAuthenticationFieldsCoreProps,
  DataSourceAuthenticationFields
} from '../DataSourceAuthenticationFields';
import {
  AuthenticationType,
  AUTH_OAUTH_TEXT,
  AUTH_AWSIROLE_TEXT,
  ConfigObjProps,
  CREDENTIALS_ARE_SECURE_TEXT,
  CredentialType,
  EngineType,
  getDataSourceIcon16,
  isBasicAuth,
  isPassThroughAuth,
} from '../CommonData';
import {
  Container,
  ImageText,
  ImageTextLabel,
  InfoBoxContainer,
  SimpleModeTextContainer,
  StyledButton,
  StyledFormItem,
  SuccessBoxContainer,
  WarningBoxContainer,
} from '../CommonStyles';
import { areCredentialsFilled } from '../utils';
import { getAppName } from '@domino/ui/dist/utils/whiteLabelUtil';

const StyledSimpleModeTextContainer = styled(SimpleModeTextContainer)`
  margin-bottom: ${themeHelper('margins.large')};
`;

const StyledSuccessBoxContainer = styled(SuccessBoxContainer)`
  margin-top: 0;
`;

export interface AuthenticateStepContentProps extends DataSourceAuthenticationFieldsCoreProps {
  authenticationType: AuthenticationType,
  /**
   * Contains a list of available authentication types for the given data source
   */
  authTypes: AuthenticationType[],
  configObj: ConfigObjProps;
  credentialType?: CredentialType;
  dataTypeDisplayName: string,
  engineType?: EngineType,
  isAuthenticateComplete: boolean;
  isAdminUser: boolean;
  setAuthenticationType: (authenticationType: AuthenticationType) => void;
  shouldShowAuthTypeSelector: boolean;
}

const AuthenticateStepContent = (
  {
    authenticationType,
    authTypes,
    configObj,
    credentialType,
    dataTypeDisplayName,
    dataType,
    engineType,
    form,
    isAdminUser,
    isAuthenticateComplete,
    password,
    setAuthenticationType,
    setIsAuthenticateComplete = () => undefined,
    setPassword,
    setUsername,
    shouldShowAuthTypeSelector,
    username,
  }: AuthenticateStepContentProps & FormComponentProps
) => {
  const { whiteLabelSettings } = useStore();
  const handleAuthCheck = React.useCallback(async () => {
    try {
      const body = {
        ...configObj,
        authType: authenticationType as AuthenticationType,
        credentialType: credentialType as CredentialType,
        dataSourceType: dataType!,
        secretCredential: password,
        visibleCredential: username || '',
      };
      const authenticated = await checkDataSourceConnection({ body });
      setIsAuthenticateComplete(authenticated);
      if (!authenticated) {
        error('Your credentials are incorrect.');
      }
    } catch (err) {
      const errorMessage = await getErrorMessage(err, 'Error checking data source connection. Check logs for more details');
      console.warn('Error checking data source connection', err);
      error(errorMessage);
    }
  }, [
    authenticationType,
    configObj,
    credentialType,
    dataType,
    password,
    username,
    setIsAuthenticateComplete
  ]);
  
  const prevAuthenticationType = usePrevious(authenticationType);
  const handleAuthenticationTypeChange = React.useCallback((evt: RadioChangeEvent) => {
    setAuthenticationType(evt.target.value as AuthenticationType);
  }, [setAuthenticationType]);

  React.useEffect(() => {
    if (isPassThroughAuth(authenticationType, dataType)) {
      if (!isAuthenticateComplete) {
        setIsAuthenticateComplete(true);
      }
      return;
    }

    if (authenticationType === AuthenticationType.AWSIAMRoleWithUsername) {
      if (!isAuthenticateComplete && username) {
        setIsAuthenticateComplete(true);
      }
      return;
    }

    if (engineType === EngineType.Starburst) {
      if (!isAuthenticateComplete && username && password) {
        setIsAuthenticateComplete(true);
      }
    }

    if (authenticationType !== prevAuthenticationType) {
      setIsAuthenticateComplete(false);
      setPassword('');
      setUsername('');
    }
  }, [
    authenticationType, 
    dataType,
    engineType,
    configObj,
    isAuthenticateComplete,
    password,
    prevAuthenticationType,
    setIsAuthenticateComplete,
    setPassword,
    setUsername,
    username,
  ]);

  React.useEffect(() => {
      mixpanel.track(() =>
          new mixpanelTypes.DatasourceAuthenticateStep({
              location: mixpanelTypes.Locations.DataSourceAuthenticateStep
          })
      );
  }, []);

  const shouldShowTestCredentialsButton = isAdminUser && 
    credentialType === CredentialType.Individual && 
    authenticationType !== AuthenticationType.AWSIAMRoleWithUsername &&
    engineType !== EngineType.Starburst;
  const shouldShowAuthenticationSucccessMessage = 
    isAuthenticateComplete && 
    authenticationType !== AuthenticationType.AWSIAMRoleWithUsername &&
    !isPassThroughAuth(authenticationType, dataType) &&
    engineType !== EngineType.Starburst;

  const shouldShowCredentialSecureMessage =
    (engineType !== EngineType.Starburst && !isAdminUser) || 
    (!isAdminUser && !isAuthenticateComplete && isBasicAuth(authenticationType));

  const sectionHeader = dataType && (
    <ImageTextLabel>
      {getDataSourceIcon16(dataType)}
      <ImageText>
        {credentialType === CredentialType.Individual ?
          `Add Your ${dataTypeDisplayName} Credentials` :
          `Add ${dataTypeDisplayName} Service Account Credentials`}
      </ImageText>
    </ImageTextLabel>
  )
;
  return (
    <Container>
      <Form
        layout="vertical"
        autoComplete="off"
        hideRequiredMark={true}
      >
        <StyledFormItem
          label={sectionHeader}
          style={shouldShowAuthTypeSelector ? { marginBottom: '16px' } : {}}
        >
          {R.cond([
            [R.always(shouldShowAuthTypeSelector), () => (
              <>
                <StyledSimpleModeTextContainer data-test="data-source-authenticate-select-type-description">
                    Please choose the method you'd like to use for authentication
                </StyledSimpleModeTextContainer>
                {form.getFieldDecorator('authenticationType', {
                  initialValue: authenticationType
                })(
                  <AuthenticationTypeSelector authTypes={authTypes} onChange={handleAuthenticationTypeChange} />
                )}
              </>
            )],
            [R.T, () => (
              <SimpleModeTextContainer data-test="data-source-authenticate-description">
                {credentialType === CredentialType.Individual ?
                  'Please enter your credentials to verify that the connector is set up successfully. Valid credentials are required to retrieve data through this data source.' :
                  `Please enter the service account credentials that users with ${getAppName(whiteLabelSettings)} permissions to this data source will use for authentication.`}
              </SimpleModeTextContainer>
            )],
          ])()}
        </StyledFormItem>
        {R.cond([
          [R.always(!isPassThroughAuth(authenticationType, dataType)), () => (
            <>
              {shouldShowCredentialSecureMessage &&
              <InfoBoxContainer data-test="authenticate-info-message">
                {CREDENTIALS_ARE_SECURE_TEXT}
              </InfoBoxContainer>
              }
              <DataSourceAuthenticationFields
                authenticationType={authenticationType}
                dataType={dataType}
                form={form}
                password={password}
                setIsAuthenticateComplete={setIsAuthenticateComplete}
                setPassword={setPassword}
                setUsername={setUsername}
                username={username}
              />
            </>
          )],
        ])()}
        {R.cond([
          [R.always(authenticationType === AuthenticationType.OAuth), () => (
            <StyledSuccessBoxContainer>{AUTH_OAUTH_TEXT}</StyledSuccessBoxContainer>
          )],
          [R.always(authenticationType === AuthenticationType.AWSIAMRole && isPassThroughAuth(authenticationType, dataType)), () => (
            <StyledSuccessBoxContainer>{AUTH_AWSIROLE_TEXT}</StyledSuccessBoxContainer>
          )],
          [R.always(shouldShowAuthenticationSucccessMessage), () => (
            <SuccessBoxContainer data-test="authenticate-success-message">
              Your Data Source was successfully authenticated and set up.
            </SuccessBoxContainer>)],
          [R.always(shouldShowTestCredentialsButton), () => (
            <StyledButton
              testId="test-credentials"
              disabled={!areCredentialsFilled({
                authenticationType,
                secretCredential: password,
                visibleCredential: username,
              })}
              onClick={handleAuthCheck}
            >
              Test Credentials
            </StyledButton>
          )],
          [R.always(isAdminUser && isBasicAuth(authenticationType)), () => (
            <WarningBoxContainer data-test="authenticate-success-message">
              These credentials are stored securely and cannot be viewed or copied by users.
            </WarningBoxContainer>
          )]])()
        }
      </Form>
    </Container>
  );
};

export default Form.create<AuthenticateStepContentProps & FormComponentProps>()(AuthenticateStepContent);
