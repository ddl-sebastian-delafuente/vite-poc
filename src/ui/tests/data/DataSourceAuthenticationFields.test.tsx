import { Form } from '@ant-design/compatible';
import { FormComponentProps } from '@ant-design/compatible/lib/form/Form';
import * as React from 'react';

import { AuthenticationType, DataSourceType } from '../../src/data/data-sources/CommonData';
import { 
  DataSourceAuthenticationFields, 
  DataSourceAuthenticationFieldsCoreProps 
} from '../../src/data/data-sources/DataSourceAuthenticationFields';
import {
  render, 
  screen, 
} from '@domino/test-utils/dist/testing-library';

const withForm = Form.create<FormComponentProps>();

describe('DataSourceAuthenticationFields', () => {
  let props: Pick<DataSourceAuthenticationFieldsCoreProps, 
    'password' | 
    'setIsAuthenticateComplete' | 
    'setPassword' | 
    'setUsername' | 
    'username'
  > & { authenticationType: AuthenticationType };

  beforeEach(() => {
    props = {
      authenticationType: AuthenticationType.Basic,
      setIsAuthenticateComplete: jest.fn(),
      setPassword: jest.fn(),
      setUsername: jest.fn(),
    }
  });

  it('should show the correct field labels for S3 datasources', async () => {
    const WrappedComponent = withForm(({ form }: FormComponentProps) => (
      <DataSourceAuthenticationFields 
        {...props}
        authenticationType={AuthenticationType.AWSIAMBasic}
        dataType={DataSourceType.S3Config} 
        form={form}
      />
    ));
    
    const view = render(<><WrappedComponent/></>);

    expect(screen.getByText('Access Key ID')).not.toBeNull();
    expect(screen.getByText('Secret Access Key')).not.toBeNull();
    expect(view.queryByDominoTestId('username-input')).not.toBeNull();
    expect(view.queryByDominoTestId('password-input')).not.toBeNull();
  });
  
  it('should show the correct field labels for Generic S3 datasources', async () => {
    const WrappedComponent = withForm(({ form }: FormComponentProps) => (
      <DataSourceAuthenticationFields 
        {...props}
        authenticationType={AuthenticationType.AWSIAMBasic}
        dataType={DataSourceType.GenericS3Config} 
        form={form}
      />
    ));
    
    const view = render(<><WrappedComponent/></>);

    expect(screen.getByText('Access Key ID')).not.toBeNull();
    expect(screen.getByText('Secret Access Key')).not.toBeNull();
    expect(view.queryByDominoTestId('username-input')).not.toBeNull();
    expect(view.queryByDominoTestId('password-input')).not.toBeNull();
  });

  it('should show the correct field labels for GCS datasources', async () => {
    const WrappedComponent = withForm(({ form }: FormComponentProps) => (
      <DataSourceAuthenticationFields 
        {...props}
        authenticationType={AuthenticationType.GCPBasic}
        dataType={DataSourceType.GCSConfig} 
        form={form}
      />
    ));
    
    const view = render(<><WrappedComponent/></>);

    expect(screen.getByText('Private Key (JSON format)')).not.toBeNull();
    expect(view.queryByDominoTestId('username-input')).toBeNull();
    expect(view.queryByDominoTestId('password-input')).not.toBeNull();
  });

  it('should show the correct field labels for all other data sources', async () => {
    const WrappedComponent = withForm(({ form }: FormComponentProps) => (
      <DataSourceAuthenticationFields 
        {...props}
        authenticationType={AuthenticationType.Basic}
        dataType={DataSourceType.SnowflakeConfig} 
        form={form}
      />
    ));
    
    const view = render(<><WrappedComponent/></>);

    expect(screen.getByText('Username')).not.toBeNull();
    expect(screen.getByText('Password')).not.toBeNull();
    expect(view.queryByDominoTestId('username-input')).not.toBeNull();
    expect(view.queryByDominoTestId('password-input')).not.toBeNull();
  });

  it('should not show fields and render an alternative if set', async () => {
    const WrappedComponent = withForm(({ form }: FormComponentProps) => (
      <DataSourceAuthenticationFields 
        {...props}
        dataType={DataSourceType.SnowflakeConfig} 
        form={form}
        shouldRenderFields={() => false}
        renderAlternative={() => <div>Alternate</div>}
      />
    ));
    
    const view = render(<><WrappedComponent/></>);

    expect(screen.getByText('Username')).not.toBeNull();
    expect(screen.getByText('Password')).not.toBeNull();
    expect(view.queryByDominoTestId('username-input')).toBeNull();
    expect(view.queryByDominoTestId('password-input')).toBeNull();
    expect(screen.getAllByText('Alternate')).toHaveLength(2);
  });
});
