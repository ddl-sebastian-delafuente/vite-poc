import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { Form } from 'antd';
import {
  CostBudgetV1,
  CostBudgetV1BudgetLabelEnum,
  CostBudgetV1BudgetTypeEnum,
  CostBudgetV1WindowEnum
} from '@domino/api/dist/domino-cost-client';
import { costApi } from '../../costApis';
import { RowWrapper, StyledFormItem } from '../../components/QuotaStyles';
import Input from '../../components/TextInput/Input';
import Button from '../../components/Button/Button';
import { themeHelper } from '../../styled';
import { error, success } from '../../components/toastr';
import { getErrorMessage } from '../../components/renderers/helpers';

export const StyledRowRapper = styled(RowWrapper)`
  column-gap: ${themeHelper('margins.medium')};
  max-width: 600px;
`;

const validation = {
  pattern: /^\d*(\.\d+)?$/, // a whole or decimal number
  message: 'Input a valid number'
};

type DefaultLimitsProps = {
  orgQuota?: string,
  projectQuota?: string
};

export const DefaultLimits = () => {
  const [form] = Form.useForm();
  const [currentQuotas, setCurrentQuotas] = React.useState<DefaultLimitsProps|undefined>();

  const getBudgetQuota = (budgets: CostBudgetV1[] = [], label: string) => {
    const foundTarget = R.find(R.propEq('budgetLabel', label), budgets);
    return foundTarget ? foundTarget.limit : undefined;
  };

  const getBudgetsDefaults = async () => {
    try {
      const response = await costApi.v4CostBudgetsDefaultsGet();
      const data = response.data as CostBudgetV1[]
      const orgQuota = getBudgetQuota(data, CostBudgetV1BudgetLabelEnum.Organization);
      const projectQuota = getBudgetQuota(data, CostBudgetV1BudgetLabelEnum.Project);
      setCurrentQuotas({
        orgQuota: orgQuota === undefined ? '' : orgQuota.toString(),
        projectQuota: projectQuota === undefined ? '' : projectQuota.toString(),
      });
    } catch (e) {
      let errorMessage = 'Failed to get budget defaults';
      if (e.status === 400) {
        errorMessage = await getErrorMessage(e, errorMessage);
      }
      error(errorMessage);
      console.warn(e);
    }
  };

  React.useEffect(() => {
    getBudgetsDefaults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => form.resetFields(), [currentQuotas, form]);

  const handleFinish = React.useCallback(async (values: DefaultLimitsProps) => {
    try {
      await Promise.all([
        !R.equals(currentQuotas?.orgQuota, values.orgQuota) ? costApi.v4CostBudgetsDefaultsBudgetLabelPut(CostBudgetV1BudgetLabelEnum.Organization, {
          budgetLabel: CostBudgetV1BudgetLabelEnum.Organization,
          budgetType: CostBudgetV1BudgetTypeEnum.Default,
          limit: values.orgQuota && values.orgQuota.length > 0 ? Number(values.orgQuota) : undefined,
          window: CostBudgetV1WindowEnum.Monthly
        }) : undefined,
        !R.equals(currentQuotas?.projectQuota, values.projectQuota) ? costApi.v4CostBudgetsDefaultsBudgetLabelPut(CostBudgetV1BudgetLabelEnum.Project, {
          budgetLabel: CostBudgetV1BudgetLabelEnum.Project,
          budgetType: CostBudgetV1BudgetTypeEnum.Default,
          limit: values.projectQuota && values.projectQuota.length > 0 ? Number(values.projectQuota) : undefined,
          window: CostBudgetV1WindowEnum.Monthly
        }) : undefined
      ]);
      setCurrentQuotas(values);
      success('Successfully updated default limits for Org and Project');
      getBudgetsDefaults();
    } catch (e) {
      let errorMessage = 'Failed to update default limits for Org and Project';
      if (e.status === 400) {
        errorMessage = await getErrorMessage(e, errorMessage);
      }
      error(errorMessage);
      console.warn(e);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
        initialValues={currentQuotas}
      >
        <StyledRowRapper>
          <StyledFormItem
            label="Org ($k)"
            name="orgQuota"
            rules={[{...validation}]}
          >
            <Input placeholder="No limit" style={{width: '160px'}}/>
          </StyledFormItem>
          <StyledFormItem
            label="Project ($k)"
            name="projectQuota"
            rules={[{...validation}]}
          >
            <Input placeholder="No limit" style={{width: '160px'}}/>
          </StyledFormItem>
          <StyledFormItem
            shouldUpdate
            label=" "
          >
            {() => (
              <Button
                htmlType="submit"
                disabled={!form.isFieldsTouched() ||
                  form.getFieldsError().filter(({errors}) => errors.length).length > 0 ||
                  R.equals(form.getFieldsValue(), currentQuotas)}
              >
                Save
              </Button>
            )}
          </StyledFormItem>
        </StyledRowRapper>
      </Form>
  );
};
