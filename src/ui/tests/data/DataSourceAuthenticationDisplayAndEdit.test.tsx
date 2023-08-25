import * as React from 'react';

import { AuthenticationType, CredentialType, DataSourceType } from '../../src/data/data-sources/CommonData';
import {
  DataSourceAuthenticationDisplayAndEditProps,
  DataSourceAuthenticationDisplayAndEdit,
} from '../../src/data/data-sources/DataSourceAuthenticationDisplayAndEdit';
import {
  render, 
  screen, 
} from '@domino/test-utils/dist/testing-library';

describe('DataSourceAuthenticationDisplayAndEdit', () => {
  let props: DataSourceAuthenticationDisplayAndEditProps;

  beforeEach(() => {
    props = {
      authenticatedUser: 'test-user',
      authenticationType: AuthenticationType.Basic,
      credentialType: CredentialType.Individual,
      dataSourceType: DataSourceType.SnowflakeConfig,
      isAuthenticated: true,
      isEditable: false,
      isOwner: true,
      password: '',
      setPassword: jest.fn(),
      setUsername: jest.fn(),
      username: ''
    }
  })
    
  it('should render labels and values when in display mode and user is owner for S3', () => {
    render(
      <DataSourceAuthenticationDisplayAndEdit
        {...props}
        authenticationType={AuthenticationType.AWSIAMBasic}
        dataSourceType={DataSourceType.S3Config}
      />
    );

    expect(screen.queryByText('Access Key ID')).not.toBeNull();
    expect(screen.queryByText('Secret Access Key')).not.toBeNull();
  });
  
  it('should render labels and values when in display mode and user is owner for GCS', () => {
    render(
      <DataSourceAuthenticationDisplayAndEdit
        {...props}
        authenticationType={AuthenticationType.GCPBasic}
        dataSourceType={DataSourceType.GCSConfig}
      />
    );

    expect(screen.getByText('Private Key (JSON format)')).not.toBeNull();
  });

  describe('Display mode', () => {
    describe('Individual Credentials', () => {
      it('should render labels and values when in display mode and user is owner', () => {
        const { queryByDominoTestId } = render(
          <DataSourceAuthenticationDisplayAndEdit 
            {...props} 
          />
        );
        expect(queryByDominoTestId('datasource-username-value')).not.toBeNull();
        expect(queryByDominoTestId('datasource-password-value')).not.toBeNull();
        expect(screen.queryByText('test-user')).not.toBeNull();
      });
    });
    
    describe('Shared Credentials', () => {
      it('should render labels and values when in display mode and user is owner', () => {
        const { queryByDominoTestId } = render(
          <DataSourceAuthenticationDisplayAndEdit 
            {...props} 
            credentialType={CredentialType.Shared}
          />
        );
        expect(queryByDominoTestId('datasource-username-value')).not.toBeNull();
        expect(queryByDominoTestId('datasource-password-value')).not.toBeNull();
        expect(screen.queryByText('test-user')).not.toBeNull();
      });
    
      it('should render labels show configured by admin if user is not the owner', () => {
        render(
          <DataSourceAuthenticationDisplayAndEdit
            {...props}
            credentialType={CredentialType.Shared}
            isOwner={false}
          />
        );

        expect(screen.queryAllByText('Configured by admin')).toHaveLength(2);
      });
    });

    it('should show empty username value if user has not been authenticated', () => {
      const { queryByDominoTestId } = render(
        <DataSourceAuthenticationDisplayAndEdit
          {...props}
          authenticatedUser={undefined}
        />
      );
      expect(queryByDominoTestId('datasource-username-value')).not.toBeNull();
      expect(queryByDominoTestId('datasource-password-value')).not.toBeNull();
      expect(screen.queryByText('--')).not.toBeNull();
    });
  })

  describe('Edit mode', () => {
    describe('Individual Credentials', () => {
      it('should should show inputs when in edit mode and user and is the owner', async () => {
        const { queryByDominoTestId } = render(
          <DataSourceAuthenticationDisplayAndEdit 
            {...props}
            isEditable={true}
          />
        );
        expect(queryByDominoTestId('datasource-username-input')).not.toBeNull();
        expect(queryByDominoTestId('datasource-password-input')).not.toBeNull();
      });
      
      it('should should show inputs when in edit mode if user is not the owner', async () => {
        const { queryByDominoTestId } = render(
          <DataSourceAuthenticationDisplayAndEdit 
            {...props}
            isEditable={true}
            isOwner={true}
          />
        );
        expect(queryByDominoTestId('datasource-username-input')).not.toBeNull();
        expect(queryByDominoTestId('datasource-password-input')).not.toBeNull();
      });
    })
    describe('Shared Credentials', () => {
      it('should should show inputs when in edit mode and user and is the owner', async () => {
        const { queryByDominoTestId } = render(
          <DataSourceAuthenticationDisplayAndEdit 
            {...props}
            credentialType={CredentialType.Shared}
            isEditable={true}
          />
        );
        expect(queryByDominoTestId('datasource-username-input')).not.toBeNull();
        expect(queryByDominoTestId('datasource-password-input')).not.toBeNull();
      });

      it('should should not show inputs when in edit mode and user not the is owner', async () => {
        render(
          <DataSourceAuthenticationDisplayAndEdit 
            {...props}
            credentialType={CredentialType.Shared}
            isOwner={false}
            isEditable={true}
          />
        );

        expect(screen.queryAllByText('Configured by admin')).toHaveLength(2);
      });
    });

  });
});
