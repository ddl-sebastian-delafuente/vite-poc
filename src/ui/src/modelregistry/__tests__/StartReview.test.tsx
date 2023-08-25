import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor, within } from '@domino/test-utils/dist/testing-library';
import StartReview from '../details/StartReview';
import { mockModel, mockModelStages, mockProjectSummary, mockUsers } from './mockData';

const CurrentStage = 'Development';
const modelVersion = 1;
const NextStageErrorMessage = 'Please set next stage of model';
const ReviewersErrorMessage = 'Reviewers is required';

jest.mock('../api', () => ({
  getModelStages: () => mockModelStages
}));
jest.mock('@domino/api/dist/Projects', () => ({
  getProjectSummary: () => mockProjectSummary
}));
jest.mock('@domino/api/dist/Users', () => ({
  listUsers: () => mockUsers
}));

afterAll(() => {
  jest.unmock('../api');
  jest.unmock('@domino/api/dist/Projects');
  jest.unmock('@domino/api/dist/Users');
});

describe('StartReview', () => {
  const createModelReview = jest.fn()
  const defaultProps = {
    model: mockModel,
    modelCurrentStage: CurrentStage,
    createModelReview: createModelReview,
    version: modelVersion
  }
  it('should open modal when start review button is clicked', async () => {
    const view = render(<StartReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Start review'}));
    await waitFor(() => expect(view.getByDominoTestId('start-review-modal')).toBeTruthy());
  });

  it('should show current stage as development when passed from props', async () => {
    const view = render(<StartReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Start review'}));
    await waitFor(() => expect(view.getByDominoTestId('start-review-modal')).toBeTruthy());
    expect(view.getByDominoTestId('current-stage').textContent).toEqual(CurrentStage);
  });

  it('should show current stage as none when current stage is not passed from props', async () => {
    const view = render(<StartReview {...defaultProps} modelCurrentStage={undefined}/>);
    await userEvent.click(view.getByRole('button', { name: 'Start review'}));
    await waitFor(() => expect(view.getByDominoTestId('start-review-modal')).toBeTruthy());
    expect(view.getByDominoTestId('current-stage').textContent).toEqual('None');
  });

  it('should validate and show error message at next stage when clicked on start review without filling next stage', async () => {
    const view = render(<StartReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Start review'}));
    await waitFor(() => expect(view.getByDominoTestId('start-review-modal')).toBeTruthy());
    await userEvent.click(view.getByRole('button', { name: 'Start Review'}));
    await waitFor(() => expect(view.queryByText(NextStageErrorMessage)).toBeTruthy());
  });

  it('should validate and show error message at reviewers dropdown when clicked on start review without filling reviewers', async () => {
    const view = render(<StartReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Start review'}));
    await waitFor(() => expect(view.getByDominoTestId('start-review-modal')).toBeTruthy());
    await userEvent.click(view.getByRole('button', { name: 'Start Review'}));
    await waitFor(() => expect(view.queryByText(ReviewersErrorMessage)).toBeTruthy());
  });

  it('should disable submit review button on modal submit when the validation is failed', async () => {
    const view = render(<StartReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Start review'}));
    await waitFor(() => expect(view.getByDominoTestId('start-review-modal')).toBeTruthy());
    await userEvent.click(view.getByRole('button', { name: 'Start Review'}));
    await waitFor(() => expect(view.baseElement.querySelectorAll('.ant-select-show-arrow').length).toBe(2));
    expect(view.getByRole('button', { name: 'Start Review'}).hasAttribute('disabled')).toBeTruthy();
  });

  it('should call createModelReview when submit button is clicked with complete validation', async () => {
    const view = render(<StartReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Start review'}));
    await waitFor(() => expect(view.getByDominoTestId('start-review-modal')).toBeTruthy());
    const nextStage = view.getByDominoTestId('next-stage');
    await userEvent.click(within(nextStage).getByRole('combobox'));
    await userEvent.click(view.getByText('staging', {selector: 'div.ant-select-item-option-content'}));
    const reviewersField = view.getByDominoTestId('start-review-reviewers-select-field');
    await userEvent.click(within(reviewersField).getByRole('combobox'));
    await userEvent.click(view.getByText('integration-test', {selector: 'div.ant-select-item-option-content'}));
    await userEvent.click(view.getByRole('button', { name: 'Start Review'}));
    await waitFor(() => expect(createModelReview).toBeCalledWith({nextStage: 'staging', notes: undefined, reviewers: ['5e7e6a95fe3cf1077d3b6b6d']}));
  });

  it('should not show current stage name in next stage options list', async () => {
    const modelCurrentStage = 'Production'
    const view = render(<StartReview {...defaultProps} modelCurrentStage={modelCurrentStage}/>);
    await userEvent.click(view.getByRole('button', { name: 'Start review'}));
    await waitFor(() => expect(view.getByDominoTestId('start-review-modal')).toBeTruthy());
    const nextStage = view.getByDominoTestId('next-stage');
    await userEvent.click(within(nextStage).getByRole('combobox'));
    expect(view.getByText('staging', {selector: 'div.ant-select-item-option-content'})).toBeTruthy();
    const options = view.getAllByRole('option');
    const optionValues = options.map(option => option.textContent);
    expect(optionValues).not.toContain(modelCurrentStage);
  });

  it('should not show archived option in next stage options list', async () => {
    const view = render(<StartReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Start review'}));
    await waitFor(() => expect(view.getByDominoTestId('start-review-modal')).toBeTruthy());
    const nextStage = view.getByDominoTestId('next-stage');
    await userEvent.click(within(nextStage).getByRole('combobox'));
    expect(view.getByText('staging', {selector: 'div.ant-select-item-option-content'})).toBeTruthy();
    const options = view.getAllByRole('option');
    const optionValues = options.map(option => option.textContent);
    expect(optionValues).not.toContain('Archived');
  });

  it('should close modal when cancel button is clicked after opening the start review popup', async () => {
    const view = render(<StartReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Start review'}));
    await waitFor(() => expect(view.getByDominoTestId('start-review-modal')).toBeTruthy());
    await userEvent.click(view.getByRole('button', { name: 'Cancel'}));
    await waitFor(() => expect(view.queryByDominoTestId('start-review-modal')).toBeFalsy());
  });

  it('should show model name and model version when the modal opens', async () => {
    const view = render(<StartReview {...defaultProps}/>);
    await userEvent.click(view.getByRole('button', { name: 'Start review'}));
    await waitFor(() => expect(view.getByDominoTestId('start-review-modal')).toBeTruthy());
    expect(view.getByDominoTestId('model-name').textContent).toEqual(mockModel.name);
    expect(view.getByDominoTestId('model-version').textContent).toEqual(modelVersion.toString());
  });

});
