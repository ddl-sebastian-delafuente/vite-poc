import { getAuthenticationStatus } from '@domino/api/dist/Datasource';
import { DominoDatasourceApiDataSourceDto as DataSourceDto } from '@domino/api/dist/types';
import { FormComponentProps } from '@ant-design/compatible/lib/form/Form';
import { Form } from '@ant-design/compatible';
import * as R from 'ramda';
import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import LabelAndValue from '../../../components/LabelAndValue';
import { colors, themeHelper } from '../../../styled';
import { 
  AuthenticationType, 
  CredentialType, 
  DataSourceType,
  isIAMAuth,
} from '../CommonData';
import { 
  DataSourceAuthenticationFields,
} from '../DataSourceAuthenticationFields';
import { BLOCKED_PASSWORD } from '../DataSourceAuthenticationShared';
import { getDataSourcePermissions } from '../utils';

const Container = styled.div`
  padding: 0;
  overflow: hidden;
`;

const StyledFormItem = styled(Form.Item)`
  .ant-legacy-form-item-label {
    label {
      color: ${colors.scorpion}
    }
  }
  &.ant-row.ant-legacy-form-item {
    padding: 0;
    margin-bottom: ${themeHelper('margins.medium')};
  }
  .ant-select-selection__placeholder {
    font-size: ${themeHelper('fontSizes.tiny')};
  }
  .ant-input::placeholder {
    font-size: ${themeHelper('fontSizes.tiny')};
  }

  .ant-legacy-form-item-control:not(.has-error) .ant-legacy-form-explain {
    color: ${colors.black};
    font-style: italic;
  }
`;

export interface DataSourceAuthenticationProps {
  authenticationType: AuthenticationType,
  currentUserId: string;
  dataSource: DataSourceDto;
  password?: string;
  setPassword: (password: string) => void;
  setUsername: (value: string) => void;
  username?: string;
}

const DataSourceAuthentication = (
  {
    authenticationType,
    currentUserId,
    dataSource,
    form,
    password,
    setPassword,
    setUsername,
    username,
  } : DataSourceAuthenticationProps & FormComponentProps
) => {
  const { setFieldsValue } = form;
  const { id } = dataSource;
  const { credentialType } = getDataSourcePermissions(dataSource);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();

  const fetchAuthenticationStatus = async () => {
    try {
      const status = await getAuthenticationStatus({dataSourceId: id});
      setIsAuthenticated(status)
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    fetchAuthenticationStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  React.useCallback((fieldKey: string, fieldSetter: (value: string) => void) => (value: string) => {
    setFieldsValue({
      [fieldKey]: value
    });
    fieldSetter(value);
  }, [setFieldsValue]);
  const isOwner = R.equals(dataSource.ownerId, currentUserId);
  const isSharedCredentials = R.equals(credentialType, CredentialType.Shared);
  const dataSourceType = dataSource.dataSourceType as DataSourceType;
  const isSharedAndNotOwner = isSharedCredentials && !isOwner;

  const shouldRenderFields = React.useCallback(() => {
    return !isSharedAndNotOwner && !isAuthenticated;
  }, [isAuthenticated, isSharedAndNotOwner]);

  const renderAlternative = React.useCallback((fieldName: string) => {
    if (isSharedAndNotOwner) {
      return <i>Configured by admin</i>;
    }

    if (fieldName === 'username') {
      return <div data-test="username-input-static">{username}</div>;
    }

    if (fieldName === 'password') {
      return <div data-test="password-input-static">{BLOCKED_PASSWORD}</div>
    }


    return null;
  }, [isSharedAndNotOwner, username]);

  return (
    <Container>
      {isIAMAuth(authenticationType) && (
        <LabelAndValue label="Authentication Mode" value="IAM Credentials" />
      )}
      <Form
        layout="vertical"
        autoComplete="off"
        hideRequiredMark={true}
      >
        <DataSourceAuthenticationFields
          authenticationType={authenticationType}
          dataType={dataSourceType}
          FormItem={StyledFormItem}
          form={form}
          hideIAMUserHelpText={true}
          password={password}
          setPassword={setPassword}
          setUsername={setUsername}
          shouldRenderFields={shouldRenderFields}
          renderAlternative={renderAlternative}
          username={username}
        />
      </Form>
    </Container>
  );
};

export default Form.create<DataSourceAuthenticationProps & FormComponentProps>()(DataSourceAuthentication);
