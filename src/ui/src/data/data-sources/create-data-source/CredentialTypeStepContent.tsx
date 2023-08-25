import * as React from 'react';
import { useEffect } from 'react';
import { kebabCase } from 'lodash';
import { Form } from '@ant-design/compatible';
import { WrappedFormUtils } from '@ant-design/compatible/lib/form/Form';
import { map } from 'ramda';
import { CredentialType, DataSourceType } from '../CommonData';
import {
  Container,
  SimpleModeTextContainer,
  StyledFormItem,
  StyledRadioContent,
  StyledRadioGroup,
  WizardContentTitle,
} from '../CommonStyles';
import { RadioChangeEvent, ItemsWithRadioProps } from '@domino/ui/dist/components/Radio';

interface CredentialTypeProps {
  key: string;
  value: string;
  text: string;
  subText: string;
}

const credentialTypeOptions: CredentialTypeProps[] = [
  {
    key: 'individual',
    value: 'Individual',
    text: 'Individual',
    subText: 'Each user will authenticate with individual credentials provided by them.'
  },
  {
    key: 'shared',
    value: 'Shared',
    text: 'Service Account',
    subText: 'Each user will authenticate with shared credentials provided by you. Users cannot view the actual credentials.'
  }
];

interface CredentialTypeStepContentProps {
  dataType: DataSourceType;
  credentialType?: CredentialType;
  setCredentialType: (type: CredentialType) => void;
  setIsCredentialTypeComplete: (isComplete: boolean) => void;
  updatePermissionPage: (...args: string[]) => void;
  form: WrappedFormUtils;
}

const CredentialTypeStepContent: React.FC<CredentialTypeStepContentProps> = (
  {
    credentialType,
    dataType,
    setCredentialType,
    setIsCredentialTypeComplete,
    updatePermissionPage,
    form,
  }
) => {
  const {getFieldDecorator, resetFields} = form;

  useEffect(() => {
    setIsCredentialTypeComplete(Boolean(credentialType));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentialType]);

  useEffect(() => {
    if (dataType) {
      setCredentialType(CredentialType.Individual);
      updatePermissionPage(CredentialType.Individual);
      resetFields();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataType, resetFields])

  return (
    <Container>
      <Form
        layout="vertical"
        autoComplete="off"
        hideRequiredMark={true}
      >
        <StyledFormItem
          label={<WizardContentTitle>Credential Type</WizardContentTitle>}
        >
          <SimpleModeTextContainer data-test="data-source-credential-type-description">
            Please select the type of credentials to use with this data source.
          </SimpleModeTextContainer>
          {getFieldDecorator('credentialType', {
            rules: [{
              required: true,
            }],
            initialValue: credentialType
          })(
            <StyledRadioGroup
              onChange={(e: RadioChangeEvent) => {
                setCredentialType(e.target.value);
                updatePermissionPage(e.target.value);
              }}
              // Note data-test is not being passed to the component
              dataTest="data-source-credential-type-radio-group"
              items={
                map(
                  (type: CredentialTypeProps) => {
                    return {
                      key: type.key,
                      value: type.value,
                      'data-test': `data-source-credential-type-radio-${kebabCase(type.text)}`,
                      label: <StyledRadioContent >
                        <div data-test={`data-source-credential-type-radio-${kebabCase(type.text)}-text`}>
                          {type.text}
                        </div>
                        <div data-test={`data-source-credential-type-radio-${kebabCase(type.text)}-subtext`}>
                          {type.subText}
                        </div>
                      </StyledRadioContent>
                    } as ItemsWithRadioProps<string | number>
                  },
                  credentialTypeOptions
                )
              }
            />
          )}
        </StyledFormItem>
      </Form>
    </Container>
  );
};

export default Form.create()(CredentialTypeStepContent as any) as any;
