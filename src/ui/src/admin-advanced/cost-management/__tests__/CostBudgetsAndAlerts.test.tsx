import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@domino/test-utils/dist/testing-library';
import * as costApi from '@domino/ui/dist/costApis';
import { mockBudgetDefaults, mockBudgetOverrides, mockAlertSettings } from './mockData';
import { CostBudgetsAndAlertsSection } from '../CostBudgetsAndAlerts';

beforeEach(() => {
  const budgetDefaultsApiMock = jest.fn().mockReturnValue(Promise.resolve({data: mockBudgetDefaults}));
  jest.spyOn(costApi.costApi, 'v4CostBudgetsDefaultsGet').mockImplementation(budgetDefaultsApiMock);
  const budgetOverridesApiMock = jest.fn().mockReturnValue(Promise.resolve({data: mockBudgetOverrides}));
  jest.spyOn(costApi.costApi, 'v4CostBudgetsOverridesGet').mockImplementation(budgetOverridesApiMock);
  const alertSettingsApiMock = jest.fn().mockReturnValue(Promise.resolve({data: mockAlertSettings}));
  jest.spyOn(costApi.costApi, 'v4CostBudgetsGlobalAlertsSettingsGet').mockImplementation(alertSettingsApiMock);
});

describe('Cost management CostBudgetsAndAlerts', () => {
  it('should render with budget defaults, overrides and alerts', async () => {
    const view = render(<CostBudgetsAndAlertsSection/>);
    expect(view.queryByText('Default Limits (per month)')).toBeTruthy();
    expect(view.queryByText('Budget Overrides')).toBeTruthy();
    expect(view.queryByText('Alert Settings')).toBeTruthy();
  });

  it('should display tooltip on hover alerts header info icon', async () => {
    const view = render(<CostBudgetsAndAlertsSection/>);
    await waitFor(() => userEvent.hover(view.baseElement.querySelectorAll('.anticon-info-circle')[0]));
    await waitFor(() => expect(view.baseElement.querySelector('.ant-tooltip-open')).toBeTruthy());
    expect(screen.getByText('By default Project Owners and Org Owners are notified on Project Budget alerts, Org Owners are notified on Org alerts.')).toBeTruthy();
  });
});
