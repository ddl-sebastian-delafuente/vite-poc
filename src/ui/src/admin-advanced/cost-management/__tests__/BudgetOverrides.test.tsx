import * as React from 'react';
import * as fetchMock from 'fetch-mock';
import userEvent from '@testing-library/user-event';
import { render, within, waitFor, screen } from '@domino/test-utils/dist/testing-library';
import { getAllOrganizations, getBriefProjectInfos } from '@domino/mocks/dist/mockStories';
import * as costApi from '@domino/ui/dist/costApis';
import { mockBudgetOverrides } from './mockData';
import { BudgetOverrides } from '../BudgetOverrides';

beforeEach(() => {
  const budgetOverridesApiMock = jest.fn().mockReturnValue(Promise.resolve({data: mockBudgetOverrides}));
  jest.spyOn(costApi.costApi, 'v4CostBudgetsOverridesGet').mockImplementation(budgetOverridesApiMock);
  fetchMock.restore()
    .mock(...getBriefProjectInfos())
    .mock(...getAllOrganizations());
});

describe('Cost management budget overrides', () => {
  it('should enable add override button on selecting the project or organization and the limit', async () => {
    const view = render(<BudgetOverrides/>);
    expect(view.getByRole('button', {name: 'Add Override'}).hasAttribute('disabled')).toBeTruthy();
    const projectAndOrgSelect = within(view.getByDominoTestId('project-org-select')).getByRole('combobox');
    await userEvent.click(projectAndOrgSelect);
    await userEvent.type(projectAndOrgSelect, 'DominoDatalab');
    await userEvent.click(view.baseElement.querySelectorAll('div.ant-select-item-option-content')[0]);
    await userEvent.type(view.getByPlaceholderText('Enter Override Value'), '10');
    expect(view.getByRole('button', {name: 'Add Override'}).hasAttribute('disabled')).toBeFalsy();
  });

  it('should display overrides list in the table', async () => {
    const view = render(<BudgetOverrides/>);
    await waitFor(() => expect(view.container.querySelectorAll('tbody tr.ant-table-row')).toHaveLength(2));
  });

  it('should display update override modal when edit icon is clicked', async () => {
    const budgetOverridesUpdateApiMock = jest.fn().mockReturnValue(Promise.resolve({}));
    jest.spyOn(costApi.costApi, 'v4CostBudgetsOverridesLabelIdPut').mockImplementation(budgetOverridesUpdateApiMock);
    const view = render(<BudgetOverrides/>);
    await waitFor(() => view.getAllByLabelText('Delete Override')[0]);
    await userEvent.hover(view.getAllByLabelText('Delete Override')[0]);
    await userEvent.click(view.baseElement.querySelectorAll('.anticon-edit')[0]);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    await userEvent.type(within(dialog).getByPlaceholderText('Enter Override Value'), '20');
    await userEvent.click(view.getByRole('button', {name: 'Save'}));
    await waitFor(() => expect(budgetOverridesUpdateApiMock).toHaveBeenCalled());
  });

  it('should call delete api when a override is deleted', async () => {
    const budgetOverridesDeleteApiMock = jest.fn().mockReturnValue(Promise.resolve({}));
    jest.spyOn(costApi.costApi, 'v4CostBudgetsOverridesLabelIdDelete').mockImplementation(budgetOverridesDeleteApiMock);
    const view = render(<BudgetOverrides/>);
    await waitFor(() => view.getAllByLabelText('Delete Override')[0]);
    await userEvent.click(view.getAllByLabelText('Delete Override')[0]);
    await waitFor(() => expect(budgetOverridesDeleteApiMock).toHaveBeenCalled());
  });
});
