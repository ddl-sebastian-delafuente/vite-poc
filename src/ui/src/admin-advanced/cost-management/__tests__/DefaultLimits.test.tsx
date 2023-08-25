import * as React from 'react';
import { fireEvent } from '@testing-library/react';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import * as costApi from '@domino/ui/dist/costApis';
import { mockBudgetDefaults } from './mockData';
import { DefaultLimits } from '../DefaultLimits';

beforeEach(() => {
  const budgetOverridesApiMock = jest.fn().mockReturnValue(Promise.resolve({data: mockBudgetDefaults}));
  jest.spyOn(costApi.costApi, 'v4CostBudgetsDefaultsGet').mockImplementation(budgetOverridesApiMock);
});

describe('Cost management default limits', () => {
  it('should enable save button on changing the limits', async () => {
    const view = render(<DefaultLimits/>);
    expect(view.getByRole('button', {name: 'Save'}).hasAttribute('disabled')).toBeTruthy();
    fireEvent.change(view.getByLabelText('Project ($k)'), {target: {value: '20'}});
    expect(view.getByRole('button', {name: 'Save'}).hasAttribute('disabled')).toBeFalsy();
  });

  it('should call update defaults api on save', async () => {
    const alertSettingsUpdateApiMock = jest.fn();
    jest.spyOn(costApi.costApi, 'v4CostBudgetsDefaultsBudgetLabelPut').mockImplementation(alertSettingsUpdateApiMock);
    const view = render(<DefaultLimits/>);
    fireEvent.change(view.getByLabelText('Project ($k)'), {target: {value: '20'}});
    fireEvent.click(view.getByRole('button', {name: 'Save'}));
    await waitFor(() => expect(alertSettingsUpdateApiMock).toBeCalled());
  });
});
