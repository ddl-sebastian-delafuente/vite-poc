import { CustomTagProps  } from 'rc-select/lib/BaseSelect';
import React, { useCallback, useState, useEffect } from 'react';
import { Select, Form, FormInstance, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Input from '../../../components/TextInput/Input';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal';
import styled from 'styled-components';
import * as colors from '@domino/ui/dist/styled/colors';
import {
  DominoCommonUserCreateUserRequest as CreateUserRequest,
  DominoCommonUserUserCreationContext as UserCreationContext, 
  DominoCommonUserUserRole as UserRole 
} from '@domino/api/dist/types';
import { themeHelper } from '@domino/ui/dist/styled/themeUtils';

const { Option } = Select

const modalWidth = '560px';

const StyledForm = styled(Form)`
padding: 40px 40px 0px;
.ant-form-item {
  margin-bottom: 22px;
}
.ant-form-item-label {
  line-height: 17px;
  margin-bottom: 8px;
}
`;

const CreateUserButton = styled(Button)`
  border-radius: ${themeHelper('borderRadius.standard')};
  float: 'right';
`;

const RoleDescription = styled.div`
  color: ${colors.warmGrey};
  font-size: ${themeHelper('fontSizes.tiny')};
`;

export const TagWrapper = styled.span`
  .ant-tag {
    display: inline-block;
    align-items: center;
    margin-left: ${themeHelper('margins.tiny')};
    cursor: default;
    border: none;
    border-radius: ${themeHelper('borderRadius.standard')};
    font-weight: ${themeHelper('fontWeights.normal')};
    width: auto;
  }
`;


const roleOption = (role: UserRole) => <>
  <Option value={role.name} label={role.name} key={role.name}>
    {role.name}
    <RoleDescription>{role.description}</RoleDescription>
  </Option>
</>

const tagRender = ({
  value,
  closable,
  onClose,
}: CustomTagProps) => (
  <TagWrapper>
    <Tag closable={closable} onClose={onClose}>
      {value}
    </Tag>
  </TagWrapper>
)

interface CreateUserModalProps {
  userCreationContext?: UserCreationContext
  onSubmit: (user: CreateUserRequest) => void
}

interface CreateUserFormProps {
  assignableRoles?: UserRole[]
  setForm: (val: FormInstance) => void;
  onEmailChange: (val: string) => void;
  onRolesChange: (val: string[]) => void;
}

const emailIsValid = (email?: string) => (
  email &&
  email.length > 0 &&
  email[0] !== "." &&
    email[email.length - 1] !== "." &&
    email.includes(".") &&
    email.includes("@")
)

const rolesAreValid = (roles?: string[]) => (roles || []).length > 0

const emailFieldName = "email"
const rolesFieldName = "roles"

const formIsValid = (form: FormInstance) => (
  rolesAreValid(form.getFieldValue(rolesFieldName)) && 
    emailIsValid(form.getFieldValue(emailFieldName))
)

const CreateUserForm = (props: CreateUserFormProps) => {
  const { assignableRoles, setForm, onEmailChange, onRolesChange } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    setForm(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>
    <StyledForm form={form} layout="vertical" name="create-user-form">
      <Form.Item
        name={emailFieldName}
        label="Email"
        rules={
          [
            {
              required: true,
              message: 'Required',
            },
            {
              validator(_, value) {
                return !value || emailIsValid(value) ? Promise.resolve() : Promise.reject(new Error('Invalid'));
              }
            },
          ]
        }
      >
        <Input 
          id="email-input"
          onChange={() => onEmailChange(form.getFieldValue(emailFieldName))}
          onPaste={() => onEmailChange(form.getFieldValue(emailFieldName))}
        />
      </Form.Item>
      <Form.Item
        name={rolesFieldName}
        label="Roles"
        rules={
          [
            {
              required: true,
              message: 'Required'
            }
          ]
        }
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Please select roles"
          onChange={onRolesChange}
          tagRender={tagRender}
        >
          {assignableRoles?.map((role: UserRole) => roleOption(role))}
        </Select>
      </Form.Item>
    </StyledForm>
  </>
}

const CreateUserModal = (props: CreateUserModalProps) => {
  const {userCreationContext, onSubmit} = props
  const [visible, setVisible] = React.useState<boolean>(false);
  const [form, setForm] = useState<FormInstance>();
  const [email, setEmail] = useState<string>('');
  const [roles, setRoles] = useState<string[]>([]);
  const onCreateUserClick = () => setVisible(true)

  const onEmailChange = useCallback((val: string) => {
    if(val.length > 0){
      setEmail(val);
    }
  }, [setEmail]);

  const onRolesChange = useCallback((val: string[]) => {
    if(val.length > 0){
      setRoles(val);
    }
  }, [setRoles]);


  const handleCancel = () => {
    form?.resetFields()
    setVisible(false)
  }
  const handleSubmit = () => {
    onSubmit({email, roles})
    setVisible(false)
  }

  return <>
    <CreateUserButton onClick={onCreateUserClick} type='primary'>
      <PlusOutlined /> Add User
    </CreateUserButton>
    <Modal
      titleText={"Create User"}
      // isDanger={!register}
      titleIconName="PlusCircleFilled"
      visible={visible}
      closable={true}
      noFooter={false}
      bodyStyle={{ padding: 0 }}
      width={modalWidth}
      style={{ height: '420px' }}
      destroyOnClose={true}
      onOk={handleSubmit}
      okText="Create"
      onCancel={handleCancel}
      okButtonProps={{ disabled: !form || !formIsValid(form) }}
    >
      <CreateUserForm
        assignableRoles={userCreationContext?.assignableRoles}
        setForm={setForm}
        onEmailChange={onEmailChange}
        onRolesChange={onRolesChange}
      />
    </Modal>
  </>
}

export default CreateUserModal;
