import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import {
  DominoDatasourceApiDataSourceDto as DataSourceDto,
} from '@domino/api/dist/types';
import { getVisibleCredentials } from '@domino/api/dist/Datasource';
import Card from '@domino/ui/dist/components/Card';
import MultiLineText from '../../../components/MultiLineText';
import FlexLayout from '../../../components/Layouts/FlexLayout';
import InfoBox from '../../../components/Callout/InfoBox';
import LabelAndValue from '../../../components/LabelAndValue';
import AdminShield from '../../../icons/AdminShield';
import { colors, themeHelper } from '../../../styled';
import {
  AUTH_AWSIROLE_TEXT,
  AUTH_OAUTH_TEXT,
  AuthenticationType,
  CREDENTIALS_ARE_SECURE_TEXT,
  CredentialType,
  DataSourceType,
  getDataSourceIcon,
  getDataSourceIconComponent,
  getDateInFormat,
  isBasicAuth,
} from '../CommonData';
import { 
  AdminShieldWrapper, 
  StyledIconWrapper,
  SuccessBoxContainer,
} from '../CommonStyles';
import { 
  getDataSourcePermissions,
  UseAuthenticationStateReturn 
} from '../utils';
import { DataSourceConfigDetails } from '../DataSourceConfigDetails';
import DataSourceAuthentication from './DataSourceAuthentication';

const CardWrapper = styled.div`
  .ant-card-body {
    padding: 0;
  }
  .ant-card-head-title {
    font-weight: ${themeHelper('fontWeights.normal')};
    color: ${colors.greyishBrown}
  }
`;
const LabelAndValueWrapper = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid ${colors.btnGrey};
`;
const AuthenticationWrapper = styled.div`
  padding: 15px 20px;
`;
const AuthenticationHeader = styled.div`
  font-size: ${themeHelper('fontSizes.medium')};
  color: ${colors.tundora};
  margin-bottom: 14px;
`;
const StyledExtraTitle = styled.div`
  color: ${colors.mantis};
`;
const StyledTitle = styled(FlexLayout)`
  margin-top: 10px;
  padding: 0 20px;
`
const InfoBoxContainer = styled(InfoBox)`
  margin: ${themeHelper('paddings.medium')} 0;
  width: 100%;
`;
const ErrorMsg = styled.div`
  font-size: ${themeHelper('fontSizes.small')};
  color: ${colors.torchRed};
