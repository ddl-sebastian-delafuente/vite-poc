import { getDataSourceConfigsNewResponse } from '@domino/test-utils/dist/mockResponses';
import * as React from 'react';

import AuthenticateStepContent, { AuthenticateStepContentProps } from '../../../../src/data/data-sources/create-data-source/AuthenticateStepContent';
import {
  CredentialType, 
} from '../../../../src/data/data-sources/CommonData';
import { 
  getDatasourceName,
  useAuthenticationState 
} from '../../../../src/data/data-sources/utils';
import { getDevStoryPath } from '../../../../src/utils/storybookUtil';
import { authenticateStepContent } from '../CommonMocks';

const datasourceOptions: string[] = getDataSourceConfigsNewResponse.map(({datasourceType}) => datasourceType);


export default {
  title: getDevStoryPath('Develop/Data/Datasource/Create Datasource/Authenticate Step Content'),
  component: AuthenticateStepContent,
  argTypes: {
    credentialType: {
      control: { type: 'select' },
      options: [CredentialType.Shared, CredentialType.Individual],
    },
    datasource: {
      control: { type: 'select' },
      options: datasourceOptions,
    },
    isAdminUser: {
      control: { type: 'boolean' },
    },
    isAuthenticateComplete: {
      control: { type: 'boolean' },
    }
  },
  args: {
    credentialType: CredentialType.Individual,
    datasource: datasourceOptions[1],
    isAdminUser: false,
    isAuthenticateComplete: false,
  },
  decorators: [
    (Story: any) => {
      authenticateStepContent();
      return <Story/>
    }
  ]
};

type TemplateProps = {
  datasource: keyof typeof datasourceOptions,
}  & AuthenticateStepContentProps;

const AuthenticateStepContentTemplate = ({ 
  credentialType,
  datasource,
  password: initialPassword,
  username: initialUsername, 
  isAuthenticateComplete: initialIsAuthenticationComplete,
  ...args 
}: TemplateProps) => {
  const getDataSource = React.useCallback((datasourceKey: string)  => {
    const datasourceIndex = datasourceOptions.indexOf(datasourceKey);
    return getDataSourceConfigsNewResponse[datasourceIndex];
  }, []);
  const selectedDataSource = getDataSource(datasource as string);
  const [ isAuthenticateComplete, setIsAuthenticateComplete ] = React.useState<boolean>(initialIsAuthenticationComplete);

  const {
    authenticationType,
    authTypes,
    password,
    setAuthenticationType,
    setPassword,
    setUsername,
    shouldShowAuthTypeSelector,
    username,
  } = useAuthenticationState({
    authenticationType: selectedDataSource?.authTypes[0],
    authTypes: selectedDataSource?.authTypes,
    credentialType: credentialType as CredentialType,
    datasourceType: selectedDataSource?.datasourceType,
    password: initialPassword,
    username: initialUsername,
  });
  React.useEffect(() => setIsAuthenticateComplete(initialIsAuthenticationComplete), [initialIsAuthenticationComplete, setIsAuthenticateComplete])

  if (!datasource || !credentialType) {
    return <div>Ensure a datasource and credential type is selected</div>
  }

  const internalProps = {
    authenticationType,
    authTypes,
    credentialType,
    configObj: {},
    dataTypeDisplayName: getDatasourceName(selectedDataSource.datasourceType),
    dataType: selectedDataSource.datasourceType,
    isAuthenticateComplete,
    password,
    setAuthenticationType,
    setIsAuthenticateComplete,
    setPassword,
    setUsername,
    shouldShowAuthTypeSelector,
    username,
  };

  return (
    <AuthenticateStepContent
      {...args}
      {...internalProps}
    />
  )
}

export const InteractiveExample = AuthenticateStepContentTemplate.bind({});
