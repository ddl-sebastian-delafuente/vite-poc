import * as React from 'react';
import { Form, FormRule } from 'antd';
import styled from 'styled-components';
import * as R from 'ramda';

import {
  CostBudgetAlertTargetsMetadataV1
} from '@domino/api/dist/domino-cost-client';
import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox/Checkbox';
import FlexLayout from '../../components/Layouts/FlexLayout';
import Select from '../../components/Select';
import Toggle from '../../components/Toggle/Toggle';
import { getErrorMessage } from '../../components/renderers/helpers';
import { success, error } from '../../components/toastr';
import { themeHelper } from '../../styled';
import { costApi } from '../../costApis';

const StyledFormItem = styled(Form.Item)`
  font-weight: ${themeHelper('fontWeights.medium')};
  margin: ${themeHelper('paddings.small')} 0;
`;

const emailValidation: FormRule = {
  type: 'array', defaultField: {type: 'email', message: 'Please enter a valid email'},
};

interface AlertSettingsProps {
  alertsEnabled: boolean;
  orgAlertTargets?: string[];
  projectAlertTargets?: string[];
  notifyOrgOwner?: boolean;
}

const AlertSettings = () => {
  const [form] = Form.useForm();
  const [currentAlertSettings, setCurrentAlertSettings] = React.useState<AlertSettingsProps>({
    alertsEnabled: true
  });
  const [shouldAlert, setShouldAlert] = React.useState<boolean>(true);

  const handleSubmit = async (values: AlertSettingsProps) => {
    setCurrentAlertSettings(values);
    try {
      await costApi.v4CostBudgetsGlobalAlertsSettingsPut({
        alertsEnabled: values.alertsEnabled,
        notifyOrgOwner: values.notifyOrgOwner,
        alertTargets: [{
          label: 'Project',
          emails: values.projectAlertTargets
        }, {
          label: 'Organization',
          emails: values.orgAlertTargets
        }]
      });
      success('Alert settings are updated');
    } catch (e) {
      let errorMessage = 'Failed to update alert settings';
      if (e.status === 400) {
        errorMessage = await getErrorMessage(e, errorMessage);
      }
      error(errorMessage);
      console.warn(e);
    }
  };

  const getAlertTargets = (alertTargets: Array<CostBudgetAlertTargetsMetadataV1> = [], label: string) => {
    const foundTarget = R.find(R.propEq('label', label), alertTargets);
    return foundTarget ? foundTarget.emails : [];
  };

  const getAlertSettings = async () => {
    const response = await costApi.v4CostBudgetsGlobalAlertsSettingsGet();
    const newAlertSettings = {
      alertsEnabled: response.data.alertsEnabled,
      projectAlertTargets: getAlertTargets(response.data.alertTargets, 'Project'),
      orgAlertTargets: getAlertTargets(response.data.alertTargets, 'Organization'),
      notifyOrgOwner: response.data.notifyOrgOwner
    };
    setCurrentAlertSettings(newAlertSettings);
    setShouldAlert(response.data.alertsEnabled);
    form.setFieldsValue(newAlertSettings);
  };

  React.useEffect(() => {
    getAlertSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={currentAlertSettings}
      onFinish={handleSubmit}
    >
      <FlexLayout justifyContent="flex-start" itemSpacing={25}>
        <div>Enable/Disable alerts on 75% and 100% of budget thresholds</div>
        <StyledFormItem name="alertsEnabled" valuePropName="checked">
          <Toggle onChange={setShouldAlert}/>
        </StyledFormItem>
      </FlexLayout>
      <StyledFormItem
        label="Extra org alert targets"
        name="orgAlertTargets"
        rules={[emailValidation]}
      >
        <Select
          mode="tags"
          tokenSeparators={[',']}
          style={{width: '320px'}}
          placeholder="email1, email2, email3"
          disabled={!shouldAlert}
        />
      </StyledFormItem>
      <StyledFormItem
        label="Extra project alert targets"
        name="projectAlertTargets"
        rules={[emailValidation]}
      >
        <Select
          mode="tags"
          tokenSeparators={[',']}
          style={{width: '320px'}}
          placeholder="email1, email2, email3"
          disabled={!shouldAlert}
        />
      </StyledFormItem>
      <StyledFormItem name="notifyOrgOwner" valuePropName="checked">
        <Checkbox disabled={!shouldAlert}>
          Notify org owner on project budget alerts
        </Checkbox>
      </StyledFormItem>
      <StyledFormItem shouldUpdate>
        {() => (
          <Button
            disabled={!form.isFieldsTouched() ||
            form.getFieldsError().filter(({errors}) => errors.length).length > 0 ||
            R.equals(form.getFieldsValue(), currentAlertSettings)}
            htmlType="submit"
          >
            Save
          </Button>
        )}
      </StyledFormItem>
    </Form>
  );
};

export default AlertSettings;
