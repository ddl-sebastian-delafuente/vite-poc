import {
  DeleteOutlined,
} from '@ant-design/icons';
import * as Quota from '@domino/api/dist/Quota';
import { Form } from 'antd';
import * as React from 'react';
import styled from 'styled-components';

import Button from '../../../../components/Button/Button';
import { CompactTable } from '../../../../components/Table/CompactTable';
import {
  error as errorToast,
  success as successToast,
} from '../../../../components/toastr';
import Input from '../../../../components/TextInput/Input';
import { StyledFormItem } from '../../../../components/QuotaStyles';
import { themeHelper } from '../../../../styled';

export interface QuotaNotifications {
  emails?: string[];
  onUpdate?: () => void;
}

const LABEL = 'Notify the following emails in addition to Admins and Dataset Owners';

const EmailTableWrapper = styled.div`
  width: 400px;
`;

const EmailLabel = styled.div`
  font-weight: ${themeHelper('fontWeights.medium')};
  margin-bottom: ${themeHelper('margins.tiny')};
`;

const FormItemWrapper = styled.div`
  display: flex;

  & > *:not(:last-child) {
    margin-right: ${themeHelper('margins.medium')};
  }
`

export const QuotaNotifications = ({
  emails = [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onUpdate = () => {},
}: QuotaNotifications) => {
  const [inputValue, setInputValue] = React.useState<string| undefined>();
  const [isAddDisabled, setIsAddDisabled] = React.useState(true);
  const [form] = Form.useForm();

  const update = React.useCallback(async ({
    emails,
    errorMessage,
    resetInput,
    successMessage,
  }: {
    emails: string[],
    errorMessage: string,
    resetInput?: boolean,
    successMessage: string,
  }) => {
    try {
      await Quota.updateQuota({
        body: {
          actionMetadata: { emails: { emails }},
        }
      });

      successToast(successMessage);
      onUpdate();

      if (resetInput) {
        form.resetFields();
        setInputValue(undefined);
      }
    } catch (e) {
      console.warn(e);
      errorToast(errorMessage);
    }
  }, [form, onUpdate, setInputValue]);

  const makeDeleteHandler = React.useCallback((emailToRemove: string) => {
    return () => {
      const newEmailList = emails.filter(email => email !== emailToRemove);

      update({
        emails: newEmailList,
        successMessage: `Removed ${emailToRemove} from notification list`,
        errorMessage: `Failed to remove ${emailToRemove} from notification list`,

      });
    }
  }, [emails, update]);

  const handleAdd = React.useCallback(() => {
    if (!inputValue) {
      return;
    }

    // check to see if email aready exists in email list
    const found = emails.find((email) => email === inputValue);
    if (found) {
      errorToast(`${inputValue} already exists in notification list`);
      return;
    }

    const newEmailList = [
      ...emails,
      inputValue
    ];
    update({
      emails: newEmailList,
      successMessage: `Added ${inputValue} to notification list`,
      errorMessage: `Failed to add ${inputValue} to notification list`,
      resetInput: true,
    })
  }, [emails, inputValue, update]);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, [setInputValue]);

  const parsedEmails = React.useMemo(() => {
    return emails.map((email) => ({ email }));
  }, [emails]);

  React.useEffect(() => {
    if (!inputValue) {
      setIsAddDisabled(true);
      return;
    }

    const validate = async () => {
      try {
        await form.validateFields();
        setIsAddDisabled(false);
      } catch(e) {
        setIsAddDisabled(true);
      }
    };

    validate();
  }, [form, inputValue, setIsAddDisabled]);

  const columns = React.useMemo(() => [
    {
      dataIndex: 'email',
      title: 'Email'
    },
    {
      sorter: false,
      dataIndex: 'email',
      title: '',
      render: (value: string) => (
        <DeleteOutlined
          aria-label="Delete Email"
          role="button"
          tabIndex={0}
          onClick={makeDeleteHandler(value)}
          style={{
            color: 'red',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        />
      ),
      width: 24,
    }
  ], [makeDeleteHandler]);

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
      >
        <EmailLabel>{LABEL}</EmailLabel>
        <FormItemWrapper>
          <StyledFormItem
            name="email"
            rules={[
              {
                message: 'Invalid email address',
                type: 'email',
              }
            ]}
          >
            <Input placeholder="Add email to notification list" onChange={handleChange} style={{ width: '320px' }} />
          </StyledFormItem>
          <Button disabled={isAddDisabled} onClick={handleAdd}>Add</Button>
        </FormItemWrapper>
      </Form>
      <EmailTableWrapper>
        <CompactTable
          columns={columns}
          dataSource={parsedEmails}
          emptyMessage="No emails added"
          hideRowSelection
          hideColumnFilter
          showPagination={false}
          showSearch={false}
        />
      </EmailTableWrapper>
    </div>
  );
}
