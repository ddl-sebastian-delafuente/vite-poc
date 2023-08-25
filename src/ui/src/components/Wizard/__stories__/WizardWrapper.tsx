import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { Form, FormInstance, TimePicker } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import Checkbox from '../../Checkbox/Checkbox';
import Button from '../../Button/Button';
import Input from '../../TextInput/Input';
import Modal, { DominoModalProps } from '../../Modal';
import Select, {OptionProp} from '../../Select/Select';
import StepperContent, { StepperContentProps, StepProps } from '../../StepperContent/StepperContent';
import { themeHelper } from '../../../styled';
import tooltipRenderer from '../../renderers/TooltipRenderer';

const { TextArea } = Input;

export const StepDescription = styled.div`
  font-size: ${themeHelper('fontSizes.tiny')};
  width: 100px;
`;

const getSteps = (stepCount: number) => {
  return Array(stepCount).fill(1).map((_, index) => ({
    title: `Step ${index + 1}`,
    description: `Step ${index + 1} details`,
    content: '',
    hasError: false
  }));
}

const STEP_COUNT = 4;
export const steps = getSteps(STEP_COUNT);

type WizardWrapperProps = {
  primaryAction: string;
  steps: StepProps[];
  hideSteps: boolean;
  modalWidth: string;
  bodyHeight?: string;
}

type Step1ContentFormProps = {
  onEmailChange: (val?: string) => void;
  onNameChange: (val: string) => void;
  onPasswordChange: (val?: string) => void;
  setForm: (val: FormInstance) => void;
}

const StyledForm = styled(Form)`
.ant-form-item {
  margin-bottom: 22px;
}
.ant-form-item-label {
  line-height: 17px;
  margin-bottom: 8px;
}
`;

