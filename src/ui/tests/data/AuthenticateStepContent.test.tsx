import * as React from 'react';

import AuthenticateStepContent, { AuthenticateStepContentProps } from '../../src/data/data-sources/create-data-source/AuthenticateStepContent';
import { AuthenticationType, CredentialType, DataSourceType } from '../../src/data/data-sources/CommonData';
import {
  AdminProfile,
  makeMocks,
  MakeMocksReturn,
} from '@domino/test-utils/dist/mock-manager';
import {
  fullClick,
  render,
  screen,
  waitFor
} from '@domino/test-utils/dist/testing-library';
let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();

  mocks.loadProfile(AdminProfile);
});

afterAll(() => {
  mocks.unmock();
});

// @ts-ignore
global.mixpanel = Object.create({})
// @ts-ignore
global.mixpanel.track = jest.fn()

const baseProps: Pick<AuthenticateStepContentProps, 'authTypes' | 'configObj'> = {
  authTypes: [AuthenticationType.OAuth, AuthenticationType.Basic],
  configObj: {},
}

describe('AuthenticateStepContent', () => {
  let props: AuthenticateStepContentProps;
  describe('Individual credential', () => {
    it('should display the correct message when credential type is individual', async () => {
      props = {
        authTypes: [AuthenticationType.Basic, AuthenticationType.OAuth],
        authenticationType: AuthenticationType.Basic,
        configObj: {},
        credentialType: CredentialType.Individual,
        dataType: DataSourceType.SnowflakeConfig,
        dataTypeDisplayName: 'Snowflake',
        isAdminUser: false,
        isAuthenticateComplete: false,
        setAuthenticationType: jest.fn(),
        setPassword: jest.fn(),
        setUsername: jest.fn(),
        shouldShowAuthTypeSelector: false,
      };
      render(
        <AuthenticateStepContent {...props}/>
      );

      expect(screen.queryByText('Please enter your credentials to verify', { exact: false })).not.toBeNull();
    });

    it('should display a test credentials button if user is admin', async () => {
      props = {
        ...baseProps,
        authenticationType: AuthenticationType.Basic,
        credentialType: CredentialType.Individual,
        dataType: DataSourceType.SnowflakeConfig,
        dataTypeDisplayName: 'Snowflake',
        isAdminUser: true,
        isAuthenticateComplete: false,
        setAuthenticationType: jest.fn(),
        setPassword: jest.fn(),
        setUsername: jest.fn(),
        shouldShowAuthTypeSelector: false,
      };
      const { queryByDominoTestId  } = render(
        <AuthenticateStepContent {...props}/>
      );

      expect(queryByDominoTestId('test-credentials')).not.toBeNull();
    });
  
    it('should display auth type selector', async () => {
      props = {
        ...baseProps,
        authenticationType: AuthenticationType.Basic,
        credentialType: CredentialType.Individual,
        dataType: DataSourceType.SnowflakeConfig,
        dataTypeDisplayName: 'Snowflake',
        isAdminUser: true,
        isAuthenticateComplete: false,
        setAuthenticationType: jest.fn(),
        setPassword: jest.fn(),
        setUsername: jest.fn(),
        shouldShowAuthTypeSelector: true,
      };
      render(
        <AuthenticateStepContent {...props}/>
      );

      expect(screen.queryByText('Please choose the method you\'d like to use for authentication')).not.toBeNull();
    });
  });

  describe('Service accounts', () => {
    it('should display the correct message when credential type a service account', async () => {
      props = {
        ...baseProps,
        authenticationType: AuthenticationType.Basic,
        credentialType: CredentialType.Shared,
        dataType: DataSourceType.SnowflakeConfig,
        dataTypeDisplayName: 'Snowflake',
        isAdminUser: false,
        isAuthenticateComplete: false,
        setAuthenticationType: jest.fn(),
        setPassword: jest.fn(),
        setUsername: jest.fn(),
        shouldShowAuthTypeSelector: false,
      };
      const { queryByDominoTestId } = render(
        <AuthenticateStepContent {...props}/>
      );

      expect(screen.queryByText('Please enter the service account credentials', { exact: false })).not.toBeNull();
      expect(queryByDominoTestId('authenticate-info-message')).not.toBeNull();
    });
  });

  it('should handle auth check', async () => {
    const MockWrapper = (mockProps: AuthenticateStepContentProps) => {
      const [isAuthenticateComplete, setIsAuthenticateComplete] = React.useState(false);
      return (
        <AuthenticateStepContent
          {...mockProps}
          isAuthenticateComplete={isAuthenticateComplete}
          setIsAuthenticateComplete={setIsAuthenticateComplete}
        />
      )
    }
    props = {
      ...baseProps,
      authenticationType: AuthenticationType.Basic,
      credentialType: CredentialType.Individual,
      dataType: DataSourceType.SnowflakeConfig,
      dataTypeDisplayName: 'Snowflake',
      isAdminUser: true,
      isAuthenticateComplete: false,
      password: 'password',
      setAuthenticationType: jest.fn(),
      setPassword: jest.fn(),
      setUsername: jest.fn(),
      shouldShowAuthTypeSelector: false,
      username: 'username'
    };
    const { getByDominoTestId, queryByDominoTestId  } = render(
      <MockWrapper {...props}/>
    );

    const testCredentialsButton = getByDominoTestId('test-credentials');
    fullClick(testCredentialsButton);

    await waitFor(() => expect(queryByDominoTestId('authenticate-success-message')).not.toBeNull());
  });

  it('should handle auth check invalid credentials', async () => {
    mocks.api.datasource.checkDataSourceConnection.mockResolvedValue(false);
    props = {
      ...baseProps,
      authenticationType: AuthenticationType.Basic,
      credentialType: CredentialType.Individual,
      dataType: DataSourceType.SnowflakeConfig,
      dataTypeDisplayName: 'Snowflake',
      isAdminUser: true,
      isAuthenticateComplete: false,
      password: 'password',
      setAuthenticationType: jest.fn(),
      setPassword: jest.fn(),
      setUsername: jest.fn(),
      shouldShowAuthTypeSelector: false,
      username: 'username'
    };
    const { getByDominoTestId  } = render(
      <AuthenticateStepContent {...props}/>
    );

    const testCredentialsButton = getByDominoTestId('test-credentials');
    fullClick(testCredentialsButton);

    await waitFor(() => expect(screen.queryByText('Your credentials are incorrect.', {exact: false})).not.toBeNull());
  });

  it('should handle auth check backend failures', async () => {
    mocks.api.datasource.checkDataSourceConnection.mockRejectedValue(new Error('Async Error'));
    props = {
      ...baseProps,
      authenticationType: AuthenticationType.Basic,
      credentialType: CredentialType.Individual,
      dataType: DataSourceType.SnowflakeConfig,
      dataTypeDisplayName: 'Snowflake',
      isAdminUser: true,
      isAuthenticateComplete: false,
      password: 'password',
      setAuthenticationType: jest.fn(),
      setPassword: jest.fn(),
      setUsername: jest.fn(),
      shouldShowAuthTypeSelector: false,
      username: 'username'
    };
    const { getByDominoTestId  } = render(
      <AuthenticateStepContent {...props}/>
    );

    const testCredentialsButton = getByDominoTestId('test-credentials');
    fullClick(testCredentialsButton);

    await waitFor(() => expect(screen.queryByText('Error checking data source connection', {exact: false})).not.toBeNull());
  });
});