`;
export const LabelAndValueWrapperStyles = {
  width: '32%'
} as React.CSSProperties;

const inputParsingRegex = new RegExp('^Input parsing error', 'i');
const internalErrorRegex = new RegExp('^Internal Error', 'i');
const invalidDatabaseRegex = new RegExp('^Invalid database name', 'i');

const getAuthError = (authError: string): string => {
  switch(true) {
    case inputParsingRegex.test(authError):
    case internalErrorRegex.test(authError):
    case invalidDatabaseRegex.test(authError):
      return 'Entered credentials do not have access to this data source configuration. Please contact your data source admin to obtain access.';
    default:
      return authError;
  }
}

export interface DataSourceDetailsSectionProps {
  dataSource: DataSourceDto, 
}

export const DataSourceDetailsSection = ({dataSource}: DataSourceDetailsSectionProps) => {
  const dataSourceType = dataSource.dataSourceType as DataSourceType;
  return (
    <LabelAndValueWrapper className="label-value-content">
      <FlexLayout justifyContent="space-between">
        <LabelAndValue
          label="Data Store"
          value={<FlexLayout alignItems="center" justifyContent="flex-start">
            <StyledIconWrapper>{getDataSourceIcon(dataSourceType)}</StyledIconWrapper>
            <div>{dataSource.displayName}</div>
          </FlexLayout>}
          testId="datasource-datastore"
          wrapperStyles={LabelAndValueWrapperStyles}
        />
        <LabelAndValue
          label="Owner"
          value={dataSource.ownerInfo.ownerName}
          testId="datasource-owner"
          wrapperStyles={LabelAndValueWrapperStyles}
        />
        <LabelAndValue
          label="Created"
          value={dataSource && getDateInFormat(dataSource.lastUpdated)}
          testId="datasource-created"
          wrapperStyles={LabelAndValueWrapperStyles}
        />
      </FlexLayout>
      <FlexLayout justifyContent="space-between" alignItems="flex-start">
        <LabelAndValue
          label="Description"
          value={dataSource.description ?
            <MultiLineText
              lines={5}
              maxLines={50}
              text={dataSource.description}
              showMoreText="show more"
              showLessText="show less"
            /> : '--'}
          testId="datasource-description"
          wrapperStyles={{ width: '62%' }}
        />
        <LabelAndValue
          label="Last Updated"
          value={dataSource && getDateInFormat(dataSource.lastUpdated)}
          testId="datasource-lastupdated"
          wrapperStyles={LabelAndValueWrapperStyles}
        />
      </FlexLayout>
      <DataSourceConfigDetails
        config={dataSource.config}
        dataSourceType={dataSourceType}
      />
    </LabelAndValueWrapper>
  );
};
interface DataSourceDetailsProps extends 
  Omit<UseAuthenticationStateReturn, 
    'resetAuthenticationState' | 
    'setAuthenticationType' | 
    'shouldPassCredentials' | 
    'shouldShowAuthTypeSelector'
    > {
  authError?: string;
  isAuthenticated?: boolean;
  selectedDataSource: DataSourceDto;
  userId: string;
}
const DataSourceDetails = (props: DataSourceDetailsProps) => {
  const { 
    authError,
    authenticationType,
    password, 
    selectedDataSource, 
    setPassword, 
    setUsername, 
    userId, 
    username, 
  } = props;
  const { isEveryone, credentialType, userIds } = getDataSourcePermissions(selectedDataSource);
  const hasAccess = R.contains(userId, userIds) || isEveryone;

  React.useEffect(() => {
    async function fetchVisibleCredentials() {
      try {
        const credentials = await getVisibleCredentials({dataSourceId: selectedDataSource.id});
        setUsername(credentials);
      } catch (e) {
        console.warn(e);
      }
    }
    
    if (R.equals(userId, selectedDataSource.ownerId) || hasAccess) {
      fetchVisibleCredentials();
    }
  }, [
    hasAccess,
    selectedDataSource,
    setUsername, 
    userId,
  ]);

  const dataSourceType = selectedDataSource.dataSourceType as DataSourceType;
  const IconComponent = getDataSourceIconComponent(dataSourceType);
  const { ownerInfo } = selectedDataSource;

  return(
    <CardWrapper>
      <Card
        title={
          <StyledTitle alignItems="center" justifyContent="flex-start">
            <StyledIconWrapper><IconComponent width="19" height="19"/></StyledIconWrapper>
            <div>{selectedDataSource.name}</div>
          </StyledTitle>
        }
        extra={
          <FlexLayout>
            {ownerInfo.isOwnerAdmin && (
                <>
                  <AdminShieldWrapper><AdminShield primaryColor={colors.goodGreenColor} width={14} height={14}/></AdminShieldWrapper>
                  <StyledExtraTitle>Configured by an admin</StyledExtraTitle>
                </>
            )}
          </FlexLayout>
        }
        width="100%"
      >
        <DataSourceDetailsSection dataSource={selectedDataSource}/>
        <AuthenticationWrapper>
          <AuthenticationHeader>
            {`Add ${selectedDataSource.displayName} Authentication`}
          </AuthenticationHeader>
          {R.cond([
            [R.always(isBasicAuth(authenticationType) && credentialType === CredentialType.Individual), () => (
              <InfoBoxContainer data-test="authenticate-info-message">
                {CREDENTIALS_ARE_SECURE_TEXT}
              </InfoBoxContainer>
            )]
          ])()}
          {R.cond([
            [R.always(authenticationType === AuthenticationType.OAuth), () => (
              <SuccessBoxContainer>{AUTH_OAUTH_TEXT}</SuccessBoxContainer>
            )],
            [R.always(authenticationType === AuthenticationType.AWSIAMRole), () => (
              <SuccessBoxContainer>{AUTH_AWSIROLE_TEXT}</SuccessBoxContainer>
            )],
            [R.T, () => (
              <DataSourceAuthentication
                authenticationType={authenticationType}
                currentUserId={userId}
                dataSource={selectedDataSource}
                password={password}
                setPassword={setPassword}
                setUsername={setUsername}
                username={username}
              />
            )]
          ])()}
          {authError && <ErrorMsg>{getAuthError(authError)}</ErrorMsg>}
        </AuthenticationWrapper>
      </Card>
    </CardWrapper>
  );
};

export default DataSourceDetails;