const Step1ContentForm = (props: Step1ContentFormProps) => {
  const { onEmailChange, onNameChange, onPasswordChange, setForm } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    setForm(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledForm
      name="step1"
      form={form}
      layout="vertical"
      initialValues={{
        email: 'john@dominodatalab.com',
      }}
    >
      <Form.Item
        name="email"
        label="E-mail"
        rules={
          [
            {
              type: 'email',
              message: 'The input is not a valid e-mail',
            },
            {
              required: true,
              message: 'Please input an e-mail'
            }
          ]
        }
      >
        <Input
          placeholder="Please input e-mail"
          onKeyUp={() => onEmailChange(form.getFieldValue('email'))}
        />
      </Form.Item>
      <Form.Item
        name="person"
        label="Person"
        rules={
          [
            {
              required: true,
              message: 'Please select a person'
            }
          ]
        }
      >
        <Select
          placeholder="Please select a person"
          onSelect={() => onNameChange(form.getFieldValue('name'))}
          style={{width: '100%'}}
          options={[
            {
              value: 'jack',
              label: 'Jack'
            },
            {
              value: 'lucy',
              label: 'Lucy'
            },
            {
              value: 'yiminghe',
              label: 'Yiminghe'
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={
          [
            {
              required: true,
              message: 'Please enter a password'
            }
          ]
        }
      >
        <Input.Password
          placeholder="input password"
          autoComplete="new-password"
          onKeyUp={() => onPasswordChange(form.getFieldValue('password'))}
        />
      </Form.Item>
      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        rules={
          [
            {
              required: true,
              message: 'Please confirm your password',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match'));
              },
            }),
          ]
        }
      >
        <Input.Password
          placeholder="input confirm password"
          autoComplete="new-confirm-password"
        />
      </Form.Item>
    </StyledForm>
  );
}

type Step2ContentFormProps = {
  setTags: (val: string[]) => void;
  setNickname: (val: string) => void;
  setPhoneNumber: (val?: number) => void;
  setForm: (val: FormInstance) => void;
}

const Step2ContentForm = (props: Step2ContentFormProps) => {
  const { setTags, setNickname, setPhoneNumber, setForm } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    setForm(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options: OptionProp[] = [];
  for (let i = 10; i < 36; i++) {
    const value = i.toString(36) + i;
    options.push({
      value,
      label: value,
    });
  }
  return (
    <StyledForm name="step2" form={form} layout="vertical">
      <Form.Item
        name="nickname"
        label={
          <span>
            Nickname&nbsp;
            {tooltipRenderer('What do you want others to call you?', <QuestionCircleOutlined/>, 'top')}
          </span>
        }
      >
        <Input
          placeholder="Please input nickname"
          onKeyUp={() => setNickname(form.getFieldValue('nickname'))}
        />
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        label="Phone Number"
        validateTrigger="onBlur"
        rules={
          [{
            pattern: new RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/),
            message: 'The input is not a valid phone number',
          }]
        }
      >
        <Input
          placeholder="phone number"
          onBlur={() => setPhoneNumber(form.getFieldValue('phoneNumber'))}
        />
      </Form.Item>
      <Form.Item
        name="tags"
        label="Tags"
        rules={
          [
            {
              required: true,
              message: 'Please select at least one tag'
            }
          ]
        }
      >
        <Select
          mode="tags"
          placeholder="Select tags"
          onChange={() => setTags(form.getFieldValue('tags'))}
          style={{width: '100%'}}
          options={options}
        />
      </Form.Item>
    </StyledForm>
  );
}

type Step3ContentFormProps = {
  onCommentChange: (data: string) => void;
  setForm: (val: FormInstance) => void;
}

const Step3ContentForm = (props: Step3ContentFormProps) => {
  const { onCommentChange, setForm } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    setForm(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledForm name="step3" form={form} layout="vertical">
      <Form.Item
        name="comment"
        label="Comment"
      >
        <TextArea rows={4} placeholder="Enter text" onChange={() =>
          onCommentChange(form.getFieldValue('comment'))}/>
      </Form.Item>
    </StyledForm>
  );
}

type Step4ContentFormProps = {
  setChecked: (data: boolean) => void;
  setTime: (data: string) => void;
  setForm: (val: FormInstance) => void;
}

const Step4ContentForm = (props: Step4ContentFormProps) => {
  const { setChecked, setTime, setForm } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    setForm(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledForm name="step4" form={form} layout="vertical">
      <Form.Item
        name={'checked'}
        label="Task"
      >
        <Checkbox
          onChange={() => {
            setChecked(form.getFieldValue('checked'));
          }}
        />
      </Form.Item>
      <Form.Item
        name="time"
        label="Time"
        rules={
          [
            {
              required: true,
              message: 'Please enter a time'
            }
          ]
        }
      >
        <TimePicker
          onChange={() => setTime(form.getFieldValue('time'))}
          // @ts-ignore
          defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
        />
      </Form.Item>
    </StyledForm>
  );
}

const WizardWrapper = (
  {
    allowForwardNavigationWithErrors,
    bodyHeight,
    hideSteps,
    modalWidth,
    primaryAction,
    titleText,
    ...rest
  }: DominoModalProps & StepperContentProps & WizardWrapperProps) => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [, setChecked] = React.useState<boolean>(false);
  const [, setEmail] = useState<string>();
  const [, setName] = useState<string>();
  const [, setPassword] = useState<string>();
  const [, setTime] = useState<string>();
  const [, setTags] = useState<string[]>([]);
  const [, setComment] = useState<string>();
  const [, setNickName] = useState<string>();
  const [, setPhoneNumber] = useState<number>();
  const [errOnStep1Validation, setErrOnStep1Validation] = useState<boolean>();
  const [errOnStep2Validation, setErrOnStep2Validation] = useState<boolean>();
  const [errOnStep3Validation, setErrOnStep3Validation] = useState<boolean>();
  const [errOnStep4Validation, setErrOnStep4Validation] = useState<boolean>();
  // These will be replaced by useForm hook in Ant 4
  const [step1Form, setStep1Form] = React.useState<FormInstance>();
  const [step2Form, setStep2Form] = React.useState<FormInstance>();
  const [step3Form, setStep3Form] = React.useState<FormInstance>();
  const [step4Form, setStep4Form] = React.useState<FormInstance>();

  const showModal = useCallback(() => setVisible(true), [setVisible]);

  const hideModal = useCallback(() => {
    step1Form?.resetFields();
    step2Form?.resetFields();
    step3Form?.resetFields();
    step4Form?.resetFields();
    setErrOnStep1Validation(undefined);
    setErrOnStep2Validation(undefined);
    setErrOnStep3Validation(undefined);
    setErrOnStep4Validation(undefined);
    setVisible(false);
  }, [step1Form, step2Form, step3Form, step4Form, setErrOnStep1Validation, setErrOnStep2Validation,
    setErrOnStep3Validation, setErrOnStep4Validation]);

  const onEmailChange = useCallback((val?: string) => {
    setErrOnStep1Validation(undefined);
    setEmail(val);
  }, [setErrOnStep1Validation, setEmail]);

  const onNameChange = useCallback((val: string) => {
    setErrOnStep1Validation(undefined);
    setName(val);
  }, [setErrOnStep1Validation, setName]);

  const onPasswordChange = useCallback((val?: string) => {
    setErrOnStep1Validation(undefined);
    setPassword(val);
  }, [setErrOnStep1Validation, setPassword]);

  const onTagsChange = useCallback((val: string[]) => {
    setErrOnStep2Validation(undefined);
    setTags(val);
  }, [setErrOnStep2Validation, setTags]);

  const onPhoneNumberChange = useCallback((val?: number) => {
    setErrOnStep2Validation(undefined);
    setPhoneNumber(val);
  }, [setErrOnStep2Validation, setPhoneNumber]);

  const onNicknameChange = useCallback((val?: string) => {
    setErrOnStep2Validation(undefined);
    setNickName(val);
  }, [setErrOnStep2Validation, setNickName]);

  const onCommentChange = useCallback((val?: string) => {
    setErrOnStep3Validation(undefined);
    setComment(val);
  }, [setErrOnStep3Validation, setComment]);

  const onTimeChange = useCallback((val: string) => {
    setErrOnStep4Validation(undefined);
    setTime(val);
  }, [setErrOnStep4Validation, setTime]);

  const onCheckedChange = useCallback((val: boolean) => {
    setErrOnStep4Validation(undefined);
    setChecked(val);
  }, [setErrOnStep4Validation, setChecked]);

  // returns true when form values are invalid
  const checkStepError = useCallback((form?: FormInstance) => {
    if (form) {
      const formItemsKeys = Object.keys(form.getFieldsValue());
      const areAllFormItemsTouched = R.all(
        R.equals(true),
        R.map((key: string) => form.isFieldTouched(key), formItemsKeys));
      const formErrs = form.getFieldsError();
      const hasErr = R.isNil(formErrs) ? false : R.any(value => Boolean(value.errors && !R.isEmpty(value.errors)), Object.values(formErrs));
      return hasErr ? hasErr : !areAllFormItemsTouched ? undefined : false;
    }
    return false;
  }, []);

  // validates all form fields and returns true when form values are invalid
  const validateStep = useCallback(async (form?: FormInstance) => {
    let hasError = false;
    if (form) {
      hasError = await form.validateFields().then(() => false).catch(() => true);
    }
    return hasError;
  }, []);

  const modalSteps: StepProps[] = [
    {
      title: 'Step 1',
      description: 'Step 1 details',
      content: <Step1ContentForm
        onEmailChange={onEmailChange}
        onNameChange={onNameChange}
        onPasswordChange={onPasswordChange}
        setForm={setStep1Form}
      />,
      onNavigationAttempt: async () => {
        const hasErr = await validateStep(step1Form);
        setErrOnStep1Validation(hasErr);
        return !hasErr;
      },
      hasError: errOnStep1Validation ?? checkStepError(step1Form)
    },
    {
      title: 'Step 2',
      description: 'Step 2 details',
      content: <Step2ContentForm
        setTags={onTagsChange}
        setNickname={onNicknameChange}
        setPhoneNumber={onPhoneNumberChange}
        setForm={setStep2Form}
      />,
      onNavigationAttempt: async () => {
        const hasErr = await validateStep(step2Form);
        setErrOnStep2Validation(hasErr);
        return !hasErr;
      },
      hasError: errOnStep2Validation ?? checkStepError(step2Form)
    },
    {
      title: 'Step 3',
      description: 'Step 3 details',
      content: <Step3ContentForm
        onCommentChange={onCommentChange}
        setForm={setStep3Form}
      />,
      onNavigationAttempt: async () => {
        const hasErr = await validateStep(step3Form);
        setErrOnStep3Validation(hasErr);
        return !hasErr;
      },
      hasError: errOnStep3Validation ?? checkStepError(step3Form)
    },
    {
      title: 'Step 4',
      description: 'Step 4 details',
      content: <Step4ContentForm
        setTime={onTimeChange}
        setChecked={onCheckedChange}
        setForm={setStep4Form}
      />,
      onNavigationAttempt: async (fromNavigationButton = false) => {
        const hasErr = await validateStep(step4Form);
        setErrOnStep4Validation(hasErr);
        if (fromNavigationButton && !hasErr && !checkStepError(step1Form) && !checkStepError(step2Form) &&
          !checkStepError(step3Form)) {
          hideModal();
          return true;
        }
        return !hasErr;
      },
      hasError: errOnStep4Validation ?? checkStepError(step4Form),
      btnText: primaryAction
    }
  ];

  return (
    <>
      <Button btnType="primary" onClick={showModal}>Wizard</Button>
      <Modal
        {...rest}
        titleText={titleText}
        titleIconName="DataIcon"
        visible={visible}
        onCancel={hideModal}
        closable={true}
        noFooter={true}
        bodyStyle={{ padding: 0 }}
        width={modalWidth}
        style={{ minHeight: '420px', maxHeight: '600px' }}
        destroyOnClose={true}
      >
        <StepperContent
          steps={modalSteps}
          contentWidth={`calc(${modalWidth} - 280px)`}
          height={bodyHeight}
          onCancel={hideModal}
          outlineSecondaryButton={true}
          hideSteps={hideSteps}
          allowForwardNavigationWithErrors={allowForwardNavigationWithErrors}
        />
      </Modal>
    </>
  );
};

export default WizardWrapper;
