// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import * as R from 'ramda';
import * as React from 'react';

import { 
  MutableFields, 
  mergeLayoutAndFieldMap 
} from '../../components/DynamicField';
import { getAuthFields } from '../../components/DynamicWizard/ProxiedRequestClientSideStaticData/createDatasource';
import LabelAndValue from '../../components/LabelAndValue';
import { AuthenticationType, CredentialType, DataSourceType } from './CommonData';
import { LabelValueWrapperStyles } from './CommonStyles';
import { 
  BLOCKED_PASSWORD,
  canViewAuth,
} from './DataSourceAuthenticationShared';
import { useAuthConfigs } from './utils';

export interface DataSourceAuthenticationDisplayAndEditProps {
  authenticatedUser?: string;
  authenticationType: AuthenticationType,
  credentialType: CredentialType;
  dataSourceType: DataSourceType;
  isAuthenticated: boolean;
  isEditable: boolean;
  isOwner: boolean;
  password?: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  username?: string;
}

export const DataSourceAuthenticationDisplayAndEdit = ({
  authenticatedUser,
  authenticationType,
  credentialType,
  dataSourceType,
  isEditable,
  isOwner,
  password,
  setUsername,
  setPassword,
  username,
}: DataSourceAuthenticationDisplayAndEditProps) => {
  const isAuthViewable = canViewAuth(isOwner, credentialType);
  const { 
    getConfigByAuthType,
  } = useAuthConfigs();
  const authConfig = getConfigByAuthType(authenticationType);
  const authFieldMetadata = getAuthFields(authenticationType, dataSourceType) || [];
  const authFieldConfig = mergeLayoutAndFieldMap({
    elements: authFieldMetadata
  }, authConfig?.fields || {});

  const getField = React.useCallback(({ 
    path,
    label,
  }: MutableFields) => {
    switch(path) {
      case 'clientId':
      case 'accessKeyID':
      case 'username':
        return (
          <LabelAndValue
            label={label}
            testId="datasource-username"
            key="datasource-username"
            value={R.cond([
              [R.always(isAuthViewable && isEditable), R.always(
                <Input
                  autoComplete="off"
                  data-test="datasource-username-input"
                  onChange={(evt) => setUsername(evt.target.value)}
                  value={username}
                /> 
              )],
              [R.always(isAuthViewable && !isEditable), R.always(<span data-test="datasource-username-value">{authenticatedUser || '--'}</span>)],
              [R.T, R.always(<i>Configured by admin</i>)]
            ])()}
            wrapperStyles={LabelValueWrapperStyles}
          />
        );
      case 'clientSecret':
      case 'password':
      case 'secretAccessKey':
        return (
          <LabelAndValue
            label={label}
            testId="datasource-password"
            key="datasource-password"
            value={R.cond([
              [R.always(isAuthViewable && isEditable), R.always(
                <Input.Password
                  autoComplete="off"
                  data-test="datasource-password-input"
                  onChange={(evt) => setPassword(evt.target.value)}
                  value={password}
                />
              )],
              [R.always(isAuthViewable && !isEditable), R.always(
                <Input data-test="datasource-password-value" value={BLOCKED_PASSWORD} type="password" style={{border: 0, padding: 0}}/>
              )],
              [R.T, R.always(<i>Configured by admin</i>)]
            ])()}
            wrapperStyles={LabelValueWrapperStyles}
          />
        )
      case 'accessKey':
        return (
          <LabelAndValue
            label={label}
            testId="datasource-password"
            key="datasource-password"
            value={R.cond([
              [R.always(isAuthViewable && isEditable), R.always(
                <Input
                  autoComplete="off"
                  data-test="datasource-password-input"
                  onChange={(evt) => setPassword(evt.target.value)}
                  value={password}
                /> 
              )],
              [R.always(isAuthViewable && !isEditable), R.always(
                <Input data-test="datasource-password-value" value={BLOCKED_PASSWORD} type="password" style={{border: 0, padding: 0}}/>
              )],
              [R.T, R.always(<i>Configured by admin</i>)]
            ])()}
            wrapperStyles={{
              ...LabelValueWrapperStyles,
              width: '100%',
            }}
            valueStyles={{ width: '100%' }}
          />
        )
      case 'privateKey':
        return (
          <LabelAndValue
            label={label}
            testId="datasource-password"
            key="datasource-password"
            value={R.cond([
              [R.always(isAuthViewable && isEditable), R.always(
                <Input.TextArea
                  autoComplete="off"
                  data-test="datasource-password-input"
                  onChange={(evt) => setPassword(evt.target.value)}
                  rows={10}
                  value={password}
                /> 
              )],
              [R.always(isAuthViewable && !isEditable), R.always(
                <Input data-test="datasource-password-value" value={BLOCKED_PASSWORD} type="password" style={{border: 0, padding: 0}}/>
              )],
              [R.T, R.always(<i>Configured by admin</i>)]
            ])()}
            wrapperStyles={{
              ...LabelValueWrapperStyles,
              width: '100%',
            }}
            valueStyles={{ width: '100%' }}
          />
        )
      default: 
        return null;
    }
  }, [
    authenticatedUser,
    isAuthViewable,
    isEditable,
    password,
    setPassword,
    setUsername,
    username,
  ])
  
  return (
    <>
      {authFieldConfig.elements.map((element: MutableFields) => getField(element))}
    </>
  )
};
