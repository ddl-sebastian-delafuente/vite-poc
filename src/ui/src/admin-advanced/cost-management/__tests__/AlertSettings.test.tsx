import * as React from 'react';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import userEvent from '@testing-library/user-event';
import * as costApi from '../../../costApis';
import { mockAlertSettings } from './mockData';
import AlertSettings from '../AlertSettings';

beforeEach(() => {
  const alertSettingsApiMock = jest.fn().mockReturnValue(Promise.resolve({data: mockAlertSettings}));
  jest.spyOn(costApi.costApi, 'v4CostBudgetsGlobalAlertsSettingsGet').mockImplementation(alertSettingsApiMock);
});

describe('Cost management alert settings', () => {
  it('should enable the save button on changing any form item', async () => {
    const view = render(<AlertSettings/>);
    expect(view.getByRole('button', {name: 'Save'}).hasAttribute('disabled')).toBeTruthy();
    const alertEnabledSwitch = view.getByRole('switch');
    await userEvent.click(alertEnabledSwitch);
    expect(view.getByRole('button', {name: 'Save'}).hasAttribute('disabled')).toBeFalsy();
  });

  it('should not clear the alert target when alert are disabled', async () => {
    const view = render(<AlertSettings/>);
    const alertEnabledSwitch = view.getByRole('switch');
    await userEvent.click(alertEnabledSwitch);
    const projectAlertTargets = view.getByRole('combobox', {name: 'Extra org alert targets'});
    await userEvent.click(projectAlertTargets);
    await userEvent.type(projectAlertTargets, 'email1@gmail.com');
    await userEvent.click(view.getByText('email1@gmail.com', {selector: 'div.ant-select-item-option-content'}));
    expect(view.queryByText('email1@gmail.com', {selector: 'span.ant-select-selection-item-content'})).toBeTruthy();
    await userEvent.click(alertEnabledSwitch);
    expect(view.queryByText('email1@gmail.com', {selector: 'span.ant-select-selection-item-content'})).toBeTruthy();
  });

  it('should disable the form when alerts are disabled', async () => {
    const view = render(<AlertSettings/>);
    await waitFor(() => expect(view.getByRole('switch').getAttribute('aria-checked')).toEqual('false'));
    expect(view.getByRole('combobox', {name: 'Extra org alert targets'}).hasAttribute('disabled')).toBeTruthy();
    expect(view.getByRole('combobox', {name: 'Extra project alert targets'}).hasAttribute('disabled')).toBeTruthy();
    expect(view.getByRole('checkbox', {name: 'Notify org owner on project budget alerts'}).hasAttribute('disabled')).toBeTruthy();
  });

  it('should call update alert settings api on save', async () => {
    const alertSettingsUpdateApiMock = jest.fn();
    jest.spyOn(costApi.costApi, 'v4CostBudgetsGlobalAlertsSettingsPut').mockImplementation(alertSettingsUpdateApiMock);
    const view = render(<AlertSettings/>);
    await userEvent.click(view.getByRole('switch'));
    await userEvent.type(view.getByRole('combobox', {name: 'Extra org alert targets'}), 'email1@gmail.com');
    await userEvent.click(view.getByRole('checkbox', {name: 'Notify org owner on project budget alerts'}));
    await userEvent.click(view.getByRole('button', {name: 'Save'}));
    await waitFor(() => expect(alertSettingsUpdateApiMock).toHaveBeenCalledWith({
      'alertTargets': [{'emails': [], 'label': 'Project'}, {'emails': ['email1@gmail.com'], 'label': 'Organization'}],
      'alertsEnabled': true,
      'notifyOrgOwner': true,
    }));
  });
});
