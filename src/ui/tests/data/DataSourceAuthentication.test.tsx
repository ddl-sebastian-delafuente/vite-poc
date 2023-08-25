import * as React from 'react';

import DataSourceAuthentication, { DataSourceAuthenticationProps } from '../../src/data/data-sources/add-existing-data-source/DataSourceAuthentication';
import { AuthenticationType, CredentialType } from '../../src/data/data-sources/CommonData';
import {
  AdminProfile,
  makeMocks,
  MakeMocksReturn,
} from '@domino/test-utils/dist/mock-manager';
import {
  dataSourceDtoIndividualSnowflake,
} from '@domino/test-utils/dist/mock-usecases';
import {
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

describe('DataSourceAuthentication', () => {
  let props: DataSourceAuthenticationProps;

  describe('Individual Credentials', () => {
    beforeEach(() => {
      props = {
        authenticationType: AuthenticationType.Basic,
        dataSource: dataSourceDtoIndividualSnowflake,
        setPassword: jest.fn(),
        setUsername: jest.fn(),
        currentUserId: 'ownerId',
      }
    });

    it('should not render the form and show credentials if user is the owner and datasource is authenticated', async () => {
      const { queryByDominoTestId } = render(<DataSourceAuthentication {...props} />);

      await waitFor(() => expect(screen.getByText('Username')).not.toBeNull());
      expect(mocks.api.datasource.getAuthenticationStatus).toHaveBeenCalled();
      await waitFor(() => expect(queryByDominoTestId('username-input-static')).not.toBeNull());
      expect(queryByDominoTestId('password-input-static')).not.toBeNull();
    });
    
    it('should not render the form and show credentials if user not the owner', async () => {
      const { queryByDominoTestId } = render(
        <DataSourceAuthentication 
          {...props} 
          currentUserId="test-user-id"
        />
      );

      await waitFor(() => expect(screen.getByText('Username')).not.toBeNull());
      await waitFor(() => expect(queryByDominoTestId('username-input-static')).not.toBeNull());
      expect(queryByDominoTestId('password-input-static')).not.toBeNull();
    });

    it('should render the form if datasource is not authenticated', async () => {
      mocks.api.datasource.getAuthenticationStatus.mockResolvedValue(false);
      const { queryByDominoTestId } = render(<DataSourceAuthentication {...props} />);

      await waitFor(() => expect(screen.getByText('Username')).not.toBeNull());
      expect(queryByDominoTestId('username-input')).not.toBeNull();
      expect(queryByDominoTestId('password-input')).not.toBeNull();
    });
  });

  describe('Shared Credentials', () => {
    beforeEach(() => {
      mocks.api.datasource.getAuthenticationStatus.mockResolvedValue(true);

      props = {
        authenticationType: AuthenticationType.Basic,
        dataSource: {
          ...dataSourceDtoIndividualSnowflake,
          dataSourcePermissions: {
            ...dataSourceDtoIndividualSnowflake.dataSourcePermissions,
            credentialType: CredentialType.Shared
          }
        },
        setPassword: jest.fn(),
        setUsername: jest.fn(),
        currentUserId: 'ownerId',
      }
    });

    it('should not render the form and show credentials if user is the owner and datasource is authenticated', async () => {
      const { queryByDominoTestId } = render(<DataSourceAuthentication {...props} />);

      await waitFor(() => expect(screen.getByText('Username')).not.toBeNull());
      expect(mocks.api.datasource.getAuthenticationStatus).toHaveBeenCalled();
      await waitFor(() => expect(queryByDominoTestId('username-input-static')).not.toBeNull());
      expect(queryByDominoTestId('password-input-static')).not.toBeNull();
    });

    it('should not render the form and not show credentials if not the owner', async () => {
      render(
        <DataSourceAuthentication 
          {...props} 
          currentUserId="test-user-id"
        />
      );

      await waitFor(() => expect(screen.getByText('Username')).not.toBeNull());
      expect(screen.queryAllByText('Configured by admin')).toHaveLength(2);
    });


    it('should render the form if datasource is not authenticated', async () => {
      mocks.api.datasource.getAuthenticationStatus.mockResolvedValue(false);
      const { queryByDominoTestId } = render(<DataSourceAuthentication {...props} />);

      await waitFor(() => expect(screen.getByText('Username')).not.toBeNull());
      expect(queryByDominoTestId('username-input')).not.toBeNull();
      expect(queryByDominoTestId('password-input')).not.toBeNull();
    });
  });
});
