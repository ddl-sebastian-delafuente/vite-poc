// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import { WrappedFormUtils } from '@ant-design/compatible/lib/form/Form';
import { FormItemProps } from 'antd/lib/form';
import * as React from 'react';

import { 
  MutableFields, 
  mergeLayoutAndFieldMap 
} from '../../components/DynamicField';
import { getAuthFields } from '../../components/DynamicWizard/ProxiedRequestClientSideStaticData/createDatasource';
import { usePrevious } from '../../utils/CustomHooks';
import { AuthenticationType, DataSourceType } from './CommonData';
import { StyledFormItem } from './CommonStyles';
import { useAuthConfigs } from './utils';

export interface DataSourceAuthenticationFieldsCoreProps {
  authenticationType: AuthenticationType,
  dataType?: DataSourceType;
  password?: string;
  setIsAuthenticateComplete?: (isComplete: boolean) => void;
  setPassword: (name?: string) => void;
  setUsername: (name?: string) => void;
  username?: string;
}

export interface DataSourceAuthenticationFieldsProps extends DataSourceAuthenticationFieldsCoreProps {
  FormItem?: React.FC<FormItemProps>;
  form: WrappedFormUtils;
  hideIAMUserHelpText?: boolean,
  shouldRenderFields?: () => boolean;
  renderAlternative?: (filedName: string) => React.ReactNode;
}

export const DataSourceAuthenticationFields = ({
  authenticationType,
  dataType,
  FormItem = StyledFormItem,
  form,
  password,
  setIsAuthenticateComplete = () => undefined,
  setPassword,
  setUsername,
  shouldRenderFields = () => true,
  renderAlternative = () => null,
  username,
}: DataSourceAuthenticationFieldsProps) => {
  const { getFieldDecorator, resetFields } = form;
  const prevDataType = usePrevious<DataSourceType | undefined>(dataType);
  const didDataTypeChange = React.useMemo(() => dataType && prevDataType && dataType !== prevDataType, [dataType, prevDataType])
  // const IAMUserHelpText = '*IAM Credentials are only applicable to RDS MySQL and RDS Postgres.';
  // const shouldShowIAMUserHelpText = shouldRenderFields() && [DataSourceType.MySQLConfig, DataSourceType.PostgreSQLConfig].indexOf(dataType as DataSourceType) > -1 && !hideIAMUserHelpText;

  React.useEffect(() => {
    if (didDataTypeChange) {
      resetFields();
      setUsername(undefined);
      setPassword(undefined);
    }
  }, [
    dataType, 
    didDataTypeChange,
    resetFields,
    setPassword,
    setUsername
  ]);

  const { 
    getConfigByAuthType,
  } = useAuthConfigs();
  const authConfig = getConfigByAuthType(authenticationType);
  const authFieldMetadata = getAuthFields(authenticationType, dataType) || [];
  const authFieldConfig = mergeLayoutAndFieldMap({
    elements: authFieldMetadata
  }, authConfig?.fields || {});
  
  const getField = React.useCallback(({ path, label, regexpError, helpText }: MutableFields) => {
    switch(path) {
      case 'clientId':
      case 'accessKeyID':
      case 'username':
        return (
          <FormItem
            label={label}
            help={helpText}
          >
            {shouldRenderFields() ? (getFieldDecorator('username', {
              rules: [{
                required: true,
                message: regexpError,
                transform: (value) => value.trim(),
              }],
              initialValue: username,
            })(
              <Input
                autoComplete="off"
                data-test="username-input"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUsername(e.target.value);
                  setIsAuthenticateComplete(false);
                }}
              />
            )) : renderAlternative('username')}
          </FormItem>
        );
      case 'clientSecret':
      case 'password':
      case 'secretAccessKey':
        return (
          <FormItem label={label} help={helpText}>
            {shouldRenderFields() ? (getFieldDecorator('password', {
              rules: [{
                required: true,
                message: regexpError,
                transform: (value) => value.trim(),
              }],
              initialValue: password,
            })(
              <Input.Password
                data-test="password-input"
                autoComplete="new-password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                  setIsAuthenticateComplete(false);
                }}
              />
            )) : renderAlternative('password')}
          </FormItem>
        )
      case 'accessKey':
        return (
          <FormItem
            className="input-textarea"
            help={helpText}
            label={label}
          >
            {shouldRenderFields() ? (getFieldDecorator('password', {
              rules: [{
                required: true,
                message: regexpError,
                transform: (value) => value.trim(),
              }],
              initialValue: password,
            })(
              <Input
                autoComplete="off"
                data-test="password-input"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value.trim());
                  setIsAuthenticateComplete(false);
                }}
              />
            )) : renderAlternative('password')}
          </FormItem>
        )
      case 'privateKey':
        return (
          <FormItem
            className="input-textarea"
            help={helpText}
            label={label}
          >
            {shouldRenderFields() ? (getFieldDecorator('password', {
              rules: [{
                required: true,
                message: regexpError,
                transform: (value) => value.trim(),
              }],
              initialValue: password,
            })(
              <Input.TextArea
                autoComplete="off"
                data-test="password-input"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setPassword(e.target.value.trim());
                  setIsAuthenticateComplete(false);
                }}
                rows={10}
              />
            )) : renderAlternative('password')}
          </FormItem>
        )
      default:
        return null;
    }
  }, [
    FormItem,
    getFieldDecorator,
    password,
    renderAlternative,
    setIsAuthenticateComplete,
    setPassword,
    setUsername,
    shouldRenderFields,
    username,
  ]);
  
  return (
    <>
      {authFieldConfig.elements.map((element: MutableFields) => getField(element))}
    </>
  )
}
